// src/features/ui/uiSlice.js

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // दोन व्ह्यू असतील: 'pattern' (default) आणि 'practice'
  viewMode: 'pattern', 
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // हा ॲक्शन व्ह्यू मोड टॉगल करेल
    toggleViewMode: (state) => {
      state.viewMode = state.viewMode === 'pattern' ? 'practice' : 'pattern';
    },
  },
});

export const { toggleViewMode } = uiSlice.actions;

export default uiSlice.reducer;