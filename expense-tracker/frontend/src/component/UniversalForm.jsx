import { useState } from 'react';

// const categories = ['Food', 'Transport', 'Entertainment', 'Utilities'];

const UniversalForm = ({ popupTitle, onSubmit, onClose, categories}) => {

    // console.log(categories)

  const [selectedCategory, setSelectedCategory] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [remark, setRemark] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');

  const [allotted, setAllotted] = useState('');
  const [cap, setCap] = useState('');
  const [used, setUsed] = useState('');


    const actionMap = {
  '➕ Add Expense': 'ADD_EXPENSE',
  '➕ Add New Category': 'ADD_CATEGORY',
  '🗑️ Delete Category': 'DELETE_CATEGORY',
  '✏️ Revise Category Budget': 'REVISE_CATEGORY_BUDGET',
  '📝 Revise Total Budget': 'REVISE_TOTAL_BUDGET',
  '📊 More Detail': 'VIEW_DETAIL'
};

  const needsCategoryDropdown = [
    '🗑️ Delete Category',
    '➕ Add Expense',
    '✏️ Revise Category Budget'
  ];

  const needsNumberInput = [
    '➕ Add Expense',
    '✏️ Revise Category Budget',
    '➕ Add New Category'
  ];

  const needsNewCategoryInput = popupTitle === '➕ Add New Category';

  const handleSubmit = (e) => {
    e.preventDefault();

    let data = {
      action: actionMap[popupTitle],
      category: selectedCategory || newCategoryName,  // Can be from dropdown or new text
      value: inputValue,
      remark: remark
    };

    if (popupTitle === '📝 Revise Total Budget') {
      data = {
        action: actionMap[popupTitle],
        allotted: allotted || undefined,
        cap: cap || undefined,
        used: used || undefined
      };
    }


    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      {/* ✅ New Category Input (for "Add New Category") */}

      {popupTitle === '📝 Revise Total Budget' && (
        <div className="space-y-3">
          <div>
            <label className="block mb-1 text-sm">💰 Total Budget Allotted (₹)</label>
            <input
              type="number"
              value={allotted}
              onChange={(e) => setAllotted(e.target.value)}
              placeholder="e.g., 10000"
              className="w-full border rounded px-3 py-2"
            />
          </div>

          {/* <div>
            <label className="block mb-1 text-sm">🎯 Budget Cap (Target) (₹)</label>
            <input
              type="number"
              value={cap}
              onChange={(e) => setCap(e.target.value)}
              placeholder="e.g., 8000"
              className="w-full border rounded px-3 py-2"
            />
          </div> */}

          {/* <div>
            <label className="block mb-1 text-sm">💸 Budget Used (Optional) (₹)</label>
            <input
              type="number"
              value={used}
              onChange={(e) => setUsed(e.target.value)}
              placeholder="e.g., 6000"
              className="w-full border rounded px-3 py-2"
            />
          </div> */}
        </div>
      )}

      {needsNewCategoryInput && (
        <div>
          <label className="block mb-1 text-sm">New Category Name</label>

          <input
            type="text"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="Enter new category name"
            className="w-full border rounded px-3 py-2"
          />
        </div>
      )}

      {/* ✅ Category Dropdown */}
      {needsCategoryDropdown.includes(popupTitle) && (
        <div>
          <label className="block mb-1 text-sm">Choose Category</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full border rounded px-3 py-2"
          >
            <option value="">-- Select Category --</option>
            {categories.map((cat, index) => (
              <option key={index} value={cat.name}>{cat.name}</option>
            ))}
          </select>
        </div>
      )}

      {/* ✅ Number Input */}
      {needsNumberInput.includes(popupTitle) && (
        <div>
          <label className="block mb-1 text-sm">Enter Amount (₹)</label>
          <input
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter amount"
            className="w-full border rounded px-3 py-2"
          />
        </div>
      )}

      {/* ✅ Remark (Always visible) */}
      <div>
        <label className="block mb-1 text-sm">Remark (Optional)</label>
        <input
          type="text"
          value={remark}
          onChange={(e) => setRemark(e.target.value)}
          placeholder="Any notes or comments"
          className="w-full border rounded px-3 py-2"
        />
      </div>

      {/* ✅ Submit */}
      <div className="flex justify-end">
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Submit
        </button>
      </div>
    </form>
  );
};

export default UniversalForm;
