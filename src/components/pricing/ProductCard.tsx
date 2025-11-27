import React from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, ArrowRight, Info } from "lucide-react";
import { Product } from "./pricingData";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ProductCardProps {
    product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
    return (
        <Card className="flex flex-col h-full border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-4">
                <div className="flex justify-between items-start gap-4">
                    <div>
                        {product.badge && (
                            <Badge variant="secondary" className="mb-2">
                                {product.badge}
                            </Badge>
                        )}
                        <h3 className="text-xl font-bold text-foreground">{product.name}</h3>
                    </div>
                </div>
                <p className="text-sm text-muted-foreground mt-2 min-h-[40px]">
                    {product.description}
                </p>
            </CardHeader>

            <CardContent className="flex-grow pt-0">
                <div className="mb-6">
                    <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-bold text-primary">{product.price}</span>
                        {product.period && (
                            <span className="text-sm text-muted-foreground">{product.period}</span>
                        )}
                    </div>
                    {product.installments && (
                        <p className="text-sm text-muted-foreground mt-1">
                            {product.installments}
                        </p>
                    )}
                    {product.details && (
                        <div className="mt-2 inline-flex items-center text-xs text-green-600 bg-green-500/10 px-2 py-1 rounded-full">
                            <Info className="w-3 h-3 mr-1" />
                            {product.details}
                        </div>
                    )}
                </div>

                <div className="space-y-3">
                    {product.features.map((feature, index) => (
                        <div key={index} className="flex items-start gap-2 text-sm">
                            <div className="mt-1 min-w-[16px]">
                                <Check className="w-4 h-4 text-primary" />
                            </div>
                            <span className="text-muted-foreground">{feature}</span>
                        </div>
                    ))}
                </div>
            </CardContent>

            <CardFooter className="pt-4">
                <Button
                    className="w-full group"
                    variant={product.highlight ? "default" : "outline"}
                    asChild
                >
                    <a href={product.ctaUrl} target={product.ctaUrl.startsWith("http") ? "_blank" : "_self"} rel="noreferrer">
                        {product.cta}
                        <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                    </a>
                </Button>
            </CardFooter>
        </Card>
    );
};

export default ProductCard;
