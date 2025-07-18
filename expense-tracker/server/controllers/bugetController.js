import Budget from '../Schema/Budget.js';
import Category from '../Schema/Categories.js';
import moment from 'moment';

export const reviseTotalBudget = async (req, res) => {
  const userId = req.user.id;
  const { allotted, cap, used } = req.body;

  const monthKey = moment().format('YYYY-MM');  // e.g., '2025-07'

  try {
    // 1️⃣ Build the update object dynamically
    const updateFields = {};
    if (allotted !== undefined && allotted !== '') updateFields.totalAllotted = parseFloat(allotted);
    if (cap !== undefined && cap !== '') updateFields.totalCap = parseFloat(cap);
    if (used !== undefined && used !== '') updateFields.totalUsedBudget = parseFloat(used);

    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({ message: 'No budget values provided to update.' });
    }

    // 2️⃣ Pull the latest categories for the user
    const categories = await Category.find({ userId });

    const categoryBudgets = categories.map(cat => ({
      categoryId: cat._id,
      categoryName: cat.name,
      budget: cat.budget
    }));

    // 3️⃣ Find and update (or create) the Budget document with categories + budget values
    const updatedBudget = await Budget.findOneAndUpdate(
      { userId, month: monthKey },
      { 
        $set: {
          ...updateFields,
          categoryBudgets  // ✅ Always refresh categoryBudgets
        }
      },
      { new: true, upsert: true }
    );
    

    res.status(200).json({
      message: '✅ Monthly budget and categories updated successfully.',
      budget: updatedBudget
    });

  } catch (error) {
    console.error('❌ Error updating monthly budget:', error);
    res.status(500).json({ message: 'Server error while updating budget.', error });
  }
};


export const getUserMonthlyBudget = async (req, res) => {
  const userId = req.user.id;
  const monthKey = moment().format('YYYY-MM');  // e.g., "2025-07"

  try {
    const budget = await Budget.findOne({ userId, month: monthKey });

    if (!budget) {
      return res.status(200).json({
        message: 'No budget set for this month yet.',
        budget: {
          totalAllotted: 0,
          totalCap: 0,
          totalUsedBudget: 0,
          categoryBudgets: []
        }
      });
    }

    res.status(200).json({
      message: '✅ Budget fetched successfully.',
      budget
    });

  } catch (error) {
    console.error('❌ Error fetching user budget:', error);
    res.status(500).json({ message: 'Server error while fetching budget.', error });
  }
};
