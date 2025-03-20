
import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const RefundPolicy = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-24">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-8">Política de Entrega e Reembolso</h1>
          
          <div className="prose prose-invert max-w-none">
            <p className="text-lg mb-4">
              Última atualização: {new Date().toLocaleDateString('pt-BR')}
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">1. Entrega de Serviços</h2>
            <p>
              A Crie Valor compromete-se a entregar os serviços contratados, incluindo o MAR - Mapa para Alto Rendimento, 
              conforme os prazos e condições estabelecidos no momento da contratação. Os prazos específicos de entrega 
              variam de acordo com a complexidade do projeto e serão informados durante o processo de contratação.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">2. Política de Reembolso</h2>
            <p>
              Entendemos que cada projeto é único e estamos comprometidos com a sua satisfação. Nossa política de reembolso 
              segue as seguintes diretrizes:
            </p>
            
            <h3 className="text-xl font-semibold mt-6 mb-3">2.1 Serviços de Consultoria e MAR</h3>
            <ul className="list-disc pl-6 mt-2 mb-4">
              <li>
                <strong>Cancelamento antes do início do projeto:</strong> Se você cancelar antes do início do projeto 
                (antes da reunião inicial ou da coleta de dados), reembolsaremos 80% do valor pago.
              </li>
              <li>
                <strong>Cancelamento após o início do projeto:</strong> Após o início do projeto, o reembolso será 
                proporcional ao trabalho já realizado, descontados os custos administrativos.
              </li>
              <li>
                <strong>Projeto concluído:</strong> Após a entrega completa do serviço, não haverá reembolso, mas 
                garantimos ajustes conforme especificado em contrato.
              </li>
            </ul>
            
            <h3 className="text-xl font-semibold mt-6 mb-3">2.2 Treinamentos e Workshops</h3>
            <ul className="list-disc pl-6 mt-2 mb-4">
              <li>
                <strong>Cancelamento com 15+ dias de antecedência:</strong> Reembolso de 90% do valor pago.
              </li>
              <li>
                <strong>Cancelamento entre 7-14 dias de antecedência:</strong> Reembolso de 50% do valor pago.
              </li>
              <li>
                <strong>Cancelamento com menos de 7 dias de antecedência:</strong> Não haverá reembolso, mas é 
                possível transferir a inscrição para outra pessoa ou para uma data futura.
              </li>
            </ul>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">3. Procedimento para Solicitação de Reembolso</h2>
            <p>
              Para solicitar um reembolso, entre em contato conosco através do e-mail contato@crievalor.com.br com as 
              seguintes informações:
            </p>
            <ul className="list-disc pl-6 mt-2 mb-4">
              <li>Nome completo e informações de contato</li>
              <li>Detalhes do serviço contratado</li>
              <li>Data da contratação</li>
              <li>Motivo da solicitação de reembolso</li>
              <li>Comprovante de pagamento</li>
            </ul>
            
            <p>
              Analisaremos cada solicitação individualmente e responderemos em até 5 dias úteis.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">4. Contato</h2>
            <p>
              Para dúvidas sobre nossa política de entrega e reembolso, entre em contato pelo e-mail: 
              contato@crievalor.com.br
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default RefundPolicy;
