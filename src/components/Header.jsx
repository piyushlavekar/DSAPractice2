
// src/components/Header.jsx

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleViewMode } from '../features/ui/uiSlice';
import SearchBar from './SearchBar';
import { 
  Bars3Icon, 
  StarIcon, 
  ClockIcon, 
  CalendarDaysIcon, 
  ViewColumnsIcon, 
  Squares2X2Icon, 
  ChartPieIcon // नवीन आयकॉन
} from '@heroicons/react/24/solid';

const Header = ({ 
  toggleSidebar, 
  onStarredClick, 
  onRevisionClick, 
  onSpacedRevisionClick,
  onStatsClick // नवीन prop
}) => {
  const dispatch = useDispatch();
  const { viewMode } = useSelector(state => state.ui);

  return (
    <header className="bg-slate-800/80 backdrop-blur-sm shadow-md px-4 py-3 flex justify-between items-center z-10 border-b border-slate-700 flex-shrink-0">
      {/* डावीकडील भाग */}
      <div className="flex items-center gap-4">
        <button onClick={toggleSidebar} className="p-2 rounded-md hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500">
          <Bars3Icon className="h-6 w-6" />
        </button>
        <h1 className="text-xl md:text-2xl font-bold hidden sm:block text-white">DSA Tracker</h1>
      </div>
      
      {/* उजवीकडील भाग */}
      <div className="flex items-center gap-2">
        <SearchBar />
        
        {/* स्टॅटिस्टिक्स बटण */}
        <button
          onClick={onStatsClick}
          className="p-2 rounded-full text-slate-400 hover:bg-slate-700 hover:text-purple-400 transition-colors"
          title="Show Statistics"
        >
          <ChartPieIcon className="h-6 w-6" />
        </button>

        {/* व्ह्यू-टॉगल बटण */}
        <button
          onClick={() => dispatch(toggleViewMode())}
          className="p-2 rounded-full text-slate-400 hover:bg-slate-700 hover:text-cyan-400 transition-colors"
          title={viewMode === 'pattern' ? 'Switch to Practice Mode' : 'Switch to Pattern Mode'}
        >
          {viewMode === 'pattern' ? (
            <Squares2X2Icon className="h-6 w-6" />
          ) : (
            <ViewColumnsIcon className="h-6 w-6" />
          )}
        </button>

        {/* इतर बटणे */}
        <button onClick={onStarredClick} className="p-2 rounded-full hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500" title="Show Starred Questions">
          <StarIcon className="h-6 w-6 text-yellow-400" />
        </button>
        <button onClick={onRevisionClick} className="p-2 rounded-full hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500" title="Revision Planner">
          <ClockIcon className="h-6 w-6 text-cyan-400" />
        </button>
        <button onClick={onSpacedRevisionClick} className="p-2 rounded-full hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500" title="Spaced Revision (3 Days Ago)">
          <CalendarDaysIcon className="h-6 w-6 text-green-400" />
        </button>
      </div>
    </header>
  );
};

export default Header;