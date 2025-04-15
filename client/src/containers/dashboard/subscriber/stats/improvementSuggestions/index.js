import React from 'react';
import { Card, CardContent, Typography, Box, List, ListItem, ListItemIcon, ListItemText, Divider } from '@mui/material';
import { 
  TipsAndUpdates as TipsIcon,
  Schedule as ScheduleIcon,
  RepeatOn as RepeatIcon,
  MilitaryTech as AchievementIcon,
  EmojiObjects as InsightIcon
} from '@mui/icons-material';

const ImprovementSuggestions = ({ stats }) => {
  // Generate personalized suggestions based on stats
  const getSuggestions = () => {
    const suggestions = [];
    
    // Suggestion based on review frequency
    if (stats?.daysSinceLastReview > 3) {
      suggestions.push({
        icon: <ScheduleIcon color="warning" />,
        title: "Review More Frequently",
        description: "It's been over 3 days since your last review. Regular practice improves retention by up to 70%. Try to review at least every 2-3 days."
      });
    }
    
    // Suggestion based on vocabulary size
    if (stats?.totalWords < 50) {
      suggestions.push({
        icon: <RepeatIcon color="info" />,
        title: "Expand Your Vocabulary",
        description: "Add more words to reach the critical threshold of 100 common words, which typically covers 50% of daily conversations."
      });
    } else if (stats?.totalWords < 500) {
      suggestions.push({
        icon: <RepeatIcon color="info" />,
        title: "Keep Building Your Vocabulary",
        description: "You're making good progress! Aim for 1000-2000 words to reach conversational fluency."
      });
    }
    
    // Suggestion based on recall score
    if (stats?.averageRating < 3) {
      suggestions.push({
        icon: <AchievementIcon color="error" />,
        title: "Focus on Reinforcement",
        description: "Your average recall score is below 3. Try using spaced repetition and active recall techniques to strengthen memory connections."
      });
    } else if (stats?.averageRating >= 4) {
      suggestions.push({
        icon: <AchievementIcon color="success" />,
        title: "Challenge Yourself",
        description: "Great recall score! Try using these words in sentences or conversations to maintain your strong recall."
      });
    }
    
    // General suggestions if not enough specific ones
    if (suggestions.length < 2) {
      suggestions.push({
        icon: <InsightIcon color="primary" />,
        title: "Mix Learning Methods",
        description: "Combine visual, auditory, and kinesthetic learning by watching videos, listening to audio, and writing/speaking the language."
      });
    }
    
    return suggestions;
  };

  const suggestions = getSuggestions();

  return (
    <Card sx={{ bgcolor: '#f5f9fc', boxShadow: 2, borderRadius: 2 }}>
      <CardContent>
        <Box display="flex" alignItems="center" mb={2}>
          <TipsIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="h5" fontWeight="500">
            Personalized Improvement Tips
          </Typography>
        </Box>
        
        <Divider sx={{ mb: 2 }} />
        
        <List>
          {suggestions.map((suggestion, index) => (
            <React.Fragment key={index}>
              <ListItem alignItems="flex-start" sx={{ py: 1 }}>
                <ListItemIcon>
                  {suggestion.icon}
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="subtitle1" fontWeight="500">
                      {suggestion.title}
                    </Typography>
                  }
                  secondary={suggestion.description}
                />
              </ListItem>
              {index < suggestions.length - 1 && <Divider variant="inset" component="li" />}
            </React.Fragment>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

export default ImprovementSuggestions;

