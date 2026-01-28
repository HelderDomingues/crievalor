import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useUserProducts } from "@/hooks/useUserProducts";
import { Loader2 } from "lucide-react";

interface AssignProductDialogProps {
    userId: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const AssignProductDialog: React.FC<AssignProductDialogProps> = ({
    userId,
    open,
    onOpenChange,
}) => {
    const { allProducts, assignProduct, isAssigning, isLoading } = useUserProducts(userId);
    const [productId, setProductId] = useState("");
    const [expiresAt, setExpiresAt] = useState("");
    const [notes, setNotes] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!productId) return;

        assignProduct(
            {
                user_id: userId,
                product_id: productId,
                access_expires_at: expiresAt || null,
                notes: notes || null,
            },
            {
                onSuccess: () => {
                    onOpenChange(false);
                    setProductId("");
                    setExpiresAt("");
                    setNotes("");
                },
            }
        );
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Atribuir Produto</DialogTitle>
                    <DialogDescription>
                        Selecione o produto e defina o período de acesso para o usuário.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="product">Produto</Label>
                        <Select value={productId} onValueChange={setProductId} disabled={isLoading || isAssigning}>
                            <SelectTrigger id="product">
                                <SelectValue placeholder="Selecione um produto" />
                            </SelectTrigger>
                            <SelectContent>
                                {allProducts.map((product) => (
                                    <SelectItem key={product.id} value={product.id}>
                                        {product.name}
                                    </SelectItem>
                                ))}
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
                            disabled={isAssigning}
                        />
                        <p className="text-[10px] text-muted-foreground">
                            Deixe em branco para acesso vitalício.
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="notes">Observações</Label>
                        <Textarea
                            id="notes"
                            placeholder="Ex: Venda via WhatsApp, Bonificação, etc."
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            disabled={isAssigning}
                            className="resize-none h-20"
                        />
                    </div>

                    <DialogFooter className="pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={isAssigning}
                        >
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={!productId || isAssigning}>
                            {isAssigning ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Atribuindo...
                                </>
                            ) : (
                                "Atribuir"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};
