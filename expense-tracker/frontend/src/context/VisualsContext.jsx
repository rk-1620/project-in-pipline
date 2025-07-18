import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { UserContext } from '../App';

export const VisualsContext = createContext();

export const VisualsProvider = ({ children }) => {
  const { userAuth } = useContext(UserContext);
  const token = userAuth?.access_token;
  const baseURL = import.meta.env.VITE_SERVER_DOMAIN;

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedTimeFrame, setSelectedTimeFrame] = useState('This Month');
  const [spendingSummary, setSpendingSummary] = useState({});
  const [allExpenses, setAllExpenses] = useState({});
  const [expenseDetails, setExpenseDetails] = useState([]);
  const [visibleCount, setVisibleCount] = useState(5);

  // Load Categories
  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${baseURL}/api/categories/user-categories`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const fetched = res.data.categories || [];
      setCategories(fetched);
      if (fetched.length > 0 && selectedCategory === 'All') {
        setSelectedCategory(fetched[0].name);
      }
    } catch (err) {
      console.error('❌ Failed to fetch categories:', err);
    }
  };

  // Load Expenses based on selected category
  const fetchExpenseData = async () => {
    try {
      if (selectedCategory === 'All') {
        const res = await axios.get(`${baseURL}/api/expenses/summary`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSpendingSummary(res.data.spendingByCategory || {});
        setAllExpenses(res.data.categoryObjects || {});
        setExpenseDetails([]);
      } else {
        const res = await axios.post(`${baseURL}/api/expenses/category-detail`,
          { category: selectedCategory, timeFrame: selectedTimeFrame },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setExpenseDetails(res.data.expenses || []);
        setSpendingSummary({});
        setAllExpenses({});
      }
      setVisibleCount(5);
    } catch (err) {
      console.error('❌ Failed to fetch expenses:', err);
    }
  };

  useEffect(() => {
    if (token) fetchCategories();
  }, [token]);

  useEffect(() => {
    if (token) fetchExpenseData();
  }, [selectedCategory, selectedTimeFrame]);

  return (
    <VisualsContext.Provider value={{
      categories,
      selectedCategory, setSelectedCategory,
      selectedTimeFrame, setSelectedTimeFrame,
      spendingSummary,
      allExpenses,
      expenseDetails,
      visibleCount, setVisibleCount,
      fetchCategories,
      fetchExpenseData
    }}>
      {children}
    </VisualsContext.Provider>
  );
};
