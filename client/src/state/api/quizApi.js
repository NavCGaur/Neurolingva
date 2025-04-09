import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseUrl = process.env.REACT_APP_BASE_URL;

console.log(baseUrl)

export const quizApi = createApi({
  reducerPath: 'quizApi',
  baseQuery: fetchBaseQuery({ baseUrl }),
  endpoints: (builder) => ({
    getQuestions: builder.query({
      query: (userId) => `/questions?userId=${userId}`,
    }),
    submitQuiz: builder.mutation({
      query: (answers) => ({
        url: '/questions/submit',
        method: 'POST',
        body: {answers},
      }),
    }),
  }),
});

export const { useGetQuestionsQuery, useSubmitQuizMutation } = quizApi;
