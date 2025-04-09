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
      {/* Hero Section */}
      <Box 
         sx={{ 
          background: 'linear-gradient(to right, rgb(119, 176, 228), rgb(118, 178, 234))', 
          color: 'white', 
          py: 8,
          borderRadius: 5,
         
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center" justifyContent="center">
            <Grid item xs={12} md={7}>
              <Typography variant="h2" component="h1" gutterBottom fontWeight="bold">
                Master Your Pronunciation
              </Typography>
              <Typography variant="h5" paragraph>
                Improve your speaking skills with advanced speech analysis and real-time feedback
              </Typography>
              <Box sx={{ mt: 4 }}>
              <Button
                  component={RouterLink}
                  to="/guest/speech"
                  variant="contained"
                  size="large"
                  sx={{ 
                    mr: 2, 
                    px: 4, 
                    py: 1.5,
                    bgcolor: '#002D62',
                    color: 'white',
                  
                  }}
                >
                  Get Started
                </Button>
                
              </Box>
            </Grid>
            
          </Grid>
        </Container>
      </Box>
      
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
      <Box sx={{ bgcolor: 'grey.100', py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h2" component="h2" align="center" gutterBottom>
            How It Works
          </Typography>
          
          <Paper elevation={2} sx={{ p: 4, 
                                    mt: 4, 
                                    background: 'linear-gradient(to right, rgb(119, 176, 228), rgb(118, 178, 234))' ,
                                    borderRadius: 5 
                                    }}>
            <List sx={{ 
                        fontSize: '1.5rem', // Increase font size globally
                        color:'white',  
                        
                        '& .MuiTypography-root': { fontSize: '1.5rem',
                          fontWeight: 'bold',
                          
                         }, // Specifically target Typography elements
                      }}>
              <ListItem alignItems="flex-start">
                <ListItemIcon>
                  <Typography 
                    variant="h3" 
                    sx={{ 
                      color: 'primary.main',
                      fontWeight: 'bold',
                      width: 30,
                      textAlign: 'center'
                    }}
                  >
                    1
                  </Typography>
                </ListItemIcon>
                <ListItemText
                  primary="Enter reference text"
                  secondary="Type in the text you want to practice pronouncing"
                />
              </ListItem>
              
              <ListItem alignItems="flex-start">
                <ListItemIcon>
                  <Typography 
                    variant="h3" 
                    sx={{ 
                      color: 'primary.main',
                      fontWeight: 'bold',
                      width: 30,
                      textAlign: 'center'
                    }}
                  >
                    2
                  </Typography>
                </ListItemIcon>
                <ListItemText
                  primary="Record your speech"
                  secondary="Use the speech recorder to capture your pronunciation"
                />
              </ListItem>
              
              <ListItem alignItems="flex-start">
                <ListItemIcon>
                  <Typography 
                    variant="h3" 
                    sx={{ 
                      color: 'primary.main',
                      fontWeight: 'bold',
                      width: 30,
                      textAlign: 'center'
                    }}
                  >
                    3
                  </Typography>
                </ListItemIcon>
                <ListItemText
                  primary="Get detailed analysis"
                  secondary="Receive feedback on your pronunciation accuracy, word error rate, and phoneme-level analysis"
                />
              </ListItem>
              
              <ListItem alignItems="flex-start">
                <ListItemIcon>
                  <Typography 
                    variant="h3" 
                    sx={{ 
                      color: 'primary.main',
                      fontWeight: 'bold',
                      width: 30,
                      textAlign: 'center'
                    }}
                  >
                    4
                  </Typography>
                </ListItemIcon>
                <ListItemText
                  primary="Track your progress"
                  secondary="View your practice history and improvement over time"
                />
              </ListItem>
            </List>
            
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Button
                component={RouterLink}
                to="guest/speech"
                variant="contained"
                size="large"
                
                sx={{ px: 4, py: 1.5, background:"#002D62", color:'white' }}
              >
                Start Practicing Now
              </Button>
            </Box>
          </Paper>
        </Container>
      </Box>
    </Box>
    
  );
};

export default HomePage;
