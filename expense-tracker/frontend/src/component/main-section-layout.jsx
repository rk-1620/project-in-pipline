import React from 'react';

const SectionLayout = ({ TopBar, RightPanel, children }) => {
  return (
    <div className="flex flex-col h-screen">

      {/* Top Bar */}
      <header className="w-full bg-gray-300 text-black rounded- p-4 shadow-md">
         <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold">My Top Bar</h1>
            <button className="w-30 h-10 rounded-full bg-gray-500 hover:bg-gray-600 focus:outline-2 focus:outline-offset-2 focus:outline-black-500 active:bg-gray-700 text-white">Hide </button>
        </div>
      </header>

      {/* Main Area */}
      <div className="flex flex-1">

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-auto">
          <div>
            <h2 className="text-2xl mb-4">Main Content Area</h2>
            <p>This is where your main page content goes.</p>
        </div>
        </main>

        {/* Right Panel */}
        <aside className="w-64 bg-gray-100 border-l p-4 ">
          <div>
                <h2 className="font-semibold mb-4">Right Panel</h2>
                <ul>
                <li>Option 1</li>
                <li>Option 2</li>
                <li>Option 3</li>
                </ul>
            </div>
        </aside>

      </div>
    </div>
  );
};

export default SectionLayout;
