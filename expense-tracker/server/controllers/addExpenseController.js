import Expense from '../Schema/Expense.js';
import Category from '../Schema/Categories.js';

export const addExpense = async (req, res) => {
  const { category, value, remark } = req.body;
  const userId = req.user.id;  // ✅ Auth middleware must provide this

  try {
    // 1️⃣ Find the category for this user by name:
    const categoryDoc = await Category.findOne({ name: category, userId });

    if (!categoryDoc) {
      return res.status(404).json({ message: `Category "${category}" not found for this user.` });
    }

    // 2️⃣ Validate amount:
    const amount = parseFloat(value);
    if (isNaN(amount) || amount <= 0) {
      return res.status(400).json({ message: 'Invalid expense amount.' });
    }

    // 3️⃣ Create the new Expense:
    const newExpense = new Expense({
      title: category,                          // Or you can use remark as title if preferred
      amount: amount,
      note: remark || "",
      userId: userId,
      categoryId: categoryDoc._id
    });

    await newExpense.save();

    res.status(201).json({ message: 'Expense added successfully.', expense: newExpense });

  } catch (error) {
    console.error('Error adding expense:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};
