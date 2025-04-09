import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const vocabApi = createApi({
  reducerPath: 'vocabApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_BASE_URL,
  }),
  endpoints: (build) => ({
    getPracticeWords: build.query({
      query: (userId) => `/vocab/practice?userId=${userId}`,
    }),

    submitRatings: build.mutation({
      query: ({ userId, ratings }) => ({
        url: '/vocab/submitratings',
        method: 'POST',
        body: { userId, ratings },
      }),
    }),
  }),
});

export const {
  useGetPracticeWordsQuery,
  useSubmitRatingsMutation,
} = vocabApi;
