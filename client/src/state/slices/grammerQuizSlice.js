import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentQuestion: 0,
  score: 0,
  answers: [],
  isComplete: false,
  isStarted: false
};

const grammerQuizSlice = createSlice({
  name: 'grammerQuiz',
  initialState,
  reducers: {
    startQuiz: (state) => {
      state.isStarted = true;
    },
    nextQuestion: (state) => {
      state.currentQuestion += 1;
    },
    addAnswer: (state, action) => {
      state.answers.push(action.payload);
    },
    incrementScore: (state) => {
      console.log('Incrementing score from', state.score); // Debug log

      state.score += 1;
    },
    setScore: (state, action) => {
      state.score = action.payload;
    },
    completeQuiz: (state) => {
      state.isComplete = true;
    },
    resetQuiz: () => initialState, 

  },
});

export const selectQuizState = (state) => state.quiz;


export const {startQuiz, nextQuestion, addAnswer,  incrementScore ,  setScore, completeQuiz, resetQuiz } = grammerQuizSlice.actions;
export default grammerQuizSlice.reducer;