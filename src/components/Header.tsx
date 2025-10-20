
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AuthHeader from "@/components/AuthHeader";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isMenuOpen]);

  const menuItems = [
    { title: "Home", path: "/" },
    { title: "Blog", path: "https://blog.crievalor.com.br", external: true },
    { title: "Sobre", path: "/sobre" },
    { title: "Contato", path: "/contato" },
  ];

  const servicesItems = [
    { title: "MAR", path: "/mar" },
    { title: "Lumia", path: "https://lumia.crievalor.com.br", external: true },
    { title: "Mentor de Propósito", path: "/mentor-proposito" },
    { title: "Identidade Visual", path: "/identidade-visual" },
    { title: "Mentorias", path: "/mentorias" },
    { title: "Oficina de Líderes", path: "/oficina-de-lideres" },
    { title: "Projetos sob Medida", path: "/projetos" },
  ];

  const handleWhatsAppContact = () => {
    const message = encodeURIComponent("Olá, gostaria de obter mais informações sobre os serviços da Crie Valor.");
    window.open(`https://wa.me/5547996542991text=${message}`, '_blank');
  };

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/90 backdrop-blur-md border-b border-border shadow-md"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 md:h-16">
          <div className="flex items-center">
            <Link
              to="/"
              className="flex items-center"
            >
              <img 
                src="/lovable-uploads/fc868084-d22b-4877-907b-fe02e64fc501.png" 
                alt="Crie Valor Logo" 
                className="h-6 w-auto mr-2 object-contain"
              />
            </Link>
          </div>

          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center space-x-4">
            {menuItems.map((item) => (
              item.external ? (
                <a
                  key={item.path}
                  href={item.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm transition-all hover:text-primary text-foreground/80 link-underline"
                >
                  {item.title}
                </a>
              ) : (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`text-sm transition-all hover:text-primary ${
                    isActive(item.path)
                      ? "text-primary font-medium"
                      : "text-foreground/80"
                  } link-underline`}
                >
                  {item.title}
                </Link>
              )
            ))}
            
            {/* Services Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center text-sm transition-all hover:text-primary text-foreground/80 link-underline">
                  Soluções
                  <ChevronDown className="ml-1 h-3 w-3" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48 bg-background border border-border shadow-lg">
                {servicesItems.map((service) => (
                  <DropdownMenuItem key={service.path} asChild>
                    <Link
                      to={service.path}
                      className={`block px-3 py-2 text-sm transition-colors hover:bg-secondary hover:text-primary ${
                        isActive(service.path) ? "text-primary font-medium" : "text-foreground"
                      }`}
                    >
                      {service.title}
                    </Link>
                  </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
            </DropdownMenu>
            <Button
              size="sm"
              className="ml-2 bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-glow"
              asChild
            >
              <Link to="/contato">
                Fale Conosco
              </Link>
            </Button>
            
            <div className="ml-4">
              <AuthHeader />
            </div>
          </nav>

          {/* Mobile Menu Button and AuthHeader for mobile */}
          <div className="md:hidden flex items-center gap-2">
            <AuthHeader />
            <button
              onClick={toggleMenu}
              className="text-foreground p-2 rounded-full hover:bg-secondary transition-colors"
              aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 bg-background z-40 transition-transform duration-300 md:hidden ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ top: "56px" }}
      >
        <nav className="flex flex-col p-8 space-y-4">
          {menuItems.map((item) => (
            item.external ? (
              <a
                key={item.path}
                href={item.path}
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg py-2 border-b border-border text-foreground/80"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.title}
              </a>
            ) : (
              <Link
                key={item.path}
                to={item.path}
                className={`text-lg py-2 border-b border-border ${
                  isActive(item.path)
                    ? "text-primary font-medium"
                    : "text-foreground/80"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.title}
              </Link>
            )
          ))}
          
          {/* Mobile Services Menu */}
          <div className="space-y-2">
            <div className="text-lg font-medium py-2 text-primary border-b border-border">
              Serviços
            </div>
            {servicesItems.map((service) => (
              <Link
                key={service.path}
                to={service.path}
                className={`text-base py-2 pl-4 block ${
                  isActive(service.path)
                    ? "text-primary font-medium"
                    : "text-foreground/70"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {service.title}
              </Link>
            ))}
          </div>
          <Button
            className="mt-4 bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-glow"
            asChild
          >
            <Link to="/contato" onClick={() => setIsMenuOpen(false)}>
              Fale Conosco
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
