import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Download, MessageCircle, Mail } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const PalestraSucesso = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-4xl font-bold mb-4">
              Inscrição Confirmada!
            </h1>
            <p className="text-xl text-muted-foreground">
              Obrigado por se inscrever. Suas informações foram registradas com sucesso.
            </p>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Próximos Passos</CardTitle>
              <CardDescription>
                Veja o que acontece a partir de agora
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <Mail className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Confirmação por Email</h3>
                  <p className="text-muted-foreground text-sm">
                    Você receberá um email de confirmação em alguns minutos com os detalhes da sua inscrição.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <Download className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Material Exclusivo</h3>
                  <p className="text-muted-foreground text-sm">
                    Após a palestra, você receberá por email todo o material complementar e recursos exclusivos.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <MessageCircle className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Contato Direto</h3>
                  <p className="text-muted-foreground text-sm">
                    Nossa equipe entrará em contato para acompanhar seu progresso e oferecer suporte adicional.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Aproveite Nossos Serviços</CardTitle>
              <CardDescription>
                Continue sua jornada de crescimento empresarial
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                A Crie Valor oferece soluções completas em marketing e gestão empresarial. 
                Conheça nossos serviços e descubra como podemos ajudar sua empresa a crescer ainda mais.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild className="flex-1">
                  <Link to="/contato">
                    Falar com Consultor
                  </Link>
                </Button>
                
                <Button variant="outline" asChild className="flex-1">
                  <Link to="/">
                    Conhecer Serviços
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground mb-4">
              Tem alguma dúvida? Entre em contato conosco.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm">
              <a 
                href="tel:+5567992150289" 
                className="flex items-center gap-2 text-primary hover:underline"
              >
                <MessageCircle className="h-4 w-4" />
                (67) 99215-0289
              </a>
              
              <a 
                href="mailto:helder@crievalor.com.br" 
                className="flex items-center gap-2 text-primary hover:underline"
              >
                <Mail className="h-4 w-4" />
                helder@crievalor.com.br
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PalestraSucesso;