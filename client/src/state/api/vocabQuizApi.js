import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseUrl = process.env.REACT_APP_BASE_URL;

console.log(baseUrl)

export const vocabQuizApi = createApi({
  reducerPath: 'vocabQuizApi',
  baseQuery: fetchBaseQuery({ baseUrl }),
  endpoints: (builder) => ({
    getVocabQuestions: builder.query({
      query: (userId) => `/vocab-questions?userId=${userId}`,
    }),
    submitVocabQuiz: builder.mutation({
      query: (answers) => ({
        url: '/vocab-questions/submit',
        method: 'POST',
        body: {answers},
      }),
    }),
  }),
});

export const { useGetVocabQuestionsQuery, useSubmitVocabQuizMutation } = vocabQuizApi;
