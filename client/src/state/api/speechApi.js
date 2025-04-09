import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const speechApi = createApi({
  reducerPath: 'speechApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: process.env.REACT_APP_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) {
        headers.set('x-auth-token', token);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    // Auth endpoints
    register: builder.mutation({
      query: (credentials) => ({
        url: '/auth/register',
        method: 'POST',
        body: credentials,
      }),
    }),
    login: builder.mutation({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    
    // Speech endpoints
    transcribeSpeech: builder.mutation({
      query: (data) => ({
        url: '/speech/transcribe',
        method: 'POST',
        body: data,
      }),
    }),
    analyzePronunciation: builder.mutation({
      query: (data) => ({
        url: '/speech/analyze',
        method: 'POST',
        body: data,
      }),
    }),
    getHistory: builder.query({
      query: () => '/speech/history',
      providesTags: ['History'],
    }),
    getAnalysisDetails: builder.query({
      query: (id) => `/speech/details/${id}`,
      providesTags: (result, error, id) => [{ type: 'Analysis', id }],
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useTranscribeSpeechMutation,
  useAnalyzePronunciationMutation,
  useGetHistoryQuery,
  useGetAnalysisDetailsQuery,
} = speechApi;
