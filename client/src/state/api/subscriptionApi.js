// src/services/subscriptionApi.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getAuth } from 'firebase/auth';

export const subscriptionApi = createApi({
  reducerPath: 'subscriptionApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
    prepareHeaders: async (headers) => {
      const auth = getAuth();
      const user = auth.currentUser;
      
      if (user) {
        const token = await user.getIdToken();
        headers.set('Authorization', `Bearer ${token}`);
      }
      
      return headers;
    }
  }),
  endpoints: (builder) => ({
    createCheckoutSession: builder.mutation({
      query: (data) => ({
        url: '/stripe/create-checkout-session',
        method: 'POST',
        body: data
      })
    }),
    createBillingPortal: builder.mutation({
      query: () => ({
        url: '/stripe/create-billing-portal',
        method: 'POST'
      })
    }),
    getCurrentSubscription: builder.query({
      query: () => '/user/subscription'
    })
  })
});

export const { 
  useCreateCheckoutSessionMutation, 
  useCreateBillingPortalMutation,
  useGetCurrentSubscriptionQuery
} = subscriptionApi;