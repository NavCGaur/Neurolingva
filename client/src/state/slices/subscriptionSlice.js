// src/features/subscription/subscriptionSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentPlan: 'free',
  subscriptionStatus: null,
  currentPeriodEnd: null,
  cancelAtPeriodEnd: false,
  isLoading: false,
  error: null
};

const subscriptionSlice = createSlice({
  name: 'subscription',
  initialState,
  reducers: {
    setSubscriptionInfo: (state, action) => {
      return {
        ...state,
        ...action.payload
      };
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    }
  }
});

export const { setSubscriptionInfo, setLoading, setError } = subscriptionSlice.actions;
export default subscriptionSlice.reducer;