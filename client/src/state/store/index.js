// src/state/store.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../slices/authSlice.js"; // Import your authSlice reducer
import themeReducer from "../slices/themeSlice.js"; // Import your themeSlice reducer
import { authApi } from "../api/index.js";  // Import the authApi

const store = configureStore({
  reducer: {
    // Combine reducers
    auth: authReducer, // For authentication state
    theme: themeReducer, // For theme state
    [authApi.reducerPath]: authApi.reducer, // For API cache and query management
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware), // Add middleware for RTK Query
});

export default store;
