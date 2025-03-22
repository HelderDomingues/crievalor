
import React from "react";
import { Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const ContactSection = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, you would handle form submission here
    console.log("Form submitted");
  };

  return <section id="contato" className="py-16 md:py-24 relative bg-secondary/30">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="blur-dot w-64 h-64 top-20 -right-32 opacity-10"></div>
        <div className="blur-dot w-96 h-96 -bottom-48 -left-48 opacity-5"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="lg:pr-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Vamos transformar sua estratégia juntos
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              Entre em contato para saber como o MAR pode acelerar os resultados da sua empresa.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <Phone className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-medium">Telefone/Whatsapp</h3>
                  <p className="text-muted-foreground">67 99654-2991 (MS)
47 99215-0289 (SC)</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-medium">E-mail</h3>
                  <p className="text-muted-foreground">contato@crievalor.com.br</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-medium">Endereços:</h3>
                  <div className="space-y-2">
                    <div>
                      <p className="font-medium text-sm">Mato Grosso do Sul</p>
                      <p className="text-muted-foreground">Rua Roque Tertuliano de Andrade, 836. Campo Grande.</p>
                    </div>
                    <div>
                      <p className="font-medium text-sm">Santa Catarina</p>
                      <p className="text-muted-foreground">Rua Bolívia, 59. Navegantes</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-card rounded-xl p-6 md:p-8 border border-border shadow-lg">
            <h3 className="text-xl font-semibold mb-6">Envie uma mensagem</h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    Nome
                  </label>
                  <Input id="name" placeholder="Seu nome" required className="bg-secondary/50 border-border" />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    E-mail
                  </label>
                  <Input id="email" type="email" placeholder="seu@email.com" required className="bg-secondary/50 border-border" />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="company" className="text-sm font-medium">
                  Empresa
                </label>
                <Input id="company" placeholder="Nome da empresa" className="bg-secondary/50 border-border" />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium">
                  Mensagem
                </label>
                <Textarea id="message" placeholder="Como podemos ajudar?" rows={4} required className="bg-secondary/50 border-border resize-none" />
              </div>
              
              <Button type="submit" className="w-full">
                Enviar mensagem
              </Button>
              
              <p className="text-xs text-muted-foreground text-center mt-4">
                Ao enviar este formulário, você concorda com nossa política de privacidade.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>;
};

export default ContactSection;
