import { useState, useEffect } from "react";
import { FolderTreeNode, MaterialFolder } from "@/types/materialFolder";
import { useMaterialFolders } from "@/hooks/useMaterialFolders";
import { Material } from "@/pages/MaterialExclusivo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    FolderPlus,
    Folder,
    ChevronRight,
    ChevronDown,
    Edit2,
    Trash2,
    Plus,
    FileText,
    Download,
} from "lucide-react";
import { cn } from "@/lib/utils";
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
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { useQuery } from "@tanstack/react-query";
import { supabaseExtended } from "@/integrations/supabase/extendedClient";

const SYSTEM_PRODUCTS = [
    { id: 'geral', name: 'Geral (Todos os assinantes ativos)' },
    { id: 'lumia', name: 'Sistema Lumia' },
    { id: 'oficina_lideres', name: 'Oficina de Líderes' },
];

interface FolderNodeProps {
    node: FolderTreeNode;
    materials: Material[];
    onEditFolder: (node: FolderTreeNode) => void;
    onDeleteFolder: (id: string, name: string) => void;
    onAddSubfolder: (parentId: string) => void;
    onEditMaterial: (material: Material) => void;
    onDeleteMaterial: (id: string) => void;
}

const FolderNode = ({
    node,
    materials,
    onEditFolder,
    onDeleteFolder,
    onAddSubfolder,
    onEditMaterial,
    onDeleteMaterial
}: FolderNodeProps) => {
    const [isOpen, setIsOpen] = useState(true);

    const nodeMaterials = materials.filter(m => m.folder_id === node.id);
    const hasChildren = (node.children && node.children.length > 0) || nodeMaterials.length > 0;

    return (
        <div className="space-y-1">
            <div className={cn(
                "group flex items-center gap-2 p-2 rounded-lg hover:bg-accent/50 transition-colors",
                "border border-transparent hover:border-border"
            )}>
                <div
                    onClick={() => setIsOpen(!isOpen)}
                    className="cursor-pointer text-muted-foreground hover:text-foreground transition-colors w-4"
                >
                    {hasChildren ? (
                        isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />
                    ) : null}
                </div>

                <Folder className="w-4 h-4 text-primary/70" />

                <div className="flex items-center gap-2 flex-1">
                    <span className="text-sm font-medium text-foreground">{node.name}</span>
                    <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity">
                        <Button size="icon" variant="ghost" className="h-7 w-7 text-muted-foreground hover:text-foreground" onClick={() => onEditFolder(node)}>
                            <Edit2 className="w-3 h-3" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive/70 hover:text-destructive" onClick={() => onDeleteFolder(node.id, node.name)}>
                            <Trash2 className="w-3 h-3" />
                        </Button>
                        <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 px-2 text-[10px] gap-1 text-muted-foreground hover:text-foreground"
                            onClick={() => onAddSubfolder(node.id)}
                        >
                            <Plus className="w-3 h-3" /> Subpasta
                        </Button>
                    </div>
                </div>
            </div>

            {isOpen && hasChildren && (
                <div className="ml-6 pl-2 border-l border-border space-y-1">
                    {/* Render subfolders */}
                    {node.children && node.children.map(child => (
                        <FolderNode
                            key={child.id}
                            node={child as FolderTreeNode}
                            materials={materials}
                            onEditFolder={onEditFolder}
                            onDeleteFolder={onDeleteFolder}
                            onAddSubfolder={onAddSubfolder}
                            onEditMaterial={onEditMaterial}
                            onDeleteMaterial={onDeleteMaterial}
                        />
                    ))}

                    {/* Render materials in this folder */}
                    {nodeMaterials.map(material => (
                        <div
                            key={material.id}
                            className="group flex items-center gap-2 p-2 rounded-lg hover:bg-muted/50 transition-colors border border-transparent hover:border-border ml-6"
                        >
                            <FileText className="w-4 h-4 text-muted-foreground/70" />
                            <span className="text-sm flex-1 truncate text-foreground">{material.title}</span>

                            <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity">
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-7 w-7 text-muted-foreground hover:text-foreground"
                                    onClick={() => onEditMaterial(material)}
                                    title="Editar Material"
                                >
                                    <Edit2 className="w-3 h-3" />
                                </Button>
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-7 w-7 text-destructive/70 hover:text-destructive"
                                    onClick={() => onDeleteMaterial(material.id)}
                                    title="Excluir Material"
                                >
                                    <Trash2 className="w-3 h-3" />
                                </Button>
                                <a
                                    href={material.file_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <Button size="icon" variant="ghost" className="h-7 w-7 text-muted-foreground hover:text-foreground">
                                        <Download className="w-3 h-3" />
                                    </Button>
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

interface FolderTreeManagerProps {
    materials: Material[];
    onEditMaterial: (material: Material) => void;
    onDeleteMaterial: (id: string) => void;
}

export const FolderTreeManager = ({ materials, onEditMaterial, onDeleteMaterial }: FolderTreeManagerProps) => {
    const { folderTree, createFolder, updateFolder, deleteFolder, isLoading } = useMaterialFolders();
    
    // Dialog States
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create');
    const [currentParentId, setCurrentParentId] = useState<string | undefined>();
    const [currentFolderId, setCurrentFolderId] = useState<string | undefined>();
    const [folderName, setFolderName] = useState("");
    const [selectedProducts, setSelectedProducts] = useState<string[]>(['geral']);
    
    // Delete Alert State
    const [deleteTarget, setDeleteTarget] = useState<{id: string, name: string} | null>(null);

    // Fetch dynamic products
    const { data: dynamicProducts = [] } = useQuery({
        queryKey: ["active-products"],
        queryFn: async () => {
            const { data, error } = await supabaseExtended.from("products").select("slug, name").eq("is_active", true);
            if (error) throw error;
            return (data as any[]) || [];
        }
    });

    const allAvailableProducts = [
        // Keep system products ONLY if no dynamic product shares the exact same name
        ...SYSTEM_PRODUCTS.filter(sp => !dynamicProducts.some(dp => dp.name.trim().toLowerCase() === sp.name.trim().toLowerCase())),
        ...dynamicProducts.map(dp => ({ id: dp.slug, name: dp.name }))
    ];

    const handleOpenCreateDialog = (parentId?: string) => {
        setDialogMode('create');
        setCurrentParentId(parentId);
        setFolderName("");
        setSelectedProducts(['geral']);
        setDialogOpen(true);
    };

    const handleOpenEditDialog = (node: FolderTreeNode) => {
        setDialogMode('edit');
        setCurrentFolderId(node.id);
        setFolderName(node.name || "");
        setSelectedProducts(node.product_types || ['geral']);
        setDialogOpen(true);
    };

    const handleSaveDialog = async () => {
        if (!folderName.trim()) return;
        
        if (dialogMode === 'create') {
            await createFolder({ 
                name: folderName, 
                parent_id: currentParentId, 
                product_types: selectedProducts 
            });
        } else if (dialogMode === 'edit' && currentFolderId) {
            await updateFolder(currentFolderId, { 
                name: folderName, 
                product_types: selectedProducts 
            });
        }
        
        setDialogOpen(false);
    };

    const rootMaterials = materials.filter(m => !m.folder_id);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-8 text-muted-foreground animate-pulse">
                <Folder className="w-6 h-6 animate-pulse mr-2" />
                Carregando estrutura de pastas...
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-4xl mx-auto p-4">
            <div className="flex items-center justify-between border-b border-border pb-4">
                <div>
                    <h2 className="text-lg font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent capitalize">
                        Gerenciamento de Pastas
                    </h2>
                    <p className="text-sm text-muted-foreground"> Organize os materiais isolando por níveis de acesso e produtos.</p>
                </div>
                <Button
                    size="sm"
                    className="gap-2"
                    onClick={() => handleOpenCreateDialog()}
                >
                    <FolderPlus className="w-4 h-4" /> Nova Pasta Raiz
                </Button>
            </div>

            <div className="bg-card backdrop-blur-sm rounded-xl border border-border p-6 min-h-[400px]">
                <div className="space-y-2">
                    {folderTree.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-4 border-2 border-dashed border-border rounded-xl">
                            <FolderPlus className="w-12 h-12 opacity-20" />
                            <p>Nenhuma pasta criada ainda.</p>
                            <Button variant="outline" size="sm" onClick={() => handleOpenCreateDialog()}>
                                Criar a primeira pasta
                            </Button>
                        </div>
                    )}

                    {folderTree.map((node) => (
                        <FolderNode
                            key={node.id}
                            node={node}
                            materials={materials}
                            onEditFolder={handleOpenEditDialog}
                            onDeleteFolder={(id, name) => setDeleteTarget({ id, name })}
                            onAddSubfolder={(parentId) => handleOpenCreateDialog(parentId)}
                            onEditMaterial={onEditMaterial}
                            onDeleteMaterial={onDeleteMaterial}
                        />
                    ))}

                    {/* Root materials */}
                    {rootMaterials.length > 0 && (
                        <div className="mt-6 pt-4 border-t border-dashed border-border">
                            <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-3 px-2 font-semibold">Materiais sem pasta (Avulsos)</p>
                            {rootMaterials.map(material => (
                                <div
                                    key={material.id}
                                    className="group flex items-center gap-2 p-2 rounded-lg hover:bg-muted/50 transition-colors border border-transparent hover:border-border"
                                >
                                    <FileText className="w-4 h-4 text-muted-foreground/70" />
                                    <span className="text-sm flex-1 truncate text-foreground">{material.title}</span>

                                    <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity">
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            className="h-7 w-7 text-muted-foreground hover:text-foreground"
                                            onClick={() => onEditMaterial(material)}
                                        >
                                            <Edit2 className="w-3 h-3" />
                                        </Button>
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            className="h-7 w-7 text-destructive/70 hover:text-destructive"
                                            onClick={() => onDeleteMaterial(material.id)}
                                        >
                                            <Trash2 className="w-3 h-3" />
                                        </Button>
                                        <a
                                            href={material.file_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <Button size="icon" variant="ghost" className="h-7 w-7 text-muted-foreground hover:text-foreground">
                                                <Download className="w-3 h-3" />
                                            </Button>
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* FOLDER CRUD DIALOG */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>
                            {dialogMode === 'create' ? (currentParentId ? "Criar Subpasta" : "Criar Pasta Raiz") : "Editar Pasta"}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-6 py-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                Nome da Pasta
                            </label>
                            <Input
                                value={folderName}
                                onChange={(e) => setFolderName(e.target.value)}
                                placeholder="Ex: Módulo 1..."
                                autoFocus
                            />
                        </div>
                        <div className="space-y-3">
                            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                Regras de Acesso (Produtos)
                            </label>
                            <p className="text-xs text-muted-foreground">Somente usuários com estes produtos verão esta pasta e seus materiais internos.</p>
                            
                            <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2 mt-2 bg-muted/30 p-3 rounded-md border border-border">
                                {allAvailableProducts.map((product) => (
                                    <div key={product.id} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`folder-product-${product.id}`}
                                            checked={selectedProducts.includes(product.id)}
                                            onCheckedChange={(checked) => {
                                                if (checked) {
                                                    setSelectedProducts(prev => [...prev, product.id]);
                                                } else {
                                                    setSelectedProducts(prev => prev.filter(p => p !== product.id));
                                                }
                                            }}
                                        />
                                        <label
                                            htmlFor={`folder-product-${product.id}`}
                                            className="text-sm font-medium leading-none cursor-pointer"
                                        >
                                            {product.name}
                                        </label>
                                    </div>
                                ))}
                            </div>
                            {selectedProducts.length === 0 && (
                                <p className="text-xs text-destructive font-medium">Selecione pelo menos um produto.</p>
                            )}
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
                        <Button onClick={handleSaveDialog} disabled={!folderName.trim() || selectedProducts.length === 0}>
                            Salvar Pasta
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* DELETE ALERT DIALOG */}
            <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Excluir "{deleteTarget?.name}"?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Isso excluirá a pasta e todas as suas subpastas. Os materiais atualmente vinculados a ela ficarão "Avulsos" na raiz. 
                            Esta ação não pode ser desfeita.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            onClick={async () => {
                                if (deleteTarget) {
                                    await deleteFolder(deleteTarget.id);
                                    setDeleteTarget(null);
                                }
                            }}
                        >
                            Confirmar Exclusão
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};
