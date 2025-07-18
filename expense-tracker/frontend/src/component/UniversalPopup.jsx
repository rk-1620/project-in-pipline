import React from 'react';

const UniversalPopup = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-opacity-10 backdrop-blur-sm flex justify-center items-center z-50">

      <div className="bg-white rounded-lg shadow-lg w-11/12 max-w-md p-6 relative">
        
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black text-xl font-bold"
        >
          &times;
        </button>

        {title && <h2 className="text-lg font-semibold mb-4">{title}</h2>}

        <div>
          {children || <p className="text-gray-500">No content</p>}
        </div>

      </div>
    </div>
  );
};

export default UniversalPopup;
