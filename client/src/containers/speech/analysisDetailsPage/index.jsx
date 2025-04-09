import React from 'react';
import { Container } from '@mui/material';
import AnalysisDetail from '../analysisDetails';

const AnalysisDetailsPage = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <AnalysisDetail />
    </Container>
  );
};

export default AnalysisDetailsPage;