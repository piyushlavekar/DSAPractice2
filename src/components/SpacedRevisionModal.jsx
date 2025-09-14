

// import React, { useMemo } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { setSelectedTopic, setHighlightedQuestion } from '../features/questions/questionsSlice';
// import { motion } from 'framer-motion';
// import { XMarkIcon, CalendarDaysIcon } from '@heroicons/react/24/solid';

// // --- इथे टॉगल करा: टेस्टिंगसाठी true ठेवा, फायनल ॲपसाठी false करा ---
// const isTestMode = true; 

// const SpacedRevisionModal = ({ closeModal }) => {
//   const dispatch = useDispatch();
//   const { topics, solveDates } = useSelector(state => state.questions);

//   const revisionQuestions = useMemo(() => {
//     const allQuestionsMap = new Map();
//     topics.forEach(topic => {
//       topic.patterns.forEach(pattern => {
//         Object.values(pattern.questions).forEach(qList => {
//           qList.forEach(question => {
//             allQuestionsMap.set(question.name, { ...question, pattern: pattern.name, topic: topic.name });
//           });
//         });
//       });
//     });

//     const questionsToRevise = [];

//     if (isTestMode) {
//       // --- टेस्टिंग लॉजिक: बरोबर 5 मिनिटांनंतर दिसेल आणि 5 मिनिटांसाठी दिसेल ---
//       const now = Date.now();
//       // प्रश्न सोडवल्यानंतर 5 मिनिटांनी दिसावा...
//       const windowStart = now - (10 * 60 * 1000); // 10 मिनिटांपूर्वी
//       // ... आणि 10 मिनिटांनंतर दिसू नये.
//       const windowEnd = now - (5 * 60 * 1000); // 5 मिनिटांपूर्वी
      
//       for (const questionName in solveDates) {
//         const solveTimestamp = solveDates[questionName];
//         if (solveTimestamp > windowStart && solveTimestamp <= windowEnd) {
//           const details = allQuestionsMap.get(questionName);
//           if (details) questionsToRevise.push(details);
//         }
//       }

//     } else {
//       // --- फायनल लॉजिक: बरोबर 3 दिवसांपूर्वीचे प्रश्न दाखवेल ---
      
//       // 1. आजच्या दिवसाची सुरुवात (00:00:00)
//       const today = new Date();
//       today.setHours(0, 0, 0, 0);

//       // 2. बरोबर 3 दिवसांपूर्वीच्या दिवसाची सुरुवात
//       const targetDayStart = new Date(today);
//       targetDayStart.setDate(today.getDate() - 3);
//       const targetDayStartTimestamp = targetDayStart.getTime();

//       // 3. 2 दिवसांपूर्वीच्या दिवसाची सुरुवात (हे 3 दिवसांपूर्वीच्या दिवसाचा शेवट असेल)
//       const targetDayEnd = new Date(today);
//       targetDayEnd.setDate(today.getDate() - 2);
//       const targetDayEndTimestamp = targetDayEnd.getTime();

//       for (const questionName in solveDates) {
//         const solveTimestamp = solveDates[questionName];
//         // प्रश्न त्या 24 तासांच्या विंडोमध्ये सोडवला होता का ते तपासा
//         if (solveTimestamp >= targetDayStartTimestamp && solveTimestamp < targetDayEndTimestamp) {
//           const details = allQuestionsMap.get(questionName);
//           if (details) questionsToRevise.push(details);
//         }
//       }
//     }
    
//     return questionsToRevise;
//   }, [topics, solveDates]);

//   const handleResultClick = (result) => {
//     dispatch(setSelectedTopic(result.topic));
//     dispatch(setHighlightedQuestion({
//       topic: result.topic,
//       pattern: result.pattern,
//       question: result.name,
//     }));
//     closeModal();
//   };

//   // UI साठी डायनॅमिक शीर्षक आणि संदेश
//   const modalTitle = isTestMode ? "Revision (5-10 Mins Ago)" : "Spaced Revision (3 Days Ago)";
//   const emptyMessage = isTestMode ? "No questions were solved between 5 and 10 minutes ago." : "You didn't solve any questions 3 days ago.";

