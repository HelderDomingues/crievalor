
import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const TermsOfService = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-24">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-8">Termos de Serviço</h1>
          
          <div className="prose prose-invert max-w-none">
            <p className="text-lg mb-4">
              Última atualização: {new Date().toLocaleDateString('pt-BR')}
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">1. Aceitação dos Termos</h2>
            <p>
              Ao acessar e utilizar os serviços oferecidos pela Crie Valor Estratégia LTDA ("Crie Valor"), 
              incluindo o MAR - Mapa para Alto Rendimento, você concorda com estes Termos de Serviço. 
              Se não concordar com qualquer parte destes termos, não deverá utilizar nossos serviços.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">2. Descrição dos Serviços</h2>
            <p>
              A Crie Valor oferece serviços de consultoria estratégica, incluindo o MAR - Mapa para Alto Rendimento, 
              uma ferramenta que combina inteligência artificial com expertise humana para gerar planos estratégicos 
              personalizados para empresas.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">3. Uso dos Serviços</h2>
            <p>
              Ao utilizar nossos serviços, você concorda em:
            </p>
            <ul className="list-disc pl-6 mt-2 mb-4">
              <li>Fornecer informações precisas e completas quando solicitado</li>
              <li>Utilizar os serviços de acordo com as leis aplicáveis</li>
              <li>Não utilizar os serviços para fins ilegais ou não autorizados</li>
              <li>Não tentar interferir no funcionamento adequado dos serviços</li>
              <li>Proteger suas credenciais de acesso, quando aplicável</li>
            </ul>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">4. Propriedade Intelectual</h2>
            <p>
              Todo o conteúdo disponibilizado pela Crie Valor, incluindo textos, gráficos, logos, ícones, imagens, 
              clipes de áudio, downloads digitais e compilações de dados, é propriedade da Crie Valor ou de seus 
              fornecedores de conteúdo e está protegido pelas leis brasileiras e internacionais de direitos autorais.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">5. Confidencialidade e Dados do Cliente</h2>
            <p>
              Tratamos com o máximo sigilo todas as informações compartilhadas por nossos clientes durante a prestação de serviços. 
              Estas informações serão utilizadas exclusivamente para o desenvolvimento dos projetos contratados, conforme 
              detalhado em nossa Política de Privacidade.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">6. Limitação de Responsabilidade</h2>
            <p>
              A Crie Valor não será responsável por quaisquer danos indiretos, incidentais, especiais, consequenciais ou 
              punitivos, incluindo perda de lucros, resultantes do uso ou incapacidade de usar os serviços.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">7. Alterações nos Termos</h2>
            <p>
              Reservamo-nos o direito de modificar estes termos a qualquer momento. As alterações serão efetivas após 
              a publicação dos termos revisados. O uso continuado dos serviços após tais alterações constitui sua aceitação 
              dos novos termos.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">8. Lei Aplicável</h2>
            <p>
              Estes termos serão regidos e interpretados de acordo com as leis brasileiras. Qualquer disputa relacionada 
              a estes termos será submetida à jurisdição exclusiva dos tribunais brasileiros.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">9. Contato</h2>
            <p>
              Para questões relacionadas a estes Termos de Serviço, entre em contato pelo e-mail: contato@crievalor.com.br
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default TermsOfService;
