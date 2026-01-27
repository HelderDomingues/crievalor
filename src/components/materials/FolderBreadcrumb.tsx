
import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MaterialFolder } from '@/types/materialFolder';
import { getFolderPath } from '@/utils/folderUtils';
import { cn } from "@/lib/utils";

interface FolderBreadcrumbProps {
    currentFolderId: string | null;
    folders: MaterialFolder[];
    onNavigate: (folderId: string | null) => void;
    className?: string;
}

export const FolderBreadcrumb: React.FC<FolderBreadcrumbProps> = ({
    currentFolderId,
    folders,
    onNavigate,
    className
}) => {
    const path = getFolderPath(currentFolderId, folders);

    return (
        <nav className={cn("flex items-center flex-wrap gap-1 text-sm text-muted-foreground", className)}>
            <Button
                variant="ghost"
                size="sm"
                className={cn(
                    "flex items-center gap-1 h-8 px-2 rounded-lg hover:bg-primary/10 hover:text-primary transition-colors",
                    !currentFolderId && "bg-primary/5 text-primary font-medium"
                )}
                onClick={() => onNavigate(null)}
            >
                <Home className="w-4 h-4" />
                <span className="hidden sm:inline">Início</span>
            </Button>

            {path.map((folder, index) => {
                const isLast = index === path.length - 1;
                return (
                    <React.Fragment key={folder.id}>
                        <ChevronRight className="w-4 h-4 opacity-50" />
                        <Button
                            variant="ghost"
                            size="sm"
                            className={cn(
                                "h-8 px-2 rounded-lg hover:bg-primary/10 hover:text-primary transition-colors max-w-[150px] truncate",
                                isLast && "bg-primary/5 text-primary font-medium pointer-events-none"
                            )}
                            onClick={() => !isLast && onNavigate(folder.id)}
                        >
                            {folder.name}
                        </Button>
                    </React.Fragment>
                );
            })}
        </nav>
    );
};
