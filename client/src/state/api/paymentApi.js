// src/state/paymentApi.js

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const paymentApi = createApi({
  reducerPath: 'paymentApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: process.env.REACT_APP_BASE_URL,
  }),
  endpoints: (build) => ({
    createPaypalOrder: build.mutation({
      query: (orderData) => ({
        url: '/payment/paypal/create-order',
        method: 'POST',
        body: orderData,
      }),
      }),
      capturePaypalPayment: build.mutation({
        query: ({orderId, userId, selectedServices}) => ({
          url: `/payment/paypal/capture-payment/${orderId}`,
          method: 'POST',
          body: { userId, selectedServices }
        }),
      })
  }),
});

export const {
  useCreatePaypalOrderMutation,
  useCapturePaypalPaymentMutation,

} = paymentApi;