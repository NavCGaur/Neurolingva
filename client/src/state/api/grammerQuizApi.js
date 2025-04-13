import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseUrl = process.env.REACT_APP_BASE_URL;

console.log(baseUrl)

export const grammerQuizApi = createApi({
  reducerPath: 'grammerQuizApi',
  baseQuery: fetchBaseQuery({ baseUrl }),
  endpoints: (builder) => ({
    getGrammerQuestions: builder.query({
      query: (userId) => `/grammer-questions?userId=${userId}`,
    }),
    submitGrammerQuiz: builder.mutation({
      query: (answers) => ({
        url: '/grammer-questions/submit',
        method: 'POST',
        body: {answers},
      }),
    }),
  }),
});

export const { useGetGrammerQuestionsQuery, useSubmitGrammerQuizMutation } = grammerQuizApi;
