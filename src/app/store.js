import { configureStore } from '@reduxjs/toolkit';
import questionsReducer from '../features/questions/questionsSlice';
import uiReducer from '../features/ui/uiSlice';

export const store = configureStore({
  reducer: {
    questions: questionsReducer,
    ui: uiReducer, // <-- 2. नवीन reducer इथे जोडा
  },
});