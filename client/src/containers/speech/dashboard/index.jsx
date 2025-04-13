import React,{useState} from 'react';
import { Container, Grid, Typography, Paper } from '@mui/material';
import SpeechRecorder from '../speechRecorder';
import ReferenceTextInput from '../referenceTextInput';
import PronunciationAnalysis from '../pronounciationAnalysis';

const SpeechDashboard = () => {

    const [audioBlob, setAudioBlob] = useState(null);
  
    // Function to pass down to SpeechRecorder to update audioBlob
    const handleAudioBlobChange = (blob) => {
      setAudioBlob(blob);
    };
    
    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
          
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} sx={{ width: '45%' }}>
              <Paper 
                elevation={3}
                sx={{
                  height: '100%',
                  background: "#176DC2",
                  color: 'white',
                  p: 3,
                  borderRadius: 2,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <SpeechRecorder 
                  audioBlob={audioBlob} 
                  onAudioBlobChange={handleAudioBlobChange} 
                />
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={6} sx={{ width: '45%' }}>
              <Paper 
                elevation={3}
                sx={{
                  height: '100%',
                  background: "#176DC2",
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

export default SpeechDashboard;