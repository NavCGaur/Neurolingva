// src/state/store.js
import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from '@reduxjs/toolkit/query';

import authReducer from "../slices/authSlice.js"; // Import your authSlice reducer
import themeReducer from "../slices/themeSlice.js"; // Import your themeSlice reducer
import vocabReducer from "../slices/vocabSlice.js";
import { authApi } from "../api/index.js";  // Import the authApi
import { vocabApi } from "../api/vocabApi.js";
import quizReducer from "../slices/quizSlice.js";
import {quizApi} from "../api/quizApi.js";
import { speechApi } from "../api/speechApi.js";
import speechReducer from "../slices/speechSlice.js";
import { speechShadowApi } from "../api/speechShadowApi.js";
import speechShadowReducer from "../slices/speechShadowSlice.js";
import subscriptionReducer from '../slices/subscriptionSlice';
import { subscriptionApi } from '../api/subscriptionApi';

const store = configureStore({
  reducer: {
    // Combine reducers
    auth: authReducer, // For authentication state
    theme: themeReducer, // For theme state
    vocab: vocabReducer, 
    speech: speechReducer,
    speechShadow: speechShadowReducer,
    subscription: subscriptionReducer,
    quiz: quizReducer,

    [subscriptionApi.reducerPath]: subscriptionApi.reducer,
    [speechApi.reducerPath]: speechApi.reducer,  
    [authApi.reducerPath]: authApi.reducer,
    [vocabApi.reducerPath]: vocabApi.reducer,  
    [speechShadowApi.reducerPath]: speechShadowApi.reducer, 
    [quizApi.reducerPath]: quizApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware, 
    vocabApi.middleware,
    quizApi.middleware,
    speechApi.middleware, 
    speechShadowApi.middleware,
    subscriptionApi.middleware,
  ), // Add middleware for RTK Query
});


// Required for refetchOnFocus/refetchOnReconnect behaviors
setupListeners(store.dispatch);

export default store;
