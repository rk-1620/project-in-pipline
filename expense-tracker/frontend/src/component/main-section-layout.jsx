import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import UniversalPopup from './UniversalPopup';
import UniversalForm from './UniversalForm';
import { UserContext } from '../App';
import { Link } from 'react-router-dom';

const SectionLayout = () => {
  const [rightPanelVisible, setRightPanelVisible] = useState(false);
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupTitle, setPopupTitle] = useState('');
  const [categories, setCategories] = useState([]);
  const [spendingMap, setSpendingMap] = useState({}); 
  
  const [budgetData, setBudgetData] = useState({
    totalAllotted: 0,
    totalCap: 0,
    totalUsedBudget: 0,
    categoryBudgets: []
  });

  // useContext: Accessing user's auth token from global context
  const { userAuth } = useContext(UserContext);
  const token = userAuth?.access_token;

  const baseURL = import.meta.env.VITE_SERVER_DOMAIN;  // e.g., http://localhost:5000

  const apiConfig = {
    ADD_EXPENSE: { url: '/api/expenses/add', method: 'POST' },
    ADD_CATEGORY: { url: '/api/categories/add', method: 'POST' },
    DELETE_CATEGORY: { url: '/api/categories/delete', method: 'DELETE' },
    REVISE_CATEGORY_BUDGET: { url: '/api/categories/update-budget', method: 'PUT' },
    REVISE_TOTAL_BUDGET: { url: '/api/budget/update-total', method: 'PUT' },
    VIEW_DETAIL: { url: '/api/expenses/detail', method: 'POST' },
  };

  const expenses = categories.map(cat => ({
    category: cat.name,
    budget: cat.budget,
    spending: spendingMap[cat.name] || 0, // Future: load actual expenses
  }));

  // const totalBudget = expenses.reduce((sum, item) => sum + item.budget, 0);
  // const totalSpending = expenses.reduce((sum, item) => sum + item.spending, 0);
  // const remaining = totalBudget - totalSpending;

  const totalAllotted = budgetData.totalAllotted || 0;
  const budgetCap = budgetData.categoryBudgets?.reduce((sum, cat) => sum + (cat.budget || 0), 0) || 0;

  // const budgetCap = expenses.budget;
  const totalSpending = Object.values(spendingMap).reduce((sum, val) => sum + val, 0);

  const surplus = Math.max(totalAllotted - budgetCap, 0);
  const remaining = Math.max(budgetCap - totalSpending, 0);

  const fetchSpendingSummary = async () => {
    try {
      const response = await axios.get(`${baseURL}/api/expenses/summary`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setSpendingMap(response.data.spendingByCategory);
      // console.log(response.data.spendingByCategory);
    } catch (error) {
      console.error('❌ Failed to fetch spending summary:', error);
    }
  };

  const fetchBudget = async () => {
    try {
      const res = await axios.get(`${baseURL}/api/budget/user-budget`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.budget) {
        setBudgetData(res.data.budget);
      }
    } catch (error) {
      console.error('❌ Failed to fetch budget:', error.response?.data?.message || error.message);
    }
  };



  const fetchCategories = async () => {
    if (!token) return;
    try {
      const response = await axios.get(`${baseURL}/api/categories/user-categories`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(response)
      setCategories(response.data.categories);
    } catch (error) {
      console.error('❌ Error fetching categories:', error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchSpendingSummary();
    fetchBudget();
  }, [token]);

  const showPopup = (title) => {
    setPopupTitle(title);
    setPopupVisible(true);
  };

  const closePopup = () => {
    setPopupVisible(false);
    setPopupTitle('');
  };

  return (
    <div className="flex flex-col h-screen">
      
      {/* Top Bar */}
      <header className="w-full bg-gray-300 text-black p-4 shadow-md">
  <div className="flex justify-between items-center">

    <div>
      <h1 className="text-xl font-bold">Budget Dashboard</h1>

      <div className="text-sm mt-1 flex flex-col gap-1">

        <span>💰 <strong>Total Budget Allotted:</strong> ₹ {totalAllotted}</span>

        <span>🎯 <strong>Budget Cap (Target):</strong> ₹ {budgetCap}</span>

        <span>💸 <strong>Total Spending:</strong> ₹ {totalSpending}</span>

        <span>💵 <strong>Surplus (Unused Allotment):</strong> ₹ {Math.max(totalAllotted - budgetCap, 0)}</span>

        <span>🪙 <strong>Remaining (Cap - Spending):</strong> ₹ {Math.max(budgetCap - totalSpending, 0)}</span>

      </div>
    </div>

    {/* <button
      onClick={() => setRightPanelVisible(prev => !prev)}
      className="w-30 h-10 rounded-full bg-gray-500 hover:bg-gray-600 active:bg-gray-700 text-white px-4"
    >
      More...
    </button> */}

  </div>
</header>

      {/* Main Area */}
      <div className={`flex flex-1 overflow-hidden transition-all duration-300 ${popupVisible ? 'blur-sm pointer-events-none' : ''}`}>
        <main className="flex-1 p-6 overflow-auto">
          {/* // flex: Places children side by side
          // justify-between: Pushes them to opposite ends (left and right)
          // items-center: Vertically centers them */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Expenses Overview</h2>
            <button
              onClick={() => setRightPanelVisible(prev => !prev)}
              className="w-35 h-10 rounded-full bg-gray-500 hover:bg-gray-600 active:bg-gray-700 text-white px-4"
            >
              More Action...
            </button>
          </div>

          <div className="overflow-x-auto rounded-lg shadow border mb-6">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-gray-100 font-semibold">
                <tr>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Budget (₹)</th>
                  <th className="px-4 py-3">Spending (₹)</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((item, index) => (
                  <tr key={index} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-2">{item.category}</td>
                    <td className="px-4 py-2">{item.budget}</td>
                    <td className="px-4 py-2">{item.spending}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex gap-4">
            <button
              className="px-6 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800"
              onClick={() => showPopup('➕ Add Expense')}
            >
              ➕ Add Expense
            </button>

            <Link
              to="/visuals"
              className="px-6 py-2 rounded-md bg-gray-400 text-white hover:bg-gray-500 active:bg-gray-600"
              onClick={() => showPopup('📊 More Detail')}
            >
              📊 More Detail
            </Link>
          </div>
        </main>

        {/* Right Panel */}
        {rightPanelVisible && (
          <aside className="w-64 bg-gray-100 border-l p-4">
            <h2 className="font-semibold mb-4 text-lg">Manage Budget</h2>
            <ul className="space-y-3 text-sm">
              <li className="cursor-pointer hover:text-blue-600" onClick={() => showPopup('📝 Revise Total Budget')}>
                📝 Revise Total Budget
              </li>
              <li className="cursor-pointer hover:text-blue-600" onClick={() => showPopup('➕ Add New Category')}>
                ➕ Add New Category
              </li>
              <li className="cursor-pointer hover:text-blue-600" onClick={() => showPopup('🗑️ Delete Category')}>
                🗑️ Delete Category
              </li>
              <li className="cursor-pointer hover:text-blue-600" onClick={() => showPopup('✏️ Revise Category Budget')}>
                ✏️ Revise Category Budget
              </li>
            </ul>
          </aside>
        )}
      </div>

      {/* Popup */}
      <UniversalPopup isOpen={popupVisible} onClose={closePopup} title={popupTitle}>
        <UniversalForm
          popupTitle={popupTitle}
          onClose={closePopup}
          categories={categories}
          onSubmit={async (formData) => {
            const { action, category, value, remark } = formData;
            const api = apiConfig[action];
            if (!api) {
              alert('❌ Unknown action');
              return;
            }

            const payloadMap = {
              ADD_EXPENSE: { category, value, remark },
              ADD_CATEGORY: { category, value },
              REVISE_TOTAL_BUDGET: { 
                allotted: formData.allotted, 
                cap: formData.cap, 
                used: formData.used 
              },
              DELETE_CATEGORY: { category },
              REVISE_CATEGORY_BUDGET: { category, value },
            };

            const payload = payloadMap[action] || formData;

            console.log(payload);

            try {
              await axios({
                method: api.method,
                url: `${baseURL}${api.url}`,
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`,
                },
                data: payload,
              });

              if (action === 'ADD_EXPENSE') {
                const categoryName = payload.category;
                const amount = parseFloat(payload.value);

                setSpendingMap(prev => ({
                    ...prev,
                    [categoryName]: (prev[categoryName] || 0) + amount
                }));
            }
              
              alert('✅ Action successful');

              if (['ADD_CATEGORY', 'DELETE_CATEGORY', 'REVISE_TOTAL_BUDGET','REVISE_CATEGORY_BUDGET'].includes(action)) {
                const res = await axios.get(`${baseURL}/api/categories/user-categories`, {
                  headers: { Authorization: `Bearer ${token}` },
                });
                setCategories(res.data.categories);
                await fetchCategories();
                await fetchBudget();
              }

            } catch (error) {
              console.error('❌ Axios error:', error.response?.data?.message || error.message);
              alert(`❌ ${error.response?.data?.message || 'Something went wrong'}`);
            }

            closePopup();
          }}
        />
      </UniversalPopup>

    </div>
  );
};

export default SectionLayout;