//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       exit={{ opacity: 0 }}
//       className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
//       onClick={closeModal}
//     >
//       <motion.div
//         initial={{ y: 20, opacity: 0 }}
//         animate={{ y: 0, opacity: 1 }}
//         exit={{ y: 20, opacity: 0 }}
//         className="bg-gray-800 border border-gray-700 rounded-xl shadow-2xl w-full max-w-2xl"
//         onClick={e => e.stopPropagation()}
//       >
//         <div className="p-4 flex justify-between items-center border-b border-gray-700">
//           <div className="flex items-center gap-2">
//             <CalendarDaysIcon className="h-6 w-6 text-green-400" />
//             <h2 className="text-lg font-semibold text-gray-200">{modalTitle}</h2>
//           </div>
//           <button onClick={closeModal} className="p-1 rounded-md hover:bg-gray-700"><XMarkIcon className="h-6 w-6" /></button>
//         </div>
//         <div className="p-4 max-h-[70vh] overflow-y-auto">
//           {revisionQuestions.length > 0 ? (
//             <ul>
//               {revisionQuestions.map(result => (
//                 <li key={`${result.topic}-${result.name}`} className="border-b border-gray-700 last:border-b-0">
//                   <button onClick={() => handleResultClick(result)} className="w-full text-left px-4 py-3 hover:bg-cyan-500/10 transition-colors">
//                     <p className="font-semibold text-gray-200">{result.name}</p>
//                     <p className="text-xs text-gray-400">{result.topic} &rarr; {result.pattern}</p>
//                   </button>
//                 </li>
//               ))}
//             </ul>
//           ) : (
//             <p className="text-center text-gray-400 py-8">{emptyMessage}</p>
//           )}
//         </div>
//       </motion.div>
//     </motion.div>
//   );
// };

// export default SpacedRevisionModal;

// src/components/SpacedRevisionModal.jsx

import React, { useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setSelectedTopic, setHighlightedQuestion } from '../features/questions/questionsSlice';
import { motion } from 'framer-motion';
import { XMarkIcon, CalendarDaysIcon } from '@heroicons/react/24/solid';

const SpacedRevisionModal = ({ closeModal }) => {
  const dispatch = useDispatch();
  const { topics, solveDates } = useSelector(state => state.questions);

  const revisionQuestions = useMemo(() => {
    // 1. सर्व प्रश्नांची माहिती एका Map मध्ये साठवा
    const allQuestionsMap = new Map();
    topics.forEach(topic => {
      topic.patterns.forEach(pattern => {
        Object.values(pattern.questions).forEach(qList => {
          qList.forEach(question => {
            allQuestionsMap.set(question.name, { ...question, pattern: pattern.name, topic: topic.name });
          });
        });
      });
    });

    // --- अंतिम लॉजिक: बरोबर 3 दिवसांपूर्वीचे प्रश्न दाखवेल ---
    
    // 2. आजच्या दिवसाची सुरुवात (00:00:00 वाजता)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 3. बरोबर 3 दिवसांपूर्वीच्या दिवसाची सुरुवात
    const targetDayStart = new Date(today);
    targetDayStart.setDate(today.getDate() - 3);
    const targetDayStartTimestamp = targetDayStart.getTime();

    // 4. 2 दिवसांपूर्वीच्या दिवसाची सुरुवात (ही 3 दिवसांपूर्वीच्या दिवसाची शेवटची वेळ असेल)
    const targetDayEnd = new Date(today);
    targetDayEnd.setDate(today.getDate() - 2);
    const targetDayEndTimestamp = targetDayEnd.getTime();

    const questionsToRevise = [];
    for (const questionName in solveDates) {
      const solveTimestamp = solveDates[questionName];
      // प्रश्न त्या 24 तासांच्या विंडोमध्ये सोडवला होता का ते तपासा
      if (solveTimestamp >= targetDayStartTimestamp && solveTimestamp < targetDayEndTimestamp) {
        const details = allQuestionsMap.get(questionName);
        if (details) {
          questionsToRevise.push(details);
        }
      }
    }
    
    return questionsToRevise;
  }, [topics, solveDates]);

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
            <CalendarDaysIcon className="h-6 w-6 text-green-400" />
            <h2 className="text-lg font-semibold text-gray-200">Spaced Revision (3 Days Ago)</h2>
          </div>
          <button onClick={closeModal} className="p-1 rounded-md hover:bg-gray-700"><XMarkIcon className="h-6 w-6" /></button>
        </div>
        <div className="p-4 max-h-[70vh] overflow-y-auto">
          {revisionQuestions.length > 0 ? (
            <ul>
              {revisionQuestions.map(result => (
                <li key={`${result.topic}-${result.name}`} className="border-b border-gray-700 last:border-b-0">
                  <button onClick={() => handleResultClick(result)} className="w-full text-left px-4 py-3 hover:bg-cyan-500/10 transition-colors">
                    <p className="font-semibold text-gray-200">{result.name}</p>
                    <p className="text-xs text-gray-400">{result.topic} &rarr; {result.pattern}</p>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-gray-400 py-8">You didn't solve any questions 3 days ago.</p>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SpacedRevisionModal;