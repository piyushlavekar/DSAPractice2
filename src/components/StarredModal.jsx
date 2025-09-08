import React, { useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setSelectedTopic, setHighlightedQuestion } from '../features/questions/questionsSlice';
import { motion } from 'framer-motion';
import { XMarkIcon, StarIcon } from '@heroicons/react/24/solid';

const StarredModal = ({ closeModal }) => {
  const dispatch = useDispatch();
  const { topics, starredQuestions } = useSelector(state => state.questions);

  const allStarred = useMemo(() => {
    const flattened = [];
    topics.forEach(topic => {
      topic.patterns.forEach(pattern => {
        Object.values(pattern.questions).forEach(qList => {
          qList.forEach(question => {
            if (starredQuestions[question.name]) {
              flattened.push({ ...question, pattern: pattern.name, topic: topic.name });
            }
          });
        });
      });
    });
    return flattened;
  }, [topics, starredQuestions]);

  const handleResultClick = (result) => {
    dispatch(setSelectedTopic(result.topic));
    dispatch(setHighlightedQuestion({
      topic: result.topic,
      pattern: result.pattern,
      question: result.name,
    }));
    closeModal();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
      onClick={closeModal}
    >
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 20, opacity: 0 }}
        className="bg-gray-800 border border-gray-700 rounded-xl shadow-2xl w-full max-w-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-4 flex justify-between items-center border-b border-gray-700">
          <div className="flex items-center gap-2">
            <StarIcon className="h-6 w-6 text-yellow-400" />
            <h2 className="text-lg font-semibold text-gray-200">Starred Questions</h2>
          </div>
          <button onClick={closeModal} className="p-1 rounded-md hover:bg-gray-700"><XMarkIcon className="h-6 w-6" /></button>
        </div>
        <div className="p-4 max-h-[70vh] overflow-y-auto">
          {allStarred.length > 0 ? (
            <ul>
              {allStarred.map(result => (
                <li key={`${result.topic}-${result.name}`} className="border-b border-gray-700 last:border-b-0">
                  <button
                    onClick={() => handleResultClick(result)}
                    className="w-full text-left px-4 py-3 hover:bg-cyan-500/10 transition-colors"
                  >
                    <p className="font-semibold text-gray-200">{result.name}</p>
                    <p className="text-xs text-gray-400">{result.topic} &rarr; {result.pattern}</p>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-gray-400 py-8">You haven't starred any questions yet.</p>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default StarredModal;