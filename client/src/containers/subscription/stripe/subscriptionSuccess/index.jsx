// src/pages/SubscriptionSuccessPage.jsx
import React, { useEffect } from 'react';
import { Container, Typography, Paper, Box, Button, CircularProgress } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setSubscriptionInfo } from '../../../../state/slices/subscriptionSlice';
import { useGetCurrentSubscriptionQuery } from '../../../../state/api/subscriptionApi';
import { getAuth, signOut } from "firebase/auth";

import { logout } from "../../../../state/slices/authSlice";


const SubscriptionSuccessPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const auth = getAuth();
  
  
  const { data: subscriptionData, isLoading, isSuccess } = useGetCurrentSubscriptionQuery();

  useEffect(() => {
    if (isSuccess && subscriptionData) {
      // Update subscription info in Redux store
      dispatch(setSubscriptionInfo({
        currentPlan: subscriptionData.planId,
        subscriptionStatus: subscriptionData.subscriptionStatus,
        currentPeriodEnd: subscriptionData.currentPeriodEnd,
        cancelAtPeriodEnd: subscriptionData.cancelAtPeriodEnd
      }));
    }
  }, [isSuccess, subscriptionData, dispatch]);

  const handleGoToDashboard = async () => {
    try {
      await signOut(auth); // Firebase logout
  
      // Clear token and reset app state
      localStorage.removeItem("token");
      dispatch(logout()); // Clear Redux auth state
  
      // Navigate to login and show optional upgrade message
      navigate("/login", { state: { upgraded: true } });
    } catch (error) {
      console.error("Error during logout:", error);
      navigate("/login");
    }
  };
  
  return (
    <Container  sx={{ py: 8,
                                  background: "linear-gradient(135deg,#1E91FF, #EDF9FF)",    
                                  display: 'flex',
                                  justifyContent: 'center',
                                  alignItems: 'center',   

                                 }}>
      <Paper elevation={3} sx={{ p: 4, textAlign: 'center',  
                            maxWidth: 'md',
                            color: 'white',
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
        }}>
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <CheckCircleOutlineIcon color="success" sx={{ fontSize: 80, mb: 2 }} />
            <Typography variant="h4" gutterBottom>
              Subscription Successful!
            </Typography>
            <Typography variant="body1" paragraph>
              Thank you for subscribing to our Pro plan. Your account has been upgraded and you now have access to all premium features. Login to access all features
            </Typography>
            <Typography variant="body2"  paragraph>
              Transaction ID: {sessionId}
            </Typography>
            <Box sx={{ mt: 4 }}>
              <Button 
                variant="contained" 
                color='white'
                size="large"
                onClick={handleGoToDashboard}
                sx={{ backgroundColor: '#002D62' }}
              >
                Go to Login
              </Button>
            </Box>
          </>
        )}
      </Paper>
    </Container>
  );
};

export default SubscriptionSuccessPage;