
import React, { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContactSection from "@/components/ContactSection";

import { ContactHeroSection } from "@/components/contact/ContactHeroSection";
import { GoogleMapSection } from "@/components/contact/GoogleMapSection";
import { ChatbotSection } from "@/components/contact/ChatbotSection";
import { Helmet } from "react-helmet-async";
import { LocalBusinessSchema } from "@/components/seo/SchemaMarkup";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";
import { useScrollToTop } from "@/hooks/useScrollToTop";

const Contato = () => {
  useScrollToTop();
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
        <title>Como Podemos Ajudar Sua Empresa? | Contato - Crie Valor</title>
        <meta name="description" content="Entre em contato com a Crie Valor para Inteligência Organizacional com IA. Escritórios em Campo Grande/MS e Navegantes/SC. Helder Domingues e Paulo Gaudioso. contato@crievalor.com.br | (47) 99215-0289" />
        <meta property="og:title" content="Contato | Crie Valor Estratégia" />
        <meta property="og:description" content="Entre em contato com a Crie Valor Estratégia. Estamos prontos para ajudar sua empresa a alcançar resultados excepcionais." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://crievalor.com.br/contato" />
        <meta property="og:image" content="https://crievalor.com.br/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Contato | Crie Valor" />
        <meta name="twitter:description" content="Entre em contato conosco para transformar estrategicamente o seu negócio." />
        <meta name="twitter:image" content="https://crievalor.com.br/og-image.png" />
        <link rel="canonical" href="https://crievalor.com.br/contato" />
      </Helmet>

      <LocalBusinessSchema
        name="Crie Valor - Inteligência Organizacional"
        address={{
          streetAddress: "Rua Bolívia, 59, Gravatá",
          addressLocality: "Navegantes",
          addressRegion: "SC",
          postalCode: "88372-682",
          addressCountry: "BR"
        }}
        telephone="+5547992150289"
        email="contato@crievalor.com.br"
        url="https://crievalor.com.br"
        logo="https://crievalor.com.br/uploads/d2f508b6-c101-4928-b7f7-161a378bb6e8.png"
        priceRange="$$$"
        geo={{
          latitude: -26.8977,
          longitude: -48.6519
        }}
        aggregateRating={{
          ratingValue: 5.0,
          reviewCount: 10
        }}
        reviews={[
          {
            author: "Jefferson Mareco",
            reviewRating: 5,
            reviewBody: "Atendimento excelente, criatividade aliada com ética."
          },
          {
            author: "Thiago Monteiro Yatros",
            reviewRating: 5,
            reviewBody: "Excelente atendimento!"
          }
        ]}
      />

      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://crievalor.com.br" },
          { name: "Contato", url: "https://crievalor.com.br/contato" }
        ]}
      />

      <Header />

      <main className="flex-grow pt-16">
        <div className="container mx-auto px-4 mt-8">
          {/* Answer Capsule */}
          <div className="max-w-4xl p-6 bg-primary/5 border-l-4 border-primary rounded-r-lg mb-8">
            <p className="text-lg leading-relaxed">
              Entre em contato com a <strong>Crie Valor - Inteligência Organizacional</strong>. Escritórios em <strong>Campo Grande/MS</strong> e <strong>Navegantes/SC</strong>. Ponto de apoio para empresários que buscam transformar atitude em crescimento. <strong>contato@crievalor.com.br</strong> | WhatsApp: <strong>(47) 99215-0289</strong>. 27+ anos de experiência estratégica.
            </p>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-center">Como podemos ajudar a transformar sua empresa hoje?</h1>
        </div>

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
