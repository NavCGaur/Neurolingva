import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Paper, 
  Typography, 
  List, 
  ListItem, 
  ListItemText, 
  Divider, 
  Box, 
  CircularProgress,
  Chip
} from '@mui/material';
import { useGetHistoryQuery } from '../../../state/api/speechApi';

const PracticeHistory = () => {
  const { data, isLoading, error } = useGetHistoryQuery();
  const navigate = useNavigate();
  
  const handleItemClick = (id) => {
    navigate(`/analysis/${id}`);
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };
  
  // Get color based on score
  const getScoreColor = (score) => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    return 'error';
  };

  if (isLoading) {
    return (
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2, mt: 3, textAlign: 'center' }}>
        <CircularProgress />
      </Paper>
    );
  }

  if (error) {
    return (
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2, mt: 3 }}>
        <Typography color="error">
          Error loading history: {error.data?.message || 'Unknown error'}
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2, mt: 3 }}>
      <Typography variant="h5" gutterBottom>
        Practice History
      </Typography>
      
      {data?.history?.length > 0 ? (
        <List>
          {data.history.map((item, index) => (
            <React.Fragment key={item._id}>
              {index > 0 && <Divider />}
              <ListItem 
                button 
                onClick={() => handleItemClick(item._id)}
                sx={{ py: 2 }}
              >
                <ListItemText
                  primary={item.referenceText.length > 50 ? 
                    item.referenceText.substring(0, 50) + '...' : 
                    item.referenceText}
                  secondary={formatDate(item.timestamp)}
                />
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Chip 
                    label={`Score: ${Math.round(item.pronunciationScore)}%`}
                    color={getScoreColor(item.pronunciationScore)}
                    size="small"
                  />
                  <Chip 
                    label={`WER: ${(item.wer * 100).toFixed(1)}%`}
                    color={item.wer < 0.2 ? 'success' : 'warning'}
                    size="small"
                    variant="outlined"
                  />
                </Box>
              </ListItem>
            </React.Fragment>
          ))}
        </List>
      ) : (
        <Typography variant="body1">
          No practice history yet. Start recording to build your history!
        </Typography>
      )}
    </Paper>
  );
};

export default PracticeHistory;