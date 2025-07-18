import Category from '../Schema/Categories.js';
import User from '../Schema/User.js';
import Budget from '../Schema/Budget.js';  // ✅ You forgot to import Budget
import moment from 'moment';

export const deleteCategory = async (req, res) => {
  const userId = req.user.id;
  const { category } = req.body;
  const monthKey = moment().format('YYYY-MM');

  if (!category) {
    return res.status(400).json({ message: '❌ Category name is required.' });
  }

  try {
    // 1️⃣ Find and delete the category belonging to this user
    const deletedCategory = await Category.findOneAndDelete({ name: category.trim(), userId });

    if (!deletedCategory) {
      return res.status(404).json({ message: '❌ Category not found.' });
    }

    // 2️⃣ Remove the category reference from the User's categories array
    await User.findByIdAndUpdate(
      userId,
      { $pull: { categories: deletedCategory._id } },  // Remove category from user
      { new: true }
    );

    // 3️⃣ Remove the category from the current month's Budget document
    await Budget.updateOne(
      { userId, month: monthKey },
      { $pull: { categoryBudgets: { categoryId: deletedCategory._id } } }
    );

    res.status(200).json({
      message: `✅ Category "${category}" deleted successfully and budget updated.`,
      category: deletedCategory
    });

  } catch (error) {
    console.error('❌ Error deleting category:', error);
    res.status(500).json({ message: 'Server error while deleting category.', error });
  }
};
