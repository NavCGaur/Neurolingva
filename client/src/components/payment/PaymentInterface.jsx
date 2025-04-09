import React, { useState } from 'react';
import { 
  Box,
  Paper,
  Typography,
  Button,
  CircularProgress,
  useTheme,
  Snackbar,
  Alert,
  List,
  ListItem,
  ListItemText,
  Divider
} from '@mui/material';
import PayPalPayment from './paypal/PaypalPayment';
import StripePayment from './stripe/StripePayment';
import DirectUPIPayment from './UPI/DirectUPIPayment';

const PaymentInterface = ({ 
  selectedServices, // Array of selected services with their details
  userId,
  amount, // Total amount
  orderId
}) => {
  const theme = useTheme();
  const [selectedPayment, setSelectedPayment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('info');

  const renderPaymentComponent = () => {
    switch(selectedPayment) {
      case 'paypal':
        return <PayPalPayment selectedServices= {selectedServices} userId={userId} amount={amount} orderId={orderId} />;
      case 'stripe':
        return <StripePayment amount={amount} orderId={orderId} />;
      case 'upi':
        return <DirectUPIPayment amount={amount} orderId={orderId} />;
      default:
        return null;
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      sx={{
        minHeight: "80vh",
        backgroundColor: theme.palette.primary.main,
        padding: { xs: 2, sm: 4 },
        height: "80%",
      }}
    >
      <Paper
        elevation={12}
        sx={{
          p: { xs: 3, sm: 6 },
          width: "100%",
          maxWidth: "600px",
          minHeight: "40vh",
          borderRadius: 2,
          backgroundColor: theme.palette.mode === 'dark' 
            ? theme.palette.primary.dark
            : '#ffffff',
          transition: 'transform 0.2s ease-in-out',
          '&:hover': {
            transform: 'scale(1.01)'
          }
        }}
      >
        <Typography 
          variant="h4" 
          component="h1"
          textAlign="center"
          fontWeight="bold"
          mb={4}
          color={theme.palette.primary.alt}
        >
          Order Summary
        </Typography>

        <List sx={{ mb: 4 }}>
          {selectedServices.map((service, index) => (
            <ListItem 
              key={index}
              sx={{
                py: 1,
                px: 0,
                display: 'flex',
                justifyContent: 'space-between'
              }}
            >
              <ListItemText 
                primary={service.name}
                secondary={service.description}
              />
              <Typography variant="body1" fontWeight="medium">
                ₹{service.price.toLocaleString()}
              </Typography>
            </ListItem>
          ))}
        </List>

        <Divider sx={{ mb: 3 }} />

        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
            <Typography variant="h6" fontWeight="bold">Total Amount</Typography>
            <Typography variant="h6" fontWeight="bold">
              ₹{amount.toLocaleString()}
            </Typography>
          </Box>
        </Box>

        <Typography 
          variant="h5" 
          component="h2"
          textAlign="center"
          fontWeight="bold"
          mb={3}
          color={theme.palette.primary.alt}
        >
          Select Payment Method
        </Typography>

        <Box
          sx={{
            display: 'flex',
            gap: 2,
            mb: 4,
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'center'
          }}
        >
          <Button
            variant={selectedPayment === 'paypal' ? 'contained' : 'outlined'}
            onClick={() => setSelectedPayment('paypal')}
            disabled={isLoading}
            sx={{
              py: 1.5,
              flex: 1,
              backgroundColor: selectedPayment === 'paypal' ? theme.palette.primary.light : theme.palette.grey[50],
              '&:hover': {
                backgroundColor: selectedPayment === 'paypal' 
                  ? theme.palette.primary.dark 
                  : theme.palette.primary.light,
                color: theme.palette.grey[50],
                transform: 'translateY(-1px)',
              },
              transition: 'transform 0.2s ease-in-out',
            }}
          >
            PayPal
          </Button>
          <Button
            variant={selectedPayment === 'stripe' ? 'contained' : 'outlined'}
            onClick={() => setSelectedPayment('stripe')}
            disabled={isLoading}
            sx={{
              py: 1.5,
              flex: 1,
              backgroundColor: selectedPayment === 'stripe' ? theme.palette.primary.light : theme.palette.grey[50],
              '&:hover': {
                backgroundColor: selectedPayment === 'stripe' 
                  ? theme.palette.primary.dark 
                  : theme.palette.primary.light,
                color: theme.palette.grey[50],
                transform: 'translateY(-1px)',
              },
              transition: 'transform 0.2s ease-in-out',
            }}
          >
            Stripe
          </Button>
          <Button
            variant={selectedPayment === 'upi' ? 'contained' : 'outlined'}
            onClick={() => setSelectedPayment('upi')}
            disabled={isLoading}
            sx={{
              py: 1.5,
              flex: 1,
              backgroundColor: selectedPayment === 'upi' ? theme.palette.primary.light : theme.palette.grey[50],
              '&:hover': {
                backgroundColor: selectedPayment === 'upi' 
                  ? theme.palette.primary.dark 
                  : theme.palette.primary.light,
                color: theme.palette.grey[50],
                transform: 'translateY(-1px)',
              },
              transition: 'transform 0.2s ease-in-out',
            }}
          >
            UPI
          </Button>
        </Box>

        <Box
          sx={{
            mt: 4,
            p: 3,
            backgroundColor: theme.palette.primary.alt,
            borderRadius: 1,
            minHeight: '200px',
            display: selectedPayment ? 'block' : 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {selectedPayment ? (
            renderPaymentComponent()
          ) : (
            <Typography
              variant="body1"
              color="text.secondary"
              textAlign="center"
            >
              Please select a payment method above
            </Typography>
          )}
        </Box>
      </Paper>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert 
          onClose={() => setSnackbarOpen(false)} 
          severity={snackbarSeverity} 
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PaymentInterface;