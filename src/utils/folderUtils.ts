import { MaterialFolder, FolderTreeNode } from "../types/materialFolder";

/**
 * Builds a hierarchical tree from a flat array of folders
 */
export const buildFolderTree = (folders: MaterialFolder[]): FolderTreeNode[] => {
    const folderMap = new Map<string, FolderTreeNode>();
    const rootFolders: FolderTreeNode[] = [];

    // First pass: create nodes
    folders.forEach(folder => {
        folderMap.set(folder.id, {
            ...folder,
            children: [],
            level: 0,
            path: []
        } as FolderTreeNode);
    });

    // Second pass: build hierarchy and calculate levels/paths
    const calculateMetadata = (node: FolderTreeNode, level: number, path: string[]) => {
        node.level = level;
        node.path = path;
        const children = folders
            .filter(f => f.parent_id === node.id)
            .sort((a, b) => (a.order_number || 0) - (b.order_number || 0));

        children.forEach(child => {
            const childNode = folderMap.get(child.id);
            if (childNode) {
                node.children = node.children || [];
                node.children.push(childNode);
                calculateMetadata(childNode, level + 1, [...path, node.id]);
            }
        });
    };

    // Find root nodes and kick off recursion
    const rootData = folders
        .filter(f => !f.parent_id || !folderMap.has(f.parent_id || ''))
        .sort((a, b) => (a.order_number || 0) - (b.order_number || 0));

    rootData.forEach(root => {
        const rootNode = folderMap.get(root.id);
        if (rootNode) {
            rootFolders.push(rootNode);
            calculateMetadata(rootNode, 0, []);
        }
    });

    return rootFolders;
};

/**
 * Gets the breadcrumb path to a specific folder
 */
export const getFolderPath = (folderId: string | null, allFolders: MaterialFolder[]): MaterialFolder[] => {
    if (!folderId) return [];

    const path: MaterialFolder[] = [];
    let currentId: string | null | undefined = folderId;

    while (currentId) {
        const folder = allFolders.find(f => f.id === currentId);
        if (folder) {
            path.unshift(folder);
            currentId = folder.parent_id;
        } else {
            break;
        }
    }

    return path;
};

/**
 * Validates if adding a child to parent would exceed max depth
 */
export const validateFolderDepth = (
    parentId: string | null,
    allFolders: MaterialFolder[],
    maxDepth: number = 5
): boolean => {
    if (!parentId) return true; // Root level is always allowed

    const path = getFolderPath(parentId, allFolders);
    return path.length < maxDepth;
};

/**
 * Gets all descendant IDs of a folder (recursive)
 */
export const getDescendantIds = (folderId: string, allFolders: MaterialFolder[]): string[] => {
    const descendants: string[] = [];
    const children = allFolders.filter(f => f.parent_id === folderId);

    children.forEach(child => {
        descendants.push(child.id);
        descendants.push(...getDescendantIds(child.id, allFolders));
    });

    return descendants;
};
