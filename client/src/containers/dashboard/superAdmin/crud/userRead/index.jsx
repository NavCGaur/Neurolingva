import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
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
import {
  Box,
  useTheme,
  Button,
  Snackbar,
  Alert,
  Stack,
} from "@mui/material";
const AdminCRUDDashboard = () => {
  const theme = useTheme();
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


  const handleRowClick = (params) => {
    const userId = params.row._id;
    setSelectedUser(userId);
    setSnackbarMessage(`User selected, Double click to view`); 
    setSnackbarOpen(true);
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
      flex: 0.3,
    },
    {
      field: "name",
      headerName: "User Name",
      flex: 1,
    },
    {
      field: "phone_number",
      headerName: "Phone Number",
      flex: 1,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
    },
    {
      field: "role",
      headerName: "Role",
      flex: 0.5,
    },
    {
      field: "paymentStatus",
      headerName: "Payment Status",
      flex: 1,
    },
    {
      field: "createdAt",
      headerName: "Created At",
      flex: 1,
    },
  ];
  

 

  return (
    <Box m="1.5rem 2.5rem">
      <DashboardHeader title="All Users" subtitle="Information of all Resellers, Agencies and Clients" />

      <Stack direction="row" spacing={2} mb={2} mt={4}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setCreateModalOpen(true)}
        >
          Create User
        </Button>
        <Button
          variant="contained"
          startIcon={<EditIcon />}
          disabled={selectedRows.length === 0}
          onClick={() => setEditModalOpen(true)}
        >
          Edit User
        </Button>

        <Button
          variant="contained"
          startIcon={<DeleteIcon />}
          disabled={selectedRows.length === 0}
          onClick={() => setDeleteModalOpen(true)}          
        >
          Delete User
        </Button>

        <Link to={`/service/createpayment/${selectedUser}`}>

          <Button
            variant="contained"
            startIcon={<AttachMoneyIcon />}
            disabled={selectedRows.length === 0}
            >
            Create Payment
          </Button>
        </Link>


      </Stack>


      <Box
        mt="40px"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: theme.palette.background.alt,
            color: theme.palette.secondary[100],
            borderBottom: "none",
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
          columns={columns}
          rowCount={(data && data.total) || 0}
          pageSizeOptions={[20, 50, 100]}
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
          sx={{ '& .MuiDataGrid-row': { cursor: 'pointer', }, }}
         
        />
      </Box>

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
        selectedUsers={selectedRows}
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
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' 
        }} > 
        <Alert onClose={handleSnackbarClose} severity="info" sx={{ width: '100%' }}> 
          {snackbarMessage} 
        </Alert> 
      </Snackbar>

    </Box>
  );
};

export default AdminCRUDDashboard;