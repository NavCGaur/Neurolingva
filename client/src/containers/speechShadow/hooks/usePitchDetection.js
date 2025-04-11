import { useEffect, useRef } from 'react';
import { PitchDetector } from 'pitchy';

const usePitchDetection = (onPitchDetected) => {
  const analyserRef = useRef(null);
  const detectorRef = useRef(null);
  const audioContextRef = useRef(null);
  const sourceRef = useRef(null);
  const streamRef = useRef(null);
  const animationRef = useRef(null);
  const isActiveRef = useRef(false);

  const start = async () => {
    try {
      console.log("[PitchDetection] Requesting microphone access...");
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      console.log("[PitchDetection] Microphone access granted.");

      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      audioContextRef.current = audioContext;
      console.log("[PitchDetection] AudioContext created.");

      const source = audioContext.createMediaStreamSource(stream);
      sourceRef.current = source;

      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 2048;
      analyserRef.current = analyser;
      console.log("[PitchDetection] Audio nodes set up with FFT size:", analyser.fftSize);

      source.connect(analyser);
      console.log("[PitchDetection] Audio nodes connected.");

      detectorRef.current = PitchDetector.forFloat32Array(analyser.fftSize);
      console.log("[PitchDetection] Pitch detector initialized.");
      
      isActiveRef.current = true;
      detectPitch();
      console.log("[PitchDetection] Pitch detection started.");
    } catch (err) {
      console.error("[PitchDetection] Error initializing pitch detection:", err);
      throw err;
    }
  };

  const stop = () => {
    console.log("[PitchDetection] Stopping pitch detection...");
    isActiveRef.current = false;
    
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      console.log("[PitchDetection] Animation frame cancelled.");
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      console.log("[PitchDetection] Microphone stream stopped.");
    }

    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close().catch(e => console.error("Error closing audio context:", e));
      console.log("[PitchDetection] AudioContext closed.");
    }
    
    // Clear all refs
    analyserRef.current = null;
    detectorRef.current = null;
    sourceRef.current = null;
    streamRef.current = null;
  };

  const detectPitch = () => {
    if (!isActiveRef.current) return;
    
    const analyser = analyserRef.current;
    const detector = detectorRef.current;

    if (!analyser || !detector) {
      console.warn("[PitchDetection] Missing analyser or detector, skipping pitch detection.");
      return;
    }

    const data = new Float32Array(analyser.fftSize);
    analyser.getFloatTimeDomainData(data);

    const [pitch, clarity] = detector.findPitch(data, analyser.context.sampleRate);

    console.log(`[PitchDetection] Detected pitch: ${pitch?.toFixed(2) || "null"} Hz, Clarity: ${clarity?.toFixed(2)}`);

    try {
      onPitchDetected({ pitch, clarity, time: Date.now() });
    } catch (err) {
      console.error("[PitchDetection] Error in onPitchDetected callback:", err);
    }

    animationRef.current = requestAnimationFrame(detectPitch);
  };

  useEffect(() => {
    return () => {
      stop();
    };
  }, []);

  return { start, stop };
};

export default usePitchDetection;