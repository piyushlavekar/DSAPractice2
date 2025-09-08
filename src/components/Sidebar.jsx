

import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setSelectedTopic } from '../features/questions/questionsSlice';
import ProgressBar from './ProgressBar';
import { motion } from 'framer-motion';

const sidebarVariants = {
  open: { x: 0 },
  closed: { x: '-100%' },
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
      transition={{ type: 'tween', ease: 'easeInOut', duration: 0.3 }}
      className="w-80 bg-gray-800 shadow-lg flex flex-col h-full z-20 fixed top-0 left-0 border-r border-gray-700"
    >
      <div className="p-4 border-b border-gray-700 flex justify-between items-center flex-shrink-0">
        <h1 className="font-bold text-xl">DSA Topics</h1>
        {/* The close logic is handled by the hamburger button in App.jsx */}
      </div>
      <nav className="flex-1 overflow-y-auto">
        <ul>
          {topics.map((topic) => {
            const topicProgress = calculateTopicProgress(topic);
            return (
              <li key={topic.name} className="border-b last:border-b-0 border-gray-700">
                <button
                  className={`w-full text-left p-4 transition-colors duration-200 ${
                    selectedTopic === topic.name 
                      ? 'bg-cyan-500/10 border-r-4 border-cyan-500' 
                      : 'hover:bg-gray-700/50'
                  }`}
                  onClick={() => handleTopicClick(topic.name)}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold whitespace-nowrap">{topic.name}</span>
                    <span className="text-sm font-semibold text-gray-400">{topicProgress}%</span>
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