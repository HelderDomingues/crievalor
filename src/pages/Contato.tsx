import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContactSection from "@/components/ContactSection";
import { MapPin, Phone, Mail, Clock, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { formatPhoneNumber } from "@/utils/formatters";

const Contato = () => {
  const [contactName, setContactName] = React.useState("");
  const [contactEmail, setContactEmail] = React.useState("");
  const [contactSubject, setContactSubject] = React.useState("");
  const [contactMessage, setContactMessage] = React.useState("");
  const [contactPhone, setContactPhone] = React.useState("");

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContactPhone(formatPhoneNumber(e.target.value));
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted", { contactName, contactEmail, contactSubject, contactMessage, contactPhone });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-16">
        {/* Hero Section */}
        <section className="py-16 md:py-24 relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute w-full h-full">
              <video
                autoPlay
                muted
                loop
                playsInline
                className="absolute w-full h-full object-cover opacity-20"
              >
                <source src="https://elements-video-cover-images-0.imgix.net/files/255686334/preview.mp4?auto=compress&crop=edges&fit=crop&fm=webm&h=630&w=1200&s=2c3d6eb06f57700b78aa31440cd61315" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
            <div className="blur-dot w-96 h-96 -top-48 -right-48 opacity-10"></div>
            <div className="blur-dot w-64 h-64 bottom-0 left-1/4 opacity-5"></div>
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <motion.div 
              className="max-w-4xl mx-auto text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Entre em <span className="text-primary">Contato</span>
              </h1>
              <p className="text-xl text-muted-foreground">
                Estamos prontos para ajudar a transformar o seu negócio
              </p>
            </motion.div>
            
            <motion.div 
              className="grid grid-cols-1 lg:grid-cols-2 gap-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <div className="bg-card rounded-xl border border-border p-8 shadow-lg">
                <h2 className="text-2xl font-bold mb-6">Nossos Escritórios</h2>
                
                <div className="space-y-8">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-3 rounded-full">
                      <MapPin className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium mb-1">Santa Catarina</h3>
                      <p className="text-muted-foreground">
                        Navegantes, SC<br />
                        Brasil
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-3 rounded-full">
                      <MapPin className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium mb-1">Mato Grosso do Sul</h3>
                      <p className="text-muted-foreground">
                        Campo Grande, MS<br />
                        Brasil
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-3 rounded-full">
                      <Phone className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium mb-1">Telefone</h3>
                      <p className="text-muted-foreground">
                        (XX) XXXX-XXXX
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-3 rounded-full">
                      <Mail className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium mb-1">Email</h3>
                      <p className="text-muted-foreground">
                        contato@crievalor.com.br
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-3 rounded-full">
                      <Clock className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium mb-1">Horário de Atendimento</h3>
                      <p className="text-muted-foreground">
                        Segunda a Sexta: 9h às 18h<br />
                        Sábado e Domingo: Fechado
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-card rounded-xl border border-border p-8 shadow-lg">
                <h2 className="text-2xl font-bold mb-6">Fale Conosco</h2>
                
                <form className="space-y-6" onSubmit={handleContactSubmit}>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium mb-2">
                        Nome
                      </label>
                      <input
                        type="text"
                        id="name"
                        className="w-full px-4 py-2 bg-secondary/50 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Seu nome"
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        className="w-full px-4 py-2 bg-secondary/50 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="seu@email.com"
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium mb-2">
                      Telefone
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      className="w-full px-4 py-2 bg-secondary/50 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="(XX) XXXXX-XXXX"
                      value={contactPhone}
                      onChange={handlePhoneChange}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium mb-2">
                      Assunto
                    </label>
                    <input
                      type="text"
                      id="subject"
                      className="w-full px-4 py-2 bg-secondary/50 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Assunto da mensagem"
                      value={contactSubject}
                      onChange={(e) => setContactSubject(e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium mb-2">
                      Mensagem
                    </label>
                    <textarea
                      id="message"
                      rows={5}
                      className="w-full px-4 py-2 bg-secondary/50 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Sua mensagem"
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                    ></textarea>
                  </div>
                  
                  <Button type="submit" className="w-full">
                    Enviar Mensagem
                  </Button>
                </form>
              </div>
            </motion.div>
          </div>
        </section>
        
        {/* Map Section */}
        <section className="py-16 md:py-24 bg-secondary/30 relative">
          <div className="container mx-auto px-4 relative z-10">
            <motion.div 
              className="max-w-3xl mx-auto text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Nossa Localização
              </h2>
              <p className="text-lg text-muted-foreground">
                Atendemos em diversas regiões do Brasil através dos nossos escritórios
              </p>
            </motion.div>
            
            <motion.div 
              className="bg-card rounded-xl overflow-hidden border border-border shadow-xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="aspect-[16/9] w-full">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3681.1970841444394!2d-43.229019223884704!3d-22.692661178727288!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjLCsDQxJzMzLjYiUyA0M8KwMTMnMzUuOCJX!5e0!3m2!1sen!2sbr!4v1627313024204!5m2!1sen!2sbr"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Google Maps"
                  className="w-full h-full"
                ></iframe>
              </div>
            </motion.div>
          </div>
        </section>
        
        {/* Chatbot Section */}
        <section className="py-16 md:py-24 relative">
          <div className="container mx-auto px-4 relative z-10">
            <motion.div 
              className="max-w-3xl mx-auto text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center justify-center p-2 bg-primary/10 text-primary rounded-full mb-6">
                <MessageSquare className="h-6 w-6" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Precisa de ajuda imediata?
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Utilize nosso chatbot inteligente para tirar dúvidas rápidas ou iniciar uma conversa
              </p>
              <Button size="lg" className="animate-pulse">
                Iniciar Chat
              </Button>
            </motion.div>
          </div>
        </section>
        
        {/* Contact Form Section */}
        <ContactSection />
      </main>
      
      <Footer />
    </div>
  );
};

export default Contato;
