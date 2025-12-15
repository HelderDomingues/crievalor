
import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Material } from "@/pages/MaterialExclusivo";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { File, FileText, FilePenLine, FileSpreadsheet, FileImage, Eye, Trash2, Search } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface MaterialsListProps {
  materials: Material[];
  onDelete: (id: string) => void;
  isLoading: boolean;
}

const MaterialsList: React.FC<MaterialsListProps> = ({ materials, onDelete, isLoading }) => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "ebook":
        return <FileText className="h-4 w-4" />;
      case "planilha":
        return <FileSpreadsheet className="h-4 w-4" />;
      case "apresentacao":
        return <FilePenLine className="h-4 w-4" />;
      case "guia":
        return <FileImage className="h-4 w-4" />;
      default:
        return <File className="h-4 w-4" />;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "ebook":
        return "E-book";
      case "planilha":
        return "Planilha";
      case "apresentacao":
        return "Apresentação";
      case "guia":
        return "Guia";
      default:
        return "Outro";
    }
  };



  const handleConfirmDelete = () => {
    if (deletingId) {
      onDelete(deletingId);
      setDeletingId(null);
    }
  };

  const handleCancelDelete = () => {
    setDeletingId(null);
  };

  const filteredMaterials = materials.filter(material =>
    material.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    material.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    getCategoryLabel(material.category).toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return <div>Carregando materiais...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center mb-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Pesquisar materiais..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {filteredMaterials.length === 0 ? (
        <div className="bg-muted/50 rounded-lg p-8 text-center">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-1">Nenhum material encontrado</h3>
          <p className="text-muted-foreground">
            {searchQuery
              ? "Nenhum material corresponde à sua pesquisa"
              : "Você ainda não adicionou nenhum material"}
          </p>
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Categoria</TableHead>

                <TableHead>Acessos</TableHead>
                <TableHead>Data</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMaterials.map((material) => (
                <TableRow key={material.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center">
                      {material.thumbnail_url ? (
                        <img
                          src={material.thumbnail_url}
                          alt=""
                          className="h-8 w-8 mr-3 rounded object-cover"
                        />
                      ) : (
                        <div className="h-8 w-8 mr-3 bg-muted rounded flex items-center justify-center">
                          {getCategoryIcon(material.category)}
                        </div>
                      )}
                      <span className="truncate max-w-[200px]">{material.title}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {getCategoryIcon(material.category)}
                      <span className="ml-1">{getCategoryLabel(material.category)}</span>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center">
                      <Eye className="h-4 w-4 mr-1 text-muted-foreground" />
                      {material.access_count}
                    </div>
                  </TableCell>
                  <TableCell>{formatDate(material.created_at)}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                      onClick={() => setDeletingId(material.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Excluir</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <AlertDialog open={!!deletingId} onOpenChange={(open) => !open && handleCancelDelete()}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Material</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza de que deseja excluir este material? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MaterialsList;
