
import React from "react";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Política de Privacidade - Crie Valor</title>
        <meta name="description" content="Política de privacidade da Crie Valor. Entenda como coletamos, usamos e protegemos seus dados pessoais conforme LGPD." />
        <link rel="canonical" href="https://crievalor.com.br/privacy-policy" />
        <meta name="robots" content="noindex, follow" />
      </Helmet>
      <Header />
      
      <main className="flex-grow pt-24">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-8">Política de Privacidade</h1>
          
          <div className="prose prose-invert max-w-none">
            <p className="text-lg mb-4">
              Última atualização: {new Date().toLocaleDateString('pt-BR')}
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">1. Introdução</h2>
            <p>
              A Crie Valor Estratégia LTDA ("nós", "nosso" ou "Crie Valor") está comprometida com a proteção da sua privacidade. 
              Esta Política de Privacidade descreve como coletamos, usamos, processamos e divulgamos seus dados pessoais, em 
              conformidade com a Lei Geral de Proteção de Dados (LGPD) e outras legislações aplicáveis.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">2. Dados que Coletamos</h2>
            <p>
              Podemos coletar as seguintes categorias de dados pessoais:
            </p>
            <ul className="list-disc pl-6 mt-2 mb-4">
              <li>Dados de identificação (nome, e-mail, telefone)</li>
              <li>Dados profissionais (empresa, cargo)</li>
              <li>Dados de uso do serviço</li>
              <li>Informações de navegação e cookies</li>
            </ul>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">3. Como Utilizamos seus Dados</h2>
            <p>
              Utilizamos seus dados pessoais para:
            </p>
            <ul className="list-disc pl-6 mt-2 mb-4">
              <li>Fornecer e melhorar nossos serviços, incluindo o MAR</li>
              <li>Comunicar informações sobre nossos serviços</li>
              <li>Personalizar sua experiência</li>
              <li>Cumprir obrigações legais e regulatórias</li>
              <li>Proteger nossos direitos e prevenir fraudes</li>
            </ul>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">4. Armazenamento e Segurança</h2>
            <p>
              Implementamos medidas técnicas e organizacionais adequadas para proteger seus dados pessoais 
              contra acesso não autorizado, alteração, divulgação ou destruição acidental ou ilegal.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">5. Compartilhamento de Dados</h2>
            <p>
              Podemos compartilhar seus dados com:
            </p>
            <ul className="list-disc pl-6 mt-2 mb-4">
              <li>Prestadores de serviços que nos auxiliam</li>
              <li>Parceiros de negócios quando necessário para fornecer serviços</li>
              <li>Autoridades competentes, quando exigido por lei</li>
            </ul>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">6. Seus Direitos</h2>
            <p>
              Você tem o direito de:
            </p>
            <ul className="list-disc pl-6 mt-2 mb-4">
              <li>Acessar seus dados pessoais</li>
              <li>Corrigir dados incompletos ou imprecisos</li>
              <li>Solicitar a exclusão de seus dados</li>
              <li>Solicitar a portabilidade de seus dados</li>
              <li>Revogar o consentimento a qualquer momento</li>
            </ul>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">7. Contato</h2>
            <p>
              Para exercer seus direitos ou esclarecer dúvidas sobre esta Política, entre em contato conosco 
              pelo e-mail: contato@crievalor.com.br
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
