import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  words: []
};

const vocabSlice = createSlice({
  name: 'vocab',
  initialState,
  reducers: {
    setWords: (state, action) => {
        console.log("state",action)

      state.words = action.payload; // get only vocabulary array
      console.log(state.words)
    }
  }
});

export const { setWords } = vocabSlice.actions;
export default vocabSlice.reducer;
