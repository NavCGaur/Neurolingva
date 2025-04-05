
import React, { useState } from "react";

import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  Typography,
  Tabs, 
  Tab,
  Snackbar, 
  Alert,
} from "@mui/material";


const UserDetailsModal = ({ open, onClose, userDetails, isLoading, theme }) => {


    const [copyNotification, setCopyNotification] = useState(false);

    const [activeTab, setActiveTab] = useState(0);


    const handleClose = () => { setActiveTab(0); onClose(); };
    
    const formatDate = (dateString) => {
      const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric', 
        
      };
      return new Date(dateString).toLocaleDateString(undefined, options);
    };
  

    const copyToClipboard = (text) => {
      navigator.clipboard.writeText(text);
      setCopyNotification(true);
    };

  
    const handleTabChange = (event, newValue) => {
      setActiveTab(newValue);
    };
  
    const DetailBox = ({ label, value }) => (
      <Box
        onClick={() => copyToClipboard(value)}
        sx={{
          display: 'flex',
          textAlign: 'center',
          cursor: 'pointer',
          borderRadius: 2,
          p: 1,
          bgcolor: theme.palette.primary.light,
          transition: 'all 0.2s ease',
          border: `1px solid ${theme.palette.divider}`,
          '&:hover': {
            bgcolor: theme.palette.primary[400],
            transform: 'translateY(-2px)',
            boxShadow: theme.shadows[4]
          }
        }}
      >
        <Typography
          variant="subtitle2"
          color={theme.palette.secondary[100]}
          gutterBottom
          sx={{ fontWeight: 600, flex: '0 0 150px' }}
        >
          {label}:
        </Typography>
        <Typography
          variant="body1"
          color={theme.palette.secondary[100]}
          sx={{ ml: 3, fontWeight: 500 }}
        >
          {value}
        </Typography>
      </Box>
    );
  
    const BasicInfoTab = () => (
      <Stack spacing={3} sx={{ px: 1 }}>
        <DetailBox label="Name"  value={userDetails?.name || 'N/A'} />
        <DetailBox label="Email" value={userDetails?.email || 'N/A'} />
        <DetailBox label="Phone Number" value={userDetails?.phone_number || 'N/A'} />
        <DetailBox label="Role" value={userDetails?.role || 'N/A'} />
        <DetailBox 
          label="Created At" 
          value={userDetails?.createdAt ? formatDate(userDetails.createdAt) : 'N/A'} 
        />
      </Stack>
    );
  
    const ResidentialAddressTab = () => (
      <Stack spacing={3} sx={{ px: 1 }}>
        <DetailBox label="Street" value={userDetails?.residential_address?.street || 'N/A'} />
        <DetailBox label="City" value={userDetails?.residential_address?.city || 'N/A'} />
        <DetailBox label="State" value={userDetails?.residential_address?.state || 'N/A'} />
        <DetailBox label="Pincode" value={userDetails?.residential_address?.pincode || 'N/A'} />
      </Stack>
    );

    const BusinessAddressTab = () => (
      <Stack spacing={3} sx={{ px: 1 }}>
        <DetailBox label="Street" value={userDetails?.business_address?.street || 'N/A'} />
        <DetailBox label="City" value={userDetails?.business_address?.city || 'N/A'} />
        <DetailBox label="State" value={userDetails?.business_address?.state || 'N/A'} />
        <DetailBox label="Pincode" value={userDetails?.business_address?.pincode || 'N/A'} />
      </Stack>
    );
  
    const BusinessTab = () => (
      <Stack spacing={3} sx={{ px: 1 }}>
        <DetailBox label="Trade Name" value={userDetails?.business_details?.trade_name || 'N/A'} />
        <DetailBox label="Legal Name" value={userDetails?.business_details?.legal_name || 'N/A'} />
        <DetailBox label="Business Type" value={userDetails?.business_details?.business_type || 'N/A'} />
        <DetailBox label="Business Category" value={userDetails?.business_details?.business_category || 'N/A'} />
        <DetailBox label="Business PAN" value={userDetails?.business_details?.business_pan || 'N/A'} />
        <DetailBox 
          label="Date of Establishment" 
          value={userDetails?.business_details?.date_of_establishment ? 
            formatDate(userDetails.business_details.date_of_establishment) : 'N/A'} 
        />
        <DetailBox 
          label="Annual Turnover" 
          value={userDetails?.business_details?.annual_turnover ? 
            `₹${userDetails.business_details.annual_turnover.toLocaleString()}` : 'N/A'} 
        />
      </Stack>
    );


  
    const DocumentsTab = () => (
      <Stack spacing={3} sx={{ px: 1 }}>
        {[
          { key: 'pan_card', label: 'PAN Card' },
          { key: 'aadhaar_card', label: 'Aadhaar Card' },
          { key: 'business_registration', label: 'Business Registration' },
          { key: 'electricity_bill', label: 'Electricity Bill' },
          { key: 'rent_agreement', label: 'Rent Agreement' },
          { key: 'property_tax_receipt', label: 'Property Tax Receipt' }
        ].map((doc) => (
          <Box
            key={doc.key}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
              p: 2,
              bgcolor: theme.palette.primary.light,
              borderRadius: 2,
              border: `1px solid ${theme.palette.divider}`
            }}
          >
            <Typography
              variant="subtitle1"
              color={theme.palette.secondary[100]}
              fontWeight="600"
            >
              {doc.label}
            </Typography>
            <Stack direction="row" spacing={2} alignItems="center">
              {userDetails?.documents?.[doc.key]?.file_url ? (
                <>
                  <Button
                    variant="outlined"
                    size="big"
                    sx={{
                      color: theme.palette.primary.contrastText, // Ensures visibility
                      backgroundColor: theme.palette.primary.main, // Sets a visible background
                      '&:hover': {
                        backgroundColor: theme.palette.primary.dark, 
                        borderColor: theme.palette.primary.main,
                      },
                      marginTop: 2,
                    }}
                    onClick={() => window.open(userDetails.documents[doc.key].file_url, '_blank')}
                  >
                    View Document
                  </Button>
                  <Typography
                    variant="body2"
                    color={userDetails.documents[doc.key].verified ? 'success.main' : 'warning.main'}
                  >
                    {userDetails.documents[doc.key].verified ? 'Verified' : 'Pending Verification'}
                  </Typography>
                </>
              ) : (
                <Typography variant="body2" color="error">
                  Not Uploaded
                </Typography>
              )}
            </Stack>
          </Box>
        ))}
      </Stack>
    );


    const ServicesTab = () => (
      <Stack spacing={3} sx={{ px: 1 }}>
        {userDetails?.services?.length ? (
          userDetails.services.map((service, index) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
                p: 2,
                bgcolor: theme.palette.primary.light,
                borderRadius: 2,
                border: `1px solid ${theme.palette.divider}`,
              }}
            >
              <Typography
                variant="subtitle1"
                color={theme.palette.secondary[100]}
                fontWeight="600"
              >
                {service.serviceName}
              </Typography>
              <Stack spacing={1}>
              <Typography
                  variant="body2"
                  sx={{
                    color: service.paymentStatus === 'Paid' ? 'success.main' : 'error.main',
                  }}
                >
                  <strong>Payment Status:</strong> {service.paymentStatus || 'Pending'}
              </Typography>
                <Typography variant="body2">
                  <strong>Next Due Date:</strong>{' '}
                  {service.nextDueDate ? formatDate(service.nextDueDate) : 'N/A'}
                </Typography>
                <Typography variant="body2">
                  <strong>Notes:</strong> {service.notes || 'N/A'}
                </Typography>
              </Stack>
            </Box>
          ))
        ) : (
          <Typography variant="body2" color="error">
            No services added.
          </Typography>
        )}
      </Stack>
    );
    
  
    return (
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            bgcolor: theme.palette.background.alt,
            width:'90%',
            height:'90%',
            
          }
        }}
      >
        <DialogTitle
          sx={{
            borderBottom: `1px solid ${theme.palette.divider}`,
            pb: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
        >
          <Typography variant="h5" component="span" fontWeight="bold" color={theme.palette.secondary[100]}>
            User Details
          </Typography>
        </DialogTitle>
  
        <DialogContent sx={{ mt: 2, p: 0 }}>
          {isLoading ? (
            <Box sx={{ p: 3 }}>
              <Typography>Loading...</Typography>
            </Box>
          ) : userDetails ? (
            <>
              <Tabs
                value={activeTab}
                onChange={handleTabChange}
                variant="scrollable"
                scrollButtons="auto"
                sx={{
                  borderBottom: 1,
                  borderColor: 'divider',
                  bgcolor: theme.palette.background.alt,
                  '& .MuiTab-root': {
                    color: theme.palette.secondary[100],
                    '&.Mui-selected': {
                      color: theme.palette.secondary[300],
                    }
                  }
                }}
              >
                <Tab label="Basic Info" />
                <Tab label="Business Details" />
                <Tab label="Services" />
                <Tab label="Documents" />
                <Tab label="Res Address" />
                <Tab label="Busi Address" />
              </Tabs>
              <Box sx={{ p: 3 }}>
                {activeTab === 0 && <BasicInfoTab />}
                {activeTab === 1 && <BusinessTab />}
                {activeTab === 2 && <ServicesTab />}
                {activeTab === 3 && <DocumentsTab />}
                {activeTab === 4 && <ResidentialAddressTab />}
                {activeTab === 5 && <BusinessAddressTab />}

              </Box>
            </>
          ) : (
            <Box sx={{ p: 3 }}>
              <Typography>No user details found.</Typography>
            </Box>
          )}
        </DialogContent>
  
        <DialogActions sx={{ p: 2.5, borderTop: `1px solid ${theme.palette.divider}` }}>
          <Button
            onClick={handleClose}
            variant="contained"
            sx={{
              bgcolor: theme.palette.secondary.alt,
              '&:hover': {
                bgcolor: theme.palette.secondary.dark
              }
            }}
          >
            Close
          </Button>
        </DialogActions>

         {/* Copy Notification */}
              <Snackbar 
                open={copyNotification} 
                autoHideDuration={2000} 
                onClose={() => setCopyNotification(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
              >
                <Alert 
                  onClose={() => setCopyNotification(false)} 
                  severity="success" 
                  sx={{ width: '100%' }}
                >
                  Copied to clipboard!
                </Alert>
              </Snackbar>
      </Dialog>
    );
  };

  export default UserDetailsModal;