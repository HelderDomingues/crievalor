import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, ExternalLink, Calendar, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const BlogPreview = () => {
  // Artigos de exemplo do blog
  const blogPosts = [
    {
      id: 1,
      title: 'Como Implementar o MAR na Sua Empresa',
      excerpt: 'Descubra o passo a passo para aplicar nossa metodologia proprietária e acelerar seus resultados empresariais.',
      date: '2024-01-15',
      readTime: '8 min',
      category: 'Estratégia',
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070',
      url: 'https://blog.crievalor.com.br/como-implementar-mar-empresa'
    },
    {
      id: 2,
      title: '5 Erros Fatais em Gestão que Destroem Empresas',
      excerpt: 'Conheça os principais erros de gestão que podem comprometer o crescimento da sua empresa e como evitá-los.',
      date: '2024-01-10',
      readTime: '6 min',
      category: 'Gestão',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2070',
      url: 'https://blog.crievalor.com.br/erros-fatais-gestao-empresas'
    },
    {
      id: 3,
      title: 'Marketing Digital: Tendências 2024',
      excerpt: 'As principais tendências de marketing digital para 2024 e como aplicá-las no seu negócio para maximizar resultados.',
      date: '2024-01-05',
      readTime: '10 min',
      category: 'Marketing',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015',
      url: 'https://blog.crievalor.com.br/marketing-digital-tendencias-2024'
    }
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <section className="py-16 md:py-24 bg-secondary/30 relative" id="blog" aria-labelledby="blogHeading">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="blur-dot w-64 h-64 top-20 -right-32 opacity-5" aria-hidden="true"></div>
        <div className="blur-dot w-96 h-96 -bottom-48 -left-48 opacity-5" aria-hidden="true"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 id="blogHeading" className="text-3xl md:text-4xl font-bold mb-4">
            Conhecimento que Transforma
          </h2>
          <p className="text-lg text-muted-foreground">
            Insights estratégicos, dicas práticas e tendências de mercado para impulsionar o seu negócio.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {blogPosts.map((post) => (
            <Card key={post.id} className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
              <div className="aspect-video overflow-hidden">
                <img 
                  src={post.image} 
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
              
              <CardHeader className="space-y-2">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
                    {post.category}
                  </span>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>{formatDate(post.date)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{post.readTime}</span>
                  </div>
                </div>
                
                <h3 className="text-xl font-bold group-hover:text-primary transition-colors line-clamp-2">
                  {post.title}
                </h3>
              </CardHeader>
              
              <CardContent className="pt-0">
                <p className="text-muted-foreground mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  asChild
                  className="w-full justify-between group-hover:bg-primary/5"
                >
                  <a href={post.url} target="_blank" rel="noopener noreferrer">
                    Ler artigo completo
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button asChild size="lg" variant="outline">
            <a 
              href="https://blog.crievalor.com.br" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center"
            >
              Ver todos os artigos <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default BlogPreview;