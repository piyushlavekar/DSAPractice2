

import { createSlice } from '@reduxjs/toolkit';
import dsaQuestions from '../../dsa_questions.json';

// --- State Persistence Functions (Verified) ---
const loadState = () => {
  try {
    const serializedState = localStorage.getItem('dsaTrackerState');
    if (serializedState === null) return undefined;
    return JSON.parse(serializedState);
  } catch (err) { return undefined; }
};

const saveState = (state) => {
  try {
    const stateToSave = {
      selectedTopic: state.selectedTopic,
      solvedQuestions: state.solvedQuestions,
      starredQuestions: state.starredQuestions,
      questionNotes: state.questionNotes,
      solveDates: state.solveDates,
      revisionPlan: state.revisionPlan,
    };
    const serializedState = JSON.stringify(stateToSave);
    localStorage.setItem('dsaTrackerState', serializedState);
  } catch (err) { /* ignore */ }
};

const persistedState = loadState();

// --- Default State for robust merging ---
const defaultInitialState = {
  topics: dsaQuestions.topics,
  selectedTopic: dsaQuestions.topics[0]?.name || null,
  solvedQuestions: {},
  starredQuestions: {},
  questionNotes: {},
  solveDates: {},
  revisionPlan: {
    isActive: false,
    selectedTopics: [],
    questionsPerDay: 5,
    dailyQuestions: [],
    seenToday: [], // CRITICAL: Tracks all questions shown in the current session
  },
  highlightedQuestion: null,
};

// --- Robust Initial State (Verified) ---
const initialState = {
  ...defaultInitialState,
  ...persistedState,
  revisionPlan: {
    ...defaultInitialState.revisionPlan,
    ...(persistedState ? persistedState.revisionPlan : {}),
  },
};

// --- Redux Slice ---
export const questionsSlice = createSlice({
  name: 'questions',
  initialState,
  reducers: {
    setSelectedTopic: (state, action) => { state.selectedTopic = action.payload; saveState(state); },
    setHighlightedQuestion: (state, action) => { state.highlightedQuestion = action.payload; },
    toggleQuestionSolved: (state, action) => {
      const questionName = action.payload;
      state.solvedQuestions = { ...state.solvedQuestions, [questionName]: !state.solvedQuestions[questionName] };
      if (state.solvedQuestions[questionName]) { state.solveDates[questionName] = Date.now(); } 
      else { delete state.solveDates[questionName]; }
      saveState(state);
    },
    toggleQuestionStarred: (state, action) => {
      const questionName = action.payload;
      state.starredQuestions = { ...state.starredQuestions, [questionName]: !state.starredQuestions[questionName] };
      saveState(state);
    },
    updateQuestionNote: (state, action) => {
      const { questionName, note } = action.payload;
      state.questionNotes = { ...state.questionNotes, [questionName]: note };
      saveState(state);
    },

      // --- THIS IS THE NEW REDUCER FOR DELETING A NOTE ---
    deleteQuestionNote: (state, action) => {
      const questionName = action.payload;
      // Create a new copy of the notes object
      const newNotes = { ...state.questionNotes };
      // Delete the property for the specified question
      delete newNotes[questionName];
      // Assign the new object back to the state
      state.questionNotes = newNotes;
      saveState(state);
    },

    // --- REBUILT AND CORRECTED REVISION LOGIC ---
    startRevisionPlan: (state, action) => {
      state.revisionPlan.isActive = true;
      state.revisionPlan.selectedTopics = action.payload.topics;
      state.revisionPlan.questionsPerDay = action.payload.questionsPerDay;
      state.revisionPlan.dailyQuestions = [];
      state.revisionPlan.seenToday = []; // Reset for a fresh start
      saveState(state);
    },
    
    generateNextRevisionBatch: (state) => {
      if (!state.revisionPlan.isActive) return;

      const allQuestionsMap = new Map();
      state.topics.forEach(t => t.patterns.forEach(p => Object.values(p.questions).forEach(qL => qL.forEach(q => allQuestionsMap.set(q.name, { ...q, pattern: p.name, topic: t.name })))));
      
      const revisionPool = [];
      const selectedTopicsSet = new Set(state.revisionPlan.selectedTopics);
      const seenTodaySet = new Set(state.revisionPlan.seenToday || []);

      for (const questionName in state.solvedQuestions) {
        if (state.solvedQuestions[questionName]) {
          const details = allQuestionsMap.get(questionName);
          if (details && selectedTopicsSet.has(details.topic) && !seenTodaySet.has(questionName)) {
            revisionPool.push({ name: questionName, solveDate: state.solveDates[questionName] || 0 });
          }
        }
      }
      
      revisionPool.sort((a, b) => a.solveDate - b.solveDate);
      const nextBatch = revisionPool.slice(0, state.revisionPlan.questionsPerDay);
      
      state.revisionPlan.dailyQuestions = nextBatch;
      if (!state.revisionPlan.seenToday) state.revisionPlan.seenToday = [];
      state.revisionPlan.seenToday.push(...nextBatch.map(q => q.name));
      saveState(state);
    },

    stopRevisionPlan: (state) => {
      state.revisionPlan = defaultInitialState.revisionPlan; // Resets completely
      saveState(state);
    },

    
  },
});

export const { 
  setSelectedTopic, setHighlightedQuestion, toggleQuestionSolved, 
  toggleQuestionStarred, updateQuestionNote, startRevisionPlan,
  generateNextRevisionBatch, stopRevisionPlan,deleteQuestionNote,
} = questionsSlice.actions;

export default questionsSlice.reducer;