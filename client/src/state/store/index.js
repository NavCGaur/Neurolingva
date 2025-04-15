// src/state/store.js
import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from '@reduxjs/toolkit/query';

import authReducer from "../slices/authSlice.js"; // Import your authSlice reducer
import themeReducer from "../slices/themeSlice.js"; // Import your themeSlice reducer
import vocabReducer from "../slices/vocabSlice.js";
import { authApi } from "../api/index.js";  // Import the authApi
import { vocabApi } from "../api/vocabApi.js";
import vocabQuizreducer from "../slices/vocabQuizSlice.js";
import {vocabQuizApi} from "../api/vocabQuizApi.js";
import grammerQuizreducer from "../slices/grammerQuizSlice.js";
import {grammerQuizApi} from "../api/grammerQuizApi.js";
import { speechApi } from "../api/speechApi.js";
import speechReducer from "../slices/speechSlice.js";
import { speechShadowApi } from "../api/speechShadowApi.js";
import speechShadowReducer from "../slices/speechShadowSlice.js";
import subscriptionReducer from '../slices/subscriptionSlice';
import { subscriptionApi } from '../api/subscriptionApi';
import { statsApi } from "../api/statsApi.js";
import statsReducer from "../slices/statsSlice.js";


const store = configureStore({
  reducer: {
    // Combine reducers
    auth: authReducer, // For authentication state
    theme: themeReducer, // For theme state
    vocab: vocabReducer, 
    speech: speechReducer,
    speechShadow: speechShadowReducer,
    subscription: subscriptionReducer,
    vocabQuiz: vocabQuizreducer,
    grammerQuiz: grammerQuizreducer,
    stats: statsReducer,


    [subscriptionApi.reducerPath]: subscriptionApi.reducer,
    [speechApi.reducerPath]: speechApi.reducer,  
    [authApi.reducerPath]: authApi.reducer,
    [vocabApi.reducerPath]: vocabApi.reducer,  
    [speechShadowApi.reducerPath]: speechShadowApi.reducer, 
    [vocabQuizApi.reducerPath]: vocabQuizApi.reducer,
    [grammerQuizApi.reducerPath]: grammerQuizApi.reducer,
    [statsApi.reducerPath]: statsApi.reducer,


  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware, 
    vocabApi.middleware,
    vocabQuizApi.middleware,
    grammerQuizApi.middleware,
    speechApi.middleware, 
    speechShadowApi.middleware,
    subscriptionApi.middleware,
    statsApi.middleware
  ), // Add middleware for RTK Query
});


// Required for refetchOnFocus/refetchOnReconnect behaviors
setupListeners(store.dispatch);

export default store;
