
import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { sanitizePhoneNumber } from "@/utils/formatters";
import { RegistrationForm } from "./form/RegistrationForm";
import { RegistrationFormData } from "./form/RegistrationFormSchema";

interface UserRegistrationProps {
  onContinue: () => void;
  onBack: () => void;
}

const UserRegistration = ({ onContinue, onBack }: UserRegistrationProps) => {
  const { signUp } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const onSubmit = async (data: RegistrationFormData) => {
    setIsSubmitting(true);
    
    try {
      // Register the user
      const { error: signUpError } = await signUp(data.email, data.password);
      
      if (signUpError) {
        throw new Error(signUpError.message);
      }
      
      // Update the user profile with the provided information
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("Erro ao criar conta");
      }
      
      // Format CPF to remove any non-numeric characters
      const formattedCpf = data.cpf.replace(/\D/g, '');
      
      // Sanitize phone number
      const sanitizedPhone = sanitizePhoneNumber(data.phone);
      
      // Update the profile
      const { error: profileError } = await supabase
        .from("profiles")
        .upsert({
          id: user.id,
          full_name: data.fullName,
          phone: sanitizedPhone,
          cpf: formattedCpf,
          updated_at: new Date().toISOString(),
        });
      
      if (profileError) {
        throw new Error("Erro ao salvar informações do perfil");
      }
      
      toast({
        title: "Cadastro realizado com sucesso!",
        description: "Agora você pode prosseguir com o pagamento.",
      });
      
      // Continue to the next step
      onContinue();
    } catch (error: any) {
      console.error("Error during registration:", error);
      
      let errorMessage = "Ocorreu um erro durante o cadastro.";
      
      if (error.message.includes("already registered")) {
        errorMessage = "Este e-mail já está registrado. Tente fazer login.";
      }
      
      toast({
        title: "Erro no cadastro",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Crie sua conta</h1>
        <p className="text-muted-foreground mt-2">
          Complete seu cadastro para prosseguir com o pagamento.
        </p>
      </div>
      
      <div className="bg-card border rounded-xl p-6">
        <RegistrationForm
          onSubmit={onSubmit}
          onBack={onBack}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
};

export default UserRegistration;
