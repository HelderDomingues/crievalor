import React, { useEffect, useRef } from "react";

const HeroNetworkAnimation: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    
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
        this.color = "rgba(59, 130, 246, 0.7)";
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
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
      }
      draw() {
        if (!ctx) return;
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
            const opacity = 1 - distance / 100;
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(node.x, node.y);
            ctx.strokeStyle = `rgba(59, 130, 246, ${opacity * 0.2})`;
            ctx.lineWidth = opacity * 0.8;
            ctx.stroke();
            if (Math.random() < 0.001) {
              animateDataTransmission(this.x, this.y, node.x, node.y);
            }
          }
        });
      }
    }
    
    const nodes: Node[] = [];
    const nodeCount = Math.min(80, Math.floor(canvas.width * canvas.height / 10000));
    for (let i = 0; i < nodeCount; i++) {
      nodes.push(new Node(Math.random() * canvas.width, Math.random() * canvas.height));
    }
    nodes.forEach(node => {
      nodes.forEach(otherNode => {
        if (node !== otherNode && Math.random() < 0.1) {
          node.connectedNodes.push(otherNode);
        }
      });
    });
    
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
    
    function animate() {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      nodes.forEach(node => {
        node.update();
        node.draw();
        node.connectNodes();
      });
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
  
  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
};

export default HeroNetworkAnimation;
