import React from "react";
import FlexBetween from "../../../../components/flexbetween";
import Header from "../../../../components/header";
import Papa from "papaparse";
import { useGetAllUsersQuery } from "../../../../state/api"; 
import StatBox from "../../../../components/statbox";
import OverviewChart from "../../../../components/charts/overviewChart";
import BreakdownChart from "../../../../components/charts/breakdownChart";



import {
  DownloadOutlined,
  Email,
  PointOfSale,
  PersonAdd,
  Traffic,
} from "@mui/icons-material";

import {
  Box,
  Button,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";

const ResellerDashboard = () => {
  const theme = useTheme();
  const isNonMediumScreens = useMediaQuery("(min-width: 1200px)");
  const { data: users, isLoading, isError } = useGetAllUsersQuery();

  const totalUsers = users ? users.length : "0";
  const totalServices = users ? users.length:"0";

  const handleDownload = () => {
    if (isLoading || isError || !users) {
      alert("Data is not available yet.");
      return;
    }

    const csvData = users.map((user) => ({
      Name: user.name || '',
      Email: user.email || '',
      "Residential Address": user.residential_address 
        ? `${user.residential_address.street || ''}, ${user.residential_address.city || ''}, ${user.residential_address.state || ''}, ${user.residential_address.pincode || ''}`
        : '',
      "Business Address": user.business_address 
        ? `${user.business_address.street || ''}, ${user.business_address.city || ''}, ${user.business_address.state || ''}, ${user.business_address.pincode || ''}`
        : '',
      Services: user.services ? user.services.map((service) => service.serviceName).join(", ") : '',
      Status: user.services ? user.services.map((service) => service.paymentStatus).join(", ") : '',
    }));

    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "users_report.csv";
    link.click();
  };

  return (
    <Box m="1.5rem 2.5rem">
      <FlexBetween>
        <Header title="RESELLER DASHBOARD" subtitle="Welcome to your dashboard" />
        <Box>
          <Button
            sx={{
              backgroundColor: theme.palette.secondary.light,
              color: theme.palette.background.alt,
              fontSize: "14px",
              fontWeight: "bold",
              padding: "10px 20px",
            }}
            onClick={handleDownload}
          >
            <DownloadOutlined sx={{ mr: "10px" }} />
            Download All User Data
          </Button>
        </Box>
      </FlexBetween>

      <Box
        mt="20px"
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gap="20px"
        sx={{
          "& > div": { gridColumn: isNonMediumScreens ? undefined : "span 12" },
        }}
      >
        {/* First row - Stats and Pie Chart */}
        <Box
          gridColumn="span 4"
          display="grid"
          gridTemplateColumns="repeat(2, 1fr)"
          gap="20px"
        >
          <StatBox
            title="Total Customers"
            value={users && totalUsers}
            increase="+14%"
            description="Since last month"
            icon={
              <PersonAdd
                sx={{ color: theme.palette.secondary[300], fontSize: "26px" }}
              />
            }
          />
          <StatBox
            title="Total Sales"
            value={users && totalServices}
            increase="+21%"
            description="Since last month"
            icon={
              <PointOfSale
                sx={{ color: theme.palette.secondary[300], fontSize: "26px" }}
              />
            }
          />
          <StatBox
            title="Monthly Sales"
            value={users && totalUsers}
            increase="+5%"
            description="Since last month"
            icon={
              <Email
                sx={{ color: theme.palette.secondary[300], fontSize: "26px" }}
              />
            }
          />
          <StatBox
            title="Yearly Sales"
            value={users && 100}
            increase="+43%"
            description="Since last year"
            icon={
              <Traffic
                sx={{ color: theme.palette.secondary[300], fontSize: "26px" }}
              />
            }
          />
        </Box>

        {/* Pie Chart */}
        <Box
          gridColumn="span 8"
          backgroundColor={theme.palette.background.alt}
          p="1.5rem"
          borderRadius="0.55rem"
        >
          <Typography variant="h6" sx={{ color: theme.palette.secondary[100] }}>
            Sales By Category
          </Typography>
          <BreakdownChart isDashboard={true} />
          <Typography
            p="0 0.6rem"
            fontSize="1rem"
            sx={{ color: theme.palette.secondary[200] }}
          >
            Breakdown of real states and information via category for revenue
            made for this year and total sales.
          </Typography>
        </Box>

        {/* Line Chart - Full Width */}
        <Box
          
          gridColumn="span 12"
          gridRow="span 2"
          height="400px"
          backgroundColor={theme.palette.background.alt}
          p="1rem"
          borderRadius="0.55rem"
          mb="3rem"
          letterSpacing="0.3px"        >
          <Typography variant="h6" sx={{ color: theme.palette.secondary[100] }}>
            Revenue & Profit Overview
          </Typography>
          <Box height="100%">  
            <OverviewChart isDashboard={true} />
          </Box>
          <Typography
            p="0 0.6rem"
            fontSize="1rem"
            sx={{ color: theme.palette.secondary[200] }}
          >
            Monthly revenue and profit trends showing the overall financial performance 
            across different time periods. The chart highlights seasonal patterns and 
            year-over-year growth in sales.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default ResellerDashboard;


