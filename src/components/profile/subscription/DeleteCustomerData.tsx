
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const DeleteCustomerData = () => {
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  const handleDeleteCustomerData = async () => {
    try {
      setIsDeleting(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("Usuário não autenticado");
      }

      // Delete subscription data from local database
      const { error: subError } = await supabase
        .from('subscriptions')
        .delete()
        .eq('user_id', user.id);

      if (subError) throw subError;

      toast({
        title: "Dados excluídos",
        description: "Todos os dados de assinatura foram excluídos com sucesso.",
        variant: "default",
      });
      
      // Reload page after 2 seconds
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error: any) {
      console.error("Erro ao excluir dados:", error);
      toast({
        title: "Erro ao excluir dados",
        description: error.message || "Ocorreu um erro ao excluir os dados.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" className="mt-4">
          <Trash2 className="h-4 w-4 mr-2" />
          Excluir dados de assinatura
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir dados de assinatura</AlertDialogTitle>
          <AlertDialogDescription>
            Esta ação irá excluir permanentemente todos os seus dados de assinatura local.
            Esta ação não pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction 
            onClick={(e) => {
              e.preventDefault();
              handleDeleteCustomerData();
            }}
            disabled={isDeleting}
          >
            {isDeleting ? "Excluindo..." : "Sim, excluir dados"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteCustomerData;
