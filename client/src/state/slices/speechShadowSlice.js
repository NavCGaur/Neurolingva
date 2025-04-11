// src/features/speechShadowing/speechShadowingSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  practiceText: '',
  nativeAudio: null,
  userRecording: null,
  feedbackData: null,
  isLoading: false,
  error: null,
};

const speechShadowSlice = createSlice({
  name: 'speechShadow',
  initialState,
  reducers: {
    setPracticeText: (state, action) => {
      state.practiceText = action.payload;
      // Reset related data when text changes
      state.nativeAudio = null;
      state.userRecording = null;
      state.feedbackData = null;
    },
    setNativeAudio: (state, action) => {
      state.nativeAudio = action.payload;
    },
    setUserRecording: (state, action) => {
      state.userRecording = action.payload;
    },
    setFeedbackData: (state, action) => {
      state.feedbackData = action.payload;
      state.isLoading = false;
    },
    clearRecordingData: (state) => {
      state.userRecording = null;
      state.feedbackData = null;
    },
  },
});

export const {
  setPracticeText,
  setNativeAudio,
  setUserRecording,
  setFeedbackData,
  clearRecordingData,
} = speechShadowSlice.actions;

export default speechShadowSlice.reducer;