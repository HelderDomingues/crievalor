
import React, { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContactSection from "@/components/ContactSection";
import { ContactHeroSection } from "@/components/contact/ContactHeroSection";
import { GoogleMapSection } from "@/components/contact/GoogleMapSection";
import { ChatbotSection } from "@/components/contact/ChatbotSection";
import { Helmet } from "react-helmet-async";

const Contato = () => {
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactSubject, setContactSubject] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [contactPhone, setContactPhone] = useState("");

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted", { contactName, contactEmail, contactSubject, contactMessage, contactPhone });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Contato | Crie Valor Estratégia</title>
        <meta name="description" content="Entre em contato com a Crie Valor Estratégia. Estamos prontos para ajudar sua empresa a alcançar resultados excepcionais." />
        {/* Conteúdo estático para crawlers */}
        <noscript>
          <h1>Contato - Crie Valor Estratégia</h1>
          <p>Entre em contato com a Crie Valor Estratégia. Estamos prontos para ajudar sua empresa a alcançar resultados excepcionais.</p>
          <h2>Informações de Contato</h2>
          <p>Email: contato@crievalor.com.br</p>
          <p>Telefone: (47) 9 9215-0289</p>
          <h2>Formulário de Contato</h2>
          <p>Preencha nosso formulário para solicitar mais informações sobre nossos serviços.</p>
        </noscript>
      </Helmet>
      
      <Header />
      
      <main className="flex-grow pt-16">
        {/* Hero Section */}
        <ContactHeroSection 
          contactName={contactName}
          setContactName={setContactName}
          contactEmail={contactEmail}
          setContactEmail={setContactEmail}
          contactSubject={contactSubject}
          setContactSubject={setContactSubject}
          contactMessage={contactMessage}
          setContactMessage={setContactMessage}
          contactPhone={contactPhone}
          setContactPhone={setContactPhone}
          handleContactSubmit={handleContactSubmit}
        />
        
        {/* Map Section */}
        <GoogleMapSection />
        
        {/* Chatbot Section */}
        <ChatbotSection />
        
        {/* Contact Form Section */}
        <ContactSection />
      </main>
      
      <Footer />
    </div>
  );
};

export default Contato;
