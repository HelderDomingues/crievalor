
import React from "react";
import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Linkedin, Instagram, Twitter } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-secondary/50 border-t border-border">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <img 
                src="/lovable-uploads/fc868084-d22b-4877-907b-fe02e64fc501.png" 
                alt="Crie Valor Logo" 
                className="h-10"
              />
            </Link>
            <p className="text-muted-foreground text-sm">
              Transformando negócios através da inteligência artificial e estratégia 
              de alto rendimento para empresas de todos os tamanhos.
            </p>
            <div className="flex space-x-4 pt-2">
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Twitter"
              >
                <Twitter size={20} />
              </a>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-base font-medium text-foreground">Navegação</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/mar" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  MAR - Mapa para Alto Rendimento
                </Link>
              </li>
              <li>
                <a 
                  href="https://blog.crievalor.com.br" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  Blog
                </a>
              </li>
              <li>
                <Link to="/sobre" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Sobre Nós
                </Link>
              </li>
              <li>
                <Link to="/contato" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Contato
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-base font-medium text-foreground">Serviços</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/mar" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  MAR - Mapa para Alto Rendimento
                </Link>
              </li>
              <li>
                <Link to="/escola-gestao" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Escola de Gestão
                </Link>
              </li>
              <li>
                <Link to="/mentorias" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Mentorias
                </Link>
              </li>
              <li>
                <Link to="/identidade-visual" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Branding
                </Link>
              </li>
              <li>
                <Link to="/projetos" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Projetos sob Medida
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-base font-medium text-foreground">Contato</h4>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <Mail size={18} className="text-primary mt-0.5" />
                <span className="text-muted-foreground text-sm">contato@crievalor.com.br</span>
              </li>
              <li className="flex items-start space-x-3">
                <Phone size={18} className="text-primary mt-0.5" />
                <span className="text-muted-foreground text-sm">67 99654-2991 (MS)<br/>47 99215-0289 (SC)</span>
              </li>
              <li className="flex items-start space-x-3">
                <MapPin size={18} className="text-primary mt-0.5" />
                <div className="text-muted-foreground text-sm">
                  <div>MS: Campo Grande</div>
                  <div>SC: Navegantes</div>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Link to="/politica-de-privacidade" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Política de Privacidade
            </Link>
            <Link to="/politica-de-reembolso" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Política de Entrega e Reembolso
            </Link>
            <Link to="/termos-de-servico" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Termos de Serviço
            </Link>
            <Link to="/acessibilidade" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Acessibilidade
            </Link>
          </div>
          
          <p className="text-muted-foreground text-sm text-center">
            © {currentYear} Crie Valor. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
