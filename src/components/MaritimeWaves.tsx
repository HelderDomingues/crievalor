import React, { useRef, useEffect } from "react";

interface MaritimeWavesProps {
  className?: string;
}

const MaritimeWaves: React.FC<MaritimeWavesProps> = ({
  className = ""
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    let animationFrameId: number;
    let time = 0;

    // Set canvas dimensions
    const resizeCanvas = () => {
      const {
        width,
        height
      } = canvas.getBoundingClientRect();
      canvas.width = width;
      canvas.height = height;
    };

    // Listen for resize events
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    // Animation function
    const animate = () => {
      time += 0.005;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw multiple wave layers
      drawWaves(ctx, time, canvas.width, canvas.height, "#3b82f640", 0.8, 50, 0);
      drawWaves(ctx, time * 0.8, canvas.width, canvas.height, "#d946ef30", 0.5, 40, 0.2);
      drawWaves(ctx, time * 1.2, canvas.width, canvas.height, "#8b5cf620", 0.3, 30, 0.4);
      animationFrameId = requestAnimationFrame(animate);
    };

    // Start animation
    animate();

    // Cleanup
    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Function to draw waves
  const drawWaves = (ctx: CanvasRenderingContext2D, time: number, width: number, height: number, color: string, amplitude: number, waveHeight: number, offset: number) => {
    ctx.beginPath();
    ctx.moveTo(0, height);

    // Draw wave path
    for (let x = 0; x <= width; x += 10) {
      const y = height - waveHeight - Math.sin(x * 0.01 + time + offset) * amplitude * waveHeight - Math.sin(x * 0.02 + time * 1.5) * (amplitude * 0.5) * waveHeight;
      ctx.lineTo(x, y);
    }
    ctx.lineTo(width, height);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
  };

  // Return a canvas element with the provided className
  return <canvas ref={canvasRef} className={className} />;
};

export default MaritimeWaves;
