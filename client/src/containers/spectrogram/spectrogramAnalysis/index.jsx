// src/features/spectrogram/SpectrogramAnalysis.jsx
import React, { useEffect, useRef, useState } from 'react';
import { Box, Paper, Typography, Grid, Divider, Button, CircularProgress } from '@mui/material';
import WaveSurfer from 'wavesurfer.js';
import SpectrogramPlugin from 'wavesurfer.js/dist/plugins/spectrogram';
import { useSelector } from 'react-redux';
import { useGetPhonemeAnalysisQuery } from '../../services/api';

const SpectrogramAnalysis = () => {
  const { practiceText, nativeAudio, userRecording, feedbackData } = useSelector(state => state.speechShadowing);
  
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  const nativeWavesurferRef = useRef(null);
  const userWavesurferRef = useRef(null);
  const nativeContainerRef = useRef(null);
  const userContainerRef = useRef(null);
  const nativeSpectrogramRef = useRef(null);
  const userSpectrogramRef = useRef(null);
  
  const { data: phonemeAnalysis, isLoading: isAnalysisLoading } = useGetPhonemeAnalysisQuery(
    { textId: practiceText, recordingId: userRecording }, 
    { skip: !userRecording }
  );

  // Initialize wavesurfer instances
  useEffect(() => {
    if (!nativeAudio || !userRecording) return;
    
    const initWaveSurfer = async () => {
      setIsLoading(true);
      
      try {
        // Initialize native audio wavesurfer
        if (nativeWavesurferRef.current) {
          nativeWavesurferRef.current.destroy();
        }
        
        nativeWavesurferRef.current = WaveSurfer.create({
          container: nativeContainerRef.current,
          waveColor: '#2196f3',
          progressColor: '#1976d2',
          height: 100,
          responsive: true,
          normalize: true,
        });
        
        // Initialize spectrogram for native audio
        nativeSpectrogramRef.current = nativeWavesurferRef.current.registerPlugin(
          SpectrogramPlugin.create({
            container: document.querySelector('#native-spectrogram'),
            labels: true,
            height: 200,
            colorMap: 'plasma',
          })
        );
        
        // Initialize user audio wavesurfer
        if (userWavesurferRef.current) {
          userWavesurferRef.current.destroy();
        }
        
        userWavesurferRef.current = WaveSurfer.create({
          container: userContainerRef.current,
          waveColor: '#f44336',
          progressColor: '#d32f2f',
          height: 100,
          responsive: true,
          normalize: true,
        });
        
        // Initialize spectrogram for user audio
        userSpectrogramRef.current = userWavesurferRef.current.registerPlugin(
          SpectrogramPlugin.create({
            container: document.querySelector('#user-spectrogram'),
            labels: true,
            height: 200,
            colorMap: 'viridis',
          })
        );
        
        // Load audio files
        await nativeWavesurferRef.current.load(nativeAudio);
        await userWavesurferRef.current.load(userRecording);
        
        setIsLoading(false);
      } catch (err) {
        console.error('Error initializing audio visualization:', err);
        setErrorMessage('Failed to load audio visualization');
        setIsLoading(false);
      }
    };
    
    initWaveSurfer();
    
    return () => {
      if (nativeWavesurferRef.current) {
        nativeWavesurferRef.current.destroy();
      }
      if (userWavesurferRef.current) {
        userWavesurferRef.current.destroy();
      }
    };
  }, [nativeAudio, userRecording]);

  // Sync playback between the two waveforms
  useEffect(() => {
    if (!nativeWavesurferRef.current || !userWavesurferRef.current) return;
    
    const handleNativePlay = () => {
      if (userWavesurferRef.current.isPlaying()) return;
      userWavesurferRef.current.play();
    };
    
    const handleNativePause = () => {
      if (!userWavesurferRef.current.isPlaying()) return;
      userWavesurferRef.current.pause();
    };
    
    const handleUserPlay = () => {
      if (nativeWavesurferRef.current.isPlaying()) return;
      nativeWavesurferRef.current.play();
    };
    
    const handleUserPause = () => {
      if (!nativeWavesurferRef.current.isPlaying()) return;
      nativeWavesurferRef.current.pause();
    };
    
    nativeWavesurferRef.current.on('play', handleNativePlay);
    nativeWavesurferRef.current.on('pause', handleNativePause);
    userWavesurferRef.current.on('play', handleUserPlay);
    userWavesurferRef.current.on('pause', handleUserPause);
    
    return () => {
      if (nativeWavesurferRef.current) {
        nativeWavesurferRef.current.un('play', handleNativePlay);
        nativeWavesurferRef.current.un('pause', handleNativePause);
      }
      if (userWavesurferRef.current) {
        userWavesurferRef.current.un('play', handleUserPlay);
        userWavesurferRef.current.un('pause', handleUserPause);
      }
    };
  }, [nativeWavesurferRef.current, userWavesurferRef.current]);

  // Overlay phoneme analysis markers if available
  useEffect(() => {
    if (!phonemeAnalysis || !userWavesurferRef.current) return;
    
    // Clear existing markers
    const existingMarkers = document.querySelectorAll('.phoneme-marker');
    existingMarkers.forEach(marker => marker.remove());
    
    // Add markers for mispronounced phonemes
    phonemeAnalysis.mispronunciations.forEach(item => {
      const marker = document.createElement('div');
      marker.className = 'phoneme-marker error';
      marker.style.position = 'absolute';
      marker.style.left = `${item.timePosition * 100}%`;
      marker.style.width = `${item.duration * 100}%`;
      marker.style.height = '100%';
      marker.style.backgroundColor = 'rgba(244, 67, 54, 0.3)';
      marker.style.zIndex = 5;
      marker.setAttribute('title', `${item.phoneme}: ${item.suggestion}`);
      
      userContainerRef.current.appendChild(marker);
    });
    
    // Add markers for stress/rhythm issues
    phonemeAnalysis.stressIssues.forEach(item => {
      const marker = document.createElement('div');
      marker.className = 'phoneme-marker warning';
      marker.style.position = 'absolute';
      marker.style.left = `${item.timePosition * 100}%`;
      marker.style.width = `${item.duration * 100}%`;
      marker.style.height = '100%';
      marker.style.backgroundColor = 'rgba(255, 152, 0, 0.3)';
      marker.style.zIndex = 5;
      marker.setAttribute('title', `Stress issue: ${item.details}`);
      
      userContainerRef.current.appendChild(marker);
    });
  }, [phonemeAnalysis, userWavesurferRef.current]);

  const handlePlayBoth = () => {
    if (nativeWavesurferRef.current && userWavesurferRef.current) {
      nativeWavesurferRef.current.play();
      userWavesurferRef.current.play();
    }
  };

  const handlePauseBoth = () => {
    if (nativeWavesurferRef.current && userWavesurferRef.current) {
      nativeWavesurferRef.current.pause();
      userWavesurferRef.current.pause();
    }
  };

  if (!nativeAudio || !userRecording) {
    return (
      <Paper elevation={3} sx={{ p: 3, m: 2 }}>
        <Typography variant="h5">
          No recordings available for analysis.
        </Typography>
        <Typography variant="body1" sx={{ mt: 1 }}>
          Please complete a speech shadowing exercise first.
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 3, m: 2 }}>
      <Typography variant="h4" gutterBottom>
        Pronunciation Analysis
      </Typography>
      
      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      )}
      
      {errorMessage && (
        <Box sx={{ my: 2, color: 'error.main' }}>
          <Typography>{errorMessage}</Typography>
        </Box>
      )}
      
      <Box sx={{ mb: 2 }}>
        <Button 
          variant="contained" 
          onClick={handlePlayBoth} 
          sx={{ mr: 1 }}
          disabled={isLoading}
        >
          Play Both
        </Button>
        <Button 
          variant="outlined" 
          onClick={handlePauseBoth}
          disabled={isLoading}
        >
          Pause
        </Button>
      </Box>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>
            Native Pronunciation
          </Typography>
          <Box 
            ref={nativeContainerRef} 
            sx={{ 
              width: '100%', 
              height: 100, 
              position: 'relative',
              my: 2
            }}
          />
          <Typography variant="subtitle1" gutterBottom>
            Spectrogram
          </Typography>
          <Box 
            id="native-spectrogram"
            sx={{ 
              width: '100%', 
              height: 200,
              backgroundColor: '#f5f5f5',
              borderRadius: 1,
              my: 2
            }}
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>
            Your Pronunciation
          </Typography>
          <Box 
            ref={userContainerRef} 
            sx={{ 
              width: '100%', 
              height: 100, 
              position: 'relative',
              my: 2
            }}
          />
          <Typography variant="subtitle1" gutterBottom>
            Spectrogram
          </Typography>
          <Box 
            id="user-spectrogram"
            sx={{ 
              width: '100%', 
              height: 200,
              backgroundColor: '#f5f5f5',
              borderRadius: 1,
              my: 2
            }}
          />
        </Grid>
      </Grid>
      
      <Divider sx={{ my: 3 }} />
      
      <Typography variant="h5" gutterBottom>
        AI Feedback
      </Typography>
      
      {isAnalysisLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
          <CircularProgress size={28} />
        </Box>
      ) : phonemeAnalysis ? (
        <Box>
          <Typography variant="h6" gutterBottom>
            Pronunciation Score: {phonemeAnalysis.overallScore}/100
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper elevation={2} sx={{ p: 2, backgroundColor: '#fafafa' }}>
                <Typography variant="subtitle1" fontWeight="bold" color="error">
                  Pronunciation Issues
                </Typography>
                {phonemeAnalysis.mispronunciations.length > 0 ? (
                  <ul style={{ paddingLeft: '20px' }}>
                    {phonemeAnalysis.mispronunciations.map((item, index) => (
                      <li key={index}>
                        <Typography>
                          <strong>"{item.phoneme}"</strong> - {item.suggestion}
                        </Typography>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    No major pronunciation issues detected.
                  </Typography>
                )}
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Paper elevation={2} sx={{ p: 2, backgroundColor: '#fafafa' }}>
                <Typography variant="subtitle1" fontWeight="bold" color="warning.dark">
                  Stress & Rhythm Issues
                </Typography>
                {phonemeAnalysis.stressIssues.length > 0 ? (
                  <ul style={{ paddingLeft: '20px' }}>
                    {phonemeAnalysis.stressIssues.map((item, index) => (
                      <li key={index}>
                        <Typography>
                          {item.details}
                        </Typography>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    No major stress or rhythm issues detected.
                  </Typography>
                )}
              </Paper>
            </Grid>
            
            <Grid item xs={12}>
              <Paper elevation={2} sx={{ p: 2, backgroundColor: '#edf7ff' }}>
                <Typography variant="subtitle1" fontWeight="bold" color="primary">
                  General Feedback
                </Typography>
                <Typography variant="body1" sx={{ mt: 1 }}>
                  {phonemeAnalysis.generalFeedback}
                </Typography>
                
                <Typography variant="subtitle1" fontWeight="bold" color="primary" sx={{ mt: 2 }}>
                  Suggestions for Improvement
                </Typography>
                <ul style={{ paddingLeft: '20px' }}>
                  {phonemeAnalysis.suggestions.map((suggestion, index) => (
                    <li key={index}>
                      <Typography>
                        {suggestion}
                      </Typography>
                    </li>
                  ))}
                </ul>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      ) : (
        <Typography variant="body1">
          No analysis data available yet. Submit a recording for feedback.
        </Typography>
      )}
    </Paper>
  );
};

export default SpectrogramAnalysis;