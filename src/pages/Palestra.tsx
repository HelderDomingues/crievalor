import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Helmet } from "react-helmet-async";
import { BreadcrumbSchema } from "@/components/seo/SchemaMarkup";

const formSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  phone: z.string().min(10, "Telefone deve ter pelo menos 10 dígitos"),
  company_name: z.string().optional(),
  instagram: z.string().optional(),
  lecture_id: z.string().min(1, "Selecione uma palestra"),
  lecture_date: z.string().optional(),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface Lecture {
  id: string;
  title: string;
  description: string;
  speaker: string;
}

const Palestra = () => {
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    const fetchLectures = async () => {
      const { data, error } = await supabase
        .from("lectures")
        .select("*")
        .eq("is_active", true)
        .order("title");

      if (error) {
        console.error("Erro ao carregar palestras:", error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar as palestras disponíveis.",
          variant: "destructive",
        });
      } else {
        setLectures(data || []);
      }
    };

    fetchLectures();
  }, [toast]);

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("event_leads").insert({
        lecture_id: data.lecture_id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        company_name: data.company_name || null,
        instagram: data.instagram || null,
        lecture_date: data.lecture_date || null,
        notes: data.notes || null,
        status: "novo",
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Cadastro realizado!",
        description: "Suas informações foram registradas com sucesso.",
      });

      navigate("/palestra/sucesso");
    } catch (error) {
      console.error("Erro ao cadastrar:", error);
      toast({
        title: "Erro no cadastro",
        description: "Não foi possível completar seu cadastro. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <Helmet>
        <title>Palestras Empresariais | Capacitação com IA - Crie Valor</title>
        <meta name="description" content="Palestras e capacitações empresariais sobre inteligência organizacional e IA para negócios. Conteúdo estratégico e networking qualificado." />
        <meta name="keywords" content="palestras empresariais, capacitação empresarial, palestras sobre IA, eventos corporativos, palestras gestão, seminários empresas campo grande, palestras navegantes sc" />
        <link rel="canonical" href="https://crievalor.com.br/palestra" />
        <meta property="og:title" content="Palestras Empresariais - Crie Valor" />
        <meta property="og:description" content="Conteúdo estratégico, insights práticos e networking qualificado em palestras sobre IA e gestão empresarial." />
        <meta property="og:url" content="https://crievalor.com.br/palestra" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://crievalor.com.br/og-image.png" />
      </Helmet>
      
      <BreadcrumbSchema 
        items={[
          { name: "Home", url: "https://crievalor.com.br" },
          { name: "Palestras", url: "https://crievalor.com.br/palestra" }
        ]}
      />
      
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-24 pb-16">
        <div className="absolute inset-0 bg-grid-white/5 bg-[size:20px_20px] [mask-image:radial-gradient(ellipse_at_center,white,transparent)]" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 text-white/90 mb-6 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
              <Calendar className="h-5 w-5 text-white" />
              <span className="text-sm font-medium uppercase tracking-wider text-white">Capacitação Empresarial</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Palestras que <span className="text-yellow-400">impulsionam vidas</span> e negócios
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
              Conteúdo estratégico, insights práticos e networking qualificado. 
              Cadastre-se e receba materiais exclusivos das nossas capacitações empresariais.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-center text-white/80 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-400 rounded-full" />
                <span className="text-white">Material Exclusivo</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-400 rounded-full" />
                <span className="text-white">Certificado de Participação</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-400 rounded-full" />
                <span className="text-white">Networking Qualificado</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* About Lectures Section - Enriquecimento de Conteúdo */}
      <section className="py-16 bg-secondary/10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
              Por Que Participar de Nossas Palestras?
            </h2>
            
            <div className="prose prose-lg max-w-none space-y-6 text-muted-foreground">
              <p>
                Nossas palestras empresariais são mais do que eventos: são experiências transformadoras 
                que conectam teoria e prática, oferecendo insights aplicáveis imediatamente ao seu negócio. 
                Com mais de 15 anos de experiência em consultoria estratégica e centenas de empresas atendidas, 
                compartilhamos conhecimento validado pelo mercado.
              </p>
              
              <div className="grid md:grid-cols-2 gap-6 my-8">
                <div className="bg-card p-6 rounded-lg border">
                  <h3 className="text-xl font-semibold mb-3 text-foreground">Conteúdo Estratégico</h3>
                  <p>
                    Abordagens práticas sobre inteligência organizacional, IA aplicada aos negócios, 
                    gestão de equipes e transformação digital. Cada palestra é adaptada ao contexto 
                    e desafios específicos do público.
                  </p>
                </div>
                
                <div className="bg-card p-6 rounded-lg border">
                  <h3 className="text-xl font-semibold mb-3 text-foreground">Networking Qualificado</h3>
                  <p>
                    Conecte-se com empresários, gestores e profissionais que compartilham os mesmos 
                    desafios e objetivos. Construa relacionamentos valiosos e expanda sua rede de contatos.
                  </p>
                </div>
              </div>
              
              <h3 className="text-2xl font-bold mt-8 mb-4 text-foreground">Temas Abordados</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="bg-primary/10 p-1 rounded-full mt-1">
                    <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span><strong className="text-foreground">Inteligência Artificial nos Negócios:</strong> Como aplicar IA de forma prática e estratégica</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="bg-primary/10 p-1 rounded-full mt-1">
                    <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span><strong className="text-foreground">Liderança de Alta Performance:</strong> Metodologias comprovadas para desenvolvimento de líderes</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="bg-primary/10 p-1 rounded-full mt-1">
                    <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span><strong className="text-foreground">Transformação Digital:</strong> Estratégias para modernizar processos e cultura organizacional</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="bg-primary/10 p-1 rounded-full mt-1">
                    <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span><strong className="text-foreground">Gestão de Mudanças:</strong> Como conduzir transformações organizacionais com sucesso</span>
                </li>
              </ul>
              
              <div className="bg-primary/5 p-6 rounded-lg border border-primary/20 mt-8">
                <h3 className="text-xl font-semibold mb-3 text-foreground">Formatos Disponíveis</h3>
                <p className="mb-4">
                  Oferecemos palestras in-company, eventos abertos, workshops práticos e capacitações customizadas. 
                  Cada formato é desenhado para maximizar o aprendizado e engajamento dos participantes.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span>Palestras de 60 a 120 minutos</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span>Workshops práticos de meio dia ou dia completo</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span>Programas de capacitação personalizados</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">

          <Card>
            <CardHeader>
              <CardTitle>Formulário de Inscrição</CardTitle>
              <CardDescription>
                Preencha seus dados para receber o material da palestra e futuras comunicações sobre eventos.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome Completo *</Label>
                    <Input
                      id="name"
                      {...register("name")}
                      placeholder="Seu nome completo"
                    />
                    {errors.name && (
                      <p className="text-sm text-destructive">{errors.name.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail *</Label>
                    <Input
                      id="email"
                      type="email"
                      {...register("email")}
                      placeholder="seu@email.com"
                    />
                    {errors.email && (
                      <p className="text-sm text-destructive">{errors.email.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">WhatsApp/Telefone *</Label>
                    <Input
                      id="phone"
                      {...register("phone")}
                      placeholder="(67) 99999-9999"
                    />
                    {errors.phone && (
                      <p className="text-sm text-destructive">{errors.phone.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="company_name">Nome da Empresa</Label>
                    <Input
                      id="company_name"
                      {...register("company_name")}
                      placeholder="Sua empresa"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="instagram">Instagram da Empresa</Label>
                    <Input
                      id="instagram"
                      {...register("instagram")}
                      placeholder="@suaempresa"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lecture_date">Data da Palestra</Label>
                    <Input
                      id="lecture_date"
                      type="date"
                      {...register("lecture_date")}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lecture_id">Palestra Participada *</Label>
                  <Select onValueChange={(value) => setValue("lecture_id", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a palestra que você participou ou irá participar" />
                    </SelectTrigger>
                    <SelectContent>
                      {lectures.map((lecture) => (
                        <SelectItem key={lecture.id} value={lecture.id}>
                          {lecture.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.lecture_id && (
                    <p className="text-sm text-destructive">{errors.lecture_id.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Observações</Label>
                  <Textarea
                    id="notes"
                    {...register("notes")}
                    placeholder="Alguma observação ou comentário adicional..."
                    rows={3}
                  />
                </div>

                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full"
                >
                  {isSubmitting ? "Enviando..." : "Confirmar Inscrição"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="mt-8 text-center text-sm text-muted-foreground">
            <p>
              Ao se inscrever, você concorda em receber materiais exclusivos e comunicações sobre nossos eventos e capacitações.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Palestra;