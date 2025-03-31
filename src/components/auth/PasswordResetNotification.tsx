
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Mail, AlertCircle, ArrowRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface PasswordResetNotificationProps {
  email?: string;
}

const PasswordResetNotification: React.FC<PasswordResetNotificationProps> = ({ 
  email
}) => {
  const { user } = useAuth();
  const [isEmailSent, setIsEmailSent] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  
  const userEmail = email || user?.email;

  const handleSendResetEmail = async () => {
    if (!userEmail) {
      setError("Email não disponível. Por favor, entre em contato com o suporte.");
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      const { error } = await supabase.auth.resetPasswordForEmail(userEmail, {
        redirectTo: window.location.origin + "/auth?action=reset_password",
      });
      
      if (error) {
        throw error;
      }
      
      setIsEmailSent(true);
    } catch (err: any) {
      console.error("Error sending reset email:", err);
      setError(err.message || "Não foi possível enviar o email de recuperação. Tente novamente mais tarde.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Defina sua senha</CardTitle>
        <CardDescription>
          É necessário definir uma senha para acessar sua conta
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isEmailSent ? (
          <Alert className="bg-green-50 border-green-200">
            <Mail className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-700">Email enviado!</AlertTitle>
            <AlertDescription className="text-sm text-green-700">
              <p>Enviamos um email para <strong>{userEmail}</strong> com instruções para definir sua senha.</p>
              <p className="mt-2">Por favor, verifique sua caixa de entrada e clique no link fornecido.</p>
            </AlertDescription>
          </Alert>
        ) : (
          <>
            <p className="text-sm text-gray-600">
              Identificamos que você ainda não definiu uma senha para sua conta. Para acessar a plataforma, é necessário 
              criar uma senha segura.
            </p>
            
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Importante</AlertTitle>
              <AlertDescription>
                Enviaremos um email com um link seguro para a criação da sua senha.
              </AlertDescription>
            </Alert>
            
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </>
        )}
      </CardContent>
      <CardFooter>
        {isEmailSent ? (
          <div className="w-full text-center">
            <p className="text-sm text-gray-500 mb-2">
              Não recebeu o email? Verifique sua pasta de spam ou solicite novamente.
            </p>
            <Button 
              variant="outline" 
              onClick={handleSendResetEmail}
              disabled={isLoading}
              className="mt-2"
            >
              Reenviar email
            </Button>
          </div>
        ) : (
          <Button 
            onClick={handleSendResetEmail} 
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? 'Enviando...' : 'Enviar email para definir senha'}
            {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default PasswordResetNotification;
