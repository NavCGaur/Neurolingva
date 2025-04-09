import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import FlexBetween from "../flexbetween";

const StatBox = ({ title, value, increase, icon, description }) => {
  const theme = useTheme();

  return (
    <Box
      gridColumn="span 2"
      gridRow="span 1"
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      p="1.5rem"
      flex="1 1 100%"
      borderRadius="0.75rem"
      boxShadow={`0 2px 10px ${theme.palette.mode === 'dark' ? '#00000033' : '#ccc'}`}
      transition="transform 0.2s ease, box-shadow 0.2s ease"
      sx={{
        background:theme.palette.background.alt,
        
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: `0 4px 16px ${theme.palette.mode === 'dark' ? '#00000055' : '#bbb'}`,
        }
      }}
    >
      <FlexBetween>
        <Typography
          variant="subtitle1"
          fontWeight={500}
          color={theme.palette.secondary[100]}
        >
          {title}
        </Typography>
        {icon}
      </FlexBetween>

      <Typography
        variant="h4"
        fontWeight={600}
        mt="0.5rem"
        color={theme.palette.secondary[200]}
      >
        {value}
      </Typography>

      <FlexBetween gap="1rem" mt="0.75rem">
        <Typography
          variant="body1"
          fontStyle="italic"
          fontWeight={500}
          color={theme.palette.secondary.light}
        >
          {increase}
        </Typography>
        <Typography variant="body2" color={theme.palette.text.secondary}>
          {description}
        </Typography>
      </FlexBetween>
    </Box>
  );
};


export default StatBox;