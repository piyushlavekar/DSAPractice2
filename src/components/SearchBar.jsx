import React, { useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setSelectedTopic, setHighlightedQuestion } from '../features/questions/questionsSlice';
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import { motion, AnimatePresence } from 'framer-motion';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const dispatch = useDispatch();
  const { topics } = useSelector((state) => state.questions);

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

  const results = useMemo(() => {
    if (!query) return [];
    return allQuestions.filter(q =>
      q.name.toLowerCase().includes(query.toLowerCase())
    );
  }, [query, allQuestions]);

  const handleResultClick = (result) => {
    dispatch(setSelectedTopic(result.topic));
    dispatch(setHighlightedQuestion({
      topic: result.topic,
      pattern: result.pattern,
      question: result.name,
    }));
    setQuery('');
  };

  return (
    <div className="relative w-full max-w-xs">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a problem..."
          className="w-full bg-gray-700/50 text-gray-200 placeholder-gray-400 rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-cyan-500"
        />
        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
      </div>
      <AnimatePresence>
        {results.length > 0 && query && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full mt-2 w-full bg-gray-800 border border-gray-700 rounded-lg shadow-xl overflow-hidden z-50"
          >
            {/* --- KEY CHANGE: The list now has a max height and is scrollable --- */}
            <ul className="max-h-60 overflow-y-auto">
              {/* --- KEY CHANGE: Removed .slice(0, 4) to show all results --- */}
              {results.map(result => (
                <li key={`${result.topic}-${result.name}`}>
                  <button
                    onClick={() => handleResultClick(result)}
                    className="w-full text-left px-4 py-3 hover:bg-cyan-500/10 transition-colors duration-150"
                  >
                    <p className="font-semibold text-gray-200">{result.name}</p>
                    <p className="text-xs text-gray-400">{result.topic} &rarr; {result.pattern}</p>
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;