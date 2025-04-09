import React from 'react';
import { useSelector } from 'react-redux';
import { 
  Paper, 
  Typography, 
  Box, 
  Chip, 
  LinearProgress, 
  Grid, 
  Divider 
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';

const PronunciationAnalysis = () => {
  const { 
    pronunciationScore, 
    phonemeAnalysis, 
    wer, 
    transcription, 
    referenceText 
  } = useSelector(state => state.speech);
  
  if (!pronunciationScore) return null;
  
  // Helper function to get color based on score
  const getScoreColor = (score) => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    return 'error';
  };
  
  // Helper function to get verbal feedback based on score
  const getVerbalFeedback = (score) => {
    if (score >= 90) return 'Excellent pronunciation!';
    if (score >= 80) return 'Very good pronunciation.';
    if (score >= 70) return 'Good pronunciation with minor issues.';
    if (score >= 60) return 'Fair pronunciation, needs improvement.';
    return 'Pronunciation needs significant improvement.';
  };
  
  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2, mt: 3 }}>
      <Typography variant="h5" gutterBottom>
        Pronunciation Analysis Results
      </Typography>
      
      <Box sx={{ mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1">You said:</Typography>
            <Typography variant="body1" sx={{ fontStyle: 'italic', mb: 2 }}>
              "{transcription}"
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1">Reference text:</Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              "{referenceText}"
            </Typography>
          </Grid>
        </Grid>
      </Box>
      
      <Divider sx={{ my: 2 }} />
      
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Overall Score
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Box sx={{ flexGrow: 1, mr: 2 }}>
            <LinearProgress 
              variant="determinate" 
              value={pronunciationScore} 
              color={getScoreColor(pronunciationScore)}
              sx={{ height: 10, borderRadius: 5 }}
            />
          </Box>
          <Typography variant="h6" color={getScoreColor(pronunciationScore)}>
            {Math.round(pronunciationScore)}%
          </Typography>
        </Box>
        
        <Typography variant="body1" sx={{ mt: 1 }}>
          {getVerbalFeedback(pronunciationScore)}
        </Typography>
      </Box>
      
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Word Error Rate (WER)
        </Typography>
        <Typography variant="body1">
          {(wer * 100).toFixed(1)}% - {wer === 0 ? 'Perfect match!' : wer < 0.2 ? 'Minor differences' : 'Significant differences'}
        </Typography>
      </Box>
      
      <Box>
        <Typography variant="h6" gutterBottom>
          Phoneme-Level Analysis
        </Typography>
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {phonemeAnalysis.map((item, index) => (<Chip
              key={index}
              icon={item.isCorrect ? <CheckCircleIcon /> : <ErrorIcon />}
              label={`${item.phoneme} (${Math.round(item.score)}%)`}
              color={item.isCorrect ? 'success' : 'error'}
              variant="outlined"
              sx={{ m: 0.5 }}
            />
          ))}
        </Box>
      </Box>
    </Paper>
  );
};

export default PronunciationAnalysis;