import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import FlexBetween from "../../../../components/flexbetween";
import Header from "../../../../components/header";
import { useGetPracticeWordsQuery } from '../../../../state/api/vocabApi';
import { setWords } from '../../../../state/slices/vocabSlice';
import VocabCard from '../../../vocabCard/vocabCard';
import SpeechShadowingPractice from "../../../speechShadow/speechShadowPractice";

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
import LockIcon from "@mui/icons-material/Lock";

import VocabQuizMain from "../../../vocabQuiz/VocabQuizMain";
import { Home } from "@mui/icons-material";
import HomePage from "../../../speech/homePageSpeech";
import GrammerQuizMain from "../../../grammerQuiz/GrammerQuizMain";
import StatsOverview from "../stats/statsOverview";

const GuestDashboard = () => {
  const theme = useTheme();
  const isNonMediumScreens = useMediaQuery("(min-width: 1200px)");
  const isMobile = useMediaQuery("(max-width: 600px)");
  const dispatch = useDispatch();
  const [selectedFeature, setSelectedFeature] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();



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


  // Get feature from URL if present
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const featureParam = params.get('feature');
    if (featureParam) {
      // Convert URL format back to feature ID (e.g., "speech-shadow" to "speech shadow")
      setSelectedFeature(featureParam.replace("-", " "));
    }
  }, [location]);


  // Feature cards data
  const featureCards = [
    {
      id: "vocabulary",
      title: "Basic Spaced Repetition",
      subtitle: "Review your daily words",
      gradient: '#176DC2',
      isLocked: false,


    },
   

    {
      id: "quiz",
      title: "Daily Vocab Quiz",
      subtitle: "Test your Vocabulary",
      gradient: '#176DC2',
      isLocked: false,

    },
    
    {
      id: "grammar",
      title: "Grammar Practice Quiz",
      subtitle: "Master the rules",
      gradient: '#176DC2',
      isLocked: false,

    },
    {
      id: "speech",
      title: "Pronounciation/ Accent Feedback ",
      subtitle: "Improve your pronunciation",
      gradient: '#176DC2',
      isLocked: false,

    },

     // Premium features
     {
      id: "ai feedback",
      title: "AI powered Pronounciation/ Accent Feedback",
      subtitle: "Master Pronunciation with AI feeback",
      isLocked: true,
      lockedText: "Unlock with PRO! SUBSCRIBE",
      lockedTooltip: "Subscribe to unlock this premium feature",
      gradient: '#176DC2',

    },
     {
      id: "speech shadow",
      title: "Speech Shadowing",
      subtitle: "Master Native Pronunciation",
      isLocked: true,
      lockedText: "Unlock with PRO! SUBSCRIBE",
      lockedTooltip: "Subscribe to unlock this premium feature",
      gradient: '#176DC2',

    },
    {
      id: "praat graph",
      title: "AI powered Spectrograms",
      subtitle: "Praat Graph highlighting mispronounciation",
      isLocked: true,
      lockedText: "Unlock with PRO! SUBSCRIBE",
      lockedTooltip: "Subscribe to unlock this premium feature",
      gradient: '#176DC2',

    },
    
  ];

 // Modify handleFeatureSelect to update the URL
  const handleFeatureSelect = (featureId) => {
    setSelectedFeature(featureId);
    // Update URL without full page reload
    const featureParam = featureId.replace(" ", "-");
    window.history.pushState({}, "", `/guest/dashboard?feature=${featureParam}`);
  };

  const renderFeatureContent = () => {
    if (!selectedFeature) return null;

    switch (selectedFeature) {
      case "vocabulary":
        return (
          <Box width="100%" sx={{         background: "linear-gradient(135deg,#1E91FF, #EDF9FF)",
            textAlign: "center", p: 3 }}>
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
      case "speech shadow":
        return (
          <Box width="100%" textAlign="center" p={3}>
            <SpeechShadowingPractice />  
          </Box>
        );
      case "quiz":
        return (
          <Box width="100%" textAlign="center" p={3}>
            <VocabQuizMain/>
          </Box>
        );
      case "grammar":
        return (
          <Box width="100%" textAlign="center" p={3}>          
            <GrammerQuizMain />
          </Box>
        );
      case "statsoverview":
        return (
          <Box width="100%" textAlign="center" p={3}>          
          <StatsOverview />
        </Box>
      ) 
      
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
          Welcome! Explore new features and enhance your experience.
          </Typography>
    } 
   
      />
      </FlexBetween>

      <Box mt="20px">
        {selectedFeature ? (
          <Box
            mt={2}
            p={3}
            borderRadius={2}
            boxShadow={3}
            color={"#13315c"}
            sx={{
              background: "linear-gradient(135deg,#1E91FF, #EDF9FF)",

            }}
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
              <Grid item xs={12} sm={6} md={3} key={card.id} >

                {card.isLocked ?
                <Card
                  onClick={() => card.isLocked && navigate("/pricing")}
                  sx={{
                    height: 220,
                    width: { xs: '100%', sm: 300, md: 320 }, // Fixed widths per breakpoint
                    minWidth: 280, // Absolute minimum
                    maxWidth: '100%', // Never exceed container
                    cursor: card.isLocked ? "pointer" : "default",
                    position: "relative",
                    background: card.gradient,
                    opacity: card.isLocked ? 0.7 : 1,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    textAlign: "center",
                    p: 2,
                    "&:hover": {
                      transform: card.isLocked ? "scale(1.02)" : "none",
                      boxShadow: card.isLocked ? theme.shadows[4] : "none",
                    },
                    transition: "all 0.3s ease",
                  }}
                >
                  <Typography variant="h6" sx={{ color: "#fff", mb: 1 }}>
                    {card.title}
                  </Typography>
                  
                  {card.isLocked && (
                    <>
                      <LockIcon sx={{ 
                        color: "#fff", 
                        fontSize: "2rem",
                        mb: 1 
                      }} />
                      <Typography
                        variant="subtitle1"
                        sx={{
                          color: "#fff",
                          fontWeight: "bold",
                          fontSize: "1.1rem",
                        }}
                      >
                        {card.lockedText}
                      </Typography>
                    </>
                  )}
                </Card>
                      
                :
                <Card
                  sx={{
                    height: 220,
                    width: { xs: '100%', sm: 300, md: 320 }, // Fixed widths per breakpoint
                    minWidth: 280, // Absolute minimum
                    maxWidth: '100%', // Never exceed container
                    background: card.gradient,
                    backdropFilter: "blur(16px)",
                    border: "1px solid rgba(255, 255, 255, 0.125)",
                    boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
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
                </Card>}
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Box>
  );
};

export default GuestDashboard;