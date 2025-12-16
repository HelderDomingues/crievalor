import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarIcon, UserIcon, ArrowRightIcon } from "lucide-react";

export interface Post {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    cover_image_url: string | null;
    published_at: string | null;
    author_name?: string; // Optional for mapped data
    categories?: { id: string; name: string; slug: string }[];
}

interface PostCardProps {
    post: Post;
}

export const PostCard = ({ post }: PostCardProps) => {
    return (
        <Card className="h-full flex flex-col overflow-hidden hover:shadow-lg transition-shadow duration-300 border-border/50 bg-card/50 backdrop-blur-sm group">
            <div className="relative h-48 w-full overflow-hidden">
                <Link to={`/blog/${post.slug}`}>
                    <img
                        src={post.cover_image_url || "/placeholder.svg"}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                </Link>
                <div className="absolute top-2 right-2 flex gap-1 flex-wrap justify-end">
                    {post.categories?.slice(0, 2).map((cat) => (
                        <Badge key={cat.slug} variant="secondary" className="bg-background/80 backdrop-blur-md">
                            {cat.name}
                        </Badge>
                    ))}
                </div>
            </div>

            <CardHeader className="p-5 pb-2">
                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-2">
                    {post.published_at && (
                        <div className="flex items-center gap-1">
                            <CalendarIcon className="w-3 h-3" />
                            <span>
                                {new Date(post.published_at).toLocaleDateString("pt-BR", {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                })}
                            </span>
                        </div>
                    )}
                    {post.author_name && (
                        <div className="flex items-center gap-1">
                            <UserIcon className="w-3 h-3" />
                            <span>{post.author_name}</span>
                        </div>
                    )}
                </div>
                <Link to={`/blog/${post.slug}`}>
                    <h3 className="text-xl font-bold leading-tight group-hover:text-primary transition-colors line-clamp-2">
                        {post.title}
                    </h3>
                </Link>
            </CardHeader>

            <CardContent className="p-5 pt-2 flex-grow">
                <p className="text-muted-foreground line-clamp-3 text-sm">
                    {post.excerpt}
                </p>
            </CardContent>

            <CardFooter className="p-5 pt-0">
                <Button variant="ghost" className="p-0 h-auto hover:bg-transparent text-primary hover:text-primary/80 group/btn" asChild>
                    <Link to={`/blog/${post.slug}`} className="flex items-center gap-2">
                        Ler artigo
                        <ArrowRightIcon className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    );
};
