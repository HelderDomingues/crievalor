import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Calendar, Clock, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { blogService } from '@/services/blogService';
import { Post } from '@/components/blog/PostCard';
import { Skeleton } from '@/components/ui/skeleton';

const BlogPreview = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { posts: fetchedPosts } = await blogService.getPosts(3);
        setPosts(fetchedPosts);
      } catch (error) {
        console.error('Error fetching blog posts for preview:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '';
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
          {loading ? (
            [1, 2, 3].map((i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="aspect-video w-full" />
                <CardHeader className="space-y-2">
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-6 w-3/4" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full mt-2" />
                  <Skeleton className="h-4 w-2/3 mt-2" />
                </CardContent>
              </Card>
            ))
          ) : posts.length > 0 ? (
            posts.map((post) => (
              <Card key={post.id} className="group hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col">
                <div className="aspect-video overflow-hidden">
                  <Link to={`/blog/${post.slug}`}>
                    <img
                      src={post.cover_image_url || "/placeholder.svg"}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  </Link>
                </div>

                <CardHeader className="space-y-2 flex-grow">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    {post.categories && post.categories.length > 0 && (
                      <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
                        {post.categories[0].name}
                      </span>
                    )}
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>{formatDate(post.published_at)}</span>
                    </div>
                  </div>

                  <Link to={`/blog/${post.slug}`}>
                    <h3 className="text-xl font-bold group-hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                  </Link>
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
                    <Link to={`/blog/${post.slug}`}>
                      Ler artigo completo
                      <BookOpen className="h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">Novos artigos estão sendo preparados.</p>
            </div>
          )}
        </div>

        <div className="text-center">
          <Button asChild size="lg" variant="outline">
            <Link to="/blog" className="inline-flex items-center">
              Ver todos os artigos <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default BlogPreview;