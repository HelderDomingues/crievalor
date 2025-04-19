import React from "react";
import { Briefcase, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProjectCard from "./ProjectCard";

const ProjectExamples = () => {
  return (
    <section id="exemplos" className="py-16 md:py-24 relative">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Exemplos de Projetos Especiais
          </h2>
          <p className="text-lg text-muted-foreground">
            Conheça alguns casos de projetos personalizados que desenvolvemos 
            para clientes com necessidades específicas.
          </p>
        </div>
        
      <div className="space-y-12">
        <ProjectCard
          icon={Briefcase}
          color="blue"
          title="Transformação Digital"
          description="Desenvolvemos um projeto completo de transformação digital para 
            uma empresa de varejo tradicional, incluindo estratégia omnichannel, 
            implementação de e-commerce e integração de sistemas."
          results={[
            "Aumento de 130% nas vendas digitais",
            "Redução de 40% nos custos operacionais",
            "Melhoria de 60% na experiência do cliente"
          ]}
        />
        
        <ProjectCard
          icon={Heart}
          color="purple"
          title="Cultura Organizacional"
          description="Desenvolvemos um programa completo de transformação cultural para 
            uma empresa em processo de fusão, incluindo diagnóstico, 
            definição de valores e implementação de novas práticas."
          results={[
            "Redução de 70% na rotatividade",
            "Aumento de 85% no engajamento dos colaboradores",
            "Integração cultural bem-sucedida em 6 meses"
          ]}
          reversed
        />
      </div>
    </section>
  );
};

export default ProjectExamples;
