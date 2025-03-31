
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Loader2, Lock, Shield } from "lucide-react";
import { registrationFormSchema, RegistrationFormData } from "./RegistrationFormSchema";
import { FormField } from "./FormField";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Info } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface UnifiedCheckoutFormProps {
  onSubmit: (data: RegistrationFormData) => Promise<void>;
  onPaymentRedirect?: () => Promise<void>;
  onBack?: () => void;
  isSubmitting: boolean;
  plan: any;
  getPaymentAmount?: () => number;
  formatCurrency?: (value: number) => string;
  selectedPaymentMethod: "credit_installment" | "cash_payment";
}

export const UnifiedCheckoutForm: React.FC<UnifiedCheckoutFormProps> = ({
  onSubmit,
  onPaymentRedirect,
  onBack,
  isSubmitting,
  plan,
  getPaymentAmount = () => 0,
  formatCurrency = (value) => value.toString(),
  selectedPaymentMethod
}) => {
  const { user } = useAuth();
  const [savedEmail, setSavedEmail] = useState<string>("");
  const [savedPhone, setSavedPhone] = useState<string>("");
  const [savedName, setSavedName] = useState<string>("");
  
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
  
  // Recuperar valores do localStorage, se existirem
  useEffect(() => {
    const storedEmail = localStorage.getItem('customerEmail');
    const storedPhone = localStorage.getItem('customerPhone');
    const storedName = localStorage.getItem('customerName');
    
    if (storedEmail) {
      setSavedEmail(storedEmail);
      form.setValue("email", storedEmail);
    }
    
    if (storedPhone) {
      setSavedPhone(storedPhone);
      form.setValue("phone", storedPhone);
    }
    
    if (storedName) {
      setSavedName(storedName);
      form.setValue("fullName", storedName);
    }
    
    // Se o usuário já estiver autenticado, preencher alguns campos automaticamente
    if (user) {
      form.setValue("email", user.email || "");
    }
  }, [form, user]);

  // Determinar se é um novo usuário ou existente
  const isNewUser = !user;
  
  const handleFormSubmit = async (data: RegistrationFormData) => {
    if (isNewUser) {
      // Caso seja um novo usuário, precisamos registrá-lo
      await onSubmit(data);
    } else if (onPaymentRedirect) {
      // Caso seja um usuário existente, seguimos direto para o pagamento
      await onPaymentRedirect();
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>
          {isNewUser ? "Complete seu cadastro" : "Confirme seus dados para pagamento"}
        </CardTitle>
        <CardDescription>
          {isNewUser 
            ? "Preencha seus dados para criar sua conta e prosseguir com o pagamento" 
            : "Confirme seus dados para prosseguir com o pagamento"
          }
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4 flex items-start mb-6">
          <Info className="text-blue-500 h-5 w-5 mt-0.5 mr-3 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-blue-800">Importante</h4>
            <p className="text-sm text-blue-700 mt-1">
              {isNewUser 
                ? "Após o cadastro, você será redirecionado para finalizar o pagamento." 
                : "Você será redirecionado para a página de pagamento da Asaas."
              }
            </p>
          </div>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
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
              disabled={!!user}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            
            {isNewUser && (
              <FormField
                form={form}
                name="password"
                label="Senha"
                placeholder="******"
                type="password"
              />
            )}
            
            {/* Resumo do pedido */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <h3 className="font-medium text-lg mb-2">Resumo do Pedido</h3>
              <div className="flex justify-between mb-2">
                <span className="text-muted-foreground">Plano</span>
                <span className="font-medium">{plan?.name}</span>
              </div>
              
              <div className="flex justify-between mb-2">
                <span className="text-muted-foreground">Forma de pagamento</span>
                <span className="font-medium">
                  {selectedPaymentMethod === "credit_installment" ? "Cartão de crédito" : "À vista (PIX/Boleto)"}
                </span>
              </div>
              
              <div className="flex justify-between font-medium text-lg mt-2">
                <span>Total</span>
                <span>R$ {formatCurrency(getPaymentAmount())}</span>
              </div>
            </div>
            
            <div className="pt-4 mt-4">
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processando...
                  </>
                ) : (
                  <>
                    {isNewUser ? "Criar conta e prosseguir" : "Prosseguir para pagamento"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
              
              {onBack && (
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={onBack} 
                  className="w-full mt-2"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Voltar para seleção de plano
                </Button>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
      
      <CardFooter className="flex flex-col space-y-2">
        <div className="flex items-center justify-center space-x-4 text-sm text-muted-foreground">
          <div className="flex items-center">
            <Lock className="mr-1 h-4 w-4 text-green-600" />
            <span className="text-sm font-medium">Pagamento Seguro</span>
          </div>
          <div className="flex items-center">
            <Shield className="mr-1 h-4 w-4 text-green-600" />
            <span className="text-sm font-medium">Dados Protegidos</span>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};
