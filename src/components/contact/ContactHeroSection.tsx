
import React from "react";
import { motion } from "framer-motion";
import { formatPhoneNumber } from "@/utils/formatters";
import { ContactCard } from "./ContactCard";
import { LocationInfoCard } from "./LocationInfoCard";

interface ContactHeroSectionProps {
  contactName: string;
  setContactName: (value: string) => void;
  contactEmail: string;
  setContactEmail: (value: string) => void;
  contactSubject: string;
  setContactSubject: (value: string) => void;
  contactMessage: string;
  setContactMessage: (value: string) => void;
  contactPhone: string;
  setContactPhone: (value: string) => void;
  handleContactSubmit: (e: React.FormEvent) => void;
}

export const ContactHeroSection: React.FC<ContactHeroSectionProps> = ({
  contactName,
  setContactName,
  contactEmail,
  setContactEmail,
  contactSubject,
  setContactSubject,
  contactMessage,
  setContactMessage,
  contactPhone,
  setContactPhone,
  handleContactSubmit,
}) => {
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContactPhone(formatPhoneNumber(e.target.value));
  };

  return (
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
          <LocationInfoCard />
          
          <ContactCard 
            contactName={contactName}
            setContactName={setContactName}
            contactEmail={contactEmail}
            setContactEmail={setContactEmail}
            contactSubject={contactSubject}
            setContactSubject={setContactSubject}
            contactMessage={contactMessage}
            setContactMessage={setContactMessage}
            contactPhone={contactPhone}
            handlePhoneChange={handlePhoneChange}
            handleContactSubmit={handleContactSubmit}
          />
        </motion.div>
      </div>
    </section>
  );
};
