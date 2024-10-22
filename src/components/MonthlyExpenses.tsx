import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DollarSign, Pen } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface MonthlyExpensesProps {
  totalExpenses: number;
  estimatedExpenses: number;
}

const monthsWithExpenses = [
  { value: '2024-01', label: 'Janeiro 2024' },
  { value: '2024-02', label: 'Fevereiro 2024' },
  { value: '2024-03', label: 'Março 2024' },
];

const MonthlyExpenses: React.FC<MonthlyExpensesProps> = ({ totalExpenses, estimatedExpenses }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newLimit, setNewLimit] = useState(estimatedExpenses.toString());
  const [currentEstimate, setCurrentEstimate] = useState(estimatedExpenses);
  const [selectedMonth, setSelectedMonth] = useState(monthsWithExpenses[2].value);
  const [animationPercentage, setAnimationPercentage] = useState(0);
  const { toast } = useToast();

  const percentage = (totalExpenses / currentEstimate) * 100;
  const cappedPercentage = Math.min(percentage, 100);
  const excessPercentage = Math.max(0, percentage - 100);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationPercentage(cappedPercentage);
    }, 100);

    return () => clearTimeout(timer);
  }, [cappedPercentage]);

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
        <CardTitle className="text-2xl font-bold">Gasto no mês</CardTitle>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="month" className="text-right">
                  Mês
                </Label>
                <Select
                  value={selectedMonth}
                  onValueChange={setSelectedMonth}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Selecione o mês" />
                  </SelectTrigger>
                  <SelectContent>
                    {monthsWithExpenses.map((month) => (
                      <SelectItem key={month.value} value={month.value}>
                        {month.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
        <div className="flex flex-col items-center justify-center h-[300px]">
          <div className="relative w-48 h-48">
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
                strokeDasharray={`${animationPercentage}, 100`}
                className="transition-all duration-1000 ease-out"
              />
              {excessPercentage > 0 && (
                <path
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#EF4444"
                  strokeWidth="3"
                  strokeDasharray={`${Math.min(animationPercentage - 100, excessPercentage)}, 100`}
                  strokeDashoffset="-100"
                  className="transition-all duration-1000 ease-out"
                />
              )}
            </svg>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-3xl font-bold">
              {Math.round(animationPercentage)}%
            </div>
          </div>
          <div className="mt-4 flex items-center text-xl font-semibold">
            <DollarSign className="mr-2 h-6 w-6 text-purple-500" />
            <span>{`${totalExpenses.toFixed(2)} / ${currentEstimate.toFixed(2)}`}</span>
          </div>
          <div className="mt-2 text-sm text-gray-500">
            {monthsWithExpenses.find(month => month.value === selectedMonth)?.label}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MonthlyExpenses;
