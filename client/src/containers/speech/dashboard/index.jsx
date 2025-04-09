import React,{useState} from 'react';
import { Container, Grid, Typography, Box } from '@mui/material';
import SpeechRecorder from '../speechRecorder';
import ReferenceTextInput from '../referenceTextInput';
import PronunciationAnalysis from '../pronounciationAnalysis';

const Dashboard = () => {

    const [audioBlob, setAudioBlob] = useState(null);
  
    // Function to pass down to SpeechRecorder to update audioBlob
    const handleAudioBlobChange = (blob) => {
      setAudioBlob(blob);
    };
    
    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
          <Typography variant="h4" gutterBottom>
            Speech Pronunciation Dashboard
          </Typography>
          
          <Typography variant="body1" color="text.secondary" paragraph>
            Record your speech and analyze your pronunciation accuracy. Enter reference text, record yourself saying it, and get detailed feedback.
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper 
                elevation={3}
                sx={{
                  height: '100%',
                  background: 'linear-gradient(to right, rgb(119, 176, 228), rgb(118, 178, 234))',
                  color: 'white',
                  p: 3,
                  borderRadius: 2
                }}
              >
                <SpeechRecorder 
                  audioBlob={audioBlob} 
                  onAudioBlobChange={handleAudioBlobChange} 
                />
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Paper 
                elevation={3}
                sx={{
                  height: '100%',
                  background: 'linear-gradient(to right, rgb(119, 176, 228), rgb(118, 178, 234))',
                  color: 'white',
                  p: 3,
                  borderRadius: 2
                }}
              >
                <ReferenceTextInput 
                  audioBlob={audioBlob}
                />
              </Paper>
            </Grid>
            
            <Grid item xs={12}>
              <PronunciationAnalysis />
            </Grid>
          </Grid>
        </Container>
      );
};

export default Dashboard;