import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabaseExtended } from "@/integrations/supabase/extendedClient";
import { 
    Table, 
    TableBody, 
    TableCell, 
    TableHead, 
    TableHeader, 
    TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
    Dialog, 
    DialogContent, 
    DialogDescription, 
    DialogFooter, 
    DialogHeader, 
    DialogTitle 
} from "@/components/ui/dialog";
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
import { 
    Plus, 
    Edit2, 
    Trash2, 
    Package, 
    Power, 
    PowerOff, 
    Activity,
    Info,
    DollarSign
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface Product {
    id: string;
    slug: string;
    name: string;
    description: string | null;
    type: string;
    price: number | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export const ProductCatalogManager: React.FC = () => {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    
    // States
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
    
    // Form States
    const [formData, setFormData] = useState({
        name: "",
        slug: "",
        description: "",
        type: "digital_product",
        price: 0,
        is_active: true
    });

    // Fetch Products
    const { data: products = [], isLoading } = useQuery({
        queryKey: ["product-catalog"],
        queryFn: async () => {
            const { data, error } = await supabaseExtended
                .from("products")
                .select("*")
                .order("name", { ascending: true });
            if (error) throw error;
            return (data as Product[]) || [];
        }
    });

    // Create/Update Mutation
    const upsertMutation = useMutation({
        mutationFn: async (payload: any) => {
            if (editingProduct?.id) {
                const { error } = await (supabaseExtended as any)
                    .from("products")
                    .update(payload)
                    .eq("id", editingProduct.id);
                if (error) throw error;
            } else {
                const { error } = await (supabaseExtended as any)
                    .from("products")
                    .insert([payload]);
                if (error) throw error;
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["product-catalog"] });
            queryClient.invalidateQueries({ queryKey: ["active-products"] });
            setIsDialogOpen(false);
            setEditingProduct(null);
            toast({ title: editingProduct ? "Produto atualizado" : "Produto criado com sucesso" });
        },
        onError: (err: any) => {
            toast({ 
                title: "Erro ao salvar produto", 
                description: err.message, 
                variant: "destructive" 
            });
        }
    });

    // Delete Mutation
    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabaseExtended
                .from("products")
                .delete()
                .eq("id", id);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["product-catalog"] });
            setDeleteTarget(null);
            toast({ title: "Produto removido do catálogo" });
        },
        onError: (err: any) => {
            toast({ 
                title: "Erro ao remover produto", 
                description: "Certifique-se que não existem usuários vinculados a este produto.", 
                variant: "destructive" 
            });
        }
    });

    const handleOpenCreate = () => {
        setEditingProduct(null);
        setFormData({
            name: "",
            slug: "",
            description: "",
            type: "digital_product",
            price: 0,
            is_active: true
        });
        setIsDialogOpen(true);
    };

    const handleOpenEdit = (product: Product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            slug: product.slug,
            description: product.description || "",
            type: product.type,
            price: product.price || 0,
            is_active: product.is_active
        });
        setIsDialogOpen(true);
    };

    const toggleStatus = async (product: Product) => {
        try {
            const { error } = await (supabaseExtended as any)
                .from("products")
                .update({ is_active: !product.is_active })
                .eq("id", product.id);
            if (error) throw error;
            queryClient.invalidateQueries({ queryKey: ["product-catalog"] });
            toast({ title: `Produto ${product.is_active ? "desativado" : "ativado"}` });
        } catch (err: any) {
            toast({ title: "Erro ao alterar status", description: err.message, variant: "destructive" });
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.slug) return;
        upsertMutation.mutate(formData);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold flex items-center gap-2 text-foreground">
                        <Package className="h-6 w-6 text-primary" />
                        Catálogo de Produtos
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">
                        Gerencie os produtos ativos na plataforma e seus identificadores (slugs).
                    </p>
                </div>
                <Button onClick={handleOpenCreate} className="gap-2 shadow-lg hover:shadow-primary/20 transition-all">
                    <Plus className="h-4 w-4" />
                    Novo Produto
                </Button>
            </div>

            <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
                <Table>
                    <TableHeader className="bg-muted/50">
                        <TableRow>
                            <TableHead className="w-[250px]">Nome / Slug</TableHead>
                            <TableHead>Descrição</TableHead>
                            <TableHead>Tipo</TableHead>
                            <TableHead>Preço</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            Array.from({ length: 3 }).map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell colSpan={6} className="h-16 animate-pulse bg-muted/20" />
                                </TableRow>
                            ))
                        ) : products.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                                    Nenhum produto cadastrado no catálogo.
                                </TableCell>
                            </TableRow>
                        ) : (
                            products.map((product) => (
                                <TableRow key={product.id} className="hover:bg-muted/30 transition-colors group">
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-bold text-foreground">{product.name}</span>
                                            <Badge variant="outline" className="w-fit text-[10px] h-4 mt-1 bg-muted/50 text-muted-foreground border-none font-mono tracking-tight">
                                                {product.slug}
                                            </Badge>
                                        </div>
                                    </TableCell>
                                    <TableCell className="max-w-[300px]">
                                        <p className="text-sm text-muted-foreground line-clamp-2">{product.description || "Sem descrição."}</p>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="secondary" className="capitalize text-[11px] font-medium">
                                            {product.type.replace('_', ' ')}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="font-medium text-foreground">
                                        {product.price ? `R$ ${product.price.toFixed(2)}` : "N/A"}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Switch 
                                                checked={product.is_active} 
                                                onCheckedChange={() => toggleStatus(product)} 
                                            />
                                            <span className={cn("text-xs font-semibold", product.is_active ? "text-green-500" : "text-muted-foreground")}>
                                                {product.is_active ? "Ativo" : "Inativo"}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="h-8 w-8 text-primary hover:text-primary hover:bg-primary/10"
                                                onClick={() => handleOpenEdit(product)}
                                            >
                                                <Edit2 className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="h-8 w-8 text-destructive/70 hover:text-destructive hover:bg-destructive/10"
                                                onClick={() => setDeleteTarget(product)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* CREATE/EDIT DIALOG */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[500px] border-border bg-card">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Activity className="h-5 w-5 text-primary" />
                            {editingProduct ? "Editar Produto" : "Novo Produto no Catálogo"}
                        </DialogTitle>
                        <DialogDescription>
                            Configure as informações base do produto para uso no sistema de isolamento.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-5 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Nome do Produto</Label>
                                <Input 
                                    value={formData.name} 
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    placeholder="Ex: Mentoria Elite"
                                    className="bg-muted/30"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                                    Slug (ID Único)
                                    <Info className="h-3 w-3" />
                                </Label>
                                <Input 
                                    value={formData.slug} 
                                    onChange={(e) => setFormData({...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '_')})}
                                    placeholder="ex: mentoria_elite"
                                    className="bg-muted/30 font-mono text-sm"
                                    required
                                    disabled={!!editingProduct}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Descrição</Label>
                            <Textarea 
                                value={formData.description} 
                                onChange={(e) => setFormData({...formData, description: e.target.value})}
                                placeholder="Descreva o propósito deste produto..."
                                className="bg-muted/30 resize-none h-24"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Tipo</Label>
                                <Input 
                                    value={formData.type} 
                                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                                    placeholder="digital_product"
                                    className="bg-muted/30"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                                    Preço Estimado
                                    <DollarSign className="h-3 w-3" />
                                </Label>
                                <Input 
                                    type="number"
                                    value={formData.price} 
                                    onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value)})}
                                    className="bg-muted/30"
                                />
                            </div>
                        </div>

                        <div className="flex items-center space-x-2 bg-muted/20 p-3 rounded-xl border border-border">
                            <Switch 
                                id="active-switch" 
                                checked={formData.is_active} 
                                onCheckedChange={(checked) => setFormData({...formData, is_active: checked})} 
                            />
                            <Label htmlFor="active-switch" className="text-sm font-medium">Produto Ativo no Ecossistema</Label>
                        </div>

                        <DialogFooter className="pt-4 gap-2">
                            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="flex-1">
                                Cancelar
                            </Button>
                            <Button type="submit" className="flex-1" disabled={upsertMutation.isPending}>
                                {upsertMutation.isPending ? "Salvando..." : editingProduct ? "Atualizar Produto" : "Criar Produto"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* DELETE ALERT */}
            <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
                <AlertDialogContent className="border-border bg-card">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Excluir produto do catálogo?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta ação removerá o produto "{deleteTarget?.name}" permanentemente do catálogo. 
                            Se houver usuários ou materiais vinculados a este slug, a operação poderá falhar por integridade de dados.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction 
                            onClick={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            Confirmar Exclusão
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};
