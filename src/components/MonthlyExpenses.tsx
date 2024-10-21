import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DollarSign, Pen } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface MonthlyExpensesProps {
  totalExpenses: number;
  estimatedExpenses: number;
}

const MonthlyExpenses: React.FC<MonthlyExpensesProps> = ({ totalExpenses, estimatedExpenses }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newLimit, setNewLimit] = useState(estimatedExpenses.toString());
  const [currentEstimate, setCurrentEstimate] = useState(estimatedExpenses);
  const { toast } = useToast();

  const percentage = (totalExpenses / currentEstimate) * 100;

  const handleSaveLimit = () => {
    const newEstimate = parseFloat(newLimit);
    if (!isNaN(newEstimate) && newEstimate > 0) {
      setCurrentEstimate(newEstimate);
      setIsDialogOpen(false);
      toast({
        title: "Limite atualizado",
        description: `Novo limite de gastos: R$ ${newEstimate.toFixed(2)}`,
      });
    } else {
      toast({
        title: "Erro",
        description: "Por favor, insira um valor válido maior que zero.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold">Gastos Mensais</CardTitle>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="icon">
              <Pen className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Alterar Limite de Gastos</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="limit" className="text-right">
                  Novo Limite
                </Label>
                <Input
                  id="limit"
                  type="number"
                  value={newLimit}
                  onChange={(e) => setNewLimit(e.target.value)}
                  className="col-span-3"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSaveLimit}>Salvar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center">
          <div className="relative w-32 h-32">
            <svg className="w-full h-full" viewBox="0 0 36 36">
              <path
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#E2E8F0"
                strokeWidth="3"
              />
              <path
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#8B5CF6"
                strokeWidth="3"
                strokeDasharray={`${Math.min(percentage, 100)}, 100`}
              />
              {percentage > 100 && (
                <path
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#EF4444"
                  strokeWidth="3"
                  strokeDasharray={`${percentage - 100}, 100`}
                  strokeDashoffset="-100"
                />
              )}
            </svg>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl font-bold">
              {percentage.toFixed(0)}%
            </div>
          </div>
          <div className="mt-4 flex items-center text-lg font-semibold">
            <DollarSign className="mr-2 h-5 w-5 text-purple-500" />
            <span>{`${totalExpenses.toFixed(2)} / ${currentEstimate.toFixed(2)}`}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MonthlyExpenses;