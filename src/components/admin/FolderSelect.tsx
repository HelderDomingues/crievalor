
import { useMaterialFolders } from "@/hooks/useMaterialFolders";
import { FolderTreeNode } from "@/types/materialFolder";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Folder } from "lucide-react";

interface FolderSelectProps {
    value?: string | null;
    onValueChange: (value: string | null) => void;
    placeholder?: string;
}

export const FolderSelect = ({ value, onValueChange, placeholder = "Selecione uma pasta" }: FolderSelectProps) => {
    const { folderTree } = useMaterialFolders();

    const renderOptions = (nodes: FolderTreeNode[]) => {
        return nodes.flatMap((node) => [
            <SelectItem key={node.id} value={node.id} className="pl-2">
                <div className="flex items-center gap-2">
                    {Array.from({ length: node.level }).map((_, i) => (
                        <span key={i} className="w-4 border-l border-muted-foreground/30 h-4 inline-block ml-1" />
                    ))}
                    <Folder className="w-3 h-3 text-muted-foreground" />
                    <span className={node.level === 0 ? "font-semibold" : ""}>{node.name}</span>
                </div>
            </SelectItem>,
            ...renderOptions((node.children || []) as FolderTreeNode[]),
        ]);
    };

    return (
        <Select
            value={value || "none"}
            onValueChange={(val) => onValueChange(val === "none" ? null : val)}
        >
            <SelectTrigger>
                <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="none">Sem pasta (avulso)</SelectItem>
                {renderOptions(folderTree)}
            </SelectContent>
        </Select>
    );
};
