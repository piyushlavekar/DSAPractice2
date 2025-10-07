
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setSelectedTopic } from '../features/questions/questionsSlice';
import ProgressBar from './ProgressBar';
import { motion } from 'framer-motion';
// --- THIS IS THE CORRECTED IMPORT ---
import { XMarkIcon } from '@heroicons/react/24/solid'; 

const sidebarVariants = {
  open: { x: 0, transition: { type: 'spring', stiffness: 300, damping: 30 } },
  closed: { x: '-100%', transition: { type: 'spring', stiffness: 300, damping: 30 } },
};

const Sidebar = ({ closeSidebar }) => {
  const { topics, selectedTopic, solvedQuestions } = useSelector((state) => state.questions);
  const dispatch = useDispatch();

  const handleTopicClick = (topicName) => {
    dispatch(setSelectedTopic(topicName));
    if (window.innerWidth < 768) {
      closeSidebar();
    }
  };

  const calculateTopicProgress = (topic) => {
    let totalQuestions = 0, solvedCount = 0;
    topic.patterns.forEach(p => Object.values(p.questions).forEach(qList => {
      totalQuestions += qList.length;
      qList.forEach(q => { if (solvedQuestions[q.name]) solvedCount++; });
    }));
    return totalQuestions > 0 ? Math.round((solvedCount / totalQuestions) * 100) : 0;
  };

  return (
    <motion.aside
      variants={sidebarVariants}
      initial="closed"
      animate="open"
      exit="closed"
      className="w-80 bg-gradient-to-b from-slate-800 to-slate-900 shadow-2xl flex flex-col h-full z-20 fixed top-0 left-0 border-r border-slate-700"
    >
      <div className="p-5 border-b border-slate-700/80 flex justify-between items-center flex-shrink-0">
        <h1 className="font-extrabold text-2xl text-white tracking-tight">DSA Topics</h1>
        <button 
          onClick={closeSidebar} 
          className="p-2 rounded-full text-slate-400 hover:bg-slate-700 hover:text-white transition-colors md:hidden"
          aria-label="Close sidebar"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>
      </div>
      
      <nav className="flex-1 overflow-y-auto p-2">
        <ul>
          {topics.map((topic) => {
            const topicProgress = calculateTopicProgress(topic);
            const isSelected = selectedTopic === topic.name;

            return (
              <li key={topic.name} className="my-1">
                <button
                  className={`w-full text-left rounded-lg p-4 transition-all duration-300 ease-in-out transform 
                    ${isSelected 
                      ? 'bg-gradient-to-r from-cyan-900/50 to-slate-800 border-l-4 border-cyan-400 shadow-lg' 
                      : 'hover:bg-slate-700/70 hover:translate-x-1'
                    }`}
                  onClick={() => handleTopicClick(topic.name)}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className={`transition-colors duration-300 ${isSelected ? 'text-white font-bold' : 'text-slate-300 font-semibold'}`}>
                      {topic.name}
                    </span>
                    <span className={`text-sm font-semibold ${isSelected ? 'text-cyan-300' : 'text-slate-400'}`}>
                      {topicProgress}%
                    </span>
                  </div>
                  <ProgressBar progress={topicProgress} />
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </motion.aside>
  );
};

export default Sidebar;