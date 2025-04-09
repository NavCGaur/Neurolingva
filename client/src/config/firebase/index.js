// src/firebase/config.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

import { getStorage } from 'firebase/storage';



console.log("firebase api key", process.env.REACT_APP_FIREBASE_API_KEY);
console.log("auth ",process.env.REACT_APP_BASE_URL)
// Your web app's Firebase configuration
// Replace these with your actual Firebase project configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const storage = getStorage(app);


// Initialize Firebase Auth
const auth = getAuth(app);

export { auth };
export default app;