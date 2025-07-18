import Category from '../Schema/Categories.js';

export const getUserCategories = async (req, res) => {
  const userId = req.user.id;
  console.log(userId);

  try {
    const categories = await Category.find({ userId }).select('name budget');
    
    console.log(categories)

    res.status(200).json({ categories });
  } catch (error) {
    console.error('❌ Error fetching categories:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};
