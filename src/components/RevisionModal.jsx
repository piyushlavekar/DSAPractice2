

import React, { useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { startRevisionPlan, generateNextRevisionBatch, stopRevisionPlan, setSelectedTopic, setHighlightedQuestion } from '../features/questions/questionsSlice';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, SparklesIcon, Cog6ToothIcon } from '@heroicons/react/24/solid';

const RevisionModal = ({ closeModal }) => {
  const dispatch = useDispatch();
  const { topics, revisionPlan, solvedQuestions } = useSelector(state => state.questions);
  
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [dailyCount, setDailyCount] = useState(5);

  const handleTopicToggle = (topicName) => {
    setSelectedTopics(prev => 
      prev.includes(topicName) ? prev.filter(t => t !== topicName) : [...prev, topicName]
    );
  };

  const handleStartPlan = () => {
    dispatch(startRevisionPlan({ topics: selectedTopics, questionsPerDay: dailyCount }));
    dispatch(generateNextRevisionBatch());
  };

  const handleResultClick = (result) => {
    dispatch(setSelectedTopic(result.topic));
    dispatch(setHighlightedQuestion({
      topic: result.topic,
      pattern: result.pattern,
      question: result.name,
    }));
    closeModal();
  };
  
  const allQuestions = useMemo(() => {
    const flattened = [];
    topics.forEach(topic => {
      topic.patterns.forEach(pattern => {
        Object.values(pattern.questions).forEach(qList => {
          qList.forEach(question => {
            flattened.push({ ...question, pattern: pattern.name, topic: topic.name });
          });
        });
      });
    });
    return flattened;
  }, [topics]);

  const dailyQuestionsWithDetails = (revisionPlan.dailyQuestions || []).map(dq => 
    allQuestions.find(aq => aq.name === dq.name)
  ).filter(Boolean);
  
  const totalRevisableCount = useMemo(() => {
    const selectedTopicsSet = new Set(revisionPlan.selectedTopics || []);
    let count = 0;
    const allQuestionsMap = new Map();
    topics.forEach(topic => {
      topic.patterns.forEach(pattern => {
        Object.values(pattern.questions).forEach(qList => {
          qList.forEach(question => {
            allQuestionsMap.set(question.name, { topic: topic.name });
          });
        });
      });
    });
    Object.keys(solvedQuestions).forEach(qName => {
      if (solvedQuestions[qName]) {
        const questionDetails = allQuestionsMap.get(qName);
        if (questionDetails && selectedTopicsSet.has(questionDetails.topic)) {
          count++;
        }
      }
    });
    return count;
  }, [topics, solvedQuestions, revisionPlan.selectedTopics]);
  
  const canGetMoreQuestions = (revisionPlan.seenToday || []).length < totalRevisableCount;

  // --- UI Components ---
  const SetupView = () => (
    <motion.div key="settings" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">1. Select Topics to Revise</label>
          <div className="max-h-48 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 gap-2 p-3 bg-gray-900 rounded-lg border border-gray-700">
            {topics.map(topic => (
              <label key={topic.name} className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-700/50 cursor-pointer">
                <input type="checkbox" checked={selectedTopics.includes(topic.name)} onChange={() => handleTopicToggle(topic.name)}
                  className="h-5 w-5 rounded border-gray-500 text-cyan-600 focus:ring-cyan-500" />
                <span className="text-gray-200">{topic.name}</span>
              </label>
            ))}
          </div>
        </div>
        <div>
          <label htmlFor="daily-count" className="block text-sm font-medium text-gray-300 mb-2">2. Questions to Revise Per Day</label>
          <input type="number" id="daily-count" value={dailyCount} onChange={e => setDailyCount(Number(e.target.value))}
            min="1" className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500" />
        </div>
      </div>
      <div className="p-4 flex justify-end border-t border-gray-700">
        <button onClick={handleStartPlan} disabled={selectedTopics.length === 0 || dailyCount < 1}
          className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-6 rounded-lg transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed">
          Start Revision
        </button>
      </div>
    </motion.div>
  );

  const ActiveView = () => (
    <motion.div key="plan" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="p-4 max-h-[60vh] overflow-y-auto">
        {dailyQuestionsWithDetails.length > 0 ? (
          <ul>
            {dailyQuestionsWithDetails.map(result => (
              <li key={result.name} className="border-b border-gray-700 last:border-b-0">
                <button onClick={() => handleResultClick(result)} className="w-full text-left px-4 py-3 hover:bg-cyan-500/10 transition-colors">
                  <p className="font-semibold text-gray-200">{result.name}</p>
                  <p className="text-xs text-gray-400">{result.topic} &rarr; {result.pattern}</p>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center text-gray-400 py-8">
            <p className="font-semibold text-lg">All Done!</p>
            <p className="text-sm mt-1">Click "Get New Questions" for more, or stop the plan.</p>
          </div>
        )}
      </div>
      <div className="p-4 flex justify-between items-center border-t border-gray-700">
        <button onClick={() => dispatch(stopRevisionPlan())} className="text-sm text-red-500 hover:text-red-400 font-semibold">Stop Plan</button>
        <button 
          onClick={() => dispatch(generateNextRevisionBatch())}
          disabled={!canGetMoreQuestions}
          className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Get New Questions
        </button>
      </div>
    </motion.div>
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={closeModal}>
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }}
        className="bg-gray-800 border border-gray-700 rounded-xl shadow-2xl w-full max-w-2xl" onClick={e => e.stopPropagation()}>
        <div className="p-4 flex justify-between items-center border-b border-gray-700">
          <div className="flex items-center gap-2">
            {!revisionPlan.isActive ? <Cog6ToothIcon className="h-6 w-6 text-gray-400" /> : <SparklesIcon className="h-6 w-6 text-cyan-400" />}
            <h2 className="text-lg font-semibold text-gray-200">{!revisionPlan.isActive ? 'Setup Revision Plan' : "Today's Revision"}</h2>
          </div>
          <button onClick={closeModal} className="p-1 rounded-md hover:bg-gray-700"><XMarkIcon className="h-6 w-6" /></button>
        </div>
        <AnimatePresence mode="wait">
          {!revisionPlan.isActive ? <SetupView /> : <ActiveView />}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default RevisionModal;