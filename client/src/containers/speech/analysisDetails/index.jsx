// src/components/AnalysisDetail.jsx
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Paper, 
  Typography, 
  Box, 
  CircularProgress, 
  Chip, 
  Grid, 
  Divider,
  Button,
  LinearProgress
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import { useGetAnalysisDetailsQuery } from '../../../state/api/speechApi';

const AnalysisDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, error } = useGetAnalysisDetailsQuery(id);
  
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (error) {
    return (
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2, mt: 3 }}>
        <Typography color="error">
          Error loading analysis: {error.data?.message || 'Unknown error'}
        </Typography>
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={() => navigate(-1)}
          sx={{ mt: 2 }}
        >
          Go Back
        </Button>
      </Paper>
    );
  }
  
  const analysis = data?.analysis;
  if (!analysis) return null;
  
  // Helper function to get color based on score
  const getScoreColor = (score) => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    return 'error';
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };
  
  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2, mt: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">
          Analysis Details
        </Typography>
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={() => navigate(-1)}
        >
          Back to List
        </Button>
      </Box>
      
      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
        {formatDate(analysis.timestamp)}
      </Typography>
      
      <Box sx={{ mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1">You said:</Typography>
            <Typography variant="body1" sx={{ fontStyle: 'italic', mb: 2 }}>
              "{analysis.transcription}"
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1">Reference text:</Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              "{analysis.referenceText}"
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
              value={analysis.pronunciationScore} 
              color={getScoreColor(analysis.pronunciationScore)}
              sx={{ height: 10, borderRadius: 5 }}
            />
          </Box>
          <Typography variant="h6" color={getScoreColor(analysis.pronunciationScore)}>
            {Math.round(analysis.pronunciationScore)}%
          </Typography>
        </Box>
      </Box>
      
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Word Error Rate (WER)
        </Typography>
        <Typography variant="body1">
          {(analysis.wer * 100).toFixed(1)}% - {analysis.wer === 0 ? 'Perfect match!' : analysis.wer < 0.2 ? 'Minor differences' : 'Significant differences'}
        </Typography>
      </Box>
      
      <Box>
        <Typography variant="h6" gutterBottom>
          Phoneme-Level Analysis
        </Typography>
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {analysis.phonemeAnalysis.map((item, index) => (
            <Chip
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

export default AnalysisDetail;
