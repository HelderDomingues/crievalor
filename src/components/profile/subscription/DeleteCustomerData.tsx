
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
import { asaasCustomerService } from "@/services/asaasCustomerService";
import { useToast } from "@/hooks/use-toast";

const DeleteCustomerData = () => {
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  const handleDeleteCustomerData = async () => {
    try {
      setIsDeleting(true);
      
      const result = await asaasCustomerService.deleteAllCustomerData();
      
      if (result.success) {
        toast({
          title: "Dados excluídos",
          description: "Todos os dados de pagamento foram excluídos com sucesso.",
          variant: "default",
        });
        
        // Recarregar a página após 2 segundos para atualizar o estado
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        toast({
          title: "Erro ao excluir dados",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Erro ao excluir dados:", error);
      toast({
        title: "Erro ao excluir dados",
        description: error.message || "Ocorreu um erro ao excluir os dados de pagamento.",
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
          Excluir dados de pagamento
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir dados de pagamento</AlertDialogTitle>
          <AlertDialogDescription>
            Esta ação irá excluir permanentemente todos os seus dados de pagamento, inclusive no Asaas.
            Suas assinaturas, histórico de pagamentos e informações de cliente serão removidos.
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
