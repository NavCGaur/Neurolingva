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
  const [formData, setFormData] = useState({});
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

  console.log("User details:",userDetails);
  const user = userDetails?.data;


  // Create ref for role field
  const roleRef = useRef();

  useEffect(() => {
    if (userDetails) {
      const initialData = {
        email: user.email || '',
        role: user.role || '',
      };
      setFormData(initialData);
    }
  }, [userDetails]);

  const handleClose = () => {
    onClose();
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

  const handleSubmit = async () => {
    try {
      const updatedData = {
        role: roleRef.current.value || formData.role,
      };

      await editUser({ id: user._id, ...updatedData }).unwrap();

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

      <DialogContent sx={{ mt: 2, p: 3 }}>
        {isLoading ? (
          <Box sx={{ p: 3 }}>
            <Typography>Loading...</Typography>
          </Box>
        ) : (
          <Stack spacing={6} mt={4}>
            <TextField
              fullWidth
              label="Email"
              value={formData.email}
              disabled
             
            />
            <FormControl fullWidth sx={textFieldSx}>
              <InputLabel>Role</InputLabel>
              <Select
                defaultValue={formData.role}
                inputRef={roleRef}
                label="Role"
              >
                <MenuItem value="Reseller">Reseller</MenuItem>
                <MenuItem value="Agency">Agency</MenuItem>
                <MenuItem value="Client">Client</MenuItem>
              </Select>
            </FormControl>
          </Stack>
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