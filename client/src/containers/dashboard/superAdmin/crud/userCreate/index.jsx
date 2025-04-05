import React, { useState } from 'react';
import { useCreateUserMutation } from '../../../../../state/api';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Snackbar,
  Alert,
  Typography,
  Stack,
  InputLabel,
  Select,
  MenuItem,
  FormControl,
  CircularProgress
} from '@mui/material';

const UserCreateModal = ({ open, onClose, theme }) => {
  const [formData, setFormData] = useState({ name: '', email: '', phone_number: '', role: '' });
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

  const [createUser, { isLoading, error }] = useCreateUserMutation();


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleClose = () => {
    setFormData({ name: '', email: '', phone_number: '', role: '' });
    setNotification({ open: false, message: '', severity: '' });  
    onClose();
  };

  const handleSubmit = async (e) => {

    if (!formData.name || !formData.email || !formData.phone_number || !formData.role) {
      setNotification({ open: true, message: 'All fields are required!', severity: 'error' });
      return;
    }

    e.preventDefault();
    try {
      await createUser(formData).unwrap();
      // Handle success (e.g., show notification or refresh user list)
      console.log('User created successfully');
      setNotification({ open: true, message: 'User created successfully!', severity: 'success' });

      setTimeout(() => { handleClose(); onClose(); }, 2000); // Delay for 2 seconds
     
    } catch (err) {
      console.error('Failed to create user:', err);
      setNotification({ open: true, message: error?.message || 'Failed to create user.', severity: 'error' });

    }
  };


 
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          bgcolor: theme.palette.background.alt,
          width: '60%',
          height: '70%'
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
          Create New User
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ mt: 2, p: 3 }}>
        <Stack spacing={3} >
       
          <TextField
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            fullWidth
            required
            variant="outlined"
          />
          <TextField
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            fullWidth
            required
            variant="outlined"
          />
          <TextField
            label="Phone Number"
            name="phone_number"
            value={formData.phone_number}
            onChange={handleInputChange}
            fullWidth
            required
            variant="outlined"
          />
         <FormControl fullWidth variant="outlined" required> 
            <InputLabel id="role-label">Role</InputLabel>
            <Select labelId="role-label" label="Role" name="role" value={formData.role} onChange={handleInputChange} 
                sx={{
                 
                  "& .MuiSelect-select": {
                    backgroundColor: formData.role
                      ? theme.palette.select.background
                      : "inherit", // Apply color when value is selected
                  },
                }}
            >
              <MenuItem value="User" >User</MenuItem> 
              <MenuItem value="Admin">Admin</MenuItem> 
              <MenuItem value="Reseller">Reseller</MenuItem> 
              <MenuItem value="Agency">Agency</MenuItem> 
              <MenuItem value="Client">Client</MenuItem> 

            </Select> 
          </FormControl>
        </Stack>
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
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={isLoading}
          sx={{
            bgcolor: theme.palette.primary.main,
            '&:hover': {
              bgcolor: theme.palette.primary.dark
            }
          }}
        >
        {isLoading ? <CircularProgress size={24} /> : 'Create User'}
        </Button>
      </DialogActions>

      <Snackbar
        open={notification.open}
        autoHideDuration={2000}
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

export default UserCreateModal;
