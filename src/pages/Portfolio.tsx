import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PortfolioGallery from "@/components/PortfolioGallery";
import { getPortfolioProjects } from "@/services/portfolioService";
import { PortfolioProject } from "@/types/portfolio";
import { Helmet } from "react-helmet-async";
import { useScrollToTop } from "@/hooks/useScrollToTop";

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
      </main>

      <Footer />
    </div>
  );
};

export default Portfolio;
