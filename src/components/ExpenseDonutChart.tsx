import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pen } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useMonthlyTotalExpenses } from "@/hooks/useMonthlyTotalExpenses";

interface ExpenseDonutChartProps {
  expenseLimit: number;
  onExpenseLimitChange: (limit: number) => Promise<boolean>;
}

const COLORS = {
  normal: ['#8B5CF6', '#E2E8F0'],
  exceeded: ['#EF4444', '#E2E8F0']
};

export const ExpenseDonutChart: React.FC<ExpenseDonutChartProps> = ({
  expenseLimit,
  onExpenseLimitChange
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newLimit, setNewLimit] = useState(expenseLimit.toString());
  const [animationPercentage, setAnimationPercentage] = useState(0);
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const { toast } = useToast();
  const { data: monthlyTotals = [], isLoading } = useMonthlyTotalExpenses();

  useEffect(() => {
    if (monthlyTotals.length > 0 && !selectedMonth) {
      setSelectedMonth(monthlyTotals[0].value);
    }
  }, [monthlyTotals]);

  const handleSaveLimit = async () => {
    const limit = parseFloat(newLimit);
    if (!isNaN(limit) && limit > 0) {
      const success = await onExpenseLimitChange(limit);
      if (success) {
        setIsDialogOpen(false);
        toast({
          title: "Limite atualizado",
          description: `Novo limite de gastos: R$ ${limit.toFixed(2)}`,
        });
      } else {
        toast({
          title: "Erro",
          description: "Não foi possível atualizar o limite de gastos.",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Erro",
        description: "Por favor, insira um valor válido maior que zero.",
        variant: "destructive",
      });
    }
  };

  const currentMonthTotal = monthlyTotals.find(month => month.value === selectedMonth)?.total || 0;
  const percentageUsed = Math.round((currentMonthTotal / expenseLimit) * 100);
  const isExceeded = percentageUsed > 100;

  const donutData = [
    { name: 'Usado', value: currentMonthTotal },
    { name: 'Restante', value: Math.max(0, expenseLimit - currentMonthTotal) }
  ];

  useEffect(() => {
    setAnimationPercentage(0);
    const timer = setTimeout(() => {
      setAnimationPercentage(percentageUsed);
    }, 500);

    return () => clearTimeout(timer);
  }, [percentageUsed, selectedMonth]);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-[400px]">
          <p>Carregando dados...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle>Distribuição de Gastos</CardTitle>
          <CardDescription>Distribuição dos gastos por categoria</CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Selecione o mês" />
            </SelectTrigger>
            <SelectContent>
              {monthlyTotals.map((month) => (
                <SelectItem key={month.value} value={month.value}>
                  {month.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="icon">
                <Pen className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
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
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={donutData}
                cx="50%"
                cy="50%"
                startAngle={90}
                endAngle={-270}
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={0}
                dataKey="value"
                animationDuration={1500}
                animationBegin={0}
              >
                {donutData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={isExceeded ? COLORS.exceeded[index] : COLORS.normal[index]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => `R$ ${value.toFixed(2)}`} />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl font-bold">
            {animationPercentage}%
          </div>
        </div>
        <div className="mt-4 text-center text-sm text-muted-foreground">
          <span>R$ {currentMonthTotal.toFixed(2)} / R$ {expenseLimit.toFixed(2)}</span>
        </div>
      </CardContent>
    </Card>
  );
};