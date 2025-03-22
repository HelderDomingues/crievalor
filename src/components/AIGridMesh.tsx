
import React, { useRef, useEffect } from "react";

interface AIGridMeshProps {
  className?: string;
}

const AIGridMesh: React.FC<AIGridMeshProps> = ({ className = "" }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas dimensions
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Grid configuration
    const gridSize = 30;
    const rows = Math.ceil(canvas.height / gridSize) + 2;
    const cols = Math.ceil(canvas.width / gridSize) + 2;
    
    // Light configuration
    class Light {
      x: number;
      y: number;
      radius: number;
      color: string;
      velocity: { x: number; y: number };
      intensity: number;
      maxIntensity: number;
      intensityChange: number;

      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.radius = Math.random() * 80 + 40;
        
        // Generate colors in purple and blue spectrum
        const hue = Math.random() < 0.7 
          ? Math.floor(Math.random() * 60) + 220  // Blues (220-280)
          : Math.floor(Math.random() * 40) + 280; // Purples (280-320)
          
        const saturation = Math.floor(Math.random() * 30) + 70; // 70-100%
        const lightness = Math.floor(Math.random() * 20) + 50;  // 50-70%
        
        this.color = `hsla(${hue}, ${saturation}%, ${lightness}%, 0.8)`;
        
        // Movement
        this.velocity = {
          x: (Math.random() - 0.5) * 0.5,
          y: (Math.random() - 0.5) * 0.5
        };
        
        // Intensity for pulsing effect
        this.maxIntensity = Math.random() * 0.2 + 0.1;
        this.intensity = Math.random() * this.maxIntensity;
        this.intensityChange = (Math.random() > 0.5 ? 0.001 : -0.001) * (Math.random() * 0.5 + 0.5);
      }

      update() {
        // Move the light
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        
        // Bounce off edges
        if (this.x < -this.radius) this.x = canvas.width + this.radius;
        if (this.x > canvas.width + this.radius) this.x = -this.radius;
        if (this.y < -this.radius) this.y = canvas.height + this.radius;
        if (this.y > canvas.height + this.radius) this.y = -this.radius;
        
        // Pulse intensity
        this.intensity += this.intensityChange;
        
        if (this.intensity <= 0 || this.intensity >= this.maxIntensity) {
          this.intensityChange *= -1;
        }
      }
    }

    // Create lights
    const numLights = 10;
    const lights: Light[] = Array.from({ length: numLights }, () => new Light());

    // Draw the grid
    const drawGrid = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Background
      ctx.fillStyle = "rgba(20, 24, 40, 0.85)"; // Dark blue background
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Update lights
      lights.forEach(light => light.update());
      
      // Calculate each grid point's brightness based on light positions
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const x = col * gridSize;
          const y = row * gridSize;
          
          // Start with dark color
          let r = 30, g = 35, b = 60, a = 0.2;
          
          // Influence from nearby lights
          for (const light of lights) {
            const dx = x - light.x;
            const dy = y - light.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < light.radius) {
              const influence = (1 - distance / light.radius) * light.intensity;
              
              // Parse the light's color
              const colorMatch = light.color.match(/hsla\((\d+),\s*(\d+)%,\s*(\d+)%,\s*([.\d]+)\)/);
              
              if (colorMatch) {
                const h = parseInt(colorMatch[1]);
                const s = parseInt(colorMatch[2]) / 100;
                const l = parseInt(colorMatch[3]) / 100;
                
                // Convert HSL to RGB
                const c = (1 - Math.abs(2 * l - 1)) * s;
                const x = c * (1 - Math.abs((h / 60) % 2 - 1));
                const m = l - c / 2;
                
                let tempR, tempG, tempB;
                
                if (h < 60) {
                  [tempR, tempG, tempB] = [c, x, 0];
                } else if (h < 120) {
                  [tempR, tempG, tempB] = [x, c, 0];
                } else if (h < 180) {
                  [tempR, tempG, tempB] = [0, c, x];
                } else if (h < 240) {
                  [tempR, tempG, tempB] = [0, x, c];
                } else if (h < 300) {
                  [tempR, tempG, tempB] = [x, 0, c];
                } else {
                  [tempR, tempG, tempB] = [c, 0, x];
                }
                
                r += (tempR + m) * 255 * influence;
                g += (tempG + m) * 255 * influence;
                b += (tempB + m) * 255 * influence;
                a += influence * 0.5;
              }
            }
          }
          
          // Clamp values
          r = Math.min(255, r);
          g = Math.min(255, g);
          b = Math.min(255, b);
          a = Math.min(1, a);
          
          // Draw grid point
          ctx.beginPath();
          ctx.arc(x, y, 1.2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${Math.floor(r)}, ${Math.floor(g)}, ${Math.floor(b)}, ${a})`;
          ctx.fill();
          
          // Draw grid lines with varied opacity based on proximity to lights
          if (col < cols - 1) {
            const nextX = (col + 1) * gridSize;
            const lineOpacity = Math.min(0.15, a * 0.3);
            
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(nextX, y);
            ctx.strokeStyle = `rgba(${Math.floor(r)}, ${Math.floor(g)}, ${Math.floor(b)}, ${lineOpacity})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
          
          if (row < rows - 1) {
            const nextY = (row + 1) * gridSize;
            const lineOpacity = Math.min(0.15, a * 0.3);
            
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x, nextY);
            ctx.strokeStyle = `rgba(${Math.floor(r)}, ${Math.floor(g)}, ${Math.floor(b)}, ${lineOpacity})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      
      // Draw flowing energy pulses along grid paths
      // This is done by another layer of animation
      
      requestAnimationFrame(drawGrid);
    };
    
    // Start animation
    drawGrid();
    
    // Clean up
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

export default AIGridMesh;
