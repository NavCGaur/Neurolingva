import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

const StatsCard = ({ title, value, icon, color, description }) => {
  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        bgcolor: color,
        color: 'white',
        boxShadow: 3,
        borderRadius: 2,
        transition: 'transform 0.3s',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: 6
        }
      }}
    >
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" fontWeight="bold">
            {title}
          </Typography>
          <Box sx={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.2)', 
            borderRadius: '50%', 
            p: 1,
            display: 'flex'
          }}>
            {icon}
          </Box>
        </Box>
        <Typography variant="h4" fontWeight="bold" mb={1}>
          {value}
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.7 }}>
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
