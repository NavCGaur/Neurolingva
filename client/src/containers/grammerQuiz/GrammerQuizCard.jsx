import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  Box
} from '@mui/material';

const GrammarQuizCard = ({ 
  question, 
  onAnswerSubmit, 
  currentQuestion, 
  totalQuestions 
}) => {
  const [selectedAnswer, setSelectedAnswer] = React.useState('');
  const [showFeedback, setShowFeedback] = React.useState(false);
  const [isCorrect, setIsCorrect] = React.useState(false);
  const [correctAnswer, setCorrectAnswer] = React.useState('');

  // Get the question text based on question type
  const getQuestionText = () => {
    switch (question.questionType) {
      case 'sentenceCorrection':
        return `Which of these is the correct version of: "${question.sentence}"?`;
      case 'identifyError':
        return `Identify the correct version of: "${question.sentence}"`;
      case 'fillInBlank':
        return `Fill in the blank: ${question.sentence.replace('___', '__________')}`;
      case 'chooseCorrectForm':
        return `Choose the correct form: ${question.sentence}`;
      default:
        return question.sentence || 'Question text not available';
    }
  };

  const getExplanationText = () => {
    if (!showFeedback || !question.explanation) return null;
    
    return (
      <Typography 
        variant="body2" 
        sx={{ 
          mt: 2,
          p: 2,
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          borderRadius: 1,
          fontStyle: 'italic'
        }}
      >
        <strong>Explanation:</strong> {question.explanation}
      </Typography>
    );
  };

  const handleAnswerSelect = (answer) => {
    if (showFeedback) return;
    setSelectedAnswer(answer);
  };

  const handleSubmit = () => {
    if (!selectedAnswer) return;
    
    const correctOption = question.options.find(opt => opt.isCorrect);
    const answerIsCorrect = selectedAnswer === correctOption.text;
    
    setIsCorrect(answerIsCorrect);
    setCorrectAnswer(correctOption.text);
    setShowFeedback(true);
    
    onAnswerSubmit({
      answer: selectedAnswer,
      isCorrect: answerIsCorrect
    });
  };

  const handleNext = () => {
    setSelectedAnswer('');
    setShowFeedback(false);
    setIsCorrect(false);
    setCorrectAnswer('');
    onAnswerSubmit(null, true);
  };

  const getOptionStyles = (option) => {
    if (!showFeedback) return {};
    
    if (option.isCorrect) {
      return { 
        backgroundColor: '#e8f5e9', 
        borderLeft: '4px solid #4caf50',
        margin: '4px 0' 
      };
    }
    
    if (option.text === selectedAnswer && !option.isCorrect) {
      return { 
        backgroundColor: '#ffebee', 
        borderLeft: '4px solid #f44336',
        margin: '4px 0' 
      };
    }
    
    return { margin: '4px 0' };
  };

  return (
    <Card sx={{ 
      width: '100%',
      maxWidth: 600,
      mx: 'auto',
      boxShadow: 3,
      mt: 4,
      backgroundColor: "#176DC2",
    }}>
      <CardContent sx={{ p: 4 }}>
        <Box mb={3}>
          <Typography variant="subtitle1" color="textSecondary">
            Question {currentQuestion} of {totalQuestions}
          </Typography>
          {question.difficulty && (
            <Typography variant="caption" color="textSecondary">
              Difficulty: {question.difficulty}
            </Typography>
          )}
        </Box>
        
        {/* Display the question text prominently */}
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
          {getQuestionText()}
        </Typography>
        
        <RadioGroup sx={{ my: 2 }}>
          {question.options.map((option) => (
            <Box 
              key={option.text}
              sx={{
                p: 1.5,
                borderRadius: 1,
                transition: 'all 0.3s ease',
                ...getOptionStyles(option)
              }}
            >
              <FormControlLabel
                value={option.text}
                control={<Radio />}
                label={option.text}
                checked={selectedAnswer === option.text}
                onChange={() => handleAnswerSelect(option.text)}
                disabled={showFeedback}
                sx={{ width: '100%', ml: 0.5 }}
              />
            </Box>
          ))}
        </RadioGroup>
        
        {showFeedback && (
          <>
            <Typography 
              variant="body1" 
              sx={{ 
                mb: 2,
                color: 'white',
                fontWeight: 'bold'
              }}
            >
              {isCorrect ? 'Correct! 🎉' : `Incorrect. The correct answer is: ${correctAnswer}`}
            </Typography>
            {getExplanationText()}
          </>
        )}
        
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={showFeedback ? handleNext : handleSubmit}
          disabled={!selectedAnswer}
          sx={{ mt: 2 }}
        >
          {showFeedback ? 
            (currentQuestion === totalQuestions ? 'Finish Quiz' : 'Next Question') : 
            'Submit Answer'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default GrammarQuizCard;