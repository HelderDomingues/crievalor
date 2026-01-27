
import { Material } from "@/pages/MaterialExclusivo";

export interface MaterialFolder {
    id: string;
    name: string;
    description?: string | null;
    parent_id?: string | null;
    order_number: number;
    created_at: string;
    updated_at: string;
    children?: MaterialFolder[]; // For tree structure
    materials?: Material[]; // Materials in this folder
}

export interface FolderTreeNode extends MaterialFolder {
    level: number; // Depth in tree (0-4)
    path: string[]; // Array of parent IDs
}
