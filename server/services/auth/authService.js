import admin from 'firebase-admin';
import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import { UserSchema } from '../../models/userSchema.js';
import Word from "../../models/wordSchema.js";


// Initialize MongoDB connection
mongoose.connect(process.env.MONGO_URL)
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));


// Create User model
const User = mongoose.model('User', UserSchema, 'NeurolingvaUsers');


const assignInitialWords = async (userId, wordCount = 5) => {
  try {
    const words = await Word.aggregate([{ $sample: { size: wordCount } }]);

    const spacedWords = words.map(word => ({
      wordId: word._id,
      rating: 0,
      lastReviewed: null,
      nextReviewDate: null, 
      addedAt: new Date(),
    }));

    await User.findByIdAndUpdate(userId, {
      $push: { vocabulary: { $each: spacedWords } }
    });

    console.log(`Assigned ${wordCount} words to user ${userId}`);
  } catch (error) {
    console.error("Error assigning initial words:", error);
  }
};


// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
    })
  });
}

const authService = {
  /**
   * Verify Firebase ID token
   * @param {string} token - Firebase ID token
   * @returns {Object} - User data
   */
  verifyFirebaseToken: async (token) => {

    if (!token) {
      throw new Error('Token is required');
    }
    try {
      const decodedToken = await admin.auth().verifyIdToken(token);

      // Get user data from MongoDB including role
      let userFromDB = await User.findOne({ uid: decodedToken.uid });

      // If user doesn't exist in MongoDB yet, create them with default role
         if (!userFromDB) {

          userFromDB = await User.create({
            uid: decodedToken.uid,
            email: decodedToken.email,
            displayName: decodedToken.name,
            photoURL: decodedToken.picture,
            role: 'Guest' // Default role
          });

          await assignInitialWords(userFromDB._id);


        }
      
      
       // Return combined data including role from MongoDB
       return {
        uid: decodedToken.uid,
        email: decodedToken.email,
        emailVerified: decodedToken.email_verified,
        displayName: decodedToken.name || userFromDB.displayName,
        photoURL: decodedToken.picture || userFromDB.photoURL,
        role: userFromDB.role, // Include role for RBAC
        createdAt: userFromDB.createdAt
      };
    } catch (error) {
      console.error('Firebase token verification error:', error);
      throw new Error('Invalid or expired token');
    }
  },
  
  /**
   * Create a new user in your database
   * @param {Object} userData - User data
   * @returns {Object} - Created user data
   */
  createUser: async (userData) => {
    try {
      const { uid, email, displayName, photoURL, role = 'user' } = userData;
  
      // Validate required fields
      if (!uid || !email) {
        throw new Error('UID and Email are required to create a user');
      }
  
      // Check if the user already exists
      const existingUser = await User.findOne({ uid });
      if (existingUser) {
        return existingUser;
      }
  
      // Create new user in MongoDB
      const newUser = await User.create({
        uid,
        email,
        displayName: displayName || '', // fallback to empty if not provided
        photoURL: photoURL || '',
        role
      });
  
      return newUser;
    } catch (error) {
      console.error('User creation error:', error);
      throw new Error('Error creating user');
    }
  }
  
};

export default authService;
