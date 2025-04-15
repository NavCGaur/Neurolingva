import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const statsApi = createApi({
  reducerPath: 'statsApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: process.env.REACT_APP_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      // Get token from auth state
      const token = getState().auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getUserStats: builder.query({
      query: (userId) => `stats/vocabulary?userId=${userId}`,
      transformResponse: (response) => response.data,
    }),
  }),
});

export const { useGetUserStatsQuery } = statsApi;
