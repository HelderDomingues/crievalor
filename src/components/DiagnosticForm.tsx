import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  phone: z.string().min(10, "Telefone deve ter pelo menos 10 dígitos"),
  company_name: z.string().optional(),
  company_size: z.string().optional(),
  current_revenue: z.string().optional(),
  main_challenge: z.string().optional(),
  desired_results: z.string().optional(),
  timeline: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const DiagnosticForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      company_name: "",
      company_size: "",
      current_revenue: "",
      main_challenge: "",
      desired_results: "",
      timeline: "",
    },
  });

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>, onChange: (value: string) => void) => {
    let value = e.target.value.replace(/\D/g, "");
    value = value.replace(/(\d{2})(\d)/, "($1) $2");
    value = value.replace(/(\d{5})(\d)/, "$1-$2");
    onChange(value);
  };

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from("diagnostic_requests")
        .insert([{
          name: data.name,
          email: data.email,
          phone: data.phone,
          company_name: data.company_name || null,
          company_size: data.company_size || null,
          current_revenue: data.current_revenue || null,
          main_challenge: data.main_challenge || null,
          desired_results: data.desired_results || null,
          timeline: data.timeline || null,
          status: 'pending'
        }]);

      if (error) {
        throw error;
      }

      setIsSubmitted(true);
      
      toast({
        title: "Solicitação enviada com sucesso!",
        description: "Nossa equipe entrará em contato em até 4 horas para agendar seu diagnóstico.",
      });
    } catch (error) {
      console.error("Error submitting diagnostic request:", error);
      toast({
        title: "Erro ao enviar solicitação",
        description: "Tente novamente ou entre em contato conosco.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="bg-card border border-border rounded-xl p-8 shadow-lg text-center">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">
            Solicitação Enviada com Sucesso!
          </h3>
          <p className="text-muted-foreground mb-4">
            Obrigado pelo seu interesse! Nossa equipe especializada entrará em contato em até 4 horas para agendar seu diagnóstico gratuito.
          </p>
          <p className="text-sm text-muted-foreground">
            Verifique também sua caixa de spam para não perder nosso contato.
          </p>
        </div>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 bg-card border border-border rounded-xl p-8 shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome completo *</FormLabel>
                <FormControl>
                  <Input placeholder="Seu nome completo" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email *</FormLabel>
                <FormControl>
                  <Input placeholder="seu@email.com" type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>WhatsApp *</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="(00) 00000-0000"
                    {...field}
                    onChange={(e) => handlePhoneChange(e, field.onChange)}
                    maxLength={15}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="company_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome da empresa</FormLabel>
                <FormControl>
                  <Input placeholder="Sua empresa" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="company_size"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Porte da empresa</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o porte" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="MEI">MEI</SelectItem>
                    <SelectItem value="Micro">Micro (até 9 funcionários)</SelectItem>
                    <SelectItem value="Pequena">Pequena (10-49 funcionários)</SelectItem>
                    <SelectItem value="Média">Média (50-249 funcionários)</SelectItem>
                    <SelectItem value="Grande">Grande (250+ funcionários)</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="current_revenue"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Faturamento mensal</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Faixa de faturamento" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Até R$ 10k">Até R$ 10.000</SelectItem>
                    <SelectItem value="R$ 10k - R$ 50k">R$ 10.000 - R$ 50.000</SelectItem>
                    <SelectItem value="R$ 50k - R$ 100k">R$ 50.000 - R$ 100.000</SelectItem>
                    <SelectItem value="R$ 100k - R$ 500k">R$ 100.000 - R$ 500.000</SelectItem>
                    <SelectItem value="Acima de R$ 500k">Acima de R$ 500.000</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="main_challenge"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Principal desafio do seu negócio</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Descreva qual é o principal desafio que sua empresa enfrenta hoje..."
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="desired_results"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Resultados desejados</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="O que você espera alcançar com nossa consultoria? Quais são seus objetivos?"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="timeline"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Prazo para ver resultados</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Em quanto tempo espera ver resultados?" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="30 dias">30 dias</SelectItem>
                  <SelectItem value="60 dias">60 dias</SelectItem>
                  <SelectItem value="90 dias">90 dias</SelectItem>
                  <SelectItem value="6 meses">6 meses</SelectItem>
                  <SelectItem value="1 ano">1 ano</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Enviando...
            </>
          ) : (
            "Solicitar Diagnóstico Gratuito"
          )}
        </Button>

        <p className="text-xs text-muted-foreground text-center">
          Ao enviar este formulário, você concorda em receber contato da nossa equipe 
          para agendamento do diagnóstico gratuito.
        </p>
      </form>
    </Form>
  );
};

export default DiagnosticForm;