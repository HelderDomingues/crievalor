import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Material } from "@/pages/MaterialExclusivo";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { File as FileIcon, FileText, FilePenLine, FileSpreadsheet, FileImage, Eye, Trash2, Search, Filter } from "lucide-react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { supabaseExtended } from "@/integrations/supabase/extendedClient";

interface MaterialsListProps {
  materials: Material[];
  onDelete: (id: string) => void;
  onEdit: (material: Material) => void;
  isLoading: boolean;
}

const SYSTEM_PRODUCTS = [
  { id: 'geral', name: 'Geral' },
  { id: 'lumia', name: 'Sistema Lumia' },
  { id: 'oficina_lideres', name: 'Oficina de Líderes' },
];

const MaterialsList: React.FC<MaterialsListProps> = ({ materials, onDelete, onEdit, isLoading }) => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Fetch products for dynamic tabs
  const { data: dynamicProducts = [] } = useQuery({
    queryKey: ["active-products"],
    queryFn: async () => {
      const { data, error } = await supabaseExtended.from("products").select("slug, name").eq("is_active", true);
      if (error) throw error;
      return (data as any[]) || [];
    }
  });

  const allTabs = [
    { id: 'all', name: 'Todos' },
    // Keep system products ONLY if no dynamic product shares the exact same name
    ...SYSTEM_PRODUCTS.filter(sp => !dynamicProducts.some(dp => dp.name.trim().toLowerCase() === sp.name.trim().toLowerCase())),
    ...dynamicProducts.map(dp => ({ id: dp.slug, name: dp.name }))
  ];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "ebook": return <FileText className="h-4 w-4" />;
      case "planilha": return <FileSpreadsheet className="h-4 w-4" />;
      case "apresentacao": return <FilePenLine className="h-4 w-4" />;
      case "guia": return <FileImage className="h-4 w-4" />;
      default: return <FileIcon className="h-4 w-4" />;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "ebook": return "E-book";
      case "planilha": return "Planilha";
      case "apresentacao": return "Apresentação";
      case "guia": return "Guia";
      default: return "Outro";
    }
  };

  const handleConfirmDelete = () => {
    if (deletingId) {
      onDelete(deletingId);
      setDeletingId(null);
    }
  };

  const filteredMaterials = materials.filter(material =>
    material.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    material.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    getCategoryLabel(material.category).toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderMaterialsTable = (list: Material[]) => {
    if (list.length === 0) {
      return (
        <div className="bg-muted/30 rounded-xl p-12 text-center border border-dashed border-border">
          <FileText className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-1">Nenhum material encontrado</h3>
          <p className="text-sm text-muted-foreground">
            {searchQuery ? "Tente mudar os termos da pesquisa." : "Nenhum material associado a este produto."}
          </p>
        </div>
      );
    }

    return (
      <div className="border border-border rounded-xl overflow-hidden shadow-sm bg-card">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="w-[300px]">Título</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Produtos</TableHead>
              <TableHead>Acessos</TableHead>
              <TableHead>Data</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {list.map((material) => (
              <TableRow key={material.id} className="hover:bg-muted/30 transition-colors group">
                <TableCell className="font-medium">
                  <div className="flex items-center">
                    {material.thumbnail_url ? (
                      <img src={material.thumbnail_url} alt="" className="h-9 w-9 mr-3 rounded-lg object-cover shadow-sm bg-muted" />
                    ) : (
                      <div className="h-9 w-9 mr-3 bg-muted rounded-lg flex items-center justify-center text-primary/60">
                        {getCategoryIcon(material.category)}
                      </div>
                    )}
                    <div className="flex flex-col">
                        <span className="truncate max-w-[220px] text-foreground">{material.title}</span>
                        {material.description && <span className="text-[10px] text-muted-foreground truncate max-w-[200px]">{material.description}</span>}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="font-normal border-primary/20 bg-primary/5 text-primary gap-1">
                    {getCategoryIcon(material.category)}
                    {getCategoryLabel(material.category)}
                  </Badge>
                </TableCell>
                <TableCell>
                    <div className="flex flex-wrap gap-1">
                        {material.product_types?.map(pt => (
                            <Badge key={pt} variant="secondary" className="text-[9px] uppercase tracking-tighter opacity-70">
                                {pt}
                            </Badge>
                        ))}
                    </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center text-sm font-medium text-foreground">
                    <Eye className="h-3.5 w-3.5 mr-1.5 text-primary/70" />
                    {material.access_count}
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground text-xs">{formatDate(material.created_at)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-primary hover:text-primary hover:bg-primary/10"
                      onClick={() => onEdit(material)}
                    >
                      <FilePenLine className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-destructive/70 hover:text-destructive hover:bg-destructive/10"
                      onClick={() => setDeletingId(material.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  };

  if (isLoading) {
    return (
        <div className="space-y-4 animate-pulse">
            <div className="h-10 bg-muted rounded-xl w-full" />
            <div className="h-[400px] bg-muted/50 rounded-xl w-full" />
        </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-card p-4 rounded-2xl border border-border">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Pesquisar materiais..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-muted/30 border-border/50 focus:bg-background transition-all rounded-xl"
          />
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Filter className="h-3 w-3" />
            Mostrando {filteredMaterials.length} materiais no total
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full space-y-4">
        <div className="overflow-x-auto pb-1 scrollbar-hide">
            <TabsList className="bg-muted/50 p-1 h-auto flex flex-nowrap w-max gap-1 rounded-xl">
                {allTabs.map(tab => (
                    <TabsTrigger 
                        key={tab.id} 
                        value={tab.id}
                        className="px-6 py-2 rounded-lg data-[state=active]:bg-card data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all text-xs font-semibold"
                    >
                        {tab.name}
                        <Badge variant="secondary" className="ml-2 h-4 min-w-[1.2rem] px-1 text-[10px] bg-muted/80 text-muted-foreground border-none">
                            {tab.id === 'all' 
                                ? filteredMaterials.length 
                                : filteredMaterials.filter(m => m.product_types?.includes(tab.id)).length
                            }
                        </Badge>
                    </TabsTrigger>
                ))}
            </TabsList>
        </div>

        <TabsContent value="all" className="mt-0 focus-visible:outline-none">
          {renderMaterialsTable(filteredMaterials)}
        </TabsContent>

        {allTabs.slice(1).map(tab => (
            <TabsContent key={tab.id} value={tab.id} className="mt-0 focus-visible:outline-none">
                {renderMaterialsTable(filteredMaterials.filter(m => m.product_types?.includes(tab.id)))}
            </TabsContent>
        ))}
      </Tabs>

      <AlertDialog open={!!deletingId} onOpenChange={(open) => !open && setDeletingId(null)}>
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
              Confirmar Exclusão
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MaterialsList;
