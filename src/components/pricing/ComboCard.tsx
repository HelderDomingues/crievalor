import React from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Star, Zap, Gift, ArrowRight } from "lucide-react";
import { Combo } from "./pricingData";
import { AuroraButton } from "@/components/ui/aurora-button";

interface ComboCardProps {
    combo: Combo;
}

const ComboCard = ({ combo }: ComboCardProps) => {
    const isPopular = combo.popular;
    const gradientColor = combo.color || "from-primary to-primary/80";

    return (
        <Card className={`flex flex-col h-full relative overflow-hidden border-2 transition-all duration-300 hover:shadow-xl ${isPopular ? "border-primary shadow-lg scale-105 z-10" : "border-border/50 hover:border-primary/30"}`}>
            {isPopular && (
                <div className="absolute top-0 inset-x-0 flex justify-center -mt-3">
                    <Badge className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-1 shadow-md">
                        <Star className="w-3 h-3 mr-1 fill-current" />
                        Mais Escolhido
                    </Badge>
                </div>
            )}

            <div className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r ${gradientColor}`} />

            <CardHeader className={`pb-4 ${isPopular ? "pt-8" : "pt-6"}`}>
                <div className="text-center mb-2">
                    <h3 className="text-2xl font-bold tracking-tight">{combo.name}</h3>
                    {combo.subtitle && (
                        <p className="text-primary font-medium mt-1">{combo.subtitle}</p>
                    )}
                </div>
                <p className="text-center text-sm text-muted-foreground min-h-[40px]">
                    {combo.description}
                </p>
            </CardHeader>

            <CardContent className="flex-grow space-y-6">
                {/* Pricing Block */}
                <div className="text-center bg-secondary/30 rounded-lg p-4">
                    <div className="text-sm text-muted-foreground line-through mb-1">
                        De {combo.originalPrice}
                    </div>
                    <div className="flex items-center justify-center gap-1 mb-2">
                        <span className="text-3xl font-bold text-foreground">{combo.price}</span>
                    </div>

                    <div className="space-y-1 text-sm">
                        <p className="font-medium text-primary">{combo.installments}</p>
                        {combo.boletoPrice && (
                            <p className="text-muted-foreground text-xs">ou {combo.boletoPrice} no boleto</p>
                        )}
                    </div>

                    <div className="mt-3 pt-3 border-t border-border/50">
                        <div className="flex items-center justify-center gap-2 text-sm font-medium text-green-600">
                            <Zap className="w-4 h-4" />
                            {combo.cashDiscount}
                        </div>
                        <p className="text-2xl font-bold text-green-700">{combo.cashPrice}</p>
                        <Badge variant="outline" className="mt-2 text-green-600 border-green-200 bg-green-50">
                            {combo.savings}
                        </Badge>
                    </div>
                </div>

                {/* Features */}
                <div className="space-y-4">
                    <div>
                        <h4 className="text-sm font-semibold mb-3 flex items-center">
                            <Check className="w-4 h-4 mr-2 text-primary" />
                            O que está incluído:
                        </h4>
                        <ul className="space-y-2">
                            {combo.features.map((feature, index) => (
                                <li key={index} className="flex items-start text-sm text-muted-foreground">
                                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 mr-2 flex-shrink-0" />
                                    {feature}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {combo.bonus.length > 0 && (
                        <div>
                            <h4 className="text-sm font-semibold mb-3 flex items-center text-amber-600">
                                <Gift className="w-4 h-4 mr-2" />
                                Bônus Exclusivos:
                            </h4>
                            <ul className="space-y-2">
                                {combo.bonus.map((bonus, index) => (
                                    <li key={index} className="flex items-start text-sm text-muted-foreground">
                                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 mr-2 flex-shrink-0" />
                                        {bonus}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </CardContent>

            <CardFooter className="pt-2 pb-6">
                <AuroraButton
                    className="w-full font-bold text-lg h-12"
                    glowClassName={gradientColor}
                    href={combo.ctaUrl}
                    target="_blank"
                    rel="noreferrer"
                >
                    {combo.cta}
                    <ArrowRight className="w-5 h-5 ml-2" />
                </AuroraButton>
            </CardFooter>
        </Card>
    );
};

export default ComboCard;
