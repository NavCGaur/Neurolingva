import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  TextField, 
  Paper, 
  Typography, 
  Box,
  Button
} from '@mui/material';
import { 
  setReferenceText,
  clearAnalysis 
} from '../../../state/slices/speechSlice';
import { useAnalyzePronunciationMutation } from '../../../state/api/speechApi';

const ReferenceTextInput = ({ audioBlob }) => {
  const dispatch = useDispatch();
  const { referenceText} = useSelector(state => state.speech);
  const [analyzePronunciation, { isLoading }] = useAnalyzePronunciationMutation();

  const handleTextChange = (e) => {
    dispatch(setReferenceText(e.target.value));
    dispatch(clearAnalysis());
  };

  const handleAnalyze = async () => {
    if (!audioBlob || !referenceText.trim()) return;

    try {
      // Convert audioBlob to base64
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      
      reader.onloadend = async () => {
        // Extract base64 data
        const base64data = reader.result.split(',')[1];
        
        // Send for analysis
        await analyzePronunciation({
          audioData: base64data,
          referenceText: referenceText.trim(),
          language: 'en-US'  // Default to English, could be made configurable
        });
      };
    } catch (error) {
      console.error('Error analyzing pronunciation:', error);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2, mt: 3 }}>
      <Typography variant="h5" gutterBottom>
        Reference Text
      </Typography>
      
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Enter the text that you want to practice pronouncing.
      </Typography>
      
      <TextField
        fullWidth
        multiline
        rows={3}
        variant="outlined"
        placeholder="Enter reference text here..."
        value={referenceText}
        onChange={handleTextChange}
        sx={{ mb: 2 }}
      />
      
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleAnalyze}
          disabled={!audioBlob || !referenceText.trim() || isLoading}
        >
          {isLoading ? 'Analyzing...' : 'Analyze Pronunciation'}
        </Button>
      </Box>
    </Paper>
  );
};

export default ReferenceTextInput;