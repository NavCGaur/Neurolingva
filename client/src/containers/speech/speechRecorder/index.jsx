import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import audioBufferToWav from 'audiobuffer-to-wav';
import { 
  Button, 
  Box, 
  Typography, 
  CircularProgress, 
  Paper,
  Stack
} from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import StopIcon from '@mui/icons-material/Stop';
import { 
  startRecording, 
  stopRecording, 
  clearAudio 
} from '../../../state/slices/speechSlice';

const SpeechRecorder = ({  audioBlob, onAudioBlobChange  }) => {
  const dispatch = useDispatch();
  const { isRecording, loading } = useSelector(state => state.speech);

  const [stream, setStream] = useState(null);
  const [recorder, setRecorder] = useState(null);
  const [audioURL, setAudioURL] = useState('');
  const audioRef = useRef(null);

  useEffect(() => {
    // Clean up function to stop recording when component unmounts
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      if (recorder) {
        recorder.stop();
      }
    };
  }, [stream, recorder]);

  useEffect(() => {
    if (audioBlob) {
      const url = URL.createObjectURL(audioBlob);
      setAudioURL(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setAudioURL('');
    }
  }, [audioBlob]);

  // Conversion function
async function convertToWav(webmBlob) {
    // Create audio context
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    // Convert Blob to ArrayBuffer
    const arrayBuffer = await webmBlob.arrayBuffer();
    
    // Decode the audio data
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    
    // Create WAV from AudioBuffer
    const wavBlob = audioBufferToWav(audioBuffer);
    return new Blob([wavBlob], { type: 'audio/wav' });
  }

  const handleStartRecording = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setStream(mediaStream);
      
      const mediaRecorder = new MediaRecorder(mediaStream);
      setRecorder(mediaRecorder);
      
      const audioChunks = [];
      
      mediaRecorder.addEventListener('dataavailable', event => {
        audioChunks.push(event.data);
      });
      
      mediaRecorder.addEventListener('stop', async () => {
        const webmBlob = new Blob(audioChunks, { type: 'audio/webm' });
        const audioBlob = await convertToWav(webmBlob);

        onAudioBlobChange(audioBlob); // Pass blob to parent

        dispatch(stopRecording());
      });
      
      mediaRecorder.start();
      dispatch(startRecording());
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const handleStopRecording = () => {
    if (recorder && recorder.state !== 'inactive') {
      recorder.stop();
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    }
  };

  const handleNewRecording = () => {
    dispatch(clearAudio());
    onAudioBlobChange(null); // Clear the blob in parent state
    setAudioURL('');
  };

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="h5" gutterBottom>
        Speech Recorder
      </Typography>
      
      <Stack spacing={2} alignItems="center">
        {loading ? (
          <Box display="flex" justifyContent="center" my={3}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {!audioBlob ? (
              <Button
                variant="contained"
                color={isRecording ? "error" : "primary"}
                startIcon={isRecording ? <StopIcon /> : <MicIcon />}
                onClick={isRecording ? handleStopRecording : handleStartRecording}
                size="large"
                sx={{ borderRadius: 28, px: 3, py: 1.5 }}
              >
                {isRecording ? "Stop Recording" : "Start Recording"}
              </Button>
            ) : (
              <Box sx={{ width: '100%', textAlign: 'center' }}>
                <audio ref={audioRef} src={audioURL} controls style={{ width: '100%', marginBottom: 16 }} />
                <Button 
                  variant="outlined" 
                  onClick={handleNewRecording}
                  sx={{ mt: 2 }}
                >
                  New Recording
                </Button>
              </Box>
            )}
            
            {isRecording && (
              <Box sx={{ textAlign: 'center', animation: 'pulse 1.5s infinite', my: 2 }}>
                <Typography variant="body1" sx={{ color: 'error.main' }}>
                  Recording...
                </Typography>
              </Box>
            )}
          </>
        )}
      </Stack>
    </Paper>
  );
};

export default SpeechRecorder;
