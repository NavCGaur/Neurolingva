import React from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  Box, 
  styled 
} from '@mui/material';

const StyledCard = styled(Card)(({ theme }) => ({
  maxWidth: 345,
  borderRadius: '12px',
  background:'linear-gradient(to right,rgb(187, 216, 243),rgb(142, 180, 215))',
  boxShadow: '0 8px 24px rgba(149, 157, 165, 0.2)',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 12px 28px rgba(149, 157, 165, 0.3)',
  },
}));

const LightBlueButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#e3f2fd',
  color: '#1976d2',
  padding: '8px 16px',
  borderRadius: '8px',
  fontWeight: 600,
  textTransform: 'none',
  '&:hover': {
    backgroundColor: '#bbdefb',
    boxShadow: '0 2px 4px rgba(25, 118, 210, 0.2)',
  },
}));

const CardTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  marginBottom: '8px',
  color: '#424242',
}));

const CardDescription = styled(Typography)(({ theme }) => ({
  color: '#616161',
  marginBottom: '16px',
  fontSize: '0.875rem',
}));

const ModernCard = ({
  title,
  description,
  buttonText,
  onButtonClick,
}) => {
  return (
    <StyledCard>
    
      <CardContent sx={{ padding: '16px 20px' }}>
        <CardTitle variant="h6">{title}</CardTitle>
        <CardDescription variant="body2">
          {description}
        </CardDescription>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <LightBlueButton 
            variant="contained" 
            disableElevation
            onClick={onButtonClick}
          >
            {buttonText}
          </LightBlueButton>
        </Box>
      </CardContent>
    </StyledCard>
  );
};

export default ModernCard;