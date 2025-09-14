

// import React, { useState, useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// // --- Import the new action ---
// import { updateQuestionNote, deleteQuestionNote } from '../features/questions/questionsSlice';
// import { motion } from 'framer-motion';
// import { XMarkIcon, TrashIcon } from '@heroicons/react/24/solid'; // Import TrashIcon
// import toast from 'react-hot-toast';

// const NotesModal = ({ question, closeModal }) => {
//   const dispatch = useDispatch();
//   const savedNote = useSelector(state => state.questions.questionNotes[question.name] || '');
//   const [note, setNote] = useState(savedNote);

//   useEffect(() => {
//     setNote(savedNote);
//   }, [question, savedNote]);

//   const handleSave = () => {
//     dispatch(updateQuestionNote({ questionName: question.name, note }));
//     toast.success('Note saved successfully!');
//     closeModal();
//   };
  
//   // --- THIS IS THE NEW HANDLER FOR THE DELETE BUTTON ---
//   const handleDelete = () => {
//     dispatch(deleteQuestionNote(question.name));
//     toast.error('Note deleted.');
//     closeModal();
//   };

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
//           <h2 className="text-lg font-semibold text-gray-200">Notes for: {question.name}</h2>
//           <button onClick={closeModal} className="p-1 rounded-md hover:bg-gray-700"><XMarkIcon className="h-6 w-6" /></button>
//         </div>
//         <div className="p-4">
//           <textarea
//             value={note}
//             onChange={e => setNote(e.target.value)}
//             placeholder="Type your notes here..."
//             className="w-full h-64 bg-gray-900 border border-gray-700 rounded-lg p-3 text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
//           />
//         </div>
//         <div className="p-4 flex justify-between items-center border-t border-gray-700">
//           {/* --- THIS IS THE NEW DELETE BUTTON --- */}
//           {/* It's only visible if a note already exists */}
//           {savedNote && (
//             <button 
//               onClick={handleDelete}
//               className="p-2 rounded-full hover:bg-red-500/20 text-red-500 hover:text-red-400 transition-colors"
//               title="Delete Note"
//             >
//               <TrashIcon className="h-6 w-6" />
//             </button>
//           )}
          
//           {/* Spacer to keep the save button on the right */}
//           <div className="flex-grow"></div>

//           <button
//             onClick={handleSave}
//             className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
//           >
//             Save & Close
//           </button>
//         </div>
//       </motion.div>
//     </motion.div>
//   );
// };

// export default NotesModal;
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// --- Import the new action ---
import { updateQuestionNote, deleteQuestionNote } from '../features/questions/questionsSlice';
import { motion } from 'framer-motion';
import { XMarkIcon, TrashIcon } from '@heroicons/react/24/solid'; // Import TrashIcon
import toast from 'react-hot-toast';

const NotesModal = ({ question, closeModal }) => {
  const dispatch = useDispatch();
  const savedNote = useSelector(state => state.questions.questionNotes[question.name] || '');
  const [note, setNote] = useState(savedNote);

  useEffect(() => {
    setNote(savedNote);
  }, [question, savedNote]);

  const handleSave = () => {
    dispatch(updateQuestionNote({ questionName: question.name, note }));
    toast.success('Note saved successfully!');
    closeModal();
  };
  
  // --- THIS IS THE NEW HANDLER FOR THE DELETE BUTTON ---
  const handleDelete = () => {
    dispatch(deleteQuestionNote(question.name));
    toast.error('Note deleted.');
    closeModal();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      // --- NEW: Added backdrop blur for a glassy effect ---
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={closeModal}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        // --- NEW: Richer modal styling ---
        className="bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-5 flex justify-between items-center border-b border-slate-700">
          <h2 className="text-lg font-semibold text-slate-100">Notes for: {question.name}</h2>
          <button onClick={closeModal} className="p-1 rounded-full text-slate-400 hover:bg-slate-700 hover:text-white transition-colors"><XMarkIcon className="h-6 w-6" /></button>
        </div>
        <div className="p-5">
          <textarea
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder="Type your notes here..."
            className="w-full h-64 bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-colors"
          />
        </div>
        <div className="p-4 flex justify-between items-center bg-slate-800/50 border-t border-slate-700 rounded-b-2xl">
          {savedNote && (
            <button 
              onClick={handleDelete}
              className="p-2 rounded-full hover:bg-red-500/20 text-red-500 hover:text-red-400 transition-all duration-200 transform hover:scale-110"
              title="Delete Note"
            >
              <TrashIcon className="h-6 w-6" />
            </button>
          )}
          
          <div className="flex-grow"></div>

          {/* --- NEW: Richer Save button --- */}
          <button
            onClick={handleSave}
            className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2 px-5 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-cyan-500/40"
          >
            Save & Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default NotesModal;