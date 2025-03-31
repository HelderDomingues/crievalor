
import React from "react";
import { motion } from "framer-motion";

export const GoogleMapSection: React.FC = () => {
  return (
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
  );
};
