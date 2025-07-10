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