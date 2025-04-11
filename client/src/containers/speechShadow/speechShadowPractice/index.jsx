import React, { useState, useEffect, useRef, useCallback } from 'react';
import { PitchDetector } from 'pitchy'; 
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  Paper, 
  CircularProgress, 
  Grid,
  Card,
  CardContent,
  Stack,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import * as Tone from 'tone';
import { useSpeechSynthesisQuery, useSubmitRecordingMutation } from '../../../state/api/speechShadowApi';
import PitchVisualizer from '../pitchVisualizer/index';
import useAudioRecorder from '../hooks/useAudioRecorder';
import usePitchDetection from '../hooks/usePitchDetection';
import { setPracticeText, setNativeAudio, setUserRecording } from '../../../state/slices/speechShadowSlice';

const SpeechShadowingPractice = () => {
  const dispatch = useDispatch();
  const { practiceText, nativeAudio } = useSelector((state) => state.speechShadow);
  const [inputText, setInputText] = useState(practiceText || '');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [pitchData, setPitchData] = useState({ native: [], user: [] });
  const [isNativeAudioLoaded, setIsNativeAudioLoaded] = useState(false);

  const pitchHistoryRef = useRef({ native: [], user: [] });
  
  const playerRef = useRef(null);
  const analyserRef = useRef(null);
  const startTimeRef = useRef(null);
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);
  
  const { startRecording, stopRecording, audioBlob, audioUrl } = useAudioRecorder();
  const { data: ttsData, isLoading, error } = useSpeechSynthesisQuery(practiceText, { skip: !practiceText });
  const [submitRecording, { isLoading: isSubmitting }] = useSubmitRecordingMutation();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Constants for pitch detection
  const MIN_PITCH = 70;  // Lower bound (e.g., very deep male voice)
  const MAX_PITCH = 500; // Upper bound (e.g., high female voice)
  const MIN_CLARITY = 0.5; // Minimum clarity threshold

  // Process raw pitch data for visualization
  const processPitchData = (pitch, clarity, time, type) => {
    console.log(`[Pitch Detection] Raw ${type} - Pitch: ${pitch}, Clarity: ${clarity}, Time: ${time}`);
    
    // Apply basic validation
    if (clarity < MIN_CLARITY || pitch < MIN_PITCH || pitch > MAX_PITCH) return null;
  
    // Add to history buffer (last 10 values)
    pitchHistoryRef.current[type] = [
      ...pitchHistoryRef.current[type].slice(-9),
      { pitch, time }
    ];
  
    // Calculate median of recent values to smooth spikes
    const sorted = [...pitchHistoryRef.current[type]].sort((a, b) => a.pitch - b.pitch);
    const medianPitch = sorted[Math.floor(sorted.length / 2)]?.pitch || pitch;
  
    // Only accept changes within reasonable range
    const lastPitch = pitchData[type][pitchData[type].length - 1]?.pitch || 0.5;
    const lastRawPitch = lastPitch * (MAX_PITCH - MIN_PITCH) + MIN_PITCH; // Convert back to Hz
    const maxChange = 50; // Maximum allowed Hz change between frames
    
    if (Math.abs(medianPitch - lastRawPitch) < maxChange) {
      // Normalize pitch to 0-1 range for visualization
      const normalizedPitch = (medianPitch - MIN_PITCH) / (MAX_PITCH - MIN_PITCH);
      // Clamp to ensure it stays within 0-1
      const clampedPitch = Math.min(1, Math.max(0, normalizedPitch));
      
      return {
        time: time - startTimeRef.current,
        pitch: clampedPitch
      };
    }
    
    return null;
  };

  // Pitch detection handler for user microphone
  const handlePitchDetected = useCallback(({ pitch, clarity, time }) => {
    const processedData = processPitchData(pitch, clarity, time, 'user');
    
    if (processedData) {
      setPitchData(prev => ({
        ...prev,
        user: [...prev.user, processedData]
      }));
    }
  }, []);
  
  const { start: startPitchDetection, stop: stopPitchDetection } = usePitchDetection(handlePitchDetected);

  useEffect(() => {
    if (ttsData?.audioUrl) {
      dispatch(setNativeAudio(ttsData.audioUrl));
      setupAudioPlayer(ttsData.audioUrl);
    }
  }, [ttsData, dispatch]);

  useEffect(() => {
    if (audioBlob && !isRecording) {
      dispatch(setUserRecording(audioUrl));
    }
  }, [audioBlob, audioUrl, isRecording, dispatch]);

  // Clean up resources on component unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (playerRef.current) {
        playerRef.current.dispose();
      }
    };
  }, []);

  const setupAudioPlayer = async (audioUrl) => {
    await Tone.start();
    setIsNativeAudioLoaded(false);
    
    try {
      // Explicitly load the buffer first
      const buffer = await Tone.Buffer.load(audioUrl);
      
      // Clean up existing player if there is one
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
      
      // Create player with pre-loaded buffer
      playerRef.current = new Tone.Player(buffer).toDestination();
      analyserRef.current = new Tone.Analyser("waveform", 2048);
      playerRef.current.connect(analyserRef.current);
      
      console.log("Native audio loaded successfully");
      setIsNativeAudioLoaded(true);
    } catch (err) {
      console.error("Error loading audio buffer:", err);
      setIsNativeAudioLoaded(false);
    }
  };

  const handleTextSubmit = () => {
    if (inputText.trim()) {
      dispatch(setPracticeText(inputText.trim()));
    }
  };

  // Handle playing native audio and extracting pitch data
  const handlePlayNative = async () => {
    console.log('Attempting to play native audio');

    if (!playerRef.current || !isNativeAudioLoaded) {
      console.error('Audio player not ready or audio not loaded');
      return;
    }
    
    try {
      await Tone.start();
      setIsPlaying(true);
      
      // Reset native pitch data
      setPitchData(prev => ({ ...prev, native: [] }));
      pitchHistoryRef.current.native = [];
      startTimeRef.current = Date.now();
      
      playerRef.current.start();
      console.log('Native audio playback started');
      
      // Setup native audio analyser
      const detector = PitchDetector.forFloat32Array(analyserRef.current.size);
      
      const detectPitch = () => {
        if (playerRef.current?.state === "started") {
          const currentTime = Date.now();
          
          // Get the data in the right format
          const data = analyserRef.current.getValue();
          // Ensure it's a proper Float32Array with correct values
          const floatData = new Float32Array(data.length);
          for (let i = 0; i < data.length; i++) {
            floatData[i] = data[i];
          }
          
          // Use the correct sample rate from Tone.js
          const [pitch, clarity] = detector.findPitch(floatData, Tone.context.sampleRate);
          
          const processedData = processPitchData(pitch, clarity, currentTime, 'native');
          
          if (processedData) {
            setPitchData(prev => ({
              ...prev,
              native: [...prev.native, processedData]
            }));
          }
          
          animationFrameRef.current = requestAnimationFrame(detectPitch);
        } else {
          setIsPlaying(false);
        }
      };
      
      animationFrameRef.current = requestAnimationFrame(detectPitch);
      
      playerRef.current.onstop = () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
        setIsPlaying(false);
      };
    } catch (err) {
      console.error('Error playing native audio:', err);
      setIsPlaying(false);
    }
  };

  const handleStartRecording = async () => {
    if (isRecording) return;
    
    // Reset data and set start time
    setPitchData({ native: [], user: [] });
    pitchHistoryRef.current = { native: [], user: [] };
    
    startTimeRef.current = Date.now();
    
    // Play native audio first
    await handlePlayNative();
    
    // Then start pitch detection and recording for user
    try {
      await startPitchDetection();
      startRecording();
      setIsRecording(true);
    } catch (err) {
      console.error('Failed to start pitch detection:', err);
    }
  };

  const handleStopRecording = () => {
    stopRecording();
    stopPitchDetection();
    setIsRecording(false);
    if (playerRef.current?.state === "started") {
      playerRef.current.stop();
    }
  };

  const handleSubmitForAnalysis = async () => {
    if (!audioBlob || !practiceText) return;
    
    const formData = new FormData();
    formData.append('audio', audioBlob);
    formData.append('text', practiceText);
    
    try {
      await submitRecording(formData).unwrap();
    } catch (err) {
      console.error('Failed to submit recording:', err);
    }
  };


  

  return (
    <Card 
      sx={{ 
        p: isMobile ? 2 : 4,
        borderRadius: 4,
        background: '#f5f5f5',
        boxShadow: theme.shadows[10],
        maxWidth: 1200,
        mx: 'auto',
        my: 4
      }}
    >
      <CardContent>
        <Typography 
          variant="h4" 
          gutterBottom 
          sx={{ 
            color: '#002D62',
            fontWeight: 700,
            mb: 4,
            textAlign: 'center'
          }}
        >
          Speech Shadowing Practice
        </Typography>
        
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 3, height: '100%',  background: 'linear-gradient(to right, rgb(119, 176, 228), rgb(118, 178, 234))',
  }}>
              <Stack spacing={3}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Enter text to practice"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  variant="outlined"
                  disabled={isPlaying || isRecording}
                
                  sx={{
                    '& .MuiInputLabel-root': {
                      transform: 'translate(14px, -20px) scale(1)', // Moves label above the border
                    },
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    },
                    background: 'white',
                    borderRadius: 3
                  }}
                />
                
                <Button 
                  variant="contained" 
                  onClick={handleTextSubmit}
                  disabled={isPlaying || isRecording || !inputText.trim() || isLoading}
                  size="large"
                  sx={{
                    py: 1.5,
                    borderRadius: 2,
                    background: '#002D62',
                    color: 'white',
                    fontWeight: 600,
                    '&:hover': {
                      boxShadow: theme.shadows[4],
                    }
                  }}
                >
                  {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Generate Native Audio'}
                </Button>

                {error && (
                  <Typography color="error" sx={{ mt: 1 }}>
                    Failed to generate audio. Please try again.
                  </Typography>
                )}
              </Stack>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={6} >
            <Paper elevation={0} sx={{ p: 3, borderRadius: 3, height: '100%', background: 'linear-gradient(to right, rgb(119, 176, 228), rgb(118, 178, 234))'}}>
              {nativeAudio ? (
                <Stack spacing={3}>
                 
                  
                  <Stack direction={isMobile ? 'column' : 'row'} spacing={2}>
                    <Button 
                      variant="outlined" 
                      onClick={handlePlayNative}
                      disabled={isPlaying || isRecording || !isNativeAudioLoaded}
                      fullWidth={isMobile}
                      sx={{
                        borderRadius: 2,
                        py: 1.5,
                        fontWeight: 600,
                        background: '#002D62',
                        color: 'white',
                      }}
                    >
                      {isNativeAudioLoaded ? 'Listen to Native' : 'Loading audio...'}
                    </Button>
                    <Button 
                      variant="contained" 
                      onClick={handleStartRecording}
                      disabled={isPlaying || isRecording || !isNativeAudioLoaded}
                      fullWidth={isMobile}
                      sx={{
                        borderRadius: 2,
                        py: 1.5,
                        fontWeight: 600,
                        background: '#002D62',
                        color: 'white',
                        '&:hover': {
                          boxShadow: theme.shadows[4],
                        }
                      }}
                    >
                      Start Shadowing
                    </Button>
                  </Stack>
                  
                  {isRecording && (
                    <Button 
                      variant="contained" 
                      color="error"
                      onClick={handleStopRecording}
                      fullWidth
                      sx={{
                        borderRadius: 2,
                        py: 1.5,
                        fontWeight: 600
                      }}
                    >
                      Stop Recording
                    </Button>
                  )}
                  
                  <Box sx={{ mt: 2 }}>
                    <PitchVisualizer 
                      canvasRef={canvasRef} 
                      pitchData={pitchData} 
                      isRecording={isRecording || isPlaying}
                      startTimeRef={startTimeRef}
                    />
                  </Box>
                  
                  {audioBlob && !isRecording && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                        Your Recording
                      </Typography>
                      <audio src={audioUrl} controls style={{ width: '100%' }} />
                      <Button 
                        variant="contained"
                        onClick={handleSubmitForAnalysis}
                        disabled={isSubmitting}
                        fullWidth
                        sx={{
                          mt: 2,
                          py: 1.5,
                          borderRadius: 2,
                          fontWeight: 600,
                          background: 'linear-gradient(to right, rgb(119, 176, 228), rgb(118, 178, 234))',
                          color: 'white',
                          '&:hover': {
                            boxShadow: theme.shadows[4],
                          }
                        }}
                      >
                        {isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Get Feedback'}
                      </Button>
                    </Box>
                  )}
                </Stack>
              ) : (
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  height: '100%',
                  textAlign: 'center'
                }}>
                  <Typography variant="body1" color="text.secondary">
                    Enter text and generate native audio to begin practice
                  </Typography>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default SpeechShadowingPractice;