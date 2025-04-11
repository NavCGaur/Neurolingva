// src/services/api.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const speechShadowApi = createApi({
  reducerPath: 'speechShadowApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: process.env.REACT_APP_BASE_URL,

    prepareHeaders: (headers, { getState }) => {
      // Get token from auth state
      const token = getState().auth.token;
      
      // If we have a token, include it in the headers
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      
      return headers;
    },
  }),
  endpoints: (builder) => ({
    // Speech synthesis endpoint
    speechSynthesis: builder.query({
      query: (text) => ({
        url: '/speechShadow/synthesize',
        method: 'POST',
        body: { text },
      }),
      transformResponse: (response) => response,
    }),
    
    // Submit recording for analysis
    submitRecording: builder.mutation({
      query: (formData) => ({
        url: '/speechShadow/analyze',
        method: 'POST',
        body: formData,
        formData: true,
      }),
    }),
    
    // Get phoneme analysis results
    getPhonemeAnalysis: builder.query({
      query: ({ textId, recordingId }) => 
        `/speechShadow/analysis?textId=${encodeURIComponent(textId)}&recordingId=${encodeURIComponent(recordingId)}`,
      transformResponse: (response) => response,
    }),
    
    // Get user practice history
    getUserPracticeHistory: builder.query({
      query: () => '/users/practice-history',
      providesTags: ['PracticeHistory'],
    }),
    
    // Save practice session
    savePracticeSession: builder.mutation({
      query: (sessionData) => ({
        url: '/users/practice-session',
        method: 'POST',
        body: sessionData,
      }),
      invalidatesTags: ['PracticeHistory'],
    }),
  }),
});

export const {
  useSpeechSynthesisQuery,
  useSubmitRecordingMutation,
  useGetPhonemeAnalysisQuery,
  useGetUserPracticeHistoryQuery,
  useSavePracticeSessionMutation,
} = speechShadowApi;