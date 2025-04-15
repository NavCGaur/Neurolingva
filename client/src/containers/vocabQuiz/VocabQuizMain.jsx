import React from 'react';
import { Container, Button, Typography, Box } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useGetVocabQuestionsQuery } from '../../state/api/vocabQuizApi';
import { 
  startQuiz,
  nextQuestion, 
  addAnswer, 
  setScore, 
  completeQuiz, 
  resetQuiz,
  selectQuizState ,
  incrementScore 

} from '../../state/slices/vocabQuizSlice';
import QuizCard from './VocabQuizCard';
import QuizResult from './VocabQuizResult';

const VocabQuizMain = () => {
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.auth?.user?.uid);
  
  const quizState = useSelector(selectQuizState);

  const { currentQuestion, isComplete, score, answers, isStarted } = quizState || {
    currentQuestion: 0,
    isComplete: false,
    score: 0,
    answers: []
  };
  
  const { data: questions, isLoading, error } = useGetVocabQuestionsQuery(userId, { skip: !userId });
  

  const handleStart = () => {
    dispatch(startQuiz());
  };


  const handleReset = () => {
    dispatch(resetQuiz());
  };

  const handleAnswerSubmit = (answerData, isProgressing = false) => {
    if (isProgressing) {
      // Move to next question or complete quiz
      if (currentQuestion === questions.length - 1) {
        dispatch(completeQuiz());
      } else {
        dispatch(nextQuestion());
      }
    } else if (answerData) {
      // Only record the answer and score
      if (answerData.isCorrect) {
        dispatch(incrementScore());
      }
      dispatch(addAnswer(answerData.answer));
    }
  };


  if (isLoading) {
    return (
      <Box sx={{ minHeight: '40vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography>Loading questions...</Typography>
      </Box>
    );
  }

  if (error || !questions || questions.length === 0) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography color="error">
          {error ? `Error loading quiz: ${error.message}` : 'No questions available.'}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{
      minHeight: '40vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      py: 4 ,
    }}>
      <Container maxWidth="md">
        {!isStarted ? (
          <Box sx={{
            textAlign: 'center',
            p: 3,
            borderRadius: 2,
            backgroundColor: "#176DC2",
            boxShadow: 1,
            width: '60%',
            maxWidth: '500px',
            minHeight: '60vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            mx: 'auto',
          }}>
            <Typography variant="h4" sx={{color: 'white'}}gutterBottom>
              Welcome to the Vocab Quiz!
            </Typography>
            <Typography variant="body1" sx={{ mb: 4, color: 'white' }}>
              Test your knowledge with our quiz. Ready to begin?
            </Typography>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={handleStart}
            >
              Start Quiz
            </Button>
          </Box>
        ) : isComplete ? (
          <QuizResult
            score={score}
            totalQuestions={questions.length}
            onReset={handleReset}
          />
        ) : (
          <QuizCard
            question={questions[currentQuestion]}
            onAnswerSubmit={handleAnswerSubmit}  // Changed from onAnswer
            currentQuestion={currentQuestion + 1}
            totalQuestions={questions.length}
          />
        )}
      </Container>
    </Box>
  );
};
export default VocabQuizMain;
