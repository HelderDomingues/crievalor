import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabaseExtended } from "@/integrations/supabase/extendedClient";
import { v4 as uuidv4 } from "uuid";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { File as FileIcon, UploadCloud, Loader2, CheckSquare } from "lucide-react";
import { FolderSelect } from "./FolderSelect";
import { useQuery } from "@tanstack/react-query";
import { Material } from "@/pages/MaterialExclusivo";

// Robust check for File objects
const isFile = (val: any): val is File => {
  return !!(val && typeof val === 'object' && typeof val.name === 'string' && typeof val.size === 'number');
};

interface MaterialFormProps {
  onMaterialAdded: () => void;
  onCancel?: () => void;
  initialData?: Material | null;
}

const formSchema = z.object({
  title: z.string().optional(), // Tornando opcional para batch upload
  description: z.string().optional(),
  category: z.string().min(1, { message: "Selecione uma categoria" }),
  product_types: z.array(z.string()).min(1, { message: "Selecione pelo menos um produto" }),
  folder_id: z.string().optional().nullable(),
  files: z.any().optional(), // Mudado para suportar múltiplos
  thumbnail: z.any().optional(),
});

const SYSTEM_PRODUCTS = [
  { id: 'geral', name: 'Geral (Todos os assinantes ativos)' },
  { id: 'lumia', name: 'Sistema Lumia' },
  { id: 'oficina_lideres', name: 'Oficina de Líderes' },
];

