import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useUserProducts } from "@/hooks/useUserProducts";
import { Loader2 } from "lucide-react";

interface EditProductDialogProps {
    userId: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    editData: {
        id: string;
        access_expires_at: string | null;
        notes: string | null;
        status: string;
        product_name?: string;
    } | null;
}

export const EditProductDialog: React.FC<EditProductDialogProps> = ({
    userId,
    open,
    onOpenChange,
    editData,
}) => {
    const { updateProduct, isUpdating } = useUserProducts(userId);
    const [expiresAt, setExpiresAt] = useState("");
    const [notes, setNotes] = useState("");
    const [status, setStatus] = useState("active");

    useEffect(() => {
        if (editData && open) {
            setExpiresAt(editData.access_expires_at ? editData.access_expires_at.split('T')[0] : "");
            setNotes(editData.notes || "");
            setStatus(editData.status || "active");
        }
    }, [editData, open]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editData) return;

        updateProduct(
            {
                userProductId: editData.id,
                data: {
                    access_expires_at: expiresAt || null,
                    notes: notes || null,
                    status: status,
                }
            },
            {
                onSuccess: () => {
                    onOpenChange(false);
                },
            }
        );
    };

    if (!editData) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Editar Acesso: {editData.product_name || "Produto"}</DialogTitle>
                    <DialogDescription>
                        Ajuste o período de acesso, notas e o status do usuário para este produto.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <Select value={status} onValueChange={setStatus} disabled={isUpdating}>
                            <SelectTrigger id="status">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="active">Ativo</SelectItem>
                                <SelectItem value="expired">Expirado</SelectItem>
                                <SelectItem value="canceled">Cancelado</SelectItem>
                                <SelectItem value="suspended">Suspenso</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="expires">Data de Expiração (Opcional)</Label>
                        <Input
                            id="expires"
                            type="date"
                            value={expiresAt}
                            onChange={(e) => setExpiresAt(e.target.value)}
                            disabled={isUpdating}
                        />
                        <p className="text-[10px] text-muted-foreground">
                            Deixe em branco para acesso vitalício.
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="notes">Observações</Label>
                        <Textarea
                            id="notes"
                            placeholder="Ex: Assinatura pausada pelo cliente temporariamente."
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            disabled={isUpdating}
                            className="resize-none h-20"
                        />
                    </div>

                    <DialogFooter className="pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={isUpdating}
                        >
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={isUpdating}>
                            {isUpdating ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Salvando...
                                </>
                            ) : (
                                "Salvar"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};
