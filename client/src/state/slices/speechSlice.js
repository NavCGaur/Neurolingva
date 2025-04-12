import { createSlice } from '@reduxjs/toolkit';
import { speechApi } from '../api/speechApi';

const initialState = {
  isRecording: false,
  audioBlob: null,
  transcription: '',
  referenceText: '',
  pronunciationScore: null,
  phonemeAnalysis: [],
  wer: null,
  loading: false,
  error: null,
};

const speechSlice = createSlice({
  name: 'speech',
  initialState,
  reducers: {
    startRecording: (state) => {
      state.isRecording = true;
      state.error = null;
    },
    stopRecording: (state, action) => {
      state.isRecording = false;
      state.audioBlob = action.payload;
    },
    setReferenceText: (state, action) => {
      state.referenceText = action.payload;
    },
    clearAudio: (state) => {    
      state.audioBlob = null;
      state.transcription = '';
    },
    clearAnalysis: (state) => {
      state.pronunciationScore = null;
      state.phonemeAnalysis = [];
      state.wer = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Transcription handling
      .addMatcher(
        speechApi.endpoints.transcribeSpeech.matchPending,
        (state) => {
          state.loading = true;
        }
      )
      .addMatcher(
        speechApi.endpoints.transcribeSpeech.matchFulfilled,
        (state, { payload }) => {
          state.loading = false;
          state.transcription = payload.transcription;
        }
      )
      .addMatcher(
        speechApi.endpoints.transcribeSpeech.matchRejected,
        (state, { payload }) => {
          state.loading = false;
          state.error = payload?.data?.message || 'Transcription failed';
        }
      )
      // Analysis handling
      .addMatcher(
        speechApi.endpoints.analyzePronunciation.matchPending,
        (state) => {
          state.loading = true;
        }
      )
      .addMatcher(
        speechApi.endpoints.analyzePronunciation.matchFulfilled,
        (state, { payload }) => {
          state.loading = false;
          state.transcription = payload.transcription;
          state.pronunciationScore = payload.pronunciationScore;
          state.phonemeAnalysis = payload.phonemeAnalysis;
          state.wer = payload.wer;
        }
      )
      .addMatcher(
        speechApi.endpoints.analyzePronunciation.matchRejected,
        (state, { payload }) => {
          state.loading = false;
          state.error = payload?.data?.message || 'Analysis failed';
        }
      );
  },
});

export const {
  startRecording,
  stopRecording,
  setReferenceText,
  clearAudio,
  clearAnalysis,
  clearError,
} = speechSlice.actions;
export default speechSlice.reducer;
