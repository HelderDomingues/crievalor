
import React from 'react';
import { motion } from 'framer-motion';
import { Folder, FileText, ExternalLink, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MaterialFolder } from '@/types/materialFolder';
import { Material } from '@/pages/MaterialExclusivo';

interface MaterialFolderViewProps {
    currentFolderId: string | null;
    folders: MaterialFolder[];
    materials: Material[];
    onNavigate: (folderId: string) => void;
    onAccessMaterial: (material: Material) => void;
}

export const MaterialFolderView: React.FC<MaterialFolderViewProps> = ({
    currentFolderId,
    folders,
    materials,
    onNavigate,
    onAccessMaterial
}) => {
    // Filter folders that are children of the current folder
    const currentSubfolders = folders.filter(f =>
        (f.parent_id === currentFolderId) ||
        (!f.parent_id && !currentFolderId)
    ).sort((a, b) => (a.order_number || 0) - (b.order_number || 0));

    // Filter materials that are in the current folder
    const currentMaterials = materials.filter(m => {
        // @ts-ignore - folder_id might not be in the type yet if not updated
        const materialFolderId = m.folder_id;
        return (materialFolderId === currentFolderId) || (!materialFolderId && !currentFolderId);
    });

    if (currentSubfolders.length === 0 && currentMaterials.length === 0) {
        return (
            <div className="text-center py-20 bg-background/30 border border-dashed border-border rounded-2xl flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-muted/20 flex items-center justify-center mb-6">
                    <Folder className="w-8 h-8 text-muted-foreground/40" />
                </div>
                <h3 className="text-xl font-black text-foreground uppercase tracking-tight italic mb-2 font-title">
                    Pasta Vazia
                </h3>
                <p className="text-sm text-muted-foreground font-sans uppercase tracking-tight max-w-md mx-auto">
                    Nenhum material ou subpasta encontrada neste local.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-12">
            {currentSubfolders.length > 0 && (
                <section>
                    <div className="flex items-center gap-3 mb-6">
                        <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-primary/60">Pastas</h2>
                        <div className="h-px flex-1 bg-gradient-to-r from-primary/20 to-transparent" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {currentSubfolders.map((folder) => (
                            <motion.div
                                key={folder.id}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <Card
                                    className="cursor-pointer border-border/50 bg-card/50 hover:bg-primary/5 hover:border-primary/30 transition-all duration-300 group overflow-hidden"
                                    onClick={() => onNavigate(folder.id)}
                                >
                                    <CardContent className="p-4 flex items-center gap-4">
                                        <div className="p-3 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors shadow-inner">
                                            <Folder className="w-5 h-5" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-sm font-bold truncate uppercase tracking-tight">{folder.name}</h3>
                                            {/* We could add item count here if we had it precalculated */}
                                        </div>
                                        <ArrowRight className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </section>
            )}

            {currentMaterials.length > 0 && (
                <section>
                    <div className="flex items-center gap-3 mb-6">
                        <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-primary/60">Conteúdos</h2>
                        <div className="h-px flex-1 bg-gradient-to-r from-primary/20 to-transparent" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {currentMaterials.map((material) => (
                            <motion.div
                                key={material.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3 }}
                            >
                                <Card className="flex flex-col h-full border-border bg-card hover:bg-primary/[0.02] hover:border-primary/40 transition-all duration-300 group relative overflow-hidden rounded-2xl shadow-sm hover:shadow-xl">
                                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                        <FileText className="h-20 w-20 text-primary" />
                                    </div>

                                    <CardHeader className="pb-3 relative">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="px-3 py-1 rounded bg-primary/10 border border-primary/20 text-primary text-[9px] font-bold uppercase tracking-widest">
                                                {material.category}
                                            </div>
                                            <span className="text-[9px] font-mono text-muted-foreground uppercase tracking-tighter">
                                                {new Date(material.created_at).toLocaleDateString('pt-BR')}
                                            </span>
                                        </div>
                                        <CardTitle className="text-lg font-black text-foreground group-hover:text-primary transition-colors uppercase italic tracking-tighter font-title leading-tight">
                                            {material.title}
                                        </CardTitle>
                                    </CardHeader>

                                    <CardContent className="pb-8 flex-grow">
                                        <p className="text-sm text-muted-foreground font-sans leading-relaxed group-hover:text-foreground transition-colors line-clamp-3">
                                            {material.description}
                                        </p>
                                    </CardContent>

                                    <CardFooter className="pt-4 border-t border-border/50 bg-muted/20">
                                        <Button
                                            className="w-full h-11 flex items-center justify-center gap-3 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-[10px] uppercase tracking-widest transition-all shadow-lg hover:translate-y-[-2px] active:translate-y-0"
                                            onClick={() => onAccessMaterial(material)}
                                        >
                                            <ExternalLink className="h-3.5 w-3.5" />
                                            ACESSAR_CONTEÚDO
                                        </Button>
                                    </CardFooter>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
};
