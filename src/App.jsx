

import React, { useState, useEffect } from 'react'; // --- HI LINE CORRECT KELI AHE ---
import { useSelector, useDispatch } from 'react-redux';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import ProgressTracker from './components/ProgressTracker';
import SearchBar from './components/SearchBar';
import StarredModal from './components/StarredModal';
import RevisionModal from './components/RevisionModal';
import { Bars3Icon, StarIcon, ClockIcon } from '@heroicons/react/24/solid';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence, motion } from 'framer-motion';
import { generateNextRevisionBatch } from './features/questions/questionsSlice';
import { useMediaQuery } from 'react-responsive';

import Footer from './components/Footer';

function App() {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isStarredModalOpen, setStarredModalOpen] = useState(false);
  const [isRevisionModalOpen, setRevisionModalOpen] = useState(false);

  const dispatch = useDispatch();
  const revisionPlan = useSelector((state) => state.questions.revisionPlan);
  const isDesktop = useMediaQuery({ query: '(min-width: 768px)' });

  useEffect(() => {
    setSidebarOpen(isDesktop);
  }, [isDesktop]);

  useEffect(() => {
    if (revisionPlan && revisionPlan.isActive) {
      const today = new Date().setHours(0, 0, 0, 0);
      const lastGenerated = new Date(revisionPlan.planGeneratedTimestamp || 0).setHours(0, 0, 0, 0);
      if (today > lastGenerated) {
        dispatch(generateNextRevisionBatch());
      }
    }
  }, [dispatch, revisionPlan.isActive, revisionPlan.planGeneratedTimestamp]);

  const mainVariants = {
    open: { marginLeft: 320 },
    closed: { marginLeft: 0 },
  };

  return (
    <div className="dark flex flex-col h-screen bg-black text-gray-200 overflow-hidden">
      <Toaster position="top-center" toastOptions={{ duration: 2000, style: { background: '#1F2937', color: '#F3F4F6' } }} />
      
      <div className="flex flex-1 relative overflow-hidden">
        <AnimatePresence>
          {isSidebarOpen && <Sidebar closeSidebar={() => setSidebarOpen(false)} />}
        </AnimatePresence>

        <motion.div
          variants={mainVariants}
          initial={false}
          animate={isSidebarOpen && isDesktop ? 'open' : 'closed'}
          transition={{ type: 'tween', ease: 'easeInOut', duration: 0.3 }}
          className="flex-1 flex flex-col min-w-0"
        >
          <header className="bg-gray-800/80 backdrop-blur-sm shadow-md px-4 py-3 flex justify-between items-center z-10 border-b border-gray-700 flex-shrink-0">
            {/* Header content unchanged */}
            <div className="flex items-center gap-4">
              <button onClick={() => setSidebarOpen(prev => !prev)} className="p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500">
                <Bars3Icon className="h-6 w-6" />
              </button>
              <h1 className="text-xl md:text-2xl font-bold hidden sm:block">DSA Tracker</h1>
            </div>
            <div className="flex items-center gap-2">
              <SearchBar />
              <button onClick={() => setStarredModalOpen(true)} className="p-2 rounded-full hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-500" title="Show Starred Questions">
                <StarIcon className="h-6 w-6 text-yellow-400" />
              </button>
              <button onClick={() => setRevisionModalOpen(true)} className="p-2 rounded-full hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-500" title="Revision Planner">
                <ClockIcon className="h-6 w-6 text-cyan-400" />
              </button>
            </div>
          </header>
          
          <main className="flex-1 flex flex-col overflow-y-auto bg-gray-900">
            <ProgressTracker />
            <MainContent />
            <Footer />
          </main>
          
        </motion.div>
      </div>

      <AnimatePresence>
        {isStarredModalOpen && <StarredModal closeModal={() => setStarredModalOpen(false)} />}
      </AnimatePresence>
      <AnimatePresence>
        {isRevisionModalOpen && <RevisionModal closeModal={() => setRevisionModalOpen(false)} />}
      </AnimatePresence>
    </div>
  );
}

export default App;