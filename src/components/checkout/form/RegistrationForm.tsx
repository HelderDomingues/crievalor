
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { registrationFormSchema, RegistrationFormData } from "./RegistrationFormSchema";
import { FormField } from "./FormField";

interface RegistrationFormProps {
  onSubmit: (data: RegistrationFormData) => Promise<void>;
  onBack: () => void;
  isSubmitting: boolean;
}

export const RegistrationForm: React.FC<RegistrationFormProps> = ({
  onSubmit,
  onBack,
  isSubmitting
}) => {
  const form = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationFormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      cpf: "",
      password: "",
    },
  });
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          form={form}
          name="fullName"
          label="Nome completo"
          placeholder="Digite seu nome completo"
        />
        
        <FormField
          form={form}
          name="email"
          label="E-mail"
          placeholder="seu@email.com"
          type="email"
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            form={form}
            name="phone"
            label="Telefone"
            placeholder="(00) 00000-0000"
          />
          
          <FormField
            form={form}
            name="cpf"
            label="CPF"
            placeholder="000.000.000-00"
          />
        </div>
        
        <FormField
          form={form}
          name="password"
          label="Senha"
          placeholder="******"
          type="password"
        />
        
        <div className="flex justify-between mt-8">
          <Button type="button" variant="outline" onClick={onBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para pagamento
          </Button>
          
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processando...
              </>
            ) : (
              <>
                Finalizar cadastro
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};
