import React, { useState, useEffect, useRef } from "react";

import { storage } from '../../../../../config/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';


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
  TextField,
  Alert,
  Snackbar,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,

} from "@mui/material";
import Upload from '@mui/icons-material/Upload'; 

import { useEditUserMutation } from "../../../../../state/api";


const UserEditModal = ({ open, onClose, userDetails, isLoading, theme }) => {
  const [editUser] = useEditUserMutation();
  const [activeTab, setActiveTab] = useState(0);
  const [formData, setFormData] = useState({});
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
  const [uploadProgress, setUploadProgress] = useState(0);
  const [serviceRefs, setServiceRefs] = useState([]);
  const [existingServices, setExistingServices] = useState([]);
  const [newServices, setNewServices] = useState([]);





  // Create refs for all form fields
    const refs = {
      name: useRef(),
      residential_address: {
        street: useRef(),
        city: useRef(),
        state: useRef(),
        pincode: useRef()
      },
      business_address: {
        street: useRef(),
        city: useRef(),
        state: useRef(),
        pincode: useRef()
      },
      business_details: {
        trade_name: useRef(),
        legal_name: useRef(),
        business_type: useRef(),
        business_category: useRef(),
        business_pan: useRef(),
        date_of_establishment: useRef(),
        annual_turnover: useRef()
      }
    };
  
    const formatDate = (dateString) => {
      const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric', 
      };
      return new Date(dateString).toLocaleDateString(undefined, options);
    };


    useEffect(() => {
      if (userDetails?.services) {
        const newRefs = userDetails.services.map(() => ({
          name: React.createRef(),
          description: React.createRef(),
          status: React.createRef(),
          dueDate: React.createRef()
        }));
        setServiceRefs(newRefs);
      }
    }, [userDetails?.services]);

    useEffect(() => {
      if (userDetails) {
        const initialData = {
          name: userDetails.name || '',
          email: userDetails.email || '',
          phone_number: userDetails.phone_number || '',
          role: userDetails.role || '',
          residential_address: {
            street: userDetails.residential_address?.street || '',
            city: userDetails.residential_address?.city || '',
            state: userDetails.residential_address?.state || '',
            pincode: userDetails.residential_address?.pincode || ''
          },
          business_address: {
            street: userDetails.business_address?.street || '',
            city: userDetails.business_address?.city || '',
            state: userDetails.business_address?.state || '',
            pincode: userDetails.business_address?.pincode || ''
          },
          business_details: {
            trade_name: userDetails.business_details?.trade_name || '',
            legal_name: userDetails.business_details?.legal_name || '',
            business_type: userDetails.business_details?.business_type || '',
            business_category: userDetails.business_details?.business_category || '',
            business_pan: userDetails.business_details?.business_pan || '',
            date_of_establishment: userDetails.business_details?.date_of_establishment || '',
            annual_turnover: userDetails.business_details?.annual_turnover || ''
          },
          services: userDetails.services || [],

          documents: userDetails.documents || {}
        };
        setFormData(initialData);
        setExistingServices(userDetails.services);
      
      }
    }, [userDetails]);


  const handleClose = () => {
    setActiveTab(0);
    onClose();
  };


  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  

  const textFieldSx = {
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: theme.palette.divider,
      },
      '&:hover fieldset': {
        borderColor: theme.palette.primary.main,
      },
      '&.Mui-focused fieldset': {
        borderColor: theme.palette.primary.main,
      },
    },
    '& .MuiInputLabel-root': {
      color: theme.palette.secondary[100],
    },
    '& .MuiInputBase-input': {
      color: theme.palette.secondary[100],
    },
  };

  const BasicInfoTab = () => (
    <Stack spacing={3} sx={{ px: 1 }}>
      <TextField
        fullWidth
        label="Name"
        defaultValue={formData.name}
        inputRef={refs.name}
        sx={textFieldSx}
      />
      <TextField
        fullWidth
        label="Email"
        defaultValue={formData.email}
        disabled
        sx={textFieldSx}
      />
      <TextField
        fullWidth
        label="Phone Number"
        defaultValue={formData.phone_number}
        disabled
        sx={textFieldSx}
      />
      <TextField
        fullWidth
        label="Role"
        defaultValue={formData.role}
        disabled
        sx={textFieldSx}
      />
    </Stack>
  );

  const ResidentialAddressTab = () => (
    <Stack spacing={3} sx={{ px: 1 }}>
      <TextField
        fullWidth
        label="Street"
        defaultValue={formData.residential_address?.street}
        inputRef={refs.residential_address.street}
        sx={textFieldSx}
      />
      <TextField
        fullWidth
        label="City"
        defaultValue={formData.residential_address?.city}
        inputRef={refs.residential_address.city}
        sx={textFieldSx}
      />
      <TextField
        fullWidth
        label="State"
        defaultValue={formData.residential_address?.state}
        inputRef={refs.residential_address.state}
        sx={textFieldSx}
      />
      <TextField
        fullWidth
        label="Pincode"
        defaultValue={formData.residential_address?.pincode}
        inputRef={refs.residential_address.pincode}
        sx={textFieldSx}
      />
    </Stack>
    
  );

  const BusinessAddressTab = () => (
  <Stack spacing={3} sx={{ px: 1 }}>

    <TextField
    fullWidth
    label="Street"
    defaultValue={formData.business_address?.street}
    inputRef={refs.business_address.street}
    sx={textFieldSx}
  />
  <TextField
    fullWidth
    label="City"
    defaultValue={formData.business_address?.city}
    inputRef={refs.business_address.city}
    sx={textFieldSx}
  />
  <TextField
    fullWidth
    label="State"
    defaultValue={formData.business_address?.state}
    inputRef={refs.business_address.state}
    sx={textFieldSx}
  />
  <TextField
    fullWidth
    label="Pincode"
    defaultValue={formData.business_address?.pincode}
    inputRef={refs.business_address.pincode}
    sx={textFieldSx}
  />
</Stack>

);

  const BusinessTab = () => (
    <Stack spacing={3} sx={{ px: 1 }}>
      <TextField
        fullWidth
        label="Trade Name"
        defaultValue={formData.business_details?.trade_name}
        inputRef={refs.business_details.trade_name}
        sx={textFieldSx}
      />
      <TextField
        fullWidth
        label="Legal Name"
        defaultValue={formData.business_details?.legal_name}
        inputRef={refs.business_details.legal_name}
        sx={textFieldSx}
      />
      <TextField
        fullWidth
        label="Business Type"
        defaultValue={formData.business_details?.business_type}
        inputRef={refs.business_details.business_type}
        sx={textFieldSx}
      />
      <TextField
        fullWidth
        label="Business Category"
        defaultValue={formData.business_details?.business_category}
        inputRef={refs.business_details.business_category}
        sx={textFieldSx}
      />
      <TextField
        fullWidth
        label="Business PAN"
        defaultValue={formData.business_details?.business_pan}
        inputRef={refs.business_details.business_pan}
        sx={textFieldSx}
      />
      <TextField
        fullWidth
        label="Date of Establishment"
        defaultValue={formData.business_details?.date_of_establishment}
        inputRef={refs.business_details.date_of_establishment}
        sx={textFieldSx}
      />
      <TextField
        fullWidth
        label="Annual Turnover"
        defaultValue={formData.business_details?.annual_turnover}
        inputRef={refs.business_details.annual_turnover}
        sx={textFieldSx}
      />
    </Stack>
  );

  const handleFileUpload = async (docType) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf,.jpg,.jpeg,.png';
    
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (file) {
        if (file.size > 1024 * 1024) { // Check for 1MB limit
          setNotification({
            open: true,
            message: 'File size must be less than 1MB',
            severity: 'error'
          });
          return;
        }
  
        const storageRef = ref(storage, `uploads/${docType}/${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);
  
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setUploadProgress(progress); // Track upload progress
          },
          (error) => {
            setNotification({
              open: true,
              message: 'Failed to upload file',
              severity: 'error'
            });
          },
          async () => {
            // Get the download URL after upload
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
  
            setFormData((prev) => ({
              ...prev,
              documents: {
                ...prev.documents,
                [docType]: {
                  file_url: downloadURL,
                  verified: false
                }
              }
            }));
  
            setNotification({
              open: true,
              message: 'File uploaded successfully',
              severity: 'success'
            });
          }
        );
      }
    };
  
    input.click();
  };
  

  const handleSubmit = async () => {


    try {
      // Collect all current values from refs
      const updatedExistingServices = existingServices.map((service, index) => ({
        ...service,
        serviceName: serviceRefs[index]?.name?.current?.value || service.serviceName,
        notes: serviceRefs[index]?.description?.current?.value || service.notes,
        paymentStatus: serviceRefs[index]?.status?.current?.value || service.paymentStatus,
        nextDueDate: serviceRefs[index]?.dueDate?.current?.value || service.nextDueDate,
      }));

      const allServices = [...updatedExistingServices, ...newServices];

    

      const updatedData = {
        name: refs?.name?.current?.value || formData.name,
        residential_address: {
          street: refs?.residential_address?.street?.current?.value || formData.residential_address.street,
          city: refs?.residential_address?.city?.current?.value || formData.residential_address.city,
          state: refs?.residential_address?.state?.current?.value || formData.residential_address.state,
          pincode: refs?.residential_address?.pincode?.current?.value || formData.residential_address.pincode,
        },
        business_address: {
          street: refs?.business_address?.street?.current?.value || formData.business_address.street,
          city: refs?.business_address?.city?.current?.value || formData.business_address.city,
          state: refs?.business_address?.state?.current?.value || formData.business_address.state,
          pincode: refs?.business_address?.pincode?.current?.value || formData.business_address.pincode,
        },
        services: allServices,
        documents: formData.documents,
      };
      
      console.log("Refs:", refs);
      console.log("Form Data:", formData);

      console.log("Edit user input:", updatedData );

      await editUser({ id: userDetails._id, ...updatedData }).unwrap();

      setNotification({
        open: true,
        message: 'User updated successfully',
        severity: 'success'
      });
      handleClose();
    } catch (error) {
      setNotification({
        open: true,
        message: error.data?.message || 'Failed to update user',
        severity: 'error'
      });
    }
  };

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
          <Typography variant="subtitle1" color={theme.palette.secondary[100]} fontWeight="600">
            {doc.label}
          </Typography>
          <Stack direction="row" spacing={2} alignItems="center">
            {formData.documents?.[doc.key]?.file_url ? (
              <>
                <Button
                  variant="outlined"
                  size="small"
                  sx={{
                    color: theme.palette.primary.contrastText, // Ensures visibility
                    backgroundColor: theme.palette.primary.main, // Sets a visible background
                    '&:hover': {
                      backgroundColor: theme.palette.primary.dark, 
                      borderColor: theme.palette.primary.main,
                    },}}
                  onClick={() => window.open(formData.documents[doc.key].file_url, '_blank')}
                >
                  View Document
                </Button>
                <IconButton
                  onClick={() => handleFileUpload(doc.key)}
                  sx={{ color: theme.palette.primary.main }}
                >
                  <Upload 
                   sx={{
                    color: theme.palette.primary.contrastText
                
                    }}/>
                </IconButton>
                <Typography
                  variant="body2"
                  color={formData.documents[doc.key].verified ? 'success.main' : 'warning.main'}
                >
                  {formData.documents[doc.key].verified ? 'Verified' : 'Pending Verification'}
                </Typography>
              </>
            ) : (
              <Button
                variant="contained"
                startIcon={<Upload />}
                onClick={() => handleFileUpload(doc.key)}
              >
                Upload Document
              </Button>
            )}
          </Stack>
        </Box>
      ))}
    </Stack>
  );



  const ServicesTab = () => {

    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    

    const [newService, setNewService] = useState({
      serviceName: '',
      paymentStatus: '',
      nextDueDate: '',
      notes: '',
    });

    const serviceOptions = [
      'GST Return Filing',
      'Income Tax Return Filing',
      'Accounting & BookKeeping',
      'Business Entity Registration',
      'GST Registration',
      'MSME Registration',
    ];
  
    const handleAddService = () => {
      if (newService.serviceName && newService.paymentStatus) {
        setNewServices([...newServices, newService]); // Add to the newServices array
        setNewService({ serviceName: '', paymentStatus: '', nextDueDate: '', notes: '' }); // Reset new service fields
        setSnackbar({ open: true, message: 'Service added successfully!', severity: 'success' });

      } else {
        setSnackbar({ open: true, message: 'Please fill all required fields!', severity: 'error' });
      }
    };

    const handleCloseSnackbar = () => {
      setSnackbar({ ...snackbar, open: false });
    };


    return(
    <Stack spacing={3} sx={{ px: 1 }}>
      <Typography variant="h6" fontWeight="600">
        Services
      </Typography>
      {console.log("existingServices",existingServices)}
      {existingServices.length > 0 ? (
        existingServices.map((service, index) => (
          <Box
            key={index}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
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
              Service {index + 1}
            </Typography>
            <TextField
              fullWidth
              label="Service Name"
              defaultValue={service.serviceName}
              inputRef={serviceRefs[index]?.serviceName}
              sx={textFieldSx}
              disabled
            />
            <FormControl fullWidth sx={textFieldSx}>
              <InputLabel>Status</InputLabel>
              <Select
                defaultValue={service.paymentStatus}
                inputRef={serviceRefs[index]?.paymentStatus}
                label="Status"
                
              >
                <MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="Paid">Paid</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Due Date"
              type="date"
              defaultValue={service.nextDueDate ? new Date(service.nextDueDate).toISOString().split('T')[0] : ''}
              inputRef={serviceRefs[index]?.nextDueDate}
              sx={textFieldSx}
              InputLabelProps={{
                shrink: true,
              }}
              disabled
            />
            <TextField
              fullWidth
              label="Notes"
              defaultValue={service.notes}
              inputRef={serviceRefs[index]?.notes}
              sx={textFieldSx}
              disabled
            />
          </Box>
        ))
      ) : (
        <Typography variant="body1" color={theme.palette.secondary[100]}>
          No services available for this user.
        </Typography>
      )}

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          p: 2,
          borderRadius: 2,
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Typography variant="subtitle1" fontWeight="600">
          Add New Service
        </Typography>
        <FormControl fullWidth sx={textFieldSx}>
          <InputLabel>Service Name</InputLabel>
          <Select
            value={newService.serviceName}
            onChange={(e) => setNewService({ ...newService, serviceName: e.target.value })}
            label="Service Name"
          >
            {serviceOptions.map((option, index) => (
              <MenuItem key={index} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth sx={textFieldSx}>
          <InputLabel>Status</InputLabel>
          <Select
            value={newService.paymentStatus}
            onChange={(e) => setNewService({ ...newService, paymentStatus: e.target.value })}
            label="Status"
          >
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="Paid">Paid</MenuItem>
          </Select>
        </FormControl>
        <TextField
          fullWidth
          label="Due Date"
          type="date"
          value={newService.nextDueDate}
          onChange={(e) => setNewService({ ...newService, nextDueDate: e.target.value })}
          sx={textFieldSx}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          fullWidth
          label="Notes"
          value={newService.notes}
          onChange={(e) => setNewService({ ...newService, notes: e.target.value })}
          sx={textFieldSx}
        />
        <Button variant="contained" onClick={handleAddService}>
          Add Service
        </Button>
      </Box>
            {/* Snackbar for notifications */}
            <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>

    </Stack>
)
} 

  
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
          width: '80%',
          height: '80%',
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
          Edit User Details
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ mt: 2, p: 0 }}>
        {isLoading ? (
          <Box sx={{ p: 3 }}>
            <Typography>Loading...</Typography>
          </Box>
        ) : (
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
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2.5, borderTop: `1px solid ${theme.palette.divider}` }}>
        <Button
          onClick={handleClose}
          variant="outlined"
          sx={{
            color: theme.palette.secondary[100],
            borderColor: theme.palette.secondary[100],
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          sx={{
            bgcolor: theme.palette.secondary.alt,
            '&:hover': {
              bgcolor: theme.palette.secondary.dark
            }
          }}
        >
          Save Changes
        </Button>
      </DialogActions>

      <Snackbar
        open={notification.open}
        autoHideDuration={3000}
        onClose={() => setNotification({ ...notification, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setNotification({ ...notification, open: false })}
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Dialog>
  );
};


export default UserEditModal;