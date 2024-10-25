import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ReauthDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (currentPassword: string) => void;
}

export const ReauthDialog: React.FC<ReauthDialogProps> = ({
  isOpen,
  onOpenChange,
  onConfirm,
}) => {
  const [currentPassword, setCurrentPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(currentPassword);
    setCurrentPassword('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Confirmar identidade</DialogTitle>
            <DialogDescription>
              Para sua segurança, precisamos confirmar sua senha atual antes de fazer alterações.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <Label htmlFor="currentPassword">Senha atual</Label>
            <Input
              id="currentPassword"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Digite sua senha atual"
              required
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="destructive" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" variant="outline">
              Confirmar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};