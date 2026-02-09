import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Target, Users, Lightbulb, Palette, Brain, Zap, Compass, UserCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { FlagIcon } from "@/components/ui/flag-icon";
import { Link } from "react-router-dom";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselApi,
} from "@/components/ui/carousel";
import marLogo from "@/assets/mar-logo-hero.png";
import lumiaLogo from "@/assets/lumia-logo-hero.png";
import mentorPropositoLogo from "@/assets/mentor-proposito-logo-hero.png";
import oficinaLideresLogo from "@/assets/oficina-lideres-logo-hero.png";

interface InteractiveBackgroundProps {
  type: "neural" | "growth" | "energy" | "design" | "institutional" | "lumia" | "ecosystem" | "purpose";
  mousePosition: {
    x: number;
    y: number;
  };
}

const InteractiveBackground: React.FC<InteractiveBackgroundProps> = ({ type, mousePosition }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

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

    let particles: any[] = [];
    let time = 0;

    // Initialize particles based on type
    const initParticles = () => {
      particles = [];
      const particleCount =
        type === "institutional"
          ? 75
          : type === "neural"
            ? 60
            : type === "growth"
              ? 80
              : type === "energy"
                ? 100
                : type === "lumia"
                  ? 90
                  : type === "ecosystem"
                    ? 85
                    : type === "purpose"
                      ? 70
                      : 70;

      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 3 + 1,
          speedX: (Math.random() - 0.5) * 0.5,
          speedY: (Math.random() - 0.5) * 0.5,
          opacity: Math.random() * 0.8 + 0.2,
          connections: [],
          pulsePhase: Math.random() * Math.PI * 2,
          color: getParticleColor(type, i),
          trail: [],
        });
      }
    };

    const getParticleColor = (type: string, index: number) => {
      switch (type) {
        case "institutional":
          return `hsl(${260 + Math.sin(index * 0.09) * 20}, 65%, 65%)`;
        case "neural":
          return `hsl(${200 + Math.sin(index * 0.1) * 30}, 70%, 60%)`;
        case "growth":
          return `hsl(${120 + Math.sin(index * 0.15) * 40}, 60%, 55%)`;
        case "energy":
          return `hsl(${300 + Math.sin(index * 0.12) * 50}, 80%, 65%)`;
        case "design":
          return `hsl(${30 + Math.sin(index * 0.08) * 60}, 70%, 60%)`;
        case "lumia":
          return `hsl(${280 + Math.sin(index * 0.11) * 40}, 75%, 65%)`;
        case "ecosystem":
          return `hsl(${220 + Math.sin(index * 0.13) * 50}, 80%, 60%)`;
        case "purpose":
          return `hsl(${45 + Math.sin(index * 0.14) * 30}, 75%, 55%)`;
        default:
          return "hsl(200, 70%, 60%)";
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time += 0.01;

      // Background gradient
      const gradient = ctx.createRadialGradient(
        mousePosition.x,
        mousePosition.y,
        0,
        mousePosition.x,
        mousePosition.y,
        300,
      );
      gradient.addColorStop(0, "rgba(0, 0, 20, 0.1)");
      gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle, i) => {
        // Mouse attraction - mais suave
        const dx = mousePosition.x - particle.x;
        const dy = mousePosition.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < 120) {
          const force = ((120 - distance) / 120) * 0.15;
          particle.speedX += (dx / distance) * force * 0.005;
          particle.speedY += (dy / distance) * force * 0.005;
        }

        // Update position
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        particle.pulsePhase += 0.05;

        // Boundary wrap
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        // Add trail
        particle.trail.push({
          x: particle.x,
          y: particle.y,
        });
        if (particle.trail.length > 10) particle.trail.shift();

        // Draw trail
        if (type === "energy" || type === "design" || type === "lumia" || type === "purpose") {
          particle.trail.forEach((point: any, index: number) => {
            const alpha = (index / particle.trail.length) * 0.3;
            ctx.beginPath();
            ctx.arc(point.x, point.y, particle.size * 0.5, 0, Math.PI * 2);
            ctx.fillStyle = particle.color.replace(")", `, ${alpha})`).replace("hsl", "hsla");
            ctx.fill();
          });
        }

        // Draw connections
        particles.forEach((other, j) => {
          if (i !== j) {
            const dx = particle.x - other.x;
            const dy = particle.y - other.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < 100) {
              const opacity = ((100 - distance) / 100) * 0.3;
              ctx.beginPath();
              ctx.moveTo(particle.x, particle.y);
              ctx.lineTo(other.x, other.y);
              ctx.strokeStyle = particle.color.replace(")", `, ${opacity})`).replace("hsl", "hsla");
              ctx.lineWidth = 0.5;
              ctx.stroke();
            }
          }
        });

        // Draw particle
        const pulse = Math.sin(particle.pulsePhase) * 0.3 + 0.7;
        const size = particle.size * pulse;

        // Glow effect
        const glowGradient = ctx.createRadialGradient(particle.x, particle.y, 0, particle.x, particle.y, size * 3);
        glowGradient.addColorStop(0, particle.color.replace(")", ", 0.8)").replace("hsl", "hsla"));
        glowGradient.addColorStop(1, particle.color.replace(")", ", 0)").replace("hsl", "hsla"));
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, size * 3, 0, Math.PI * 2);
        ctx.fillStyle = glowGradient;
        ctx.fill();

        // Core particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    initParticles();
    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [type, mousePosition]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full opacity-60"
      style={{
        pointerEvents: "none",
      }}
    />
  );
};

