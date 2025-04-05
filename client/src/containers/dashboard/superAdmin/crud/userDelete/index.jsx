import React, { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";
import { useDeleteUserMutation } from "../../../../../state/api";

const UserDeleteModal = ({ open, onClose, selectedUsers }) => {
  const [deleteUser, { isLoading }] = useDeleteUserMutation();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success"); // 'success' or 'error'

  const handleDelete = async () => {
    try {
      if (selectedUsers?.length === 1) {
        const userId = selectedUsers[0];
        await deleteUser(userId).unwrap();
        setSnackbarMessage("User deleted successfully!");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
        onClose(); // Close the modal on success
      } else {
        setSnackbarMessage("Invalid selection. Only one user can be deleted at a time.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    } catch (error) {
      setSnackbarMessage("Error deleting user. Please try again.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        aria-labelledby="delete-user-dialog-title"
        aria-describedby="delete-user-dialog-description"
      >
        <DialogTitle id="delete-user-dialog-title">Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-user-dialog-description">
            Are you sure you want to delete the selected user? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            color="secondary"
            variant="contained"
            autoFocus
            disabled={isLoading}
          >
            {isLoading ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for success or error messages */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default UserDeleteModal;
