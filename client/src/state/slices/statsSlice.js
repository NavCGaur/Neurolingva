import { createSlice } from '@reduxjs/toolkit';
import { statsApi } from '../api/statsApi';

const initialState = {
  totalWords: 0,
  daysSinceLastReview: 0,
  nextReviewDate: null,
  averageRating: 0,
};

const statsSlice = createSlice({
  name: 'stats',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addMatcher(
      statsApi.endpoints.getUserStats.matchFulfilled,
      (state, { payload }) => {
        state.totalWords = payload.totalWords;
        state.daysSinceLastReview = payload.daysSinceLastReview;
        state.nextReviewDate = payload.nextReviewDate;
        state.averageRating = payload.averageRating;
      }
    );
  },
});

export default statsSlice.reducer;
