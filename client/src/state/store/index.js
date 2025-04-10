// src/state/store.js
import { configureStore } from "@reduxjs/toolkit";
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

const store = configureStore({
  reducer: {
    // Combine reducers
    auth: authReducer, // For authentication state
    theme: themeReducer, // For theme state
    vocab: vocabReducer, 
    speech: speechReducer,
    speechShadow: speechShadowReducer,
    [speechApi.reducerPath]: speechApi.reducer,
  
    [authApi.reducerPath]: authApi.reducer,
    [vocabApi.reducerPath]: vocabApi.reducer,  
    [speechShadowApi.reducerPath]: speechShadowApi.reducer, 
    quiz: quizReducer,
   [quizApi.reducerPath]: quizApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware, vocabApi.middleware,quizApi.middleware,speechApi.middleware, speechShadowApi.middleware), // Add middleware for RTK Query
});

export default store;
