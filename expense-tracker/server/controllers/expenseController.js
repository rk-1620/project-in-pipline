import Expense from '../Schema/Expense.js';
import Category from '../Schema/Categories.js';
import moment from 'moment';

export const addExpense = async (req, res) => {
  const userId = req.user.id;  // ✅ From JWT middleware
  const { category, value, remark } = req.body;

  if (!category || !value) {
    return res.status(400).json({ message: 'Category and expense amount are required.' });
  }

  const expenseAmount = parseFloat(value);
  if (isNaN(expenseAmount) || expenseAmount < 0) {
    return res.status(400).json({ message: 'Invalid expense amount.' });
  }

  try {
    // ✅ 1. Find the categoryId from category name + userId
    const existingCategory = await Category.findOne({ name: category.trim(), userId });

    if (!existingCategory) {
      return res.status(404).json({ message: 'Category not found for this user.' });
    }

    // ✅ 2. Create new expense linked to categoryId and userId
    const newExpense = new Expense({
      title: category.trim(),             // or use something more descriptive
      amount: expenseAmount,
      note: remark || '',
      userId,
      categoryId: existingCategory._id,
    });

    await newExpense.save();

    res.status(201).json({
      message: '✅ Expense added successfully.',
      expense: newExpense,
    });

  } catch (error) {
    console.error('❌ Error adding expense:', error);
    res.status(500).json({ message: 'Server error while adding expense.', error });
  }
};


export const getExpenseSummary = async (req, res) => {
  const userId = req.user.id;
  const categoryObjects = {};  // ✅ New object you can use elsewhere

  try {
    // ✅ 1. Get all expenses for the user
    const expenses = await Expense.find({ userId });

    // ✅ 2. Calculate spending per category
    const spendingByCategory = {};

    expenses.forEach(exp => {
      const categoryName = exp.title;  // Make sure this is consistent (or use exp.categoryId.name if populated)
      const amount = exp.amount;

      // ➕ Initialize if category not yet added
      if (!categoryObjects[categoryName]) {
        categoryObjects[categoryName] = {
          name: categoryName,
          total: 0,
          expenses: [],  // ✅ Store all individual expenses here
          lastUpdated: exp.createdAt
        };
      }

      // ➕ Accumulate total
      categoryObjects[categoryName].total += amount;

      // ➕ Store full expense (for detailed table later)
      categoryObjects[categoryName].expenses.push({
        date: exp.createdAt,
        amount: amount,
        category: categoryName,
        remark: exp.note || ''
      });

      // ✅ Last updated could track the latest expense date if you want:
      categoryObjects[categoryName].lastUpdated = exp.createdAt;

      // ➕ Also update your simple spending summary (works fine as is)
      if (spendingByCategory[categoryName]) {
        spendingByCategory[categoryName] += amount;
      } else {
        spendingByCategory[categoryName] = amount;
      }
    });


    // ✅ 3. Total spending (optional)
    const totalSpent = Object.values(spendingByCategory).reduce((sum, val) => sum + val, 0);

    res.status(200).json({
      message: '✅ Expense summary fetched successfully.',
      spendingByCategory,
      totalSpent,
      categoryObjects
    });

  } catch (error) {
    console.error('❌ Error fetching expense summary:', error);
    res.status(500).json({ message: 'Server error while fetching expense summary.', error });
  }
};

export const getCategoryExpenseDetails = async (req, res) => {
  const userId = req.user.id;
  // console.log("getCategoryExpenseDetails",userId)
  const { category, timeFrame } = req.body;

  if (!category) {
    return res.status(400).json({ message: '❌ Category is required.' });
  }

  try {
    const query = { userId, title: category.trim() };

    // ✅ Optional: Time Frame filtering
    if (timeFrame === 'Today') {
      const startOfDay = moment().startOf('day').toDate();
      query.createdAt = { $gte: startOfDay };
    } else if (timeFrame === 'This Week') {
      const startOfWeek = moment().startOf('isoWeek').toDate();
      query.createdAt = { $gte: startOfWeek };
    } else if (timeFrame === 'This Month') {
      const startOfMonth = moment().startOf('month').toDate();
      query.createdAt = { $gte: startOfMonth };
    }

    const expenses = await Expense.find(query).sort({ createdAt: -1 });

    const formattedExpenses = expenses.map(exp => ({
      date: exp.createdAt,
      category: exp.title,
      amount: exp.amount,
      remark: exp.note || '',
    }));

    res.status(200).json({
      message: `✅ Expenses for category "${category}" fetched successfully.`,
      expenses: formattedExpenses,
    });

  } catch (error) {
    console.error('❌ Error fetching category expenses:', error);
    res.status(500).json({ message: 'Server error while fetching expenses.', error });
  }
};