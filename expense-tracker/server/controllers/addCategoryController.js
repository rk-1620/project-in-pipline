import Category from '../Schema/Categories.js';
import User from '../Schema/User.js';
import Budget from '../Schema/Budget.js';
import moment from 'moment';

export const addCategory = async (req, res) => {
  const userId = req.user.id;   // ✅ fixed here

  const { category, value } = req.body;
  const monthKey = moment().format('YYYY-MM');  // e.g., '2025-07'

  if (!category || !value) {
    return res.status(400).json({ message: 'Category name and budget are required.' });
  }

  const budgetAmount = parseFloat(value);
  if (isNaN(budgetAmount) || budgetAmount < 0) {
    return res.status(400).json({ message: 'Invalid budget value.' });
  }

  try {
    const existingCategory = await Category.findOne({ name: category.trim(), userId });

    if (existingCategory) {
      return res.status(409).json({ message: 'Category already exists.' });
    }

    const newCategory = new Category({
      name: category.trim(),
      userId,
      budget: budgetAmount
    });

    await newCategory.save();

    await User.findByIdAndUpdate(
      userId,
      { $push: { categories: newCategory._id } },   // ✅ fixed here
      { new: true }
    );

    await Budget.findOneAndUpdate(
      { userId, month: monthKey },
      {
        $push: {
          categoryBudgets: {
            categoryId: newCategory._id,
            categoryName: newCategory.name,
            budget: newCategory.budget
          }
        }
      },
      { new: true, upsert: true }
    );

    res.status(201).json({
      message: '✅ Category added successfully.',
      category: newCategory
    });

  } catch (error) {
    console.error('❌ Error adding category:', error);
    res.status(500).json({ message: 'Server error while adding category.', error });
  }
};
