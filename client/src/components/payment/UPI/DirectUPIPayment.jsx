/*import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  Snackbar,
  Alert,
  TextField,
  useTheme,

} from '@mui/material';
import { QRCodeSVG } from 'qrcode.react';  // Changed this line

const DirectUPIPayment = ({ amount, orderId }) => {

  const theme = useTheme();
  
  const BUSINESS_UPI_ID = process.env.REACT_APP_UPI_ID;
  const BUSINESS_NAME = process.env.REACT_APP_BUSINESS_NAME;

  const [showQR, setShowQR] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("info");

  // Generate UPI payment link
  const upiLink = `upi://pay?pa=${BUSINESS_UPI_ID}&pn=${encodeURIComponent(BUSINESS_NAME)}&am=${amount}&tn=${encodeURIComponent(`Order_${orderId}`)}&cu=INR`;

  const handleShowQR = () => {
    setShowQR(true);
  };

  const handleCopyUpiId = () => {
    navigator.clipboard.writeText(BUSINESS_UPI_ID);
    setSnackbarMessage("UPI ID copied to clipboard!");
    setSnackbarSeverity("success");
    setSnackbarOpen(true);
  };

  const handleOpenUpiApp = () => {
    const isMobileDevice = /android|iphone|ipod/i.test(navigator.userAgent);

    if (isMobileDevice) {
      window.location.href = upiLink;
    } else {
      alert("Please open this link on your mobile device with a UPI app installed to complete the payment.");
    }

  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', textAlign: 'center' }}>
      {!showQR ? (
        <Button
          variant="contained"
          color="primary"
          onClick={handleShowQR}
          sx={{ mt: 2 }}
        >
          Pay with UPI
        </Button>
      ) : (
        <Paper elevation={3} sx={{ p: 3, mt: 2 }}>
          <Typography variant="h6" gutterBottom>
            Scan QR Code to Pay
          </Typography>
          
          <Box sx={{ my: 2 }}>
            <QRCodeSVG  // Changed to QRCodeSVG
              value={upiLink}
              size={256}
              level="H"
              includeMargin={true}
            />
          </Box>
          
          <Typography variant="body1" gutterBottom>
            Amount: ₹{amount}
          </Typography>

          <Box sx={{ mt: 2, bgcolor: 'theme.palette.primary.main', p: 2, borderRadius: 1 }}>
            
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
              <TextField
                variant="outlined"
                size="small"
                value={BUSINESS_UPI_ID}
                InputProps={{
                  readOnly: true,
                }}
                sx={{ color: "theme.palette.primary.main" }}
              />
              <Button 
                variant="outlined" 
                size="medium"
                onClick={handleCopyUpiId}
                color='theme.palette.primary.alt'
              >
                Copy
              </Button>
            </Box>
          </Box>

          <Box sx={{ mt: 3 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Or click below to pay using UPI app:
            </Typography>
            <Button 
              variant="outlined" 
              color="primary"
              onClick={handleOpenUpiApp}
              sx={{ mt: 1 }}
            >
              Open in UPI App
            </Button>
          </Box>

          <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid #eee' }}>
            <Typography variant="body2" color="text.secondary">
              After payment, please contact us with your Order ID: {orderId}
            </Typography>
          </Box>
        </Paper>
      )}

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default DirectUPIPayment;

*/