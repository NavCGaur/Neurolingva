// src/hooks/useAudioRecorder.js
import { useState, useEffect, useCallback } from 'react';
import * as Pitchy from 'pitchy';

const useAudioRecorder = () => {
  const [recording, setRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState('');
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioStream, setAudioStream] = useState(null);
  const [audioContext, setAudioContext] = useState(null);
  const [analyser, setAnalyser] = useState(null);
  const [pitchDetector, setPitchDetector] = useState(null);
  const [currentPitch, setCurrentPitch] = useState(null);

  // Initialize audio components
  useEffect(() => {
    return () => {
      // Cleanup function
      if (audioStream) {
        audioStream.getTracks().forEach(track => track.stop());
      }
      if (audioContext) {
        audioContext.close();
      }
    };
  }, [audioStream, audioContext]);

  const startRecording = useCallback(async () => {
    try {
      // Request access to the microphone
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setAudioStream(stream);
      
      // Initialize Web Audio components
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const analyserNode = audioCtx.createAnalyser();
      analyserNode.fftSize = 2048;
      
      // Create media recorder
      const recorder = new MediaRecorder(stream);
      const audioChunks = [];
      
      // Set up source and connect to analyzer
      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyserNode);
      
      // Initialize pitch detector
      const detector = Pitchy.PitchDetector.forFloat32Array(analyserNode.fftSize);
      setPitchDetector(detector);
      
      // Set up recording events
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunks.push(e.data);
        }
      };
      
      recorder.onstop = () => {
        const blob = new Blob(audioChunks, { type: 'audio/wav' });
        setAudioBlob(blob);
        
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
      };
      
      // Start recording
      recorder.start();
      setMediaRecorder(recorder);
      setAudioContext(audioCtx);
      setAnalyser(analyserNode);
      setRecording(true);
      
      // Start pitch detection
      const detectPitch = () => {
        if (recording && analyserNode) {
          const buffer = new Float32Array(analyserNode.fftSize);
          analyserNode.getFloatTimeDomainData(buffer);
          
          const [pitch, clarity] = detector.findPitch(buffer, audioCtx.sampleRate);
          
          // Only update if the clarity is good enough
          if (clarity > 0.8) {
            setCurrentPitch(pitch);
          }
          
          // Continue detecting if still recording
          if (recording) {
            requestAnimationFrame(detectPitch);
          }
        }
      };
      
      requestAnimationFrame(detectPitch);
    } catch (err) {
      console.error('Error starting recording:', err);
    }
  }, [recording]);

  const stopRecording = useCallback(() => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
    }
    
    if (audioStream) {
      audioStream.getTracks().forEach(track => track.stop());
    }
    
    setRecording(false);
  }, [mediaRecorder, audioStream]);

  const getCurrentPitch = useCallback(() => {
    return currentPitch;
  }, [currentPitch]);

  return {
    startRecording,
    stopRecording,
    isRecording: recording,
    audioBlob,
    audioUrl,
    getCurrentPitch,
  };
};

export default useAudioRecorder;