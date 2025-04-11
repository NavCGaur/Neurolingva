// src/components/AccountSettings.jsx
import React from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Button, 
  Divider, 
  Chip, 
  CircularProgress 
} from '@mui/material';
import { useSelector } from 'react-redux';
import { useCreateBillingPortalMutation } from '../../../../state/api/subscriptionApi';
import { format } from 'date-fns';

const AccountSettings = () => {
  const { currentPlan, subscriptionStatus, currentPeriodEnd, cancelAtPeriodEnd } = useSelector(
    state => state.subscription
  );
  
  const [createBillingPortal, { isLoading }] = useCreateBillingPortalMutation();
  
  const handleManageBilling = async () => {
    try {
      const response = await createBillingPortal().unwrap();
      // Redirect to Stripe Customer Portal
      window.location.href = response.url;
    } catch (error) {
      console.error('Error opening billing portal:', error);
    }
  };
  
  // Format subscription end date
  const formattedEndDate = currentPeriodEnd 
    ? format(new Date(currentPeriodEnd), 'MMMM d, yyyy') 
    : null;
  
  // Determine status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'trialing':
        return 'info';
      case 'past_due':
        return 'warning';
      case 'canceled':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Paper elevation={2} sx={{ p: 3, background: "linear-gradient(135deg,#1E91FF, #EDF9FF)", maxWidth:'100%' , display: 'flex', 
        flexDirection: 'column' ,
        justifyContent: 'center',
        alignItems: 'center',
        }}>
      <Typography variant="h5" gutterBottom>
        Subscription Details
      </Typography>
      <Divider sx={{ mb: 3 }} />
      
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 'medium', mb: 0.5 }}>
          Current Plan
        </Typography>
        <Typography variant="h6" gutterBottom>
          {currentPlan === 'pro' ? 'Pro Plan' : 'Free Plan'}
          {subscriptionStatus && (
            <Chip 
              label={subscriptionStatus.toUpperCase()} 
              size="small" 
              color={getStatusColor(subscriptionStatus)} 
              sx={{ ml: 2, verticalAlign: 'middle' }} 
            />
          )}
        </Typography>
        
        {currentPlan === 'pro' && formattedEndDate && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="white">
              Your subscription will {cancelAtPeriodEnd ? 'end' : 'renew'} on {formattedEndDate}
            </Typography>
            {cancelAtPeriodEnd && (
              <Typography variant="body2" color="warning.main" sx={{ mt: 1 }}>
                Your subscription is set to cancel at the end of the current billing period.
              </Typography>
            )}
          </Box>
        )}
      </Box>
      
      {currentPlan === 'pro' && (
        <Box sx={{ mt: 3 }}>
          <Button 
            variant="outlined" 
            color="primary"
            onClick={handleManageBilling}
            disabled={isLoading}
            startIcon={isLoading && <CircularProgress size={20} />}
          >
            {isLoading ? 'Loading...' : 'Manage Billing'}
          </Button>
          <Typography variant="caption" display="block" sx={{ mt: 1, color: 'text.secondary' }}>
          You'll be redirected to the secure Stripe Billing Portal where you can update your payment method, view billing history, or cancel your subscription.
          </Typography>
        </Box>
      )}
      
      {currentPlan === 'free' && (
        <Box sx={{ mt: 3 }}>
          <Button 
            variant="contained" 
            href="/pricing"
            sx={{ backgroundColor: '#002D62',             color:"white"            }}
          >
            Upgrade to Pro
          </Button>
        </Box>
      )}
    </Paper>
  );
};

export default AccountSettings;