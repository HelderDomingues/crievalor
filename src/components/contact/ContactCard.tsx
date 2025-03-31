
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface ContactCardProps {
  contactName: string;
  setContactName: (value: string) => void;
  contactEmail: string;
  setContactEmail: (value: string) => void;
  contactSubject: string;
  setContactSubject: (value: string) => void;
  contactMessage: string;
  setContactMessage: (value: string) => void;
  contactPhone: string;
  handlePhoneChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleContactSubmit: (e: React.FormEvent) => void;
}

export const ContactCard: React.FC<ContactCardProps> = ({
  contactName,
  setContactName,
  contactEmail,
  setContactEmail,
  contactSubject,
  setContactSubject,
  contactMessage,
  setContactMessage,
  contactPhone,
  handlePhoneChange,
  handleContactSubmit,
}) => {
  return (
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
  );
};
