import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Card, CardContent, Typography, Button, Collapse } from '@mui/material';
import { useSubmitRatingsMutation } from '../../../state/api/vocabApi'; // RTK Query hook

const VocabCard = () => {
  const words = useSelector(state => state.vocab.words);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showDetails, setShowDetails] = useState(false);
  const [ratings, setRatings] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const userId = useSelector((state) => state.auth?.user?.uid); // 🔹 Get logged in user's ID
  

  const [submitRatings, { isLoading, isSuccess, isError }] = useSubmitRatingsMutation();

  if (!words || words.length === 0) {
    return (
      <Typography textAlign="left" mt={4} fontSize={20}>
        📚✨ <strong>All Caught Up!</strong> <br />
        No words to review right now — keep up the good work! 🌟
      </Typography>
    );
  }
  
  const current = words[currentIndex];
  const isLastCard = currentIndex === words.length - 1;

  const handleCardClick = () => setShowDetails(!showDetails);

  const handleRating = (level) => {
    setRatings(prev => ({ ...prev, [current.word]: level }));
  };

  const handleNext = () => {
    if (ratings[current.word] === undefined) return; // Prevent skipping without rating
    setShowDetails(false);
    setCurrentIndex(prev => prev + 1);
  };


  console.log("userId in vocabcard", userId);

  const handleSubmit = async () => {
    const ratingsArray = Object.entries(ratings).map(([word, rating]) => ({ word, rating }));
    console.log("userId in vocabcard handlesubmit", userId);
    try {
      await submitRatings({ userId, ratings: ratingsArray }).unwrap();
      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting ratings:', error);
    }
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" gap={3} >
      <Card
        sx={{ width: 320, minHeight: 400, background: '#176DC2', cursor: 'pointer' }}
        onClick={handleCardClick} 
      >
        <CardContent sx={{ p: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
          <Box sx={{ borderBottom: '1px solid rgba(0,0,0,0.1)', pb: 1 }}>
            <Typography variant="h3" align="center">{current.word}</Typography>
          </Box>

          <Box sx={{ flexGrow: 1, overflowY: 'auto',   scrollbarWidth: 'none', '&::-webkit-scrollbar': { display: 'none' } }}>
            <Collapse in={showDetails}>
              <Box mt={1}>
                <Typography variant="h6"><b>Definition:</b></Typography>
                <Typography textAlign={'left'} mt={1}>{current.definition}</Typography>

                {current.exampleSentence && (
                  <>
                    <Typography variant="h6" mt={2}><b>Example:</b></Typography>
                    <Typography fontStyle="italic">"{current.exampleSentence}"</Typography>
                  </>
                )}

                <Box display="flex" gap={2} mt={2}>
                  {current.partOfSpeech && <Typography><b>Part:</b> {current.partOfSpeech}</Typography>}
                  {current.difficulty && <Typography><b>Level:</b> {current.difficulty}/5</Typography>}
                </Box>

                <Box mt={2}>
                  <Typography><b>How well did you remember this word?</b></Typography>
                  <Box display="flex" gap={1} mt={1}>
                  <Button
                    variant={ratings[current.word] === 5 ? 'contained' : 'outlined'}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRating(5);
                    }}
                  >
                    Easy 😎
                  </Button>
                  <Button
                    variant={ratings[current.word] === 3 ? 'contained' : 'outlined'}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRating(3);
                    }}
                  >
                    Average 😊
                  </Button>
                  <Button
                    variant={ratings[current.word] === 1 ? 'contained' : 'outlined'}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRating(1);
                    }}
                  >
                    Difficult 😕
                  </Button>


                  </Box>
                </Box>
              </Box>
            </Collapse>

            {!showDetails && (
              <Box height="100%" display="flex" alignItems="center" justifyContent="center">
                <Typography variant="body2" fontStyle="italic" color="text.secondary">
                  Click to reveal details
                </Typography>
              </Box>
            )}
          </Box>
        </CardContent>
      </Card>

      {showDetails && !isLastCard && (
        <Button
          variant="contained"
          onClick={handleNext}
          disabled={ratings[current.word] === undefined}
        >
          Next
        </Button>
      )}

      {isLastCard && showDetails && !submitted && (
        <Button
          variant="contained"
          color="success"
          onClick={handleSubmit}
          disabled={isLoading || ratings[current.word] === undefined}
        >
          {isLoading ? 'Submitting...' : 'Finish & Submit'}
        </Button>
      )}

      {submitted && isSuccess && (
        <Typography color="success.main" sx={{ fontSize: "2rem", fontWeight: "bold" }}>Practice submitted successfully!</Typography>
      )}
      {isError && (
        <Typography color="error.main">Error submitting ratings.</Typography>
      )}
    </Box>
  );
};

export default VocabCard;
