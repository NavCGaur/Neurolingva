import mongoose from "mongoose";

const userWordSchema = new mongoose.Schema({
  wordId: { type: mongoose.Schema.Types.ObjectId, ref: "Word" }, // Reference to Word
  rating: { type: Number, default: 0 }, // Recall score (0–5)
  lastReviewed: { type: Date },
  nextReviewDate: { type: Date },
  addedAt: { type: Date, default: Date.now }
});

export const UserSchema = new mongoose.Schema({
    uid: { type: String, required: true, unique: true },
    email: { type: String, required: true },
      // Vocabulary tracking
    vocabulary: [userWordSchema],
    displayName: { type: String },
    photoURL: { type: String },
    role: { type: String, enum: ['Guest', 'Admin', 'Subscriber'], default: 'Guest' },
    createdAt: { type: Date, default: Date.now }
  });
  
  