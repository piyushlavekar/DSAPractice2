
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toggleQuestionSolved, setHighlightedQuestion, toggleQuestionStarred } from '../features/questions/questionsSlice';
import NotesModal from './NotesModal';
import { ChevronDownIcon, StarIcon as StarIconSolid, DocumentTextIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarIconOutline } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const accordionVariants = {
  open: { opacity: 1, height: 'auto', transition: { duration: 0.5, ease: [0.04, 0.62, 0.23, 0.98] } },
  closed: { opacity: 0, height: 0, transition: { duration: 0.3, ease: 'easeInOut' } }
};
const listContainerVariants = {
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
  hidden: { opacity: 0 }
};
const listItemVariants = {
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
  hidden: { opacity: 0, y: 20 }
};
const difficultyColorMap = {
  easy: 'text-green-400',
  medium: 'text-yellow-400',
  hard: 'text-red-400',
};

const MainContent = () => {
  const { 
    topics, 
    selectedTopic, 
    solvedQuestions, 
    highlightedQuestion, 
    starredQuestions,
    questionNotes
  } = useSelector((state) => state.questions);

  const dispatch = useDispatch();
  const topic = topics.find((t) => t.name === selectedTopic);
  const [openPatterns, setOpenPatterns] = useState({});
  const [notesModalQuestion, setNotesModalQuestion] = useState(null);

  useEffect(() => {
    if (highlightedQuestion) {
      setOpenPatterns(prev => ({ ...prev, [highlightedQuestion.pattern]: true }));
      const elementId = `q-${highlightedQuestion.pattern}-${highlightedQuestion.question}`.replace(/\s+/g, '-');
      const scrollTimer = setTimeout(() => {
        const element = document.getElementById(elementId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          element.classList.add('highlight');
          const highlightTimer = setTimeout(() => {
            element.classList.remove('highlight');
            dispatch(setHighlightedQuestion(null));
          }, 2500);
          return () => clearTimeout(highlightTimer);
        }
      }, 500);
      return () => clearTimeout(scrollTimer);
    }
  }, [highlightedQuestion, dispatch]);

   const handleCheckboxChange = (questionName) => {
    // 1. प्रश्न टॉगल करण्यापूर्वी त्याची सध्याची स्थिती काय आहे ते तपासा
    const isCurrentlySolved = !!solvedQuestions[questionName];

    // 2. सध्याच्या स्थितीनुसार वेगळा टोस्ट (toast) दाखवा
    if (isCurrentlySolved) {
      // जर तो आधीच सॉल्व्ह असेल, तर तो आता 'unsolved' होईल
      toast.error(`'${questionName}' marked as unsolved.`);
    } else {
      // जर तो सॉल्व्ह नसेल, तर तो आता 'solved' होईल
      toast.success(`'${questionName}' marked as solved!`);
    }

    // 3. आता Redux मधील स्टेट अपडेट करा
    dispatch(toggleQuestionSolved(questionName));
  };

  // --- THIS IS THE UPDATED FUNCTION ---
  const handleStarClick = (questionName) => {
    const isCurrentlyStarred = !!starredQuestions[questionName];

    // Show the toast *before* dispatching the action
    if (!isCurrentlyStarred) {
      toast.success(`'${questionName}' starred successfully!`);
    } else {
      toast.error(`'${questionName}' removed from starred.`);
    }

    // Now, dispatch the action to update the state
    dispatch(toggleQuestionStarred(questionName));
  };

  const togglePattern = (patternName) => {
    setOpenPatterns(prev => ({ ...prev, [patternName]: !prev[patternName] }));
  };

  if (!topic) return <div className="flex-1 p-4 md:p-8 text-center">Please select a topic from the sidebar.</div>;

  return (
    <>
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedTopic}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <div className="px-4 pb-8 md:px-8">
            <header className="py-6 md:py-8"><h2 className="text-3xl md:text-4xl font-bold">{topic.name}</h2></header>
            <section className="flex flex-col gap-4">
              {topic.patterns.map((pattern) => {
                const isOpen = !!openPatterns[pattern.name];
                return (
                  <div key={pattern.name} className="bg-gray-800/80 backdrop-blur-sm border border-gray-700 rounded-xl shadow-md">
                    <button onClick={() => togglePattern(pattern.name)} className="w-full flex justify-between items-center p-4 md:p-6 text-left">
                      <h3 className="text-xl md:text-2xl font-semibold">{pattern.name}</h3>
                      <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
                        <ChevronDownIcon className="h-6 w-6" />
                      </motion.div>
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div key="content" variants={accordionVariants} initial="closed" animate="open" exit="closed" className="overflow-hidden">
                          <div className="px-4 md:px-6 pb-6 pt-0 space-y-4">
                            {Object.entries(pattern.questions).map(([difficulty, questions]) => (
                              questions.length > 0 && (
                                <div key={difficulty} className="border border-gray-700/80 rounded-lg p-4">
                                  <h4 className={`font-bold capitalize text-lg md:text-xl mb-3 ${difficultyColorMap[difficulty]}`}>{difficulty}</h4>
                                  <motion.ul variants={listContainerVariants} initial="hidden" animate="visible">
                                    {questions.map((question) => {
                                      const questionId = `q-${pattern.name}-${question.name}`.replace(/\s+/g, '-');
                                      const hasNote = questionNotes[question.name] && questionNotes[question.name].length > 0;
                                      const isSolved = !!solvedQuestions[question.name];

                                      return (
                                        <motion.li key={question.name} id={questionId} variants={listItemVariants} className="flex items-center justify-between border-b border-gray-700/80 last:border-b-0 py-3 transition-colors duration-300">
                                          <div className="flex items-center flex-grow min-w-0">
                                            <input type="checkbox" id={`${pattern.name}-${question.name}`} checked={isSolved} onChange={() => handleCheckboxChange(question.name)} className="h-5 w-5 flex-shrink-0 cursor-pointer rounded border-gray-500 text-cyan-600 focus:ring-cyan-500 focus:ring-offset-gray-900" />
                                            <label htmlFor={`${pattern.name}-${question.name}`} className={`ml-3 text-base md:text-lg truncate ${isSolved ? 'line-through text-gray-500' : ''}`}>
                                              <a href={question.link} target="_blank" rel="noopener noreferrer" className={`hover:underline transition-colors ${!isSolved ? 'hover:text-cyan-400' : 'cursor-default'}`}>
                                                {question.name}
                                              </a>
                                            </label>
                                          </div>
                                          <div className="flex items-center gap-1 md:gap-2 ml-2 md:ml-4 flex-shrink-0">
                                            <button onClick={() => setNotesModalQuestion(question)} className="p-2 rounded-full hover:bg-gray-700" title="Take Notes">
                                              <DocumentTextIcon className={`h-5 w-5 transition-colors ${hasNote ? 'text-cyan-400' : 'text-gray-400'}`} />
                                            </button>
                                            <button onClick={() => handleStarClick(question.name)} className="p-2 rounded-full hover:bg-gray-700" title="Star Question">
                                              {starredQuestions[question.name] ? <StarIconSolid className="h-5 w-5 text-yellow-400" /> : <StarIconOutline className="h-5 w-5 text-gray-400" />}
                                            </button>
                                          </div>
                                        </motion.li>
                                      );
                                    })}
                                  </motion.ul>
                                </div>
                              )
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </section>
          </div>
        </motion.div>
      </AnimatePresence>
      <AnimatePresence>
        {notesModalQuestion && <NotesModal question={notesModalQuestion} closeModal={() => setNotesModalQuestion(null)} />}
      </AnimatePresence>
    </>
  );
};

export default MainContent;