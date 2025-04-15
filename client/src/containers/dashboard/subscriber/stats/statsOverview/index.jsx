import React from 'react';
import { useSelector } from 'react-redux';
import { Grid, Card, CardContent, Typography, Box } from '@mui/material';
import { 
  School as SchoolIcon, 
  Today as TodayIcon, 
  Update as UpdateIcon, 
  Star as StarIcon 
} from '@mui/icons-material';
import { useGetUserStatsQuery } from '../../../../../state/api/statsApi';
import { CircularProgress } from '@mui/material';
import StatsCard from '../StatsCard';
import ImprovementSuggestions from '../improvementSuggestions';

const StatsOverview = () => {

  const userId = useSelector((state) => state.auth?.user?.uid);
  
  const { data: stats, isLoading, error } = useGetUserStatsQuery(userId, { skip: !userId });

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Card sx={{ p: 2, bgcolor: '#ffebee' }}>
        <Typography color="error">Failed to load stats: {error.message || 'Unknown error'}</Typography>
      </Card>
    );
  }

  const statsData = [
    {
      title: 'Total Words Learned',
      value: stats?.totalWords || 0,
      icon: <SchoolIcon />,
      color: '#176DC2',
      description: 'Words in your vocabulary'
    },
    {
      title: 'Days Since Review',
      value: stats?.daysSinceLastReview || 0,
      icon: <TodayIcon />,
      color: '#176DC2',
      description: 'Since your last study session'
    },
    {
      title: 'Next Review',
      value: stats?.nextReviewDate ? new Date(stats.nextReviewDate).toLocaleDateString() : 'Not set',
      icon: <UpdateIcon />,
      color: '#176DC2',
      description: 'Upcoming review date'
    },
    {
      title: 'Average Recall Score',
      value: stats?.averageRating?.toFixed(1) || '0.0',
      icon: <StarIcon />,
      color: '#176DC2',
      description: 'Your average word rating (0-5)'
    }
  ];

  return (
    <Box sx={{ flexGrow: 1, p: 2 }}>
      <Typography variant="h4" gutterBottom>
        Learning Statistics
      </Typography>
      <Grid container spacing={3}>
        {statsData.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <StatsCard {...stat} />
          </Grid>
        ))}
      </Grid>

      <Box mt={4}>
        <ImprovementSuggestions stats={stats} />
      </Box>
    </Box>
  );
};

export default StatsOverview;
