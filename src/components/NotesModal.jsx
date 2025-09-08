

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
          <h2 className="text-lg font-semibold text-gray-200">Notes for: {question.name}</h2>
          <button onClick={closeModal} className="p-1 rounded-md hover:bg-gray-700"><XMarkIcon className="h-6 w-6" /></button>
        </div>
        <div className="p-4">
          <textarea
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder="Type your notes here..."
            className="w-full h-64 bg-gray-900 border border-gray-700 rounded-lg p-3 text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>
        <div className="p-4 flex justify-between items-center border-t border-gray-700">
          {/* --- THIS IS THE NEW DELETE BUTTON --- */}
          {/* It's only visible if a note already exists */}
          {savedNote && (
            <button 
              onClick={handleDelete}
              className="p-2 rounded-full hover:bg-red-500/20 text-red-500 hover:text-red-400 transition-colors"
              title="Delete Note"
            >
              <TrashIcon className="h-6 w-6" />
            </button>
          )}
          
          {/* Spacer to keep the save button on the right */}
          <div className="flex-grow"></div>

          <button
            onClick={handleSave}
            className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
          >
            Save & Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default NotesModal;