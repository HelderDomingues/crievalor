import React, { useEffect, useRef } from "react";
import { ArrowRight, Brain, Zap, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import MaritimeWaves from "./MaritimeWaves";
interface HeroSectionProps {
  title: string;
  subtitle: string;
  description: string;
  ctaText: string;
  ctaUrl: string;
  secondaryCtaText?: string;
  secondaryCtaUrl?: string;
  isMarHero?: boolean;
}
const HeroSection = ({
  title,
  subtitle,
  description,
  ctaText,
  ctaUrl,
  secondaryCtaText,
  secondaryCtaUrl,
  isMarHero = false
}: HeroSectionProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas dimensions
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Neural network simulation
    class Node {
      x: number;
      y: number;
      radius: number;
      color: string;
      vx: number;
      vy: number;
      connectedNodes: Node[];
      pulseValue: number;
      pulseSpeed: number;
      constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.radius = Math.random() * 1.5 + 1;
        this.color = "rgba(59, 130, 246, 0.7)"; // Primary color
        this.vx = (Math.random() - 0.5) * 0.3;
        this.vy = (Math.random() - 0.5) * 0.3;
        this.connectedNodes = [];
        this.pulseValue = Math.random() * 2 * Math.PI;
        this.pulseSpeed = 0.02 + Math.random() * 0.02;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.pulseValue += this.pulseSpeed;

        // Bounce off edges
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
      }
      draw() {
        if (!ctx) return;

        // Pulsing effect
        const pulseOpacity = (Math.sin(this.pulseValue) + 1) * 0.3 + 0.2;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color.replace("0.7", pulseOpacity.toString());
        ctx.fill();
      }
      connectNodes() {
        if (!ctx) return;
        this.connectedNodes.forEach(node => {
          const distance = Math.sqrt((this.x - node.x) ** 2 + (this.y - node.y) ** 2);
          if (distance < 100) {
            // Calculate opacity based on distance
            const opacity = 1 - distance / 100;

            // Draw the connection
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(node.x, node.y);
            ctx.strokeStyle = `rgba(59, 130, 246, ${opacity * 0.2})`;
            ctx.lineWidth = opacity * 0.8;
            ctx.stroke();

            // Data transmission animation
            if (Math.random() < 0.001) {
              animateDataTransmission(this.x, this.y, node.x, node.y);
            }
          }
        });
      }
    }

    // Create nodes
    const nodes: Node[] = [];
    const nodeCount = Math.min(80, Math.floor(canvas.width * canvas.height / 10000)); // Responsive node count

    for (let i = 0; i < nodeCount; i++) {
      nodes.push(new Node(Math.random() * canvas.width, Math.random() * canvas.height));
    }

    // Connect nodes
    nodes.forEach(node => {
      nodes.forEach(otherNode => {
        if (node !== otherNode && Math.random() < 0.1) {
          node.connectedNodes.push(otherNode);
        }
      });
    });

    // Data transmission animation
    const dataTransmissions: any[] = [];
    function animateDataTransmission(x1: number, y1: number, x2: number, y2: number) {
      dataTransmissions.push({
        x1,
        y1,
        x2,
        y2,
        progress: 0,
        speed: 0.01 + Math.random() * 0.01
      });
    }

    // Animation loop
    function animate() {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw nodes
      nodes.forEach(node => {
        node.update();
        node.draw();
        node.connectNodes();
      });

      // Update and draw data transmissions
      for (let i = dataTransmissions.length - 1; i >= 0; i--) {
        const dt = dataTransmissions[i];
        dt.progress += dt.speed;
        if (dt.progress >= 1) {
          dataTransmissions.splice(i, 1);
          continue;
        }
        const x = dt.x1 + (dt.x2 - dt.x1) * dt.progress;
        const y = dt.y1 + (dt.y2 - dt.y1) * dt.progress;
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
        ctx.fill();
      }
      requestAnimationFrame(animate);
    }
    animate();
    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);
  return <section className="relative min-h-screen flex items-center overflow-hidden pt-16">
      {/* Neural network background */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-0"></canvas>
      
      {/* Maritime Waves animation */}
      <MaritimeWaves className="z-10" />
      
      {/* Background gradient */}
      <div className="absolute inset-0 hero-gradient opacity-90 z-10"></div>
      
      {/* Decorative elements */}
      {isMarHero && <>
          <div className="absolute top-1/4 left-10 md:left-20 z-20 animate-float opacity-20 hidden md:block">
            <Brain size={80} className="text-primary" />
          </div>
          <div className="absolute bottom-1/4 right-10 md:right-20 z-20 animate-float opacity-20 hidden md:block" style={{
        animationDelay: "1s"
      }}>
            <BarChart3 size={80} className="text-primary" />
          </div>
          <div className="absolute top-2/3 left-1/4 z-20 animate-float opacity-20 hidden md:block" style={{
        animationDelay: "2s"
      }}>
            <Zap size={60} className="text-primary" />
          </div>
        </>}
      
      <div className="container mx-auto px-4 relative z-30">
        <div className="max-w-3xl mx-auto text-center">
          {isMarHero ? <div className="mb-6 animate-fade-in">
              <img src="/lovable-uploads/91e6888f-e3da-40dc-8c55-5718c15ada21.png" alt="MAR - Mapa para Alto Rendimento" className="h-24 mx-auto" />
            </div> : <div className="mb-6 animate-fade-in">
              
            </div>}
          
          <div className="bg-primary/10 text-primary rounded-full px-4 py-2 inline-block mb-4 animate-fade-in">
            {subtitle}
          </div>
          
          <h1 style={{
          animationDelay: "0.2s"
        }} className="sm:text-5xl font-bold mb-6 animate-fade-in md:text-5xl text-3xl">
            {title}
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-8 animate-fade-in" style={{
          animationDelay: "0.4s"
        }}>
            {description}
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in" style={{
          animationDelay: "0.6s"
        }}>
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium" asChild>
              <a href={ctaUrl}>
                {ctaText} <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
            
            {secondaryCtaText && secondaryCtaUrl && <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/10" asChild>
                <a href={secondaryCtaUrl}>{secondaryCtaText}</a>
              </Button>}
          </div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-30 animate-bounce">
        <div className="w-8 h-12 rounded-full border-2 border-muted-foreground flex justify-center items-start p-1">
          <div className="w-1 h-2 bg-muted-foreground rounded-full animate-pulse-subtle"></div>
        </div>
      </div>
    </section>;
};
export default HeroSection;