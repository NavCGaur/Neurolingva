/*import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useCreatePaypalOrderMutation, useCapturePaypalPaymentMutation } from '../../../state/api/paymentApi';
import { Snackbar, Alert } from '@mui/material';

const PayPalPayment = ({ selectedServices, userId, amount, orderId }) => {
  const [createPaypalOrder] = useCreatePaypalOrderMutation();
  const [capturePayment] = useCapturePaypalPaymentMutation();

  const navigate = useNavigate();

  
  // Snackbar state
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('info');

  const handleSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);        
    setSnackbarOpen(true);
  };


  return (
    <>
      <PayPalScriptProvider
        options={{
          "client-id": process.env.REACT_APP_PAYPAL_CLIENT_ID,
          currency: "USD"
        }}
      >
        
        <PayPalButtons
          style={{ layout: "vertical" }}
          createOrder={async () => {
            try {
              const response = await createPaypalOrder({
                amount,
                orderId,
                selectedServices,
                userId 
              }).unwrap();
              return response.orderID;
            } catch (error) {
              handleSnackbar('Error creating PayPal order', 'error');
              console.error('Error:', error);
            }
          }}
          onApprove={async (data, actions) => {
            try {
              console.log("Capture payment data:", {
                orderId: data.orderID,
                userId,
                selectedServices
              });
              
              const response = await capturePayment({
                orderId: data.orderID,
                userId: userId,
                selectedServices: selectedServices
              }).unwrap();
              if (response.status === 'COMPLETED') {
                handleSnackbar('Payment successful, Going back to dashboard in 10 seconds!', 'success');
                setTimeout(()=>{
                  navigate('/service/customers'); 

                },10000)
              }
            } catch (error) {
              handleSnackbar('Error processing payment', 'error');
              console.error('Error:', error);
            } 
          }}
          onError={(err) => {
            handleSnackbar('PayPal payment failed', 'error');
            console.error('PayPal Error:', err);
          }}
        />
      </PayPalScriptProvider>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={10000}
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
    </>
  );
};

export default PayPalPayment;

*/