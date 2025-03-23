
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
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
    { title: "MAR", path: "/mar" },
    { title: "Sobre", path: "/sobre" },
    { title: "Contato", path: "/contato" },
  ];

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/90 backdrop-blur-md border-b border-border shadow-md"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <div className="flex items-center">
            <Link
              to="/"
              className="flex items-center"
            >
              <img 
                src="/lovable-uploads/fc868084-d22b-4877-907b-fe02e64fc501.png" 
                alt="Crie Valor Logo" 
                className="h-6 mr-2"  /* Reduced from h-8 (25% smaller) */
              />
            </Link>
          </div>

          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center space-x-8">
            {menuItems.map((item) => (
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
            ))}
            <Button
              size="sm"
              className="ml-2 bg-primary text-primary-foreground hover:bg-primary/90 transition-all"
            >
              Fale Conosco
            </Button>
            
            {/* Add AuthHeader component here */}
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
        style={{ top: "64px" }}
      >
        <nav className="flex flex-col p-8 space-y-6">
          {menuItems.map((item) => (
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
          ))}
          <Button className="mt-4 bg-primary text-primary-foreground hover:bg-primary/90 transition-all">
            Fale Conosco
          </Button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
