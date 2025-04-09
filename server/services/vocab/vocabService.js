import { UserSchema } from '../../models/userSchema.js'; 
import mongoose from 'mongoose';

const User = mongoose.model('User', UserSchema);

export const fetchUserWordsDue = async (userId) => {
  console.log("userId in service", userId);

  try {
    const user = await User.findOne({ uid: userId }).populate('vocabulary.wordId');

    if (!user) {
      console.log("No user found with id:", userId);
      throw new Error('User not found');
    }

    console.log("user in service", user);

    const today = new Date();
    today.setUTCHours(0, 0, 0, 0); // Normalize to start of the day

    return user.vocabulary
      .filter(v => {
        return (
          v.wordId &&
          (!v.nextReviewDate || new Date(v.nextReviewDate).getTime() <= today.getTime())
        );
      })
      .map(v => ({
        word: v.wordId.word,
        definition: v.wordId.definition,
        exampleSentence: v.wordId.exampleSentence,
        difficulty: v.wordId.difficulty,
        partOfSpeech: v.wordId.partOfSpeech,
        // Optional: add rating/nextReviewDate info if needed
        rating: v.rating,
        nextReviewDate: v.nextReviewDate,
      }));
  } catch (err) {
    console.error("Error in fetchUserWordsDue:", err);
    throw err;
  }
};
 

export const updateMultipleUserWordRatings = async (userId, ratings) => {
  const user = await User.findOne({ uid: userId }).populate('vocabulary.wordId');
  if (!user) throw new Error('User not found');

  const now = new Date();

  for (const { word, rating } of ratings) {
    const vocabEntry = user.vocabulary.find(v => v.wordId && v.wordId.word === word);
    if (vocabEntry) {
      vocabEntry.rating = rating;
      vocabEntry.lastReviewed = now;
      vocabEntry.nextReviewDate = calculateNextReviewDate(rating, now);
    }
  }

  await user.save();
};

function calculateNextReviewDate(rating, fromDate) {
  const next = new Date(fromDate);
  const days = rating === 5 ? 7 : rating === 3 ? 3 : 1;
  next.setDate(next.getDate() + days);
  return next;
}