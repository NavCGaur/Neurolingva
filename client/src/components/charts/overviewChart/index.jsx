import React, { useMemo } from "react";
import { ResponsiveLine } from "@nivo/line";
import { useTheme } from "@mui/material";
//import { useGetAllUsersQuery } from "../../../state/api";

const OverviewChart = ({ isDashboard = false }) => {
  const theme = useTheme();
  //const { data, isLoading, isError } = useGetAllUsersQuery();

    // Dummy Sales Data
    const dummyData = [
      { month: "Jan", totalSales: 56 },
      { month: "Feb", totalSales: 50 },
      { month: "Mar", totalSales: 91 },
      { month: "Apr", totalSales: 165 },
      { month: "May", totalSales: 104 },
      { month: "Jun", totalSales: 123 },
      { month: "Jul", totalSales: 254 },
      { month: "Aug", totalSales: 58 },
      { month: "Sep", totalSales: 95 },
      { month: "Oct", totalSales: 145 },
      { month: "Nov", totalSales: 88 },
      { month: "Dec", totalSales: 245 },
    ];

  const chartData = useMemo(() => {

    /*if (!data) return [];
    if (!Array.isArray(data)) {
      console.error("Expected an array but received:", data);
      return [];
    }
    // Initialize the line configuration
    const totalSalesLine = {
      id: "totalSales",
      color: theme.palette.secondary.main,
      data: []
    };
    

    // Calculate cumulative sales
    let cumulativeTotal = 0;
    totalSalesLine.data = data.map(({ month, totalSales }) => {
      cumulativeTotal += totalSales;
      return {
        x: month,
        y: cumulativeTotal
      };
    });
    */

    let cumulativeTotal = 0;

    const totalSalesLine = {
      id: "totalSales",
      color: theme.palette.secondary.main,
      data: dummyData.map(({ month, totalSales }) => {
        cumulativeTotal += totalSales;
        return { x: month, y: cumulativeTotal };
      }),
    };
    return [totalSalesLine];
  }, [dummyData, theme.palette.secondary.main]);

 // if (isLoading || !data) return "Loading...";
  //if (isError) return "Error loading data.";

  return (
    <ResponsiveLine
      data={chartData}
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
      margin={{ top: 20, right: 50, bottom: 50, left: 70 }}
      xScale={{ type: "point" }}
      yScale={{
        type: "linear",
        min: "auto",
        max: "auto",
        stacked: false,
        reverse: false,
      }}
      yFormat=" >-.2f"
      curve="catmullRom"
      enableArea={isDashboard}
      axisTop={null}
      axisRight={null}
      axisBottom={{
        format: (v) => {
          if (isDashboard) return v.slice(0, 3);
          return v;
        },
        orient: "bottom",
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: isDashboard ? "" : "Month",
        legendOffset: 36,
        legendPosition: "middle",
      }}
      axisLeft={{
        orient: "left",
        tickValues: 5,
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: isDashboard ? "" : `Total Revenue for Year`,
        legendOffset: -60,
        legendPosition: "middle",
      }}
      enableGridX={false}
      enableGridY={false}
      pointSize={10}
      pointColor={{ theme: "background" }}
      pointBorderWidth={2}
      pointBorderColor={{ from: "serieColor" }}
      pointLabelYOffset={-12}
      useMesh={true}
      legends={
        !isDashboard
          ? [
              {
                anchor: "bottom-right",
                direction: "column",
                justify: false,
                translateX: 30,
                translateY: -40,
                itemsSpacing: 0,
                itemDirection: "left-to-right",
                itemWidth: 80,
                itemHeight: 20,
                itemOpacity: 0.75,
                symbolSize: 12,
                symbolShape: "circle",
                symbolBorderColor: "rgba(0, 0, 0, .5)",
                effects: [
                  {
                    on: "hover",
                    style: {
                      itemBackground: "rgba(0, 0, 0, .03)",
                      itemOpacity: 1,
                    },
                  },
                ],
              },
            ]
          : undefined
      }
    />
  );
};

export default OverviewChart;