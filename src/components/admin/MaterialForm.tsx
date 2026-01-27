
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
import { File, UploadCloud, Loader2 } from "lucide-react";
import { PLANS } from "@/services/subscriptionService";
import { FolderSelect } from "./FolderSelect";

import { Material } from "@/pages/MaterialExclusivo";

interface MaterialFormProps {
  onMaterialAdded: () => void;
  onCancel?: () => void;
  initialData?: Material | null;
}

const formSchema = z.object({
  title: z.string().min(3, { message: "O título deve ter pelo menos 3 caracteres" }),
  description: z.string().min(10, { message: "A descrição deve ter pelo menos 10 caracteres" }),
  category: z.string().min(1, { message: "Selecione uma categoria" }),
  // plan_level kept as optional string to satisfy potential backend requirements but hidden from UI
  plan_level: z.string().optional().default("subscriber"),
  folder_id: z.string().optional().nullable(),
  file: z.any().optional(), // File is optional when editing
  thumbnail: z.any().optional(),
});

const MaterialForm: React.FC<MaterialFormProps> = ({ onMaterialAdded, onCancel, initialData }) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filePreview, setFilePreview] = useState<string | null>(initialData?.file_url || null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(initialData?.thumbnail_url || null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      category: initialData?.category || "",
      plan_level: initialData?.plan_level || "subscriber",
      folder_id: initialData?.folder_id || null,
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Update form value
    form.setValue(fieldName as any, file);

    // Create preview for thumbnail
    if (fieldName === 'thumbnail' && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setThumbnailPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }

    // Create preview for document if it's a PDF
    if (fieldName === 'file' && file.type === 'application/pdf') {
      setFilePreview(URL.createObjectURL(file));
    } else if (fieldName === 'file') {
      setFilePreview(null);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);

      // Upload file to storage ONLY if a new file is selected
      let fileUrl = initialData?.file_url;

      if (values.file && values.file instanceof File) {
        const file = values.file as File;
        const fileExt = file.name.split('.').pop();
        const fileName = `${uuidv4()}.${fileExt}`;
        const filePath = `materials/${fileName}`;

        const { error: uploadError } = await supabaseExtended.storage
          .from('materials')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: fileData } = supabaseExtended.storage
          .from('materials')
          .getPublicUrl(filePath);

        fileUrl = fileData.publicUrl;
      } else if (!fileUrl) {
        throw new Error("É necessário incluir um arquivo.");
      }

      let thumbnailUrl = initialData?.thumbnail_url || null;

      // Upload thumbnail if provided
      if (values.thumbnail && values.thumbnail instanceof File) {
        const thumb = values.thumbnail as File;
        const thumbExt = thumb.name.split('.').pop();
        const thumbName = `${uuidv4()}.${thumbExt}`;
        const thumbPath = `thumbnails/${thumbName}`;

        const { error: thumbUploadError } = await supabaseExtended.storage
          .from('materials')
          .upload(thumbPath, thumb);

        if (thumbUploadError) throw thumbUploadError;

        const { data: thumbData } = supabaseExtended.storage
          .from('materials')
          .getPublicUrl(thumbPath);

        thumbnailUrl = thumbData.publicUrl;
      }

      const materialData = {
        title: values.title,
        description: values.description,
        category: values.category,
        file_url: fileUrl,
        thumbnail_url: thumbnailUrl,
        plan_level: values.plan_level,
        folder_id: values.folder_id,
        // Don't reset access_count on edit
        ...(initialData ? {} : { access_count: 0 }),
      };

      if (initialData) {
        // Update existing
        const { error: updateError } = await supabaseExtended
          .from('materials')
          .update(materialData)
          .eq('id', initialData.id);

        if (updateError) throw updateError;

        toast({ title: "Material atualizado com sucesso" });
      } else {
        // Insert new
        const { error: insertError } = await supabaseExtended
          .from('materials')
          .insert([materialData]);

        if (insertError) throw insertError;

        toast({ title: "Material adicionado com sucesso" });
      }

      // Reset form
      if (!initialData) {
        form.reset();
        setFilePreview(null);
        setThumbnailPreview(null);
      }

      // Notify parent
      onMaterialAdded();

    } catch (error) {
      console.error("Error adding material:", error);
      toast({
        title: "Erro ao adicionar material",
        description: "Não foi possível adicionar o material. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{initialData ? "Editar Material" : "Adicionar Novo Material"}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título</FormLabel>
                  <FormControl>
                    <Input placeholder="Digite o título do material" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Digite uma descrição para o material"
                      {...field}
                      rows={4}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 gap-6">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoria</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma categoria" />
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


            </div>

            <FormField
              control={form.control}
              name="folder_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pasta (Opcional)</FormLabel>
                  <FormControl>
                    <FolderSelect
                      value={field.value}
                      onValueChange={field.onChange}
                      placeholder="Selecione uma pasta"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="file"
              render={() => (
                <FormItem>
                  <FormLabel>Arquivo</FormLabel>
                  <FormControl>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center">
                      <File className="h-10 w-10 text-gray-400 mb-2" />
                      <p className="text-sm text-muted-foreground mb-2">
                        Arraste um arquivo ou clique para selecionar
                      </p>
                      <p className="text-xs text-muted-foreground mb-4">
                        Suporta PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX (máx. 10MB)
                      </p>
                      <Input
                        type="file"
                        className="w-auto max-w-xs"
                        onChange={(e) => handleFileChange(e, 'file')}
                        accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                      />
                      {filePreview && (
                        <div className="mt-4 p-2 border rounded">
                          <p className="text-sm font-medium">Prévia do arquivo:</p>
                          <embed
                            src={filePreview}
                            className="w-full h-32 mt-2"
                            type="application/pdf"
                          />
                        </div>
                      )}
                    </div>
                  </FormControl>
                  {form.formState.errors.file && (
                    <FormMessage>{form.formState.errors.file.message?.toString()}</FormMessage>
                  )}
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="thumbnail"
              render={() => (
                <FormItem>
                  <FormLabel>Imagem de Capa (opcional)</FormLabel>
                  <FormControl>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center">
                      <UploadCloud className="h-10 w-10 text-gray-400 mb-2" />
                      <p className="text-sm text-muted-foreground mb-2">
                        Arraste uma imagem ou clique para selecionar
                      </p>
                      <p className="text-xs text-muted-foreground mb-4">
                        Suporta JPG, PNG, WebP (máx. 2MB)
                      </p>
                      <Input
                        type="file"
                        className="w-auto max-w-xs"
                        onChange={(e) => handleFileChange(e, 'thumbnail')}
                        accept="image/jpeg,image/png,image/webp"
                      />
                      {thumbnailPreview && (
                        <div className="mt-4">
                          <p className="text-sm font-medium mb-2">Prévia da imagem:</p>
                          <img
                            src={thumbnailPreview}
                            alt="Thumbnail preview"
                            className="max-h-32 rounded border"
                          />
                        </div>
                      )}
                    </div>
                  </FormControl>
                  {form.formState.errors.thumbnail && (
                    <FormMessage>{form.formState.errors.thumbnail.message?.toString()}</FormMessage>
                  )}
                </FormItem>
              )}
            />

            <div className="flex gap-2">
              {onCancel && (
                <Button type="button" variant="outline" className="w-full" onClick={onCancel} disabled={isSubmitting}>
                  Cancelar
                </Button>
              )}
              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {initialData ? "Salvando..." : "Enviando..."}
                  </>
                ) : (
                  initialData ? "Salvar Alterações" : "Adicionar Material"
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
