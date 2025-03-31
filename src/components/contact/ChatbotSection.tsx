
import React from "react";
import { motion } from "framer-motion";
import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

export const ChatbotSection: React.FC = () => {
  return (
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
  );
};
