import Expense from "../Schema/Expense.js";
import Category from "../Schema/Categories.js";

export const getDateRange = (timeFrame) => {
  const today = new Date();
  let startDate;

  switch (timeFrame) {
    case 'Today':
      startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      break;
    case 'This Week':
      const firstDayOfWeek = today.getDate() - today.getDay();
      startDate = new Date(today.getFullYear(), today.getMonth(), firstDayOfWeek);
      break;
    case 'This Month':
    default:
      startDate = new Date(today.getFullYear(), today.getMonth(), 1);
      break;
  }

  return { startDate, endDate: today };
};


export const chartSummary = async (req, res) => {
  const userId = req.user.id;
  const { timeFrame } = req.body;

  const { startDate, endDate } = getDateRange(timeFrame);

  try {
    // 1️⃣ Fetch expenses in time range + populate category
    const expenses = await Expense.find({
      userId,
      createdAt: { $gte: startDate, $lte: endDate }
    })
    .populate('categoryId', 'name')  // Only bring category name

    // 2️⃣ Build spending by category
    const spendingByCategory = {};

    expenses.forEach(exp => {
      const categoryName = exp.categoryId?.name || 'Uncategorized';
      const amount = exp.amount || 0;

      if (!spendingByCategory[categoryName]) {
        spendingByCategory[categoryName] = 0;
      }
      spendingByCategory[categoryName] += amount;
    });

    // 3️⃣ Prepare expenses for line chart ➔ with category name injected
    const enrichedExpenses = expenses.map(exp => ({
      _id: exp._id,
      category: exp.categoryId?.name || 'Uncategorized',
      amount: exp.amount,
      createdAt: exp.createdAt
    }));

    res.json({
      spendingByCategory,
      expenses: enrichedExpenses
    });

  } catch (error) {
    console.error('❌ Chart summary failed:', error);
    res.status(500).json({ message: 'Server error while fetching chart summary.' });
  }
};
