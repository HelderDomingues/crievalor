import { useState } from "react";
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
    Save,
    X,
    Plus,
    FileText,
    Download,
    Eye
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

interface FolderNodeProps {
    node: FolderTreeNode;
    materials: Material[];
    onEdit: (id: string, name: string) => void;
    onDelete: (id: string) => void;
    onAddSubfolder: (parentId: string) => void;
    onEditMaterial: (material: Material) => void;
    onDeleteMaterial: (id: string) => void;
}

const FolderNode = ({
    node,
    materials,
    onEdit,
    onDelete,
    onAddSubfolder,
    onEditMaterial,
    onDeleteMaterial
}: FolderNodeProps) => {
    const [isOpen, setIsOpen] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editName, setEditName] = useState(node.name);

    const handleSave = () => {
        onEdit(node.id, editName);
        setIsEditing(false);
    };

    const nodeMaterials = materials.filter(m => m.folder_id === node.id);
    const hasChildren = (node.children && node.children.length > 0) || nodeMaterials.length > 0;

    return (
        <div className="space-y-1">
            <div className={cn(
                "group flex items-center gap-2 p-2 rounded-lg hover:bg-accent/10 transition-colors",
                "border border-transparent hover:border-accent/20"
            )}>
                <div
                    onClick={() => setIsOpen(!isOpen)}
                    className="cursor-pointer text-muted-foreground hover:text-primary transition-colors w-4"
                >
                    {hasChildren ? (
                        isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />
                    ) : null}
                </div>

                <Folder className="w-4 h-4 text-primary/70" />

                {isEditing ? (
                    <div className="flex items-center gap-1 flex-1">
                        <Input
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="h-8 py-0 text-sm"
                            autoFocus
                            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                        />
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-emerald-500" onClick={handleSave}>
                            <Save className="w-4 h-4" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => setIsEditing(false)}>
                            <X className="w-4 h-4" />
                        </Button>
                    </div>
                ) : (
                    <div className="flex items-center gap-2 flex-1">
                        <span className="text-sm font-medium">{node.name}</span>
                        <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity">
                            <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => setIsEditing(true)}>
                                <Edit2 className="w-3 h-3" />
                            </Button>
                            <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" onClick={() => onDelete(node.id)}>
                                <Trash2 className="w-3 h-3" />
                            </Button>
                            <Button
                                size="sm"
                                variant="ghost"
                                className="h-7 px-2 text-[10px] gap-1"
                                onClick={() => onAddSubfolder(node.id)}
                            >
                                <Plus className="w-3 h-3" /> Add Subpasta
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            {isOpen && hasChildren && (
                <div className="ml-6 pl-2 border-l border-accent/20 space-y-1">
                    {/* Render subfolders */}
                    {node.children && node.children.map(child => (
                        <FolderNode
                            key={child.id}
                            node={child as FolderTreeNode}
                            materials={materials}
                            onEdit={onEdit}
                            onDelete={onDelete}
                            onAddSubfolder={onAddSubfolder}
                            onEditMaterial={onEditMaterial}
                            onDeleteMaterial={onDeleteMaterial}
                        />
                    ))}

                    {/* Render materials in this folder */}
                    {nodeMaterials.map(material => (
                        <div
                            key={material.id}
                            className="group flex items-center gap-2 p-2 rounded-lg hover:bg-primary/5 transition-colors border border-transparent hover:border-primary/10 ml-6"
                        >
                            <FileText className="w-4 h-4 text-muted-foreground/70" />
                            <span className="text-sm flex-1 truncate">{material.title}</span>

                            <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity">
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-7 w-7"
                                    onClick={() => onEditMaterial(material)}
                                    title="Editar Material"
                                >
                                    <Edit2 className="w-3 h-3" />
                                </Button>
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-7 w-7 text-destructive"
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
                                    <Button size="icon" variant="ghost" className="h-7 w-7">
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
    const [isAddingRoot, setIsAddingRoot] = useState(false);
    const [newRootName, setNewRootName] = useState("");
    const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

    const handleCreateFolder = async (name: string, parentId?: string) => {
        if (!name.trim()) return;
        await createFolder({ name, parent_id: parentId });
        if (!parentId) {
            setIsAddingRoot(false);
            setNewRootName("");
        }
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
            <div className="flex items-center justify-between border-b pb-4">
                <div>
                    <h2 className="text-lg font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent capitalize">
                        Gerenciamento de Pastas
                    </h2>
                    <p className="text-sm text-muted-foreground"> Organize os materiais em uma estrutura hierárquica (até 5 níveis).</p>
                </div>
                <Button
                    size="sm"
                    className="gap-2"
                    onClick={() => setIsAddingRoot(true)}
                >
                    <FolderPlus className="w-4 h-4" /> Nova Pasta Raiz
                </Button>
            </div>

            <div className="bg-card/50 backdrop-blur-sm rounded-xl border p-6 min-h-[400px]">
                {isAddingRoot && (
                    <div className="flex items-center gap-2 mb-4 p-3 bg-accent/5 rounded-lg border border-accent/20 animate-in slide-in-from-top-2">
                        <Folder className="w-4 h-4 text-primary" />
                        <Input
                            value={newRootName}
                            onChange={(e) => setNewRootName(e.target.value)}
                            placeholder="Nome da pasta raiz..."
                            className="flex-1"
                            autoFocus
                            onKeyDown={(e) => e.key === 'Enter' && handleCreateFolder(newRootName)}
                        />
                        <Button onClick={() => handleCreateFolder(newRootName)}>Criar</Button>
                        <Button variant="ghost" onClick={() => setIsAddingRoot(false)}>Cancelar</Button>
                    </div>
                )}

                <div className="space-y-2">
                    {folderTree.length === 0 && !isAddingRoot && (
                        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-4 border-2 border-dashed rounded-xl">
                            <FolderPlus className="w-12 h-12 opacity-20" />
                            <p>Nenhuma pasta criada ainda.</p>
                            <Button variant="outline" size="sm" onClick={() => setIsAddingRoot(true)}>
                                Criar a primeira pasta
                            </Button>
                        </div>
                    )}

                    {folderTree.map((node) => (
                        <FolderNode
                            key={node.id}
                            node={node}
                            materials={materials}
                            onEdit={(id, name) => updateFolder(id, { name })}
                            onDelete={(id) => setDeleteTarget(id)}
                            onAddSubfolder={(parentId) => handleCreateFolder("Nova Subpasta", parentId)}
                            onEditMaterial={onEditMaterial}
                            onDeleteMaterial={onDeleteMaterial}
                        />
                    ))}

                    {/* Root materials */}
                    {rootMaterials.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-dashed border-accent/20">
                            <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2 px-2">Materiais sem pasta</p>
                            {rootMaterials.map(material => (
                                <div
                                    key={material.id}
                                    className="group flex items-center gap-2 p-2 rounded-lg hover:bg-primary/5 transition-colors border border-transparent hover:border-primary/10"
                                >
                                    <FileText className="w-4 h-4 text-muted-foreground/70" />
                                    <span className="text-sm flex-1 truncate">{material.title}</span>

                                    <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity">
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            className="h-7 w-7"
                                            onClick={() => onEditMaterial(material)}
                                        >
                                            <Edit2 className="w-3 h-3" />
                                        </Button>
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            className="h-7 w-7 text-destructive"
                                            onClick={() => onDeleteMaterial(material.id)}
                                        >
                                            <Trash2 className="w-3 h-3" />
                                        </Button>
                                        <a
                                            href={material.file_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <Button size="icon" variant="ghost" className="h-7 w-7">
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

            <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Excluir Pasta?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Isso excluirá a pasta e todas as suas subpastas. Os materiais vinculados a estas pastas ficarão sem pasta (órfãos).
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            onClick={async () => {
                                if (deleteTarget) {
                                    await deleteFolder(deleteTarget);
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
