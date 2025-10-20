import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Target, Users, Lightbulb, Palette, Brain, Zap, Compass } from "lucide-react";
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

  const slides = [
    {
      id: "proposito-empresa",
      icon: FlagIcon,
      title: "Nosso Propósito",
      subtitle: "Gerar clareza e direção para as empresas",
      description: "Fazendo da atitude o motor do crescimento.",
      ctaText: "Descubra como fazemos isso",
      ctaUrl: "#como-fazemos",
      secondaryCtaText: "Converse conosco",
      secondaryCtaUrl:
        "https://wa.me/5547992150289?text=Tenho%20interesse%20em%20conhecer%20o%20propósito%20da%20Crie%20Valor",
      backgroundType: "purpose" as const,
      gradientColors: "from-amber-900/20 via-yellow-900/10 to-orange-900/20",
      accentColor: "text-amber-400",
      glowColor: "shadow-amber-500/20",
    },
    {
      id: "ecosystem",
      icon: Brain,
      title: "Ecossistema de Inteligência Organizacional",
      subtitle: "Estratégia, clareza e ação — em um só lugar",
      description:
        "O MAR analisa profundamente seu negócio. O Lumia transforma estratégia em execução com consultores virtuais em Vendas, Marketing, Operações e Finanças. Some a isso a definição de Propósito (Simon Sinek) — e ganhe direção com impacto.",
      ctaText: "Conheça o Lumia",
      ctaUrl: "/lumia",
      secondaryCtaText: "Entenda o MAR",
      secondaryCtaUrl: "/mar",
      backgroundType: "ecosystem" as const,
      gradientColors: "from-blue-900/20 via-purple-900/10 to-indigo-900/20",
      accentColor: "text-blue-400",
      glowColor: "shadow-blue-500/20",
    },
    {
      id: "proposito",
      icon: Compass,
      title: "Mentor de Propósito",
      subtitle: 'Descubra o "Por Quê" que transforma empresas comuns em marcas extraordinárias',
      description:
        "A ferramenta de inteligência conversacional que guia líderes e organizações na descoberta do propósito que impulsiona resultados extraordinários.",
      ctaText: "Descobrir o Mentor",
      ctaUrl: "/mentor-proposito",
      secondaryCtaText: "Agendar Demonstração",
      secondaryCtaUrl:
        "https://wa.me/5547992150289?text=Tenho%20interesse%20em%20conhecer%20o%20Mentor%20de%20Propósito",
      backgroundType: "purpose" as const,
      gradientColors: "from-yellow-900/20 via-orange-900/10 to-amber-900/20",
      accentColor: "text-yellow-400",
      glowColor: "shadow-yellow-500/20",
    },
    {
      id: "lumia",
      icon: Zap,
      title: "Lumia: consultoria virtual sob medida",
      subtitle: "4 especialistas treinados especificamente para a sua empresa",
      description:
        "Consultores virtuais calibrados pelo MAR e pelo contexto da sua empresa. Respostas práticas, análises, recomendações e acompanhamento de resultados — na velocidade do seu negócio.",
      ctaText: "Experimente o Lumia",
      ctaUrl: "/lumia",
      secondaryCtaText: "Falar com um especialista",
      secondaryCtaUrl: "https://wa.me/5547992150289?text=Tenho%20interesse%20em%20conhecer%20o%20Lumia",
      backgroundType: "lumia" as const,
      gradientColors: "from-purple-900/20 via-violet-900/10 to-pink-900/20",
      accentColor: "text-purple-400",
      glowColor: "shadow-purple-500/20",
    },
    {
      id: "mar",
      icon: Target,
      title: "MAR — Mapa de Alto Rendimento",
      subtitle: "Diagnóstico profundo e plano estratégico completo",
      description:
        "Metodologia proprietária, testada em +10 anos e +500 empresas. Decisões embasadas, prioridades claras e metas mensuráveis para crescer com consistência.",
      ctaText: "Ver como funciona",
      ctaUrl: "/mar",
      secondaryCtaText: "Agendar avaliação",
      secondaryCtaUrl: "/contato",
      backgroundType: "neural" as const,
      gradientColors: "from-blue-900/20 via-indigo-900/10 to-purple-900/20",
      accentColor: "text-blue-400",
      glowColor: "shadow-blue-500/20",
    },
    {
      id: "mentorias",
      icon: Users,
      title: "Mentorias Empresariais",
      subtitle: "Desenvolva todo o potencial da sua liderança",
      description:
        "Acelere seu crescimento profissional com acompanhamento 1:1 de especialistas em gestão, marketing e recursos humanos.",
      ctaText: "Conhecer Mentorias",
      ctaUrl: "/mentorias",
      secondaryCtaText: "Conversar no WhatsApp",
      secondaryCtaUrl:
        "https://wa.me/5547992150289?text=Tenho%20interesse%20em%20saber%20mais%20sobre%20as%20Mentorias%20Empresariais",
      backgroundType: "growth" as const,
      gradientColors: "from-green-900/20 via-emerald-900/10 to-teal-900/20",
      accentColor: "text-green-400",
      glowColor: "shadow-green-500/20",
    },
    {
      id: "oficina",
      icon: Lightbulb,
      title: "Oficina de Líderes",
      subtitle: "Desenvolva habilidades de liderança excepcionais",
      description:
        "Programa intensivo para formar líderes capazes de inspirar, motivar e conduzir equipes ao sucesso em qualquer cenário.",
      ctaText: "Conhecer Oficina",
      ctaUrl: "/oficina-lideres",
      secondaryCtaText: "Conversar no WhatsApp",
      secondaryCtaUrl:
        "https://wa.me/5547992150289?text=Tenho%20interesse%20em%20saber%20mais%20sobre%20a%20Oficina%20de%20Líderes",
      backgroundType: "energy" as const,
      gradientColors: "from-purple-900/20 via-pink-900/10 to-red-900/20",
      accentColor: "text-purple-400",
      glowColor: "shadow-purple-500/20",
    },
    {
      id: "identidade",
      icon: Palette,
      title: "Identidade Visual",
      subtitle: "Crie uma marca que conecta e converte",
      description:
        "Desenvolvemos identidades visuais únicas que refletem a essência da sua marca e criam conexões duradouras com seu público.",
      ctaText: "Ver Portfólio",
      ctaUrl: "/identidade-visual",
      secondaryCtaText: "Solicitar Orçamento",
      secondaryCtaUrl:
        "https://wa.me/5547992150289?text=Tenho%20interesse%20em%20saber%20mais%20sobre%20Identidade%20Visual",
      backgroundType: "design" as const,
      gradientColors: "from-orange-900/20 via-yellow-900/10 to-red-900/20",
      accentColor: "text-orange-400",
      glowColor: "shadow-orange-500/20",
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
                <div className="min-h-[90vh] flex items-center">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center w-full py-20">
                    {/* Content */}
                    <div className="space-y-8 relative">
                      {/* Icon with glow */}
                      <div className="flex items-center gap-6">
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
                      <div className="space-y-6">
                        <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                          <span
                            className={`bg-gradient-to-r from-white via-white to-gray-300 bg-clip-text text-transparent`}
                          >
                            {slide.title}
                          </span>
                        </h1>

                        {/* Subtitle */}
                        <h2 className={`text-2xl lg:text-3xl font-semibold ${slide.accentColor} leading-relaxed`}>
                          {slide.subtitle}
                        </h2>

                        <p className="text-xl text-gray-300 leading-relaxed max-w-2xl">{slide.description}</p>
                      </div>

                      {/* CTAs with enhanced styling */}
                      <div className="flex flex-col sm:flex-row gap-6 pt-8">
                        <Button
                          asChild
                          size="lg"
                          className={`text-xl px-8 py-6 bg-gradient-to-r ${slide.accentColor.replace("text-", "from-")} to-white text-white hover:scale-105 transition-all duration-300 ${slide.glowColor} shadow-2xl font-bold border-2 border-white/10`}
                        >
                          {slide.ctaUrl.startsWith("#") ? (
                            <a
                              href={slide.ctaUrl}
                              onClick={(e) => {
                                e.preventDefault();
                                document.getElementById(slide.ctaUrl.slice(1))?.scrollIntoView({ behavior: "smooth" });
                              }}
                            >
                              {slide.ctaText} <ArrowRight className="ml-3 h-6 w-6" />
                            </a>
                          ) : (
                            <Link to={slide.ctaUrl}>
                              {slide.ctaText} <ArrowRight className="ml-3 h-6 w-6" />
                            </Link>
                          )}
                        </Button>
                        <Button
                          asChild
                          variant="outline"
                          size="lg"
                          className="text-xl px-8 py-6 border-2 border-white/40 bg-black/40 backdrop-blur-sm text-white hover:bg-white/20 hover:border-white/60 hover:scale-105 transition-all duration-300 font-semibold"
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

                    {/* Visual - Enhanced 3D effect */}
                    <div className="relative flex items-center justify-center">
                      <div className="relative w-96 h-96">
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
                        <div className="absolute inset-8 rounded-full bg-gradient-to-br from-black/50 to-black/80 backdrop-blur-xl border border-white/10 flex items-center justify-center">
                          <div className="absolute inset-4 rounded-full bg-gradient-to-br from-white/5 to-transparent" />
                          <div className="absolute inset-8 rounded-full bg-gradient-to-br from-white/10 to-transparent" />
                          {React.createElement(slide.icon, {
                            className: `h-32 w-32 ${slide.accentColor} relative z-10`,
                          })}
                        </div>

                        {/* Floating particles around the orb */}
                        {[...Array(8)].map((_, i) => (
                          <div
                            key={i}
                            className={`absolute w-2 h-2 ${slide.accentColor.replace("text-", "bg-")} rounded-full`}
                            style={{
                              left: `${50 + 40 * Math.cos((i * Math.PI) / 4)}%`,
                              top: `${50 + 40 * Math.sin((i * Math.PI) / 4)}%`,
                              animation: `orbit 8s linear infinite ${i * 0.5}s`,
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Enhanced navigation with responsive positioning - moved to top area */}
          <CarouselPrevious className="left-4 lg:left-8 top-20 lg:top-24 bg-black/30 backdrop-blur-sm border-white/20 text-white hover:bg-white/10 z-20" />
          <CarouselNext className="right-4 lg:right-8 top-20 lg:top-24 bg-black/30 backdrop-blur-sm border-white/20 text-white hover:bg-white/10 z-20" />
        </Carousel>

        {/* Slide indicators */}
        <div className="flex justify-center gap-3 mt-12">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => api?.scrollTo(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === current
                  ? `${currentSlide.accentColor.replace("text-", "bg-")} scale-125`
                  : "bg-white/30 hover:bg-white/50"
              }`}
            />
          ))}
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InteractiveGalaxyHeroCarousel;
