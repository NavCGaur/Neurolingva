import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Button, 
  Grid, 
  Box, 
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';
import ScoreIcon from '@mui/icons-material/Score';
import SpeakerNotesIcon from '@mui/icons-material/SpeakerNotes';
import SpeedIcon from '@mui/icons-material/Speed';
import CalculateIcon from '@mui/icons-material/Calculate';

import SpeechDashboard from '../dashboard';


const HomePage = () => {
  const features = [
    {
      icon: <RecordVoiceOverIcon fontSize="large" color="primary" />,
      title: "Speech Recognition & Transcription",
      description: "Converts spoken words into text using Microsoft Azure Speech Services"
    },
    {
      icon: <ScoreIcon fontSize="large" color="primary" />,
      title: "Pronunciation Accuracy Scoring",
      description: "Compares user speech to correct pronunciation and provides a detailed score"
    },
    {
      icon: <SpeakerNotesIcon fontSize="large" color="primary" />,
      title: "Phoneme-Level Analysis",
      description: "Breaks down words into phonemes to highlight specific mispronunciations"
    },
    {
      icon: <SpeedIcon fontSize="large" color="primary" />,
      title: "Real-Time Feedback",
      description: "Displays immediate results after speech input for rapid improvement"
    },
    {
      icon: <CalculateIcon fontSize="large" color="primary" />,
      title: "Word Error Rate (WER) Calculation",
      description: "Measures accuracy of spoken words compared to expected text"
    }
  ];

  return (
    <Box>
       {/*
      //Features Section 
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h3" component="h2" align="center" gutterBottom>
          Key Features
        </Typography>
        <Typography variant="h6" align="center" color="text.secondary" paragraph>
          Our advanced speech recognition technology provides detailed analysis to help improve your pronunciation
        </Typography>
        
        <Grid container spacing={4} sx={{ mt: 4 }}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Paper
                elevation={2}
                sx={{
                  p: 3,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: 6
                  }
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                  {feature.icon}
                </Box>
                <Typography variant="h6" align="center" gutterBottom>
                  {feature.title}
                </Typography>
                <Typography variant="body2" align="center" color="text.secondary">
                  {feature.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>   
    */}       


      {/* How It Works Section */}
      <Box sx={{  background: "linear-gradient(135deg,#1E91FF, #EDF9FF)"  }}>
        <Container maxWidth="lg">
         
          
          <Paper elevation={2} sx={{ p: 4, 
                                  
                                    background: "#176DC2",
                                    borderRadius: 5 
                                    }}>
            <List sx={{ 
                        fontSize: '1.2rem', // Increase font size globally
                        color:'white',  
                        display: 'flex',
                        
                        '& .MuiTypography-root': { fontSize: '1.2rem',
                          letterSpacing: '0.2px',
                         }, // Specifically target Typography elements
                      }}>
              <ListItem alignItems="flex-start">
                
                <ListItemText
                  primary="1. Enter reference text"
                 
                />
              </ListItem>
              
              <ListItem alignItems="flex-start">
                
                <ListItemText
                  primary="2. Record your speech"                 

                />
              </ListItem>
              
              <ListItem alignItems="flex-start">
                
                <ListItemText
                  primary="3. Get detailed analysis"               

                />
              </ListItem>
              
              <ListItem alignItems="flex-start">
               
                <ListItemText
                  primary="4. Track your progress"
                  

                />
              </ListItem>
            </List>
            
          
          </Paper>

          <SpeechDashboard />
        </Container>
      </Box>
    </Box>
    
  );
};

export default HomePage;
