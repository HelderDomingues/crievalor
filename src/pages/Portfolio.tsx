import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PortfolioGallery from "@/components/PortfolioGallery";
import { getPortfolioProjects } from "@/services/portfolioService";
import { PortfolioProject } from "@/types/portfolio";
import { Helmet } from "react-helmet-async";
import { FAQSchema } from "@/components/seo/SchemaMarkup";
import { useScrollToTop } from "@/hooks/useScrollToTop";

const faqItems = [
  {
    question: "Quem é Helder Domingues?",
    answer:
      "Helder Domingues é publicitário e consultor de marca e estratégia. Trabalha com identidade visual e posicionamento de marca, e constrói sistemas web com agentes de IA sob sua direção. É um dos fundadores da Crie Valor, de Campo Grande/MS.",
  },
  {
    question: "O que o Helder faz?",
    answer:
      "Marca e posicionamento, criação e direção de arte, e sistemas web. Nos sistemas, a construção é feita com agentes de IA sob direção dele. O ponto em comum é partir de um problema de negócio, definir a estratégia e executar. Cada trabalho usa só a parte que o problema pede.",
  },
  {
    question: "Qual projeto recente está no portfólio?",
    answer:
      "O sistema de votação Melhores do Varejo Campo Grande/MS 2026, feito para a CDL Campo Grande. O público escolhe os melhores comércios e serviços da cidade em 28 categorias, com cadastro, votação por categoria e painel interno de acompanhamento da apuração. O sistema está em melhores.cdlcampogrande.com.br.",
  },
  {
    question: "Como o Helder participa da criação de um sistema?",
    answer:
      "Ele define o problema de negócio, as regras e a experiência do sistema e conduz a construção até a entrada no ar. A IA entra como método: agentes de IA escrevem e testam código sob a direção dele. Isso é diferente de um sistema com IA dentro do produto; cada projeto diz qual é o caso.",
  },
  {
    question: "Qual a relação entre este portfólio e a Crie Valor?",
    answer:
      "O portfólio é de Helder Domingues e está no site da Crie Valor, empresa da qual ele é um dos fundadores. A galeria reúne os trabalhos autorizados para exibição.",
  },
  {
    question: "Como falar com o Helder?",
    answer:
      "Pelos canais de contato da Crie Valor, no fim desta página. A conversa pode ser sobre um projeto, uma parceria ou uma oportunidade de trabalho.",
  },
];

const Portfolio = () => {
  useScrollToTop();
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const data = await getPortfolioProjects();
        setProjects(data);
      } catch (error) {
        console.error("Error loading portfolio projects:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProjects();
  }, []);

  // Remove a meta description estática do index.html nesta página para não
  // deixar duas tags de descrição no DOM (a de cá é a do Helmet abaixo).
  useEffect(() => {
    document
      .querySelectorAll('head meta[name="description"]:not([data-rh])')
      .forEach((el) => el.remove());
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet>
        <title>Portfólio | Crie Valor</title>
        <meta
          name="description"
          content="Projetos entregues pela Crie Valor: sistemas de gestão, estratégia e identidade visual para empresas."
        />
        <link rel="canonical" href="https://crievalor.com.br/portfolio" />
        <meta property="og:title" content="Portfólio | Crie Valor" />
        <meta
          property="og:description"
          content="Projetos entregues pela Crie Valor: sistemas de gestão, estratégia e identidade visual para empresas."
        />
        <meta property="og:url" content="https://crievalor.com.br/portfolio" />
        <meta property="og:type" content="website" />

        <FAQSchema questions={faqItems} />
      </Helmet>

      <Header />

      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Portfólio</h1>
        <p className="text-muted-foreground mb-10 max-w-2xl">
          Projetos entregues pela Crie Valor para clientes reais — sistemas de
          gestão, estratégia e identidade visual.
        </p>

        {isLoading ? (
          <p className="text-muted-foreground">Carregando projetos…</p>
        ) : projects.length === 0 ? (
          <p className="text-muted-foreground">
            Nenhum projeto publicado ainda.
          </p>
        ) : (
          <PortfolioGallery projects={projects} />
        )}

        <section className="mt-16">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">Perguntas frequentes</h2>
          <div className="space-y-6 max-w-3xl">
            {faqItems.map((item) => (
              <div key={item.question}>
                <h3 className="text-lg font-semibold mb-1">{item.question}</h3>
                <p className="text-muted-foreground leading-relaxed">{item.answer}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Portfolio;
