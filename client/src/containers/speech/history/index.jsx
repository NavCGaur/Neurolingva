import React from 'react';
import { Container, Typography } from '@mui/material';
import PracticeHistory from '../practiceHistory';

const History = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Typography variant="h4" gutterBottom>
        Practice History
      </Typography>
      
      <Typography variant="body1" color="text.secondary" paragraph>
        View your pronunciation practice history and track your progress over time.
      </Typography>
      
      <PracticeHistory />
    </Container>
  );
};

export default History;