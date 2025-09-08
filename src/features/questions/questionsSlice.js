

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
    seenToday: [],
    planGeneratedTimestamp: null, // --- 1. ADDED THIS PROPERTY FOR BETTER LOGIC ---
  },
  highlightedQuestion: null,
};

// --- CHANGE 2: SIMPLIFIED AND CORRECTED INITIAL STATE LOGIC ---
// This now correctly loads the entire revision plan from localStorage,
// including the list of daily questions, solving the refresh problem.
const initialState = {
  ...defaultInitialState,
  ...persistedState,
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
    deleteQuestionNote: (state, action) => {
      const questionName = action.payload;
      const newNotes = { ...state.questionNotes };
      delete newNotes[questionName];
      state.questionNotes = newNotes;
      saveState(state);
    },
    startRevisionPlan: (state, action) => {
      state.revisionPlan.isActive = true;
      state.revisionPlan.selectedTopics = action.payload.topics;
      state.revisionPlan.questionsPerDay = action.payload.questionsPerDay;
      state.revisionPlan.dailyQuestions = [];
      state.revisionPlan.seenToday = [];
      // --- CHANGE 3: SET THE TIMESTAMP WHEN THE PLAN STARTS ---
      state.revisionPlan.planGeneratedTimestamp = Date.now(); 
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
      
      // --- CHANGE 4: UPDATE THE TIMESTAMP WHENEVER A NEW BATCH IS GENERATED ---
      state.revisionPlan.planGeneratedTimestamp = Date.now();
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
  generateNextRevisionBatch, stopRevisionPlan, deleteQuestionNote,
} = questionsSlice.actions;

export default questionsSlice.reducer;