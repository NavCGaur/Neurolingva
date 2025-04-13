import React from 'react';
import { Card, CardContent, Typography, Button} from '@mui/material';

const VocabQuizResult = ({ score, totalQuestions, onReset }) => {
  return (
    <Card sx={{ 
      width: '100%',
      maxWidth: 600,
      mx: 'auto',
      boxShadow: 3
    }}>
      <CardContent sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Quiz Complete!
        </Typography>
        <Typography variant="h5" color="primary" gutterBottom sx={{ mb: 4 }}>
          Your Score: {score} / {totalQuestions}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={onReset}
        >
          Try Again
        </Button>
      </CardContent>
    </Card>
  );
};

export default VocabQuizResult;