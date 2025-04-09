import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import FlexBetween from "../../../../components/flexbetween";
import Header from "../../../../components/header";
import { useGetPracticeWordsQuery } from '../../../../state/api/vocabApi';
import { setWords } from '../../../../state/slices/vocabSlice';
import VocabCard from '../../../../components/cards/vocabCard/vocabCard';

import {
  Box,
  useTheme,
  useMediaQuery,
  Typography,
  CircularProgress,
  Card, 
  CardContent,
  Grid,
} from "@mui/material";
import QuizMain from "../../../quiz/QuizMain";
import { Home } from "@mui/icons-material";
import HomePage from "../../../speech/homePageSpeech";

const GuestDashboard = () => {
  const theme = useTheme();
  const isNonMediumScreens = useMediaQuery("(min-width: 1200px)");
  const isMobile = useMediaQuery("(max-width: 600px)");
  const dispatch = useDispatch();
  const [selectedFeature, setSelectedFeature] = useState(null);

  const userId = useSelector((state) => state.auth?.user?.uid);

  const { data: words, isLoading } = useGetPracticeWordsQuery(userId, {
    skip: !userId,
  });  

  useEffect(() => {
    if (words) {
      console.log("words:", words);
      dispatch(setWords(words));
    }
  }, [words, dispatch]);

  // Feature cards data
  const featureCards = [
    {
      id: "vocabulary",
      title: "Vocabulary Practice",
      subtitle: "Review your daily words",
      gradient: 'linear-gradient(to right,rgb(119, 176, 228),rgb(118, 178, 234))',
    },
    {
      id: "speech",
      title: "Speech Practice",
      subtitle: "Improve your pronunciation",
      gradient: 'linear-gradient(to right, #c4e0a6, #8bc34a)',
    },
    {
      id: "quiz",
      title: "Daily Quiz",
      subtitle: "Test your knowledge",
      gradient: 'linear-gradient(to right, #ffcc80, #ff9800)',
    },
    {
      id: "grammar",
      title: "Grammar Practice",
      subtitle: "Master the rules",
      gradient: 'linear-gradient(to right, #ce93d8, #9c27b0)',
    },
  ];

  const handleFeatureSelect = (featureId) => {
    setSelectedFeature(featureId);
  };

  const renderFeatureContent = () => {
    if (!selectedFeature) return null;

    switch (selectedFeature) {
      case "vocabulary":
        return (
          <Box width="100%">
            <Typography variant="h6" mb={2}>
              Tap each word to reveal details and rate your recall
            </Typography>
            {isLoading ? (
              <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                <CircularProgress />
              </Box>
            ) : (
              <VocabCard userId={userId} />
            )}
          </Box>
        );
      case "speech":
        return (
          <Box width="100%" textAlign="center" p={3}>
            <HomePage />  
          </Box>
        );
      case "quiz":
        return (
          <Box width="100%" textAlign="center" p={3}>
            <QuizMain />
          </Box>
        );
      case "grammar":
        return (
          <Box width="100%" textAlign="center" p={3}>
            <Typography variant="h6">Grammar Practice Feature</Typography>
            <Typography variant="body1" mt={2}>Coming soon! Learn and practice grammar rules.</Typography>
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Box m={isMobile ? "1rem" : "1.5rem 2.5rem"}>
      <FlexBetween flexDirection={isMobile ? "column" : "row"} gap={isMobile ? "1rem" : "0"}>
      <Header 
    title={
        <Typography variant="h4" sx={{ color: "#13315C", fontWeight: "bold", fontSize: "2rem" }}>
            GUEST DASHBOARD
        </Typography>
    } 
    subtitle={
        <Typography variant="subtitle1" sx={{ color: "#13315C" }}>
            Welcome to your dashboard
        </Typography>
    } 
/>
      </FlexBetween>

      <Box mt="20px">
        {selectedFeature ? (
          <Box
            mt={4}
            p={3}
            borderRadius={2}
            bgcolor="#eaf4f4" // Directly using the desired color 
            boxShadow={3}
            color={"#13315c"}
          >
            <Box>
                <Typography variant="h4" sx={{ color: "#13315C", fontWeight: "bold" }}>
                    {featureCards.find(card => card.id === selectedFeature)?.title}
                </Typography>
                <Typography variant="subtitle1" sx={{ color: "#13315C" }}>
                    {featureCards.find(card => card.id === selectedFeature)?.subtitle}
                </Typography>
            </Box>

            {renderFeatureContent()}
          </Box>
        ) : (
          <Grid container spacing={3} mt={2}>
            {featureCards.map((card) => (
              <Grid item xs={12} sm={6} md={3} key={card.id}>
                <Card
                  sx={{
                    height: 220,
                    background: card.gradient,
                    boxShadow: 4,
                    cursor: 'pointer',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: 6,
                    },
                  }}
                  onClick={() => handleFeatureSelect(card.id)}
                >
                  <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', p: 3 }}>
                    <Typography variant="h5" component="div" fontWeight="bold" textAlign="center" mb={1} color="#eaf4f4">
                      {card.title}
                    </Typography>
                    <Typography variant="body1" color="#eaf4f4" textAlign="center" >
                      {card.subtitle}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Box>
  );
};

export default GuestDashboard;