const InteractiveGalaxyHeroCarousel = () => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [mousePosition, setMousePosition] = useState({
    x: 0,
    y: 0,
  });
  const containerRef = useRef<HTMLDivElement>(null);

  const slides: Array<{
    id: string;
    icon: React.ComponentType<any>;
    logo?: string;
    title: string;
    subtitle: string;
    description: string;
    badge?: string;
    ctaText: string;
    ctaUrl: string;
    secondaryCtaText: string;
    secondaryCtaUrl: string;
    backgroundType: "neural" | "growth" | "energy" | "design" | "institutional" | "lumia" | "ecosystem" | "purpose";
    gradientColors: string;
    accentColor: string;
    glowColor: string;
  }> = [
      {
        id: "lumia-main",
        icon: Zap,
        logo: lumiaLogo,
        title: "CLAREZA E DIREÇÃO",
        subtitle: "O Ecossistema LUMIA foi feito para acelerar o seu crescimento.",
        description: "Inteligência Organizacional de ponta para empresas que buscam profissionalização e escala progressiva. Você no centro da estratégia.",
        badge: "Ideal para faturamento R$ 150k+ e 10+ colaboradores",
        ctaText: "Começar Agora",
        ctaUrl: "#pricing",
        secondaryCtaText: "Falar com consultor",
        secondaryCtaUrl: "https://wa.me/5547992150289?text=Tenho%20interesse%20em%20conhecer%20o%20LUMIA",
        backgroundType: "lumia" as const,
        gradientColors: "from-purple-900/20 via-violet-900/10 to-pink-900/20",
        accentColor: "text-purple-400",
        glowColor: "shadow-purple-500/20",
      },
      {
        id: "user-control",
        icon: UserCheck,
        title: "Controle Total. Zero Espera.",
        subtitle: "Você valida cada etapa. A IA executa a velocidade.",
        description: "Diferente de consultorias tradicionais com relatórios estáticos, o LUMIA evolui com você. Use especialistas virtuais em Vendas, Marketing e Gestão em tempo real.",
        ctaText: "Experimentar Agora",
        ctaUrl: "/lumia",
        secondaryCtaText: "Como funciona?",
        secondaryCtaUrl: "#ecosystem-flow",
        backgroundType: "neural" as const,
        gradientColors: "from-emerald-900/20 via-teal-900/10 to-blue-900/20",
        accentColor: "text-emerald-400",
        glowColor: "shadow-emerald-500/20",
      },
    ];

  useEffect(() => {
    if (!api) return;

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("mousemove", handleMouseMove);
      return () => container.removeEventListener("mousemove", handleMouseMove);
    }
  }, []);

  const currentSlide = slides[current];

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-gray-900 via-slate-900 to-black"
    >
      {/* Interactive background */}
      <div className="absolute inset-0">
        <InteractiveBackground type={currentSlide.backgroundType} mousePosition={mousePosition} />
      </div>

      {/* Base gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${currentSlide.gradientColors}`} />

      {/* Cosmic dust overlay */}
      <div className="absolute inset-0 opacity-30">
        {[...Array(100)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <Carousel
          className="w-full max-w-7xl mx-auto"
          setApi={setApi}
          opts={{
            align: "start",
            loop: true,
          }}
        >
          <CarouselContent>
            {slides.map((slide, index) => (
              <CarouselItem key={slide.id}>
                <div className="min-h-[80vh] md:min-h-[90vh] flex items-center">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 items-center w-full py-12 md:py-20">
                    {/* Content */}
                    <div className="space-y-4 md:space-y-8 relative order-2 lg:order-1">
                      {/* Icon with glow - only visible on medium+ screens */}
                      <div className="hidden md:flex items-center gap-6">
                        <div
                          className={`relative rounded-full bg-black/30 backdrop-blur-sm p-6 border border-white/10 ${slide.glowColor} shadow-2xl`}
                        >
                          {React.createElement(slide.icon, {
                            className: `h-12 w-12 ${slide.accentColor}`,
                          })}
                          <div
                            className={`absolute inset-0 rounded-full bg-gradient-to-r ${slide.accentColor.replace("text-", "from-")} to-transparent opacity-20 blur-xl`}
                          />
                        </div>
                        <div
                          className={`h-px bg-gradient-to-r ${slide.accentColor.replace("text-", "from-")} to-transparent flex-1`}
                        />
                      </div>

                      {/* Title with gradient */}
                      <div className="space-y-3 md:space-y-6">
                        {slide.badge && (
                          <Badge variant="outline" className="mb-2 border-white/20 bg-white/10 text-white backdrop-blur-sm px-4 py-1 text-sm md:text-base animate-fade-in">
                            {slide.badge}
                          </Badge>
                        )}
                        <h1 className="text-3xl sm:text-4xl lg:text-6xl xl:text-7xl font-bold leading-tight">
                          <span
                            className={`bg-gradient-to-r from-white via-white to-gray-300 bg-clip-text text-transparent`}
                          >
                            {slide.title}
                          </span>
                        </h1>

                        {/* Subtitle */}
                        <h2 className={`text-lg sm:text-xl lg:text-2xl xl:text-3xl font-semibold ${slide.accentColor} leading-relaxed ${slide.id === 'mar' ? 'animate-pulse font-bold text-2xl sm:text-3xl lg:text-4xl xl:text-5xl tracking-tight drop-shadow-[0_0_15px_rgba(96,165,250,0.5)]' : ''
                          }`}>
                          {slide.subtitle}
                        </h2>

                        <p className="text-base sm:text-lg lg:text-xl text-gray-300 leading-relaxed max-w-2xl">{slide.description}</p>
                      </div>

                      {/* CTAs with enhanced styling */}
                      <div className="flex flex-col sm:flex-row gap-3 md:gap-6 pt-4 md:pt-8">
                        <Button
                          asChild
                          size="lg"
                          className={`text-base md:text-xl px-6 md:px-8 py-4 md:py-6 bg-gradient-to-r ${slide.accentColor.replace("text-", "from-")} to-white text-white hover:scale-105 transition-all duration-300 ${slide.glowColor} shadow-2xl font-bold border-2 border-white/10`}
                        >
                          {slide.ctaUrl.startsWith("#") ? (
                            <a
                              href={slide.ctaUrl}
                              onClick={(e) => {
                                e.preventDefault();
                                document.getElementById(slide.ctaUrl.slice(1))?.scrollIntoView({ behavior: "smooth" });
                              }}
                            >
                              {slide.ctaText} <ArrowRight className="ml-2 md:ml-3 h-5 w-5 md:h-6 md:w-6" />
                            </a>
                          ) : (
                            <Link to={slide.ctaUrl}>
                              {slide.ctaText} <ArrowRight className="ml-2 md:ml-3 h-5 w-5 md:h-6 md:w-6" />
                            </Link>
                          )}
                        </Button>
                        <Button
                          asChild
                          variant="outline"
                          size="lg"
                          className="text-base md:text-xl px-6 md:px-8 py-4 md:py-6 border-2 border-white/40 bg-black/40 backdrop-blur-sm text-white hover:bg-white/20 hover:border-white/60 hover:scale-105 transition-all duration-300 font-semibold"
                        >
                          {slide.secondaryCtaUrl.startsWith("http") ? (
                            <a href={slide.secondaryCtaUrl} target="_blank" rel="noopener noreferrer">
                              {slide.secondaryCtaText}
                            </a>
                          ) : (
                            <Link to={slide.secondaryCtaUrl}>{slide.secondaryCtaText}</Link>
                          )}
                        </Button>
                      </div>
                    </div>

                    {/* Visual - Logo or Icon with responsive sizing */}
                    <div className="relative flex items-center justify-center order-1 lg:order-2">
                      {slide.logo ? (
                        // Display product logo
                        <div className="relative w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 lg:w-96 lg:h-96">
                          {/* Outer glow rings */}
                          {[...Array(3)].map((_, i) => (
                            <div
                              key={i}
                              className={`absolute inset-0 rounded-full border-2 ${slide.accentColor.replace("text-", "border-")} opacity-20 animate-pulse`}
                              style={{
                                transform: `scale(${1 + i * 0.15})`,
                                animationDelay: `${i * 0.5}s`,
                                animationDuration: "3s",
                              }}
                            />
                          ))}

                          {/* Logo container */}
                          <div className="absolute inset-4 md:inset-8 rounded-full bg-gradient-to-br from-black/50 to-black/80 backdrop-blur-xl border border-white/10 flex items-center justify-center p-6 md:p-8">
                            <img
                              src={slide.logo}
                              alt={`Logo ${slide.title}`}
                              className="w-full h-full object-contain relative z-10"
                            />
                          </div>

                          {/* Floating particles around the logo */}
                          {[...Array(8)].map((_, i) => (
                            <div
                              key={i}
                              className={`absolute w-1.5 h-1.5 md:w-2 md:h-2 ${slide.accentColor.replace("text-", "bg-")} rounded-full`}
                              style={{
                                left: `${50 + 40 * Math.cos((i * Math.PI) / 4)}%`,
                                top: `${50 + 40 * Math.sin((i * Math.PI) / 4)}%`,
                                animation: `orbit 8s linear infinite ${i * 0.5}s`,
                              }}
                            />
                          ))}
                        </div>
                      ) : (
                        // Display icon for slides without specific logo
                        <div className="relative w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 lg:w-96 lg:h-96">
                          {/* Outer glow rings */}
                          {[...Array(3)].map((_, i) => (
                            <div
                              key={i}
                              className={`absolute inset-0 rounded-full border-2 ${slide.accentColor.replace("text-", "border-")} opacity-20 animate-pulse`}
                              style={{
                                transform: `scale(${1 + i * 0.2})`,
                                animationDelay: `${i * 0.5}s`,
                                animationDuration: "3s",
                              }}
                            />
                          ))}

                          {/* Central orb */}
                          <div className="absolute inset-4 md:inset-8 rounded-full bg-gradient-to-br from-black/50 to-black/80 backdrop-blur-xl border border-white/10 flex items-center justify-center">
                            <div className="absolute inset-4 rounded-full bg-gradient-to-br from-white/5 to-transparent" />
                            <div className="absolute inset-8 rounded-full bg-gradient-to-br from-white/10 to-transparent" />
                            {React.createElement(slide.icon, {
                              className: `h-20 w-20 sm:h-24 sm:w-24 md:h-32 md:w-32 ${slide.accentColor} relative z-10`,
                            })}
                          </div>

                          {/* Floating particles around the orb */}
                          {[...Array(8)].map((_, i) => (
                            <div
                              key={i}
                              className={`absolute w-1.5 h-1.5 md:w-2 md:h-2 ${slide.accentColor.replace("text-", "bg-")} rounded-full`}
                              style={{
                                left: `${50 + 40 * Math.cos((i * Math.PI) / 4)}%`,
                                top: `${50 + 40 * Math.sin((i * Math.PI) / 4)}%`,
                                animation: `orbit 8s linear infinite ${i * 0.5}s`,
                              }}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Enhanced navigation with responsive positioning - hidden on mobile */}
          <CarouselPrevious className="hidden md:flex left-4 lg:left-8 top-20 lg:top-24 bg-black/30 backdrop-blur-sm border-white/20 text-white hover:bg-white/10 z-20" />
          <CarouselNext className="hidden md:flex right-4 lg:right-8 top-20 lg:top-24 bg-black/30 backdrop-blur-sm border-white/20 text-white hover:bg-white/10 z-20" />
        </Carousel>

        {/* Slide indicators - responsive sizing */}
        <div className="flex justify-center gap-2 md:gap-3 mt-8 md:mt-12">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => api?.scrollTo(index)}
              className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-300 ${index === current
                ? `${currentSlide.accentColor.replace("text-", "bg-")} scale-125`
                : "bg-white/30 hover:bg-white/50"
                }`}
              aria-label={`Ir para slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default InteractiveGalaxyHeroCarousel;
