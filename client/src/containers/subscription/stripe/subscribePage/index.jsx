// src/pages/SubscribePage.jsx
import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useCreateCheckoutSessionMutation } from '../../../../state/api/subscriptionApi';
import { getAuth } from 'firebase/auth';

const SubscribePage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const auth = getAuth();
  
  const plan = searchParams.get('plan');
  const frequency = searchParams.get('frequency');
  
  const [createCheckoutSession, { isLoading, isError, error }] = useCreateCheckoutSessionMutation();
  
  useEffect(() => {
    const handleSubscribe = async () => {
      // Validate parameters
      if (!plan || !['monthly', 'annual'].includes(frequency)) {
        navigate('/');
        return;
      }
      
      // Check authentication
      const user = auth.currentUser;
      if (!user) {
        navigate('/login');
        return;
      }
      
      try {
        // Create checkout session
        const response = await createCheckoutSession({ 
          planId: plan,
          planFrequency: frequency
        }).unwrap();
        
        // Redirect to Stripe Checkout
        window.location.href = response.url;
      } catch (err) {
        console.error('Error creating checkout session:', err);
        // Wait a moment before redirecting on error
        setTimeout(() => navigate('/pricing'), 2000);
      }
    };
    
    handleSubscribe();
  }, [plan, frequency, auth, navigate, createCheckoutSession]);
  
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center',
        minHeight: '60vh',
        background: "linear-gradient(135deg,#1E91FF, #EDF9FF)",       

      }}
    >
      {isLoading && (
        <>
          <CircularProgress size={60} />
          <Typography variant="h6" sx={{ mt: 3 }}>
            Preparing your checkout...
          </Typography>
        </>
      )}
      
      {isError && (
        <Typography variant="h6" color="error">
          Error preparing checkout. Redirecting to pricing page...
        </Typography>
      )}
    </Box>
  );
};

export default SubscribePage;