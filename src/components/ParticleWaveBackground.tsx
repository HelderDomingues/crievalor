
import React, { useRef, useEffect } from "react";

interface ParticleWaveBackgroundProps {
  className?: string;
}

const ParticleWaveBackground: React.FC<ParticleWaveBackgroundProps> = ({ className = "" }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas dimensions
    const resizeCanvas = () => {
      const pixelRatio = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * pixelRatio;
      canvas.height = window.innerHeight * pixelRatio;
      ctx.scale(pixelRatio, pixelRatio);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Particle properties
    interface Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;
      opacity: number;
      angle: number;
      waveAmplitude: number;
      waveFrequency: number;
      waveSpeed: number;
      phase: number;
    }

    // Create 3 wave patterns with different colors
    const waves = [
      {
        color: "#D946EF", // Magenta
        particleCount: 750,
        yPosition: canvas.height * 0.3,
        waveAmplitude: 100,
        waveFrequency: 0.008,
        particleSize: { min: 1, max: 3 },
        waveSpeed: 0.001,
      },
      {
        color: "#8B5CF6", // Purple
        particleCount: 750,
        yPosition: canvas.height * 0.5,
        waveAmplitude: 80,
        waveFrequency: 0.005,
        particleSize: { min: 1, max: 3 },
        waveSpeed: 0.0015,
      },
      {
        color: "#0EA5E9", // Blue
        particleCount: 750,
        yPosition: canvas.height * 0.7,
        waveAmplitude: 120,
        waveFrequency: 0.006,
        particleSize: { min: 1, max: 3 },
        waveSpeed: 0.002,
      }
    ];

    // Generate particles for all waves
    const particles: Particle[] = [];

    waves.forEach(wave => {
      for (let i = 0; i < wave.particleCount; i++) {
        const x = Math.random() * canvas.width;
        const baseY = wave.yPosition;
        const size = Math.random() * (wave.particleSize.max - wave.particleSize.min) + wave.particleSize.min;
        const speedX = 0; // We'll calculate position based on waves, not direct speed
        const speedY = 0;
        const opacity = Math.random() * 0.8 + 0.2;
        const waveAmplitude = wave.waveAmplitude * (0.8 + Math.random() * 0.4); // Slight variation
        const waveFrequency = wave.waveFrequency * (0.9 + Math.random() * 0.2); // Slight variation
        const waveSpeed = wave.waveSpeed * (0.9 + Math.random() * 0.2); // Slight variation
        const phase = Math.random() * Math.PI * 2; // Random starting phase

        particles.push({
          x,
          y: baseY,
          size,
          speedX,
          speedY,
          color: wave.color,
          opacity,
          angle: 0,
          waveAmplitude,
          waveFrequency,
          waveSpeed,
          phase
        });
      }
    });

    // Animation time tracking
    let time = 0;

    // Animation function
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update time
      time += 0.01;
      
      // Background gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, "rgba(15, 23, 42, 1)");      // Dark blue
      gradient.addColorStop(1, "rgba(23, 21, 56, 1)");      // Dark purple
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      particles.forEach(particle => {
        // Update phase for wave movement
        particle.phase += particle.waveSpeed;
        
        // Calculate wave Y position
        const waveY = Math.sin(particle.x * particle.waveFrequency + particle.phase) * particle.waveAmplitude;
        
        // Update particle position based on wave
        particle.y = particle.y + waveY * 0.005; // Small continuous adjustment based on wave

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.globalAlpha = particle.opacity;
        ctx.fill();
        
        // Make particles move laterally as well
        particle.x += Math.sin(time * 0.3) * 0.2;
        
        // Wrap around if particle goes off screen
        if (particle.x > canvas.width) {
          particle.x = 0;
        } else if (particle.x < 0) {
          particle.x = canvas.width;
        }
      });
      
      // Randomly highlight some particles to create shimmer effect
      if (Math.random() > 0.95) {
        const randomIndex = Math.floor(Math.random() * particles.length);
        const particle = particles[randomIndex];
        
        // Draw a glowing highlight
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size * 3, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.globalAlpha = 0.1;
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size * 1.5, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.globalAlpha = 0.2;
        ctx.fill();
      }
      
      // Reset alpha for next frame
      ctx.globalAlpha = 1;
      
      requestAnimationFrame(animate);
    };

    // Start animation
    animate();

    // Cleanup
    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full ${className}`}
    />
  );
};

export default ParticleWaveBackground;
