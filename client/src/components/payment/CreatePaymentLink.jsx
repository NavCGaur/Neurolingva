import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

import { skipToken } from "@reduxjs/toolkit/query";

import { 
  Box, 
  Paper, 
  Typography, 
  useTheme,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  OutlinedInput,
  Button,
  Snackbar,
  Alert,
  CircularProgress
} from '@mui/material';

import PaymentInterface from './PaymentInterface';
import { useGetUserByIdQuery } from "../../state/api";


const SERVICE_PRICES = {
  "GST Registration": 1499,
  "MSME Registration": 999,
  "Business Entity Registration": 1,
  "GST Return Filing": 799,
  "Income Tax Return Filing": 999,
  "Accounting & BookKeeping": 1999
};

const CreatePaymentLink = () => {
  const theme = useTheme();
  const [selectedServices, setSelectedServices] = useState([]);
  const [showPaymentInterface, setShowPaymentInterface] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('info');

  

  const { userId } = useParams(); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { data: userDetails, isLoading: isUserLoading } = useGetUserByIdQuery(
    userId ? { id: userId } : skipToken
    );



  if (!userDetails) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="error">User details not available</Typography>
      </Box>
    );
  }

  // Extract userId and filter pending services
  const pendingServices = userDetails.services?.filter(service => 
    service.paymentStatus === 'Pending'
  ) || [];

  // Early return if no pending services
  if (pendingServices.length === 0) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography>No pending services found</Typography>
      </Box>
    );
  }

  const handleServiceSelect = (event) => {
    setSelectedServices(event.target.value);
  };

  const calculateTotal = () => {
    return selectedServices.reduce((total, serviceId) => {
      const service = pendingServices.find(s => s._id === serviceId);
      return total + (SERVICE_PRICES[service.serviceName] || 0);
    }, 0);
  };

  const handleProceedToPayment = () => {
    setShowPaymentInterface(true);
  };


  // Format selected services for PaymentInterface
  const formatSelectedServicesForPayment = () => {
    return selectedServices.map(serviceId => {
      const service = pendingServices.find(s => s._id === serviceId);
      return {
        name: service.serviceName,
        description: `Due: ${new Date(service.nextDueDate).toLocaleDateString()}`,
        price: SERVICE_PRICES[service.serviceName]
      };
    });
  };

  if (showPaymentInterface) {
    return (
      <PaymentInterface
        selectedServices={formatSelectedServicesForPayment()}
        amount={calculateTotal()}
        orderId={`ORD-${userId}-${Date.now()}`}
        userId={userId}
      />
    );
  }

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      sx={{
        minHeight: "100vh",
        backgroundColor: theme.palette.primary.main,
        padding: { xs: 2, sm: 4 },
        height: "100%",
      }}
    >
      <Paper
        elevation={12}
        sx={{
          p: { xs: 3, sm: 6 },
          width: "100%",
          maxWidth: "600px",
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
          mb={6}
          color={theme.palette.primary.alt}
        >
          Select Services for Payment
        </Typography>

        <FormControl fullWidth sx={{ mb: 4 }}>
          <InputLabel>Select Services</InputLabel>
          <Select
            multiple
            value={selectedServices}
            onChange={handleServiceSelect}
            input={<OutlinedInput label="Select Services" />}
            renderValue={(selected) => {
              const selectedServiceNames = selected.map(id => 
                pendingServices.find(service => service._id === id)?.serviceName
              ).join(', ');
              return selectedServiceNames;
            }}
          >
            {pendingServices.map((service) => (
              <MenuItem key={service._id} value={service._id}>
                <Checkbox checked={selectedServices.includes(service._id)} />
                <ListItemText 
                  primary={`${service.serviceName} - ₹${SERVICE_PRICES[service.serviceName].toLocaleString()}`}
                  secondary={`Due: ${new Date(service.nextDueDate).toLocaleDateString()}`}
                />
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button
          variant="contained"
          fullWidth
          onClick={handleProceedToPayment}
          disabled={isLoading || selectedServices.length === 0}
          sx={{
            py: 1.5,
            backgroundColor: theme.palette.primary.main,
            '&:hover': {
              backgroundColor: theme.palette.primary.dark,
              transform: 'translateY(-1px)',
            },
            transition: 'transform 0.2s ease-in-out',
          }}
        >
          {isLoading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Proceed to Payment"
          )}
        </Button>
      </Paper>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
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

export default CreatePaymentLink;