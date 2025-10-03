import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useMediaQuery } from 'react-responsive';
import { AnimatePresence, motion } from 'framer-motion';
import { Toaster } from 'react-hot-toast';

// Redux
import { generateNextRevisionBatch } from './features/questions/questionsSlice';

// Components
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import MainContent from './components/MainContent';
import PracticeView from './components/PracticeView';
import ProgressTracker from './components/ProgressTracker';
import Footer from './components/Footer';
import StarredModal from './components/StarredModal';
import RevisionModal from './components/RevisionModal';
import SpacedRevisionModal from './components/SpacedRevisionModal';
import StatisticsModal from './components/StatisticsModal';
import ActivityGraph from './components/ActivityGraph'; // --- 1. नवीन कॉम्पोनंट इम्पोर्ट करा ---

function App() {
  // State for Modals and Sidebar
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isStarredModalOpen, setStarredModalOpen] = useState(false);
  const [isRevisionModalOpen, setRevisionModalOpen] = useState(false);
  const [isSpacedRevisionModalOpen, setSpacedRevisionModalOpen] = useState(false);
  const [isStatsModalOpen, setStatsModalOpen] = useState(false);

  // Redux State
  const dispatch = useDispatch();
  const { revisionPlan } = useSelector((state) => state.questions);
  const { viewMode } = useSelector((state) => state.ui);

  // Media Query
  const isDesktop = useMediaQuery({ query: '(min-width: 768px)' });

  // Effects
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

  // Framer Motion Variants
  const mainVariants = {
    open: { marginLeft: isDesktop ? 320 : 0 },
    closed: { marginLeft: 0 },
  };

  return (
    <div className="dark flex flex-col h-screen bg-slate-900 text-gray-200 overflow-hidden">
      <Toaster position="top-center" toastOptions={{ duration: 2000, style: { background: '#1F2937', color: '#F3F4F6' } }} />
      
      <div className="flex flex-1 relative overflow-hidden">
        <AnimatePresence>
          {isSidebarOpen && <Sidebar closeSidebar={() => setSidebarOpen(false)} />}
        </AnimatePresence>

        <motion.div
          variants={mainVariants}
          initial={false}
          animate={isSidebarOpen ? 'open' : 'closed'}
          transition={{ type: 'tween', ease: 'easeInOut', duration: 0.3 }}
          className="flex-1 flex flex-col min-w-0"
        >
          <Header 
            toggleSidebar={() => setSidebarOpen(prev => !prev)}
            onStarredClick={() => setStarredModalOpen(true)}
            onRevisionClick={() => setRevisionModalOpen(true)}
            onSpacedRevisionClick={() => setSpacedRevisionModalOpen(true)}
            onStatsClick={() => setStatsModalOpen(true)}
          />
          
          <div className="flex-1 flex flex-col overflow-y-auto">
            <ProgressTracker />
            {viewMode === 'pattern' ? <MainContent /> : <PracticeView />}
            
            {/* --- 2. ॲक्टिव्हिटी ग्राफ येथे फुटरच्या वर जोडा --- */}
            <ActivityGraph />

            <Footer />
          </div>
          
        </motion.div>
      </div>

      {/* सर्व Modals */}
      <AnimatePresence>
        {isStarredModalOpen && <StarredModal closeModal={() => setStarredModalOpen(false)} />}
      </AnimatePresence>
      <AnimatePresence>
        {isRevisionModalOpen && <RevisionModal closeModal={() => setRevisionModalOpen(false)} />}
      </AnimatePresence>
      <AnimatePresence>
        {isSpacedRevisionModalOpen && <SpacedRevisionModal closeModal={() => setSpacedRevisionModalOpen(false)} />}
      </AnimatePresence>
      <AnimatePresence>
        {isStatsModalOpen && <StatisticsModal closeModal={() => setStatsModalOpen(false)} />}
      </AnimatePresence>
    </div>
  );
}

export default App;