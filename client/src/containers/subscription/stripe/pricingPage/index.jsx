// src/pages/PricingPage.jsx
import React, { useState } from 'react';
import { 
  Container, 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  Box, 
  List,   
  ListItem, 
  ListItemIcon, 
  ListItemText,
  ToggleButtonGroup,
  ToggleButton,
  CircularProgress,
  Link
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useCreateCheckoutSessionMutation } from '../../../../state/api/subscriptionApi';
import { getAuth } from 'firebase/auth';

import HomeIcon from '@mui/icons-material/Home';
import Logo from '../../../../assets/neurolingvalogo.png' 

const PricingPage = () => {
  const [billingFrequency, setBillingFrequency] = useState('monthly');
  const navigate = useNavigate();
  const auth = getAuth();
  const user = auth.currentUser;
  
  const { currentPlan } = useSelector(state => state.subscription);
  const [createCheckoutSession, { isLoading }] = useCreateCheckoutSessionMutation();

  const handleFrequencyChange = (event, newFrequency) => {
    if (newFrequency !== null) {
      setBillingFrequency(newFrequency);
    }
  };

const handleSubscribe = async (plan) => {
    // If user is not authenticated, redirect to login with return URL
    if (!user) {
      // Properly encode the redirect URL to avoid issues with multiple query parameters
      const redirectPath = `/subscribe?plan=${plan}&frequency=${billingFrequency}`;
      navigate(`/login?redirect=${encodeURIComponent(redirectPath)}`);
      return;
    }
  
    try {
      // Create checkout session
      const response = await createCheckoutSession({ 
        planId: plan,
        planFrequency: billingFrequency
      }).unwrap();
      
      // Redirect to Stripe Checkout
      window.location.href = response.url;
    } catch (error) {
      console.error('Error creating checkout session:', error);
    }
  };
  const freeFeatures = [
    'Basic spaced repetition',
    'Flashcards for vocabulary practice',
    'Limited interactive quizzes & grammar exercises',
    'Basic pronunciation feedback',
    'Basic accent feedback',
    'User progress tracking (basic statistics)',
    'English language support'
  ];

  const proFeatures = [
    'AI-Powered Spaced Repetition',
    'Adaptive Learning Paths',
    'Advanced Pronunciation & Accent Training',
    'Praat Graphs + AI Feedback',
    'Real-time Speech Shadowing'
  ];

  const cardBackground = 'linear-gradient(to right, rgb(119, 176, 228), rgb(118, 178, 234))';
  const buttonColor = '#002D62';

  return (
    <Container id="pricing" maxWidth={false}
                    sx={{ py: 8 ,
                      width: '100vw',
                      background: "linear-gradient(135deg,#1E91FF, #EDF9FF)",       
                     }}>

                  <Box display="flex" alignItems="center" justifyContent="center" mb={1}> 
                                 <img src={Logo} alt="logo" style={{ width: "50px", height: "50px" }} /> 
                              </Box>
                      
                              <Box>
                                <Link href="/" style={{ textDecoration: "none" }}>
                                  <HomeIcon
                                    style={{
                                      position: "absolute",
                                      top: "20px",
                                      left: "20px",
                                      width: "50px",
                                      height: "50px",
                                      color: "white",
                                      cursor: "pointer"
                                    }}
                                  />
                                </Link>
                              </Box>                
                            
      <Typography variant="h3" align="center" gutterBottom>
        Choose Your Plan
      </Typography>
      

      <Box sx={{ display: 'flex', 
                justifyContent: 'center',
                mb: 6 ,         
                }}>
        <ToggleButtonGroup
            value={billingFrequency}
            exclusive
            onChange={handleFrequencyChange}
            aria-label="billing frequency"
            >
            <ToggleButton 
                value="monthly"
                sx={{
                bgcolor: '#002D62',
                color: '#fff',
                fontSize: billingFrequency === 'monthly' ? '1.2rem' : '1rem',
               
                '&.Mui-selected': {
                    bgcolor: '#001A42', // Darker shade
                    color: '#fff',

                },
                }}
            >
                Monthly
            </ToggleButton>

            <ToggleButton 
                value="annual"
                sx={{
                bgcolor: '#002D62',
                color: '#fff',
                fontSize: billingFrequency === 'annual' ? '1.2rem' : '1rem',
                
                '&.Mui-selected': {
                    bgcolor: '#001A42', // Darker shade
                    color: '#fff',

                },
                }}
            >
                Annual (Save 20%)
            </ToggleButton>
            </ToggleButtonGroup>

      </Box>
      
      <Grid container spacing={4} justifyContent="center">
        {/* Free Plan Card */}
        <Grid item xs={12} md={5}>
          <Card 
            elevation={6} 
            sx={{ 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              height: "auto",
              borderRadius: 3,
              backdropFilter: "blur(16px)",
              backgroundColor: "#176DC2",
              border: "1px solid rgba(255, 255, 255, 0.125)",
              boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
              transition: 'all 0.3s ease-in-out',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: "0 12px 40px 0 rgba(31, 38, 135, 0.47)",
              }
            }}
          >
            <CardContent sx={{ flexGrow: 1, p: 4 }}>
              <Typography variant="h4" component="h2" sx={{ mb: 2, color: 'white' }}>
                Free Plan
              </Typography>
              <Typography variant="h3" component="div" sx={{ mb: 3, color: 'white' }}>
                $0
              </Typography>
              
              <Box sx={{ mb: 4 ,                     color: 'white',
}}>
                <Button 
                  variant="contained" 
                  size="large" 
                  fullWidth
                  sx={{ 
                    backgroundColor: buttonColor,
                    fontSize: '1.1rem',
                    py: 1.5,
                    color: 'white',

                  }}
                  disabled={currentPlan === 'free'}
                >
                  {currentPlan === 'free' ? 'Current Plan' : 'Sign Up Free'}
                </Button>
              </Box>
              
              <Typography variant="subtitle1" component="div" sx={{ mb: 2, color: 'white', fontWeight: 'bold' }}>
                ✅ Free Plan Features
              </Typography>
              
              <List>
                {freeFeatures.map((feature, index) => (
                  <ListItem key={index} sx={{ py: 0.5 }}>
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      <CheckIcon sx={{ color: 'white' }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary={feature}
                      primaryTypographyProps={{ sx: { color: 'white' } }}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Pro Plan Card */}
        <Grid item xs={12} md={5}>
          <Card 
            elevation={8} 
            sx={{ 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              height: "auto",
              borderRadius: 3,
              backdropFilter: "blur(16px)",
              backgroundColor: "#176DC2",
              border: "1px solid rgba(255, 255, 255, 0.125)",
              boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
              transition: 'all 0.3s ease-in-out',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: "0 12px 40px 0 rgba(31, 38, 135, 0.47)",
              }     ,        
               transform: 'scale(1.05)',
              position: 'relative',
            }}
          >
            <Box 
              sx={{ 
                position: 'absolute', 
                top: 0, 
                right: 0, 
                backgroundColor: '#002D62', 
                color: 'white',
                px: 2,
                py: 0.5,
                borderBottomLeftRadius: 8
              }}
            >
              RECOMMENDED
            </Box>
            
            <CardContent sx={{ flexGrow: 1, p: 4 }}>
              <Typography variant="h4" component="h2" sx={{ mb: 2, color: 'white' }}>
                Pro Plan
              </Typography>
              <Typography variant="h3" component="div" sx={{ mb: 0, color: 'white' }}>
                {billingFrequency === 'monthly' ? '$9.99' : '$95.88'}
              </Typography>
              
              <Typography variant="subtitle1" sx={{ mb: 3, color: 'white' }}>
                per {billingFrequency === 'monthly' ? 'month' : 'year'}
                {billingFrequency === 'annual' && ' ($7.99/month)'}
              </Typography>
              
              <Box sx={{ mb: 4 }}>
                <Button 
                  variant="contained" 
                  size="large" 
                  fullWidth
                  onClick={() => handleSubscribe('pro')}
                  disabled={isLoading || currentPlan === 'pro'}
                  sx={{ 
                    backgroundColor: buttonColor,
                    fontSize: '1.1rem',
                    py: 1.5,
                    color: 'white',
            
                  }}
                >
                  {isLoading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : currentPlan === 'pro' ? (
                    'Current Plan'
                  ) : (
                    'Subscribe Now'
                  )}
                </Button>
              </Box>
              
              <Typography variant="subtitle1" component="div" sx={{ mb: 2, color: 'white', fontWeight: 'bold' }}>
                ✅ All Free Features, Plus:
              </Typography>
              
              <List>             
                
                <ListItem sx={{ pt: 2 }}>
                  <Typography variant="subtitle1" component="div" sx={{ color: 'white', fontWeight: 'bold' }}>
                    🔥 Pro Plan Features
                  </Typography>
                </ListItem>
                
                {/* list Pro features */}
                {proFeatures.map((feature, index) => (
                  <ListItem key={`pro-${index}`} sx={{ py: 0.5 }}>
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      <CheckIcon sx={{ color: 'white' }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary={feature}
                      primaryTypographyProps={{ sx: { color: 'white', fontWeight: 'medium' } }}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default PricingPage;