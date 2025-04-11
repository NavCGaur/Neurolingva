import React, { useEffect, useRef } from 'react';
import { Box } from '@mui/material';

const PitchVisualizer = ({ canvasRef, pitchData, isRecording, startTimeRef }) => {
  const animationRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Set canvas dimensions to match its display size
    const updateCanvasDimensions = () => {
      const rect = canvas.getBoundingClientRect();
      if (canvas.width !== rect.width || canvas.height !== rect.height) {
        canvas.width = rect.width;
        canvas.height = rect.height;
      }
    };
    
    updateCanvasDimensions();
    
    const ctx = canvas.getContext('2d');
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    
    const drawPitchGraph = () => {
      // Clear canvas with dark background
      ctx.fillStyle = 'rgba(15, 25, 35, 1)';
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);
      
      // Draw grid lines
      ctx.strokeStyle = 'rgba(100, 140, 180, 0.2)';
      ctx.lineWidth = 0.5;
      
      // Horizontal grid lines (pitch)
      for (let i = 0; i <= canvasHeight; i += canvasHeight/5) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvasWidth, i);
        ctx.stroke();
        
        // Add pitch labels (0-1 scale)
        ctx.fillStyle = 'white';
        ctx.font = '10px Arial';
        ctx.fillText((1 - (i/canvasHeight)).toFixed(1), 5, i - 5);
      }
      
      // Calculate the maximum time value in the data for scaling
      const maxNativeTime = pitchData.native.length > 0 
        ? Math.max(...pitchData.native.map(p => p.time)) 
        : 0;
        
      const maxUserTime = pitchData.user.length > 0 
        ? Math.max(...pitchData.user.map(p => p.time)) 
        : 0;
        
      const maxTime = Math.max(maxNativeTime, maxUserTime, 5000); // Minimum 5 seconds
      
      // Draw time labels
      for (let i = 0; i <= canvasWidth; i += canvasWidth/5) {
        const time = (i / canvasWidth) * maxTime;
        const seconds = (time / 1000).toFixed(1);
        
        ctx.fillStyle = 'white';
        ctx.font = '10px Arial';
        ctx.fillText(`${seconds}s`, i, canvasHeight - 5);
      }
      
      // Draw pitch lines
      const drawPitchLine = (data, color) => {
        if (data.length < 2) return; // Need at least 2 points to draw a line
        
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        ctx.shadowBlur = 10;
        ctx.shadowColor = color;
        ctx.beginPath();
        
        const timeScale = canvasWidth / maxTime;
        
        // Since pitch is already normalized (0-1), we can map directly to canvas height
        // with some padding (20px from top/bottom)
        const padding = 20;
        const drawableHeight = canvasHeight - padding * 2;
        
        let firstPoint = true;
        
        for (const point of data) {
          // Scale the time to fit the entire canvas width
          const x = point.time * timeScale;
          // Invert Y-axis (0 at bottom, 1 at top) and add padding
          const y = canvasHeight - padding - (point.pitch * drawableHeight);
          
          if (firstPoint) {
            ctx.moveTo(x, y);
            firstPoint = false;
          } else {
            ctx.lineTo(x, y);
          }
        }
        
        ctx.stroke();
        ctx.shadowBlur = 0;
        
        // Draw the most recent point as a circle
        if (data.length > 0) {
          const latest = data[data.length - 1];
          const x = latest.time * timeScale;
          const y = canvasHeight - padding - (latest.pitch * drawableHeight);
          
          ctx.beginPath();
          ctx.arc(x, y, 5, 0, Math.PI * 2);
          ctx.fillStyle = color;
          ctx.fill();
        }
      };
      
      // Draw native pitch (blue)
      drawPitchLine(pitchData.native, '#4fc3f7');
      
      // Draw user pitch (red)
      drawPitchLine(pitchData.user, '#ff5252');
      
      // Add legend
      ctx.font = '12px Arial';
      ctx.fillStyle = '#4fc3f7';
      ctx.fillText('Native', 10, 20);
      ctx.fillStyle = '#ff5252';
      ctx.fillText('Your Recording', 80, 20);
      
      // Continue animation if recording
      if (isRecording) {
        animationRef.current = requestAnimationFrame(drawPitchGraph);
      }
    };
    
    drawPitchGraph();
    
    // Setup a resize observer to handle canvas resizing
    const resizeObserver = new ResizeObserver(() => {
      updateCanvasDimensions();
      drawPitchGraph();
    });
    
    resizeObserver.observe(canvas.parentElement);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      resizeObserver.disconnect();
    };
  }, [canvasRef, pitchData, isRecording, startTimeRef]);
  
  return (
    <Box sx={{ 
      width: '100%', 
      height: 300,
      borderRadius: 2,
      overflow: 'hidden',
      background: 'rgba(15, 25, 35, 0.95)'
    }}>
      <canvas
        ref={canvasRef}
        style={{ width: '100%', height: '100%' }}
      />
    </Box>
  );
};

export default PitchVisualizer;