const MaterialForm: React.FC<MaterialFormProps> = ({ onMaterialAdded, onCancel, initialData }) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(initialData?.thumbnail_url || null);

  // Buscar produtos dinâmicos do banco
  const { data: dynamicProducts = [] } = useQuery({
    queryKey: ["active-products"],
    queryFn: async () => {
      const { data, error } = await supabaseExtended.from("products").select("slug, name").eq("is_active", true);
      if (error) throw error;
      return (data as any[]) || [];
    }
  });

  const allAvailableProducts = [
    ...SYSTEM_PRODUCTS,
    ...dynamicProducts.filter(dp => !SYSTEM_PRODUCTS.some(sp => sp.id === dp.slug)).map(dp => ({ id: dp.slug, name: dp.name }))
  ];

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      category: initialData?.category || "",
      product_types: initialData?.product_types || ["geral"],
      folder_id: initialData?.folder_id || null,
    },
  });

  const isBatchUpload = selectedFiles.length > 1;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    if (fieldName === 'files') {
      const files = Array.from(e.target.files || []);
      setSelectedFiles(files);
      form.setValue('files', files);
    } else if (fieldName === 'thumbnail') {
      const file = e.target.files?.[0];
      if (!file) return;
      form.setValue('thumbnail', file);
      
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setThumbnailPreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);

      const filesToUpload = selectedFiles.length > 0 ? selectedFiles : (initialData ? [] : null);
      
      if (!filesToUpload && !initialData) {
        throw new Error("É necessário incluir pelo menos um arquivo.");
      }

      if (!isBatchUpload && !values.title && !initialData) {
        throw new Error("O título é obrigatório para uploads individuais.");
      }

      // 1. Upload Thumbnail (se existir, será a mesma para o batch)
      let thumbnailUrl = initialData?.thumbnail_url || null;
      if (values.thumbnail && isFile(values.thumbnail)) {
        const thumb = values.thumbnail as File;
        const thumbExt = thumb.name.split('.').pop();
        const thumbName = `${uuidv4()}.${thumbExt}`;
        const thumbPath = `thumbnails/${thumbName}`;
        const { error: thumbUploadError } = await supabaseExtended.storage.from('materials').upload(thumbPath, thumb);
        if (thumbUploadError) throw thumbUploadError;
        const { data: thumbData } = supabaseExtended.storage.from('materials').getPublicUrl(thumbPath);
        thumbnailUrl = thumbData.publicUrl;
      }

      // 2. Upload Arquivos e Inserir Registros
      if (filesToUpload && filesToUpload.length > 0) {
        for (const file of filesToUpload) {
          const fileExt = file.name.split('.').pop();
          const fileName = `${uuidv4()}.${fileExt}`;
          const filePath = `materials/${fileName}`;
          
          const { error: uploadError } = await supabaseExtended.storage.from('materials').upload(filePath, file);
          if (uploadError) throw uploadError;
          
          const { data: fileData } = supabaseExtended.storage.from('materials').getPublicUrl(filePath);
          
          const materialTitle = isBatchUpload 
            ? (values.title ? `${values.title} - ${file.name}` : file.name)
            : values.title || file.name;

          const materialData = {
            title: materialTitle,
            description: values.description || "",
            category: values.category,
            file_url: fileData.publicUrl,
            thumbnail_url: thumbnailUrl,
            product_types: values.product_types,
            folder_id: values.folder_id,
            plan_level: "subscriber", // fallback legadp
            access_count: 0
          };

          const { error: insertError } = await (supabaseExtended as any).from('materials').insert([materialData]);
          if (insertError) throw insertError;
        }
        toast({ title: isBatchUpload ? "Materiais adicionados com sucesso!" : "Material adicionado com sucesso" });
      } else if (initialData) {
        // Apenas atualizar dados textuais (se editando)
        const updateData = {
          title: values.title || initialData.title,
          description: values.description || "",
          category: values.category,
          product_types: values.product_types,
          folder_id: values.folder_id,
          thumbnail_url: thumbnailUrl
        };

        const { error: updateError } = await (supabaseExtended as any).from('materials').update(updateData).eq('id', initialData.id);
        if (updateError) throw updateError;
        toast({ title: "Material atualizado com sucesso" });
      }

      // Reset
      if (!initialData) {
        form.reset();
        setSelectedFiles([]);
        setThumbnailPreview(null);
      }
      onMaterialAdded();

    } catch (error) {
      console.error("Error adding material:", error);
      toast({
        title: "Erro ao salvar",
        description: error instanceof Error ? error.message : "Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="border-t-4 border-t-primary shadow-lg max-w-4xl mx-auto">
      <CardHeader className="bg-muted/30">
        <CardTitle className="text-xl flex items-center gap-2 text-primary">
          <FileIcon className="h-5 w-5" />
          {initialData ? "Editar Material" : "Novo Material / Upload em Lote"}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            
            {/* Secção de Arquivos (Em Destaque) */}
            {!initialData && (
              <div className="bg-muted p-6 rounded-xl border border-border">
                <FormField
                  control={form.control}
                  name="files"
                  render={() => (
                    <FormItem>
                      <FormLabel className="text-base font-semibold text-primary">Arquivos (Selecione um ou vários)</FormLabel>
                      <FormControl>
                        <div className="border-2 border-dashed border-primary/40 bg-card rounded-lg p-8 flex flex-col items-center justify-center transition-colors hover:bg-accent cursor-pointer relative">
                          <UploadCloud className="h-12 w-12 text-primary mb-3" />
                          <p className="text-sm font-medium text-foreground mb-1">
                            Arraste arquivos ou clique para selecionar
                          </p>
                          <p className="text-xs text-muted-foreground mb-4">
                            Você pode selecionar múltiplos arquivos para Upload em Lote
                          </p>
                          <Input
                            type="file"
                            multiple
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            onChange={(e) => handleFileChange(e, 'files')}
                            accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                          />
                          
                          {selectedFiles.length > 0 && (
                            <div className="mt-4 w-full">
                              <p className="text-sm font-medium text-primary mb-2 flex items-center gap-2">
                                <CheckSquare className="h-4 w-4" /> {selectedFiles.length} arquivo(s) selecionado(s):
                              </p>
                              <ul className="text-xs text-muted-foreground max-h-32 overflow-auto bg-muted p-2 rounded border border-border">
                                {selectedFiles.map((f, i) => (
                                  <li key={i} className="truncate py-1 border-b border-border last:border-0">{f.name}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Título {isBatchUpload && <span className="text-muted-foreground font-normal">(Prefixo opcional)</span>}</FormLabel>
                      <FormControl>
                        <Input placeholder={isBatchUpload ? "Ex: Módulo 1 (será usado como prefixo)" : "Digite o título"} {...field} />
                      </FormControl>
                      {isBatchUpload && (
                        <FormDescription>Deixe em branco para usar o nome original de cada arquivo.</FormDescription>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição {isBatchUpload && <span className="text-muted-foreground font-normal">(Aplicada a todos)</span>}</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Descreva os materiais" rows={4} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Categoria</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Categoria" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="ebook">E-book</SelectItem>
                            <SelectItem value="planilha">Planilha</SelectItem>
                            <SelectItem value="apresentacao">Apresentação</SelectItem>
                            <SelectItem value="guia">Guia</SelectItem>
                            <SelectItem value="outro">Outro</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="folder_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pasta</FormLabel>
                        <FormControl>
                          <FolderSelect value={field.value} onValueChange={field.onChange} placeholder="Pasta-raiz..." />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Coluna Direita: Regras de Acesso e Capa */}
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="product_types"
                  render={() => (
                    <FormItem className="bg-muted/50 p-4 rounded-lg border border-border">
                      <FormLabel className="font-semibold text-foreground text-base mb-3 block">Regras de Acesso (Produtos)</FormLabel>
                      <FormDescription className="mb-4">
                        Quem poderá ver {isBatchUpload ? "estes materiais" : "este material"}? Selecione um ou vários.
                      </FormDescription>
                      <div className="space-y-3 max-h-[220px] overflow-y-auto pr-2">
                        {allAvailableProducts.map((product) => (
                          <FormField
                            key={product.id}
                            control={form.control}
                            name="product_types"
                            render={({ field }) => {
                              return (
                                <FormItem key={product.id} className="flex flex-row items-start space-x-3 space-y-0 rounded-md border border-border p-3 bg-card hover:bg-accent hover:text-accent-foreground transition-colors">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(product.id)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...field.value, product.id])
                                          : field.onChange(field.value?.filter((value) => value !== product.id))
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-medium cursor-pointer flex-1">
                                    {product.name}
                                  </FormLabel>
                                </FormItem>
                              )
                            }}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="thumbnail"
                  render={() => (
                    <FormItem>
                      <FormLabel>Capa (Aplicada a todos)</FormLabel>
                      <FormControl>
                        <div className="border border-dashed border-border rounded-lg p-4 flex flex-col items-center justify-center bg-muted/30 relative cursor-pointer hover:bg-accent transition-colors">
                          {thumbnailPreview ? (
                            <img src={thumbnailPreview} alt="Preview" className="h-24 object-cover rounded shadow-sm opacity-80" />
                          ) : (
                            <div className="text-center">
                              <UploadCloud className="h-6 w-6 text-muted-foreground mx-auto mb-1" />
                              <span className="text-xs text-muted-foreground">Adicionar Capa</span>
                            </div>
                          )}
                          <Input
                            type="file"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            onChange={(e) => handleFileChange(e, 'thumbnail')}
                            accept="image/jpeg,image/png,image/webp"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex gap-4 pt-4 border-t">
              {onCancel && (
                <Button type="button" variant="outline" className="w-full md:w-auto px-8" onClick={onCancel} disabled={isSubmitting}>
                  Cancelar
                </Button>
              )}
              <Button type="submit" className="w-full md:w-auto px-10 shadow-md" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processando...
                  </>
                ) : (
                  initialData ? "Salvar Alterações" : (isBatchUpload ? `Fazer Upload de ${selectedFiles.length} Arquivos` : "Adicionar Material")
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default MaterialForm;
