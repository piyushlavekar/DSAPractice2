
// src/components/PracticeView.jsx

import React, { useMemo, useEffect, useState } from 'react'; // useEffect and useState import करा
import { useSelector, useDispatch } from 'react-redux';
import { toggleQuestionSolved, setHighlightedQuestion, toggleQuestionStarred } from '../features/questions/questionsSlice';
import NotesModal from './NotesModal';
import { StarIcon as StarIconSolid, DocumentTextIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarIconOutline } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

// --- Animation variants (No change) ---
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
  hard: 'text-red-500',
};

const PracticeView = () => {
  const dispatch = useDispatch();
  // --- 1. Redux मधून highlightedQuestion मिळवा ---
  const { 
    topics, 
    selectedTopic, 
    solvedQuestions, 
    starredQuestions, 
    questionNotes,
    highlightedQuestion // <-- हा महत्त्वाचा आहे
  } = useSelector((state) => state.questions);
  
  const [notesModalQuestion, setNotesModalQuestion] = useState(null);
  
  const topic = topics.find((t) => t.name === selectedTopic);

  // --- 2. हायलाईटिंगसाठी useEffect लॉजिक (MainContent मधून कॉपी केलेले) ---
  useEffect(() => {
    // जर Redux मध्ये हायलाईट करण्यासाठी प्रश्न असेल तर...
    if (highlightedQuestion) {
      // त्या प्रश्नासाठी एक युनिक आयडी तयार करा
      const elementId = `q-${highlightedQuestion.pattern}-${highlightedQuestion.question}`.replace(/\s+/g, '-');
      
      // थोडा वेळ थांबा, जेणेकरून DOM अपडेट होईल
      const scrollTimer = setTimeout(() => {
        const element = document.getElementById(elementId);
        // जर तो प्रश्न पेजवर सापडला तर...
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          element.classList.add('highlight'); // हायलाईट क्लास लावा
          
          // 2.5 सेकंदांनंतर हायलाईट काढून टाका
          const highlightTimer = setTimeout(() => {
            element.classList.remove('highlight');
            dispatch(setHighlightedQuestion(null)); // Redux state रिकामा करा
          }, 2500);
          return () => clearTimeout(highlightTimer);
        }
      }, 100); // 100ms थांबा
      return () => clearTimeout(scrollTimer);
    }
  }, [highlightedQuestion, dispatch]);


  // --- Questions by difficulty logic (No change) ---
  const questionsByDifficulty = useMemo(() => {
    if (!topic) return { easy: [], medium: [], hard: [] };
    const difficultyMap = { easy: [], medium: [], hard: [] };
    topic.patterns.forEach(pattern => {
      Object.entries(pattern.questions).forEach(([difficulty, questions]) => {
        const questionsWithPattern = questions.map(q => ({...q, patternName: pattern.name}));
        difficultyMap[difficulty].push(...questionsWithPattern);
      });
    });
    return difficultyMap;
  }, [topic]);

  // --- UPDATED HANDLER FOR CHECKBOX ---
  const handleCheckboxChange = (questionName) => {
    const isCurrentlySolved = !!solvedQuestions[questionName];
    if (isCurrentlySolved) {
      toast.error(`'${questionName}' marked as unsolved.`);
    } else {
      toast.success(`'${questionName}' marked as solved!`);
    }
    dispatch(toggleQuestionSolved(questionName));
  };

  // --- UPDATED HANDLER FOR STAR ---
  const handleStarClick = (questionName) => {
    const isCurrentlyStarred = !!starredQuestions[questionName];
    if (isCurrentlyStarred) {
      toast.error(`'${questionName}' removed from starred.`);
    } else {
      toast.success(`'${questionName}' added to starred!`);
    }
    dispatch(toggleQuestionStarred(questionName));
  };
  
  if (!topic) return <div className="flex-1 p-8 text-center text-slate-400">Please select a topic to start practicing.</div>;

  return (
    <>
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedTopic}
          // ... (rest of the motion.div is same)
        >
          <header className="px-8 py-8 border-b border-slate-800">
            <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">{topic.name}</h2>
            <p className="mt-2 text-lg text-slate-400">Practice Mode: All questions by difficulty.</p>
          </header>

          <main className="px-4 md:px-8 py-8 flex flex-col gap-5">
            {Object.entries(questionsByDifficulty).map(([difficulty, questions]) => (
              questions.length > 0 && (
                <div key={difficulty} className="bg-slate-800/60 border border-slate-700 rounded-2xl shadow-lg p-5">
                  <h4 className={`font-bold capitalize text-2xl mb-4 ${difficultyColorMap[difficulty]}`}>{difficulty}</h4>
                  <motion.ul variants={listContainerVariants} initial="hidden" animate="visible">
                    {questions.map((question) => {
                      // --- 3. प्रत्येक प्रश्नाला एक युनिक आयडी द्या ---
                      const questionId = `q-${question.patternName}-${question.name}`.replace(/\s+/g, '-');
                      const hasNote = questionNotes[question.name] && questionNotes[question.name].length > 0;
                      const isSolved = !!solvedQuestions[question.name];

                      return (
                        // id={questionId} येथे जोडला आहे
                        <motion.li key={question.name} id={questionId} variants={listItemVariants} className="flex items-center justify-between border-b border-slate-700 last:border-b-0 py-4 transition-all duration-300">
                          {/* --- बाकी सर्व कोड जसा आहे तसाच राहील --- */}
                          <div className="flex items-center flex-grow min-w-0">
                            <input type="checkbox" id={`practice-${question.name}`} checked={isSolved} onChange={() => handleCheckboxChange(question.name)} className="h-5 w-5 flex-shrink-0 cursor-pointer rounded-md border-slate-500 bg-slate-700 text-cyan-500 focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-slate-900" />
                            <div className="ml-4">
                                <label htmlFor={`practice-${question.name}`} className={`text-base md:text-lg transition-colors ${isSolved ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                                <a href={question.link} target="_blank" rel="noopener noreferrer" className={`hover:underline ${!isSolved ? 'hover:text-cyan-400' : 'cursor-default'}`}>
                                    {question.name}
                                </a>
                                </label>
                                <p className="text-xs text-slate-500 mt-1">{question.patternName}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 md:gap-2 ml-2 md:ml-4 flex-shrink-0">
                            <button onClick={() => setNotesModalQuestion(question)} className="p-2 rounded-full hover:bg-slate-700 transition-colors" title="Take Notes">
                              <DocumentTextIcon className={`h-5 w-5 transition-colors ${hasNote ? 'text-cyan-400' : 'text-slate-400'}`} />
                            </button>
                            <button onClick={() => handleStarClick(question.name)} className="p-2 rounded-full hover:bg-slate-700 transition-colors" title="Star Question">
                              {starredQuestions[question.name] ? <StarIconSolid className="h-5 w-5 text-yellow-400" /> : <StarIconOutline className="h-5 w-5 text-slate-400" />}
                            </button>
                          </div>
                        </motion.li>
                      );
                    })}
                  </motion.ul>
                </div>
              )
            ))}
          </main>
        </motion.div>
      </AnimatePresence>
      <AnimatePresence>
        {notesModalQuestion && <NotesModal question={notesModalQuestion} closeModal={() => setNotesModalQuestion(null)} />}
      </AnimatePresence>
    </>
  );
};

export default PracticeView;