import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useUserProducts } from "@/hooks/useUserProducts";
import { AssignProductDialog } from "./AssignProductDialog";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Package, Plus, Trash2, XCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface UserProductsManagerProps {
    userId: string;
    userName?: string;
}

export const UserProductsManager: React.FC<UserProductsManagerProps> = ({
    userId,
    userName
}) => {
    const { userProducts, isLoading, revokeProduct, isRevoking } = useUserProducts(userId);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // Status mapping to colors
    const statusColors: Record<string, string> = {
        active: "bg-green-500/10 text-green-500 border-green-500/20",
        expired: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
        canceled: "bg-red-500/10 text-red-500 border-red-500/20",
        suspended: "bg-orange-500/10 text-orange-500 border-orange-500/20",
    };

    const getStatusLabel = (status: string) => {
        const labels: Record<string, string> = {
            active: "Ativo",
            expired: "Expirado",
            canceled: "Cancelado",
            suspended: "Suspenso",
        };
        return labels[status] || status;
    };

    const handleRevoke = (userProductId: string) => {
        if (window.confirm("Tem certeza que deseja cancelar o acesso a este produto?")) {
            revokeProduct(userProductId);
        }
    };

    return (
        <Card className="border-border bg-card/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <div>
                    <CardTitle className="text-xl flex items-center gap-2">
                        <Package className="h-5 w-5 text-primary" />
                        Produtos do Usuário
                    </CardTitle>
                    <CardDescription>
                        Gerencie os acessos de {userName || "este usuário"} aos produtos do ecossistema.
                    </CardDescription>
                </div>
                <Button
                    onClick={() => setIsDialogOpen(true)}
                    className="gap-2"
                    size="sm"
                >
                    <Plus className="h-4 w-4" />
                    Atribuir Produto
                </Button>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <div className="space-y-2">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                ) : userProducts.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground border border-dashed rounded-lg">
                        <Package className="h-12 w-12 mx-auto mb-2 opacity-20" />
                        <p>Nenhum produto atribuído a este usuário.</p>
                    </div>
                ) : (
                    <div className="rounded-md border border-border overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/50">
                                    <TableHead>Produto</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Concedido em</TableHead>
                                    <TableHead>Expira em</TableHead>
                                    <TableHead className="text-right">Ações</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {userProducts.map((up) => (
                                    <TableRow key={up.id}>
                                        <TableCell className="font-medium">
                                            {up.product?.name || "Produto Desconhecido"}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={statusColors[up.status]}>
                                                {getStatusLabel(up.status)}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {format(new Date(up.access_granted_at), "dd/MM/yyyy", { locale: ptBR })}
                                        </TableCell>
                                        <TableCell>
                                            {up.access_expires_at
                                                ? format(new Date(up.access_expires_at), "dd/MM/yyyy", { locale: ptBR })
                                                : "Vitalício"}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {up.status === 'active' && (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                                    onClick={() => handleRevoke(up.id)}
                                                    disabled={isRevoking}
                                                >
                                                    <XCircle className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </CardContent>

            <AssignProductDialog
                userId={userId}
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
            />
        </Card>
    );
};
