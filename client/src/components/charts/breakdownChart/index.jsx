import React from "react";
import { ResponsivePie } from "@nivo/pie";
import { Box, Typography, useTheme } from "@mui/material";
//import { useGetAllUsersQuery } from '../../../state/api';

const BreakdownChart = ({ isDashboard = false }) => {
    
  const theme = useTheme();

  //const { data, isLoading, isError } = useGetAllUsersQuery();
  //if (!data || isLoading) return "Loading...";
  //if (isError) return "Error loading data.";

  // Dummy User Data
  const dummyData = {
    salesByCategory: {
      Resellers: 165,
      Agency: 480,
      Clients: 854,      
    },
    yearlySalesTotal: 1785,
  };


  const colors = [
    theme.palette.secondary[600],
    theme.palette.secondary[500],
    theme.palette.secondary[300],
    theme.palette.secondary[800],
    theme.palette.secondary[100], 
    theme.palette.secondary[200],
  ];
  const formattedData = Object.entries(dummyData.salesByCategory).map(
    ([category, sales], i) => ({
      id: category,
      label: category,
      value: sales,
      color: colors[i],
    })
  );

  return (
    <Box
      height={isDashboard ? "400px" : "100%"}
      width={undefined}
      minHeight={isDashboard ? "325px" : undefined}
      minWidth={isDashboard ? "325px" : undefined}
      position="relative"
    >
      <ResponsivePie
        data={formattedData}
        theme={{
          axis: {
            domain: {
              line: {
                stroke: theme.palette.secondary[200],
              },
            },
            legend: {
              text: {
                fill: theme.palette.secondary[200],
              },
            },
            ticks: {
              line: {
                stroke: theme.palette.secondary[200],
                strokeWidth: 1,
              },
              text: {
                fill: theme.palette.secondary[200],
              },
            },
          },
          legends: {
            text: {
              fill: theme.palette.secondary[200],
            },
          },
          tooltip: {
            container: {
              color: theme.palette.primary.main,
            },
          },
        }}
        colors={{ datum: "data.color" }}
        margin={
          isDashboard
            ? {  top: 20,  bottom: 80, left: 120 }
            : { top:20,  bottom: 60, left: 120 }
        }
        sortByValue={true}
        innerRadius={0.45}
        activeOuterRadiusOffset={8}
        borderWidth={1}
        borderColor={{
          from: "color",
          modifiers: [["darker", 0.2]],
        }}
        enableArcLinkLabels={!isDashboard}
        arcLinkLabelsTextColor={theme.palette.secondary[200]}
        arcLinkLabelsThickness={2}
        arcLinkLabelsColor={{ from: "color" }}
        arcLabelsSkipAngle={10}
        arcLabelsTextColor={{
          from: "color",
          modifiers: [["darker", 2]],
        }}
        legends={[
          {
            anchor: "left",
            direction: "column",
            justify: false,
            itemsSpacing: 16,
            itemWidth: 85,
            itemHeight: 24,
            itemTextColor: "#999",
            itemDirection: "left-to-right",
            itemOpacity: 1,
            symbolSize: 18,
            symbolShape: "circle",
            effects: [
              {
                on: "hover",
                style: {
                  itemTextColor: theme.palette.primary[500],
                },
              },
            ],
          },
        ]}
      />
      <Box
        position="absolute"
        top="50%"
        left="52%"
        color={theme.palette.secondary[400]}
        textAlign="center"
        pointerEvents="none"
        sx={{
          transform: isDashboard
            ? "translate(50%, -180%)"
            :"translate(50%, -180%)",
        }}
      >
        <Typography variant="h6">
          {!isDashboard && "Total:"} ${dummyData.yearlySalesTotal}
        </Typography>
      </Box>
    </Box>
  );
};

export default BreakdownChart;