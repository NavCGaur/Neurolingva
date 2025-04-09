import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { useSelector } from "react-redux";
import { DataGrid } from "@mui/x-data-grid";
import { skipToken } from "@reduxjs/toolkit/query";
import { useGetUserQuery, useGetUserByIdQuery } from "../../../../../state/api";
import DashboardHeader from "../../../../../components/dashboardHeader";
import DataGridCustomToolbar from "../../../../../components/datagridcustomtoolbar";
import UserCreateModal from "../userCreate";
import UserDetailsModal from "../userDetails";
import UserUpdateModal from "../userUpdate";
import UserDeleteModal from "../userDelete";
import CreatePaymentLink from "../../../../../components/payment/CreatePaymentLink";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';

import {
  Box,
  useTheme,
  Button,
  Snackbar,
  Alert,
  useMediaQuery,
  TextField, 
  InputAdornment, 
  IconButton, 
  Paper, 
  Grid, 
  Collapse, 
  Typography, 
  Pagination 
} from "@mui/material";
const AdminCRUDDashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery("(max-width: 600px)");
  const isMediumScreen = useMediaQuery("(max-width: 900px)");
  
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 20,
  });
  const [sortModel, setSortModel] = useState([]);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [expandedRows, setExpandedRows] = useState({}); // Track expanded rows for mobile view

  const userId = useSelector((state) => state.auth.user.uid);
  

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    phone_number: "",
    role: "user",
  });

  const { data: userDetails, isLoading: isUserLoading } = useGetUserByIdQuery(
    selectedUser ? { id: selectedUser } : skipToken
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setSearch(searchInput);
    }, 1000);
    return () => clearTimeout(timeoutId);
  }, [searchInput]);

  const { data, isLoading } = useGetUserQuery({
    userId,
    page: paginationModel.page,
    pageSize: paginationModel.pageSize,
    sort: JSON.stringify(sortModel[0] || {}),
    search,
  });

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric', 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getPaymentSummary = (user) => {
    // Check if user and services exist
    if (!user || !Array.isArray(user.services)) {
        return "No services";
    }
    
    const summary = {
        Paid: 0,
        Pending: 0
    };
    
    user.services.forEach(service => {
        if (service.paymentStatus === "Paid") {
            summary.Paid += 1;
        } else if (service.paymentStatus === "Pending") {
            summary.Pending += 1;
        }
    });
    
    // Return formatted string for DataGrid cell
    return `Paid: ${summary.Paid}, Pending: ${summary.Pending}`;
  };

  const processedRows = data?.users?.map((item, index) => ({
    ...item,
    serial: index + 1,
    createdAt: formatDate(item.createdAt),
    paymentStatus: getPaymentSummary(item),
  })) || [];

  const toggleRowExpansion = (userId) => {
    setExpandedRows(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };

  const handleRowClick = (params) => {
    if (!isMobile) {
      const userId = params.row._id;
      setSelectedUser(userId);
      setSnackbarMessage(`User selected, Double click to view`); 
      setSnackbarOpen(true);
    } else {
      // On mobile, clicking a row will expand/collapse it
      toggleRowExpansion(params.row._id);
    }
  };

  const handleRowDoubleClick = (params) => {
    const userId = params.row._id;
    setSelectedUser(userId);
    setViewModalOpen(true);
  };

  const handleSnackbarClose = () => { setSnackbarOpen(false); };
  
  const columns = [
    {
      field: "serial",
      headerName: "S.No",
      flex: isMobile ? 0.5 : 0.3,
      hide: isMobile, // Hide on mobile to save space
    },
    /*{
      field: "name",
      headerName: "User Name",
      flex: 1,
    },
    {
      field: "phone_number",
      headerName: "Phone",
      flex: 1,
      hide: isMediumScreen, // Hide on medium screens
    },*/
    {
      field: "email",
      headerName: "Email",
      flex: 1,
      hide: isMobile, // Hide on mobile
    },
    {
      field: "role",
      headerName: "Role",
      flex: isMobile ? 0.5 : 0.5,
    },
    {
      field: "paymentStatus",
      headerName: isMobile ? "Payments" : "Payment Status",
      flex: 1,
      hide: isMobile, // Hide on mobile or show abbreviated version
    },
    {
      field: "createdAt",
      headerName: isMobile ? "Created" : "Created At",
      flex: 1,
      hide: isMediumScreen, // Hide on medium screens
    },
  ];

  const visibleColumns = columns.filter(column => !column.hide);

  // Mobile view user cards
  const renderMobileUserCards = () => {
    return (
      <Box sx={{ mt: 2 }}>
        {processedRows.map((user) => (
          <Paper 
            key={user._id} 
            elevation={2} 
            sx={{
              mb: 2,
              p: 2,
              borderRadius: "8px",
              backgroundColor: theme.palette.primary.light,
            }}
          >
            <Box 
              sx={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center',
                cursor: 'pointer',
              }}
              onClick={() => toggleRowExpansion(user._id)}
            >
              <Typography variant="subtitle1" fontWeight="bold">
                {user.name}
              </Typography>
              <IconButton 
                size="small" 
                sx={{ 
                  transform: expandedRows[user._id] ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.3s',
                }}
              >
                <ExpandMoreIcon />
              </IconButton>
            </Box>
            
            {/* Expanded content */}
            <Collapse in={expandedRows[user._id]} timeout="auto" unmountOnExit>
              <Box sx={{ mt: 2 }}>
                <Grid container spacing={1}>
                  <Grid item xs={4}>
                    <Typography variant="body2" color="text.secondary">Role:</Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <Typography variant="body2">{user.role}</Typography>
                  </Grid>
                  
                  <Grid item xs={4}>
                    <Typography variant="body2" color="text.secondary">Email:</Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <Typography variant="body2">{user.email}</Typography>
                  </Grid>
                  
                {/* <Grid item xs={4}>
                    <Typography variant="body2" color="text.secondary">Phone:</Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <Typography variant="body2">{user.phone_number}</Typography>
                  </Grid>
                  */}
                  <Grid item xs={4}>
                    <Typography variant="body2" color="text.secondary">Payments:</Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <Typography variant="body2">{user.paymentStatus}</Typography>
                  </Grid>
                  
                  <Grid item xs={4}>
                    <Typography variant="body2" color="text.secondary">Created:</Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <Typography variant="body2">{user.createdAt}</Typography>
                  </Grid>
                </Grid>
                
                <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                  <Button 
                    variant="contained" 
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedUser(user._id);
                      setViewModalOpen(true);
                    }}
                  >
                    View
                  </Button>
                  <Button 
                    variant="contained" 
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedUser(user._id);
                      setEditModalOpen(true);
                    }}
                  >
                    Edit
                  </Button>
                </Box>
              </Box>
            </Collapse>
          </Paper>
        ))}
        
        {/* Pagination for mobile view */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Pagination
            count={Math.ceil((data?.total || 0) / paginationModel.pageSize)}
            page={paginationModel.page + 1}
            onChange={(e, page) => setPaginationModel({ ...paginationModel, page: page - 1 })}
            color="primary"
            size="small"
          />
        </Box>
      </Box>
    );
  };
  
  return (
    <Box m={isMobile ? "1rem" : "1.5rem 2.5rem"}>
      <DashboardHeader 
        title="All Users" 
        subtitle="Information of all Resellers, Agencies and Clients" 
      />

      {/* Action buttons: stack vertically on mobile */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          flexWrap: isMobile ? 'nowrap' : 'wrap',
          gap: '0.5rem',
          mb: 2,
          mt: 4,
          '& .MuiButton-root': {
            width: isMobile ? '100%' : 'auto',
            minWidth: isMobile ? 'auto' : '120px',
            fontSize: isMobile ? '0.75rem' : '0.875rem',
            padding: isMobile ? '8px 16px' : '8px 16px',
            justifyContent: 'flex-start'
          }
        }}
      >
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setCreateModalOpen(true)}
        >
          {isMobile ? 'Create User' : 'Create User'}
        </Button>
        <Button
          variant="contained"
          startIcon={<EditIcon />}
          disabled={selectedRows.length === 0 && !selectedUser}
          onClick={() => setEditModalOpen(true)}
        >
          {isMobile ? 'Edit User' : 'Edit User'}
        </Button>
        <Button
          variant="contained"
          startIcon={<DeleteIcon />}
          disabled={selectedRows.length === 0 && !selectedUser}
          onClick={() => setDeleteModalOpen(true)}          
        >
          {isMobile ? 'Delete User' : 'Delete User'}
        </Button>
        <Link to={`/service/createpayment/${selectedUser}`} style={{ width: isMobile ? '100%' : 'auto' }}>
          <Button
            variant="contained"
            startIcon={<AttachMoneyIcon />}
            disabled={selectedRows.length === 0 && !selectedUser}
            sx={{ width: isMobile ? '100%' : 'auto' }}
          >
            {isMobile ? 'Create Payment' : 'Create Payment'}
          </Button>
        </Link>
      </Box>

      {/* Search bar */}
      <Box sx={{ mb: 2 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search users..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: searchInput && (
              <InputAdornment position="end">
                <IconButton size="small" onClick={() => setSearchInput("")}>
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
          size="small"
        />
      </Box>

      {/* Show cards on mobile, data grid on larger screens */}
      {isMobile ? (
        renderMobileUserCards()
      ) : (
        <Box
          mt={isMobile ? "20px" : "40px"}
          height={isMobile ? "65vh" : "75vh"}
          sx={{
            "& .MuiDataGrid-root": {
              border: "none",
            },
            "& .MuiDataGrid-cell": {
              borderBottom: "none",
              fontSize: isMobile ? '0.75rem' : '0.875rem',
            },
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: theme.palette.background.alt,
              color: theme.palette.secondary[100],
              borderBottom: "none",
              fontSize: isMobile ? '0.75rem' : '0.875rem',
            },
            "& .MuiDataGrid-virtualScroller": {
              backgroundColor: theme.palette.primary.light,
            },
            "& .MuiDataGrid-footerContainer": {
              backgroundColor: theme.palette.background.alt,
              color: theme.palette.secondary[100],
              borderTop: "none",
            },
            "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
              color: `${theme.palette.secondary[200]} `,
            },
          }}
        >
          <DataGrid
            loading={isLoading || !data}
            getRowId={(row) => row._id}
            rows={processedRows}
            columns={visibleColumns}
            rowCount={(data && data.total) || 0}
            pageSizeOptions={[10, 20, 50]}
            paginationModel={paginationModel}
            paginationMode="server"
            sortingMode="server"
            onPaginationModelChange={setPaginationModel}
            onSortModelChange={setSortModel}
            slots={{
              toolbar: DataGridCustomToolbar,
            }}
            slotProps={{
              toolbar: {
                searchInput,
                setSearchInput,
                setSearch,
              },
            }}
            onRowSelectionModelChange={(newSelection) => {
              setSelectedRows(newSelection);
            }}
            onRowClick={handleRowClick}
            onRowDoubleClick={handleRowDoubleClick}
            sx={{ 
              '& .MuiDataGrid-row': { 
                cursor: 'pointer',
              },
            }}
          />
        </Box>
      )}

      <UserCreateModal 
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        theme={theme}
      />

      <UserDetailsModal
        open={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        userDetails={userDetails}
        isLoading={isUserLoading}
        theme={theme}
      />

      <UserUpdateModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        userDetails={userDetails}
        isLoading={isLoading}
        theme={theme}
      />

      <UserDeleteModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        selectedUsers={selectedRows.length > 0 ? selectedRows : [selectedUser].filter(Boolean)}
      />

      <CreatePaymentLink
        open={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        userDetails={userDetails}
        isLoading={isLoading}
        theme={theme}
      />

      <Snackbar 
        open={snackbarOpen} 
        autoHideDuration={3000} 
        onClose={handleSnackbarClose} 
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} 
      > 
        <Alert onClose={handleSnackbarClose} severity="info" sx={{ width: '100%' }}> 
          {snackbarMessage} 
        </Alert> 
      </Snackbar>
    </Box>
  );
};

export default AdminCRUDDashboard;