import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../App';
import { SpendingBarChart, SpendingLineChart, SpendingPieChart } from '../component/charts';
import { getDateRange } from '../../../server/controllers/chartController';

const VisualsPage = () => {
  const { userAuth } = useContext(UserContext);
  const token = userAuth?.access_token;
  const baseURL = import.meta.env.VITE_SERVER_DOMAIN;

  const [categories, setCategories] = useState([]);

  // Table States
  const [tableCategory, setTableCategory] = useState('All');
  const [tableTimeFrame, setTableTimeFrame] = useState('This Month');
  const [tableExpenses, setTableExpenses] = useState([]);
  const [visibleCount, setVisibleCount] = useState(5);

  // Chart States
  const [chartTimeFrame, setChartTimeFrame] = useState('This Month');
  const [chartSummary, setChartSummary] = useState({});
  const [chartExpenses, setChartExpenses] = useState([]);

  // ✅ Fetch categories (for both table and charts)
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${baseURL}/api/categories/user-categories`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const fetchedCategories = res.data.categories || [];
        setCategories(fetchedCategories);
      } catch (err) {
        console.error('❌ Failed to fetch categories:', err);
      }
    };

    if (token) fetchCategories();
  }, [token]);

  // ✅ Fetch Table Expenses based on table filters
  useEffect(() => {
    const fetchTableData = async () => {
      try {
        if (tableCategory === 'All') {
          const res = await axios.get(`${baseURL}/api/expenses/summary`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          const allExpenses = Object.values(res.data.categoryObjects || {}).flatMap(cat => cat.expenses || []);

          // ✅ Apply time frame filter on frontend:
          const { startDate, endDate } = getDateRange(tableTimeFrame);

          // console.log(allExpenses)

          const filteredExpenses = allExpenses.filter(exp => {
            const expenseDate = new Date(exp.date);  // use correct date field!
            return expenseDate >= startDate && expenseDate <= endDate;
          });

          setTableExpenses(filteredExpenses.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
        } else {
          const res = await axios.post(`${baseURL}/api/expenses/category-detail`, {
            category: tableCategory,
            timeFrame: tableTimeFrame
          }, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setTableExpenses((res.data.expenses || []).sort((a, b) => new Date(b.date) - new Date(a.date)));
        }
        setVisibleCount(5);
      } catch (err) {
        console.error('❌ Failed to fetch table data:', err);
      }
    };

    if (token) fetchTableData();
  }, [token, tableCategory, tableTimeFrame]);

  // ✅ Fetch Chart Data based on chart filters
  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const res = await axios.post(`${baseURL}/api/expenses/chart-summary`, {
          timeFrame: chartTimeFrame
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        //console.log(res.data.spendingByCategory)

        setChartSummary(res.data.spendingByCategory || {});
        setChartExpenses(res.data.expenses || []);
      } catch (err) {
        console.error('❌ Failed to fetch chart data:', err);
      }
    };

    if (token) fetchChartData();
  }, [token, chartTimeFrame]);

  // ✅ Prepare Chart Data
  const pieChartData = Object.entries(chartSummary).map(([name, value]) => ({ name, value }));
  //console.log(chartExpenses);
  const lineChartData = chartExpenses.map(exp => ({
    date: exp.createdAt?.slice(0, 10),
    amount: exp.amount
  }));

  return (
    <div className="p-6 space-y-10">

      {/* 🔗 Section 1: Table Filters */}
      <div className="flex flex-wrap gap-4 items-center">
        <div>
          <label className="block text-sm mb-1">Select Category</label>
          <select
            className="border px-3 py-2 rounded w-48"
            value={tableCategory}
            onChange={(e) => setTableCategory(e.target.value)}
          >
            <option value="All">All Categories</option>
            {categories.map(cat => (
              <option key={cat._id} value={cat.name}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm mb-1">Select Time Frame</label>
          <select
            className="border px-3 py-2 rounded w-48"
            value={tableTimeFrame}
            onChange={(e) => setTableTimeFrame(e.target.value)}
          >
            <option value="This Month">This Month</option>
            <option value="Today">Today</option>
            <option value="This Week">This Week</option>
          </select>
        </div>
      </div>

      {/* 🔗 Section 2: Table */}
      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-3">
          {tableCategory === 'All' ? 'All Expenses (Across All Categories)' : `Expenses: ${tableCategory}`}
        </h2>

        <div className="border rounded shadow overflow-hidden">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-gray-100 font-semibold">
              <tr>
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2">Category</th>
                <th className="px-4 py-2">Amount (₹)</th>
                <th className="px-4 py-2">Remark</th>
              </tr>
            </thead>
          </table>

          <div className="max-h-64 overflow-y-auto">
            <table className="min-w-full text-left text-sm">
              <tbody>
                {tableExpenses.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-4 py-2 text-center">No expenses found.</td>
                  </tr>
                ) : (
                  tableExpenses.map((exp, idx) => (
                    <tr key={idx} className="border-t">
                      <td className="px-4 py-2">{exp.date?.slice(0, 10)}</td>
                      <td className="px-4 py-2">{exp.category}</td>
                      <td className="px-4 py-2">₹ {exp.amount}</td>
                      <td className="px-4 py-2">{exp.remark || '—'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* {tableExpenses.length > visibleCount && (
          <div className="mt-4 text-center">
            <button
              className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
              onClick={() => setVisibleCount(prev => prev + 5)}
            >
              Show More
            </button>
          </div>
        )} */}
      </div>

      {/* 🔗 Section 3: Chart Filters */}
      <div className="mt-10">
        <h2 className="text-lg font-semibold mb-3">Visual Charts</h2>
        
        <div className="mb-4">
          <label className="block text-sm mb-1">Select Time Frame for Charts</label>
          <select
            className="border px-3 py-2 rounded w-48"
            value={chartTimeFrame}
            onChange={(e) => setChartTimeFrame(e.target.value)}
          >
            <option value="This Month">This Month</option>
            <option value="This Week">This Week</option>
            <option value="Today">Today</option>
          </select>
        </div>

        {/* 🔗 Section 4: Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border rounded p-4 shadow">
            <SpendingPieChart data={pieChartData} />
          </div>
          <div className="border rounded p-4 shadow">
            <SpendingBarChart data={chartSummary} />
          </div>
          <div className="border rounded p-4 shadow col-span-1 md:col-span-2">
            <SpendingLineChart expenses={lineChartData} />
          </div>
        </div>
      </div>

    </div>
  );
};

export default VisualsPage;
