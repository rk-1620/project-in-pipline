import Category from '../Schema/Categories.js';
import moment from 'moment';
import Budget from '../Schema/Budget.js';

export const reviseCategoryBudget = async (req, res) => {
  const userId = req.user.id;  // ✅ Authenticated user
  const { category, value } = req.body;  // category name & new budget value

  const monthKey = moment().format('YYYY-MM');

  if (!category || !value) {
    return res.status(400).json({ message: 'Category name and new budget are required.' });
  }

  const newBudget = parseFloat(value);
  if (isNaN(newBudget) || newBudget < 0) {
    return res.status(400).json({ message: 'Invalid budget value.' });
  }

  try {
    // ✅ Find the category by name and userId, then update the budget
    const updatedCategory = await Category.findOneAndUpdate(
      { name: category.trim(), userId },
      { $set: { budget: newBudget } },
      { new: true }  // return the updated document
    );

    if (!updatedCategory) {
      return res.status(404).json({ message: 'Category not found.' });
    }

    // 2️⃣ Update the Budget table (current month only)
    await Budget.updateOne(
      { userId, month: monthKey, "categoryBudgets.categoryId": updatedCategory._id },
      {
        $set: {
          "categoryBudgets.$.budget": parseFloat(value),
          "categoryBudgets.$.categoryName": updatedCategory.name
        }
      }
    );

    res.status(200).json({
      message: '✅ Category budget updated successfully.',
      category: updatedCategory
    });

  } catch (error) {
    console.error('❌ Error updating category budget:', error);
    res.status(500).json({ message: 'Server error while updating category budget.', error });
  }
};