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

interface ExpenseDonutChartProps {
  expenses: Array<{ type: string; amount: number; }>;
  availableMonths: Array<{ value: string; label: string; }>;
  selectedMonth: string;
  onMonthChange: (month: string) => void;
  expenseLimit: number;
  onExpenseLimitChange: (limit: number) => void;
}

const COLORS = ['#8B5CF6', '#A78BFA', '#C4B5FD', '#DDD6FE'];

export const ExpenseDonutChart: React.FC<ExpenseDonutChartProps> = ({
  expenses,
  availableMonths,
  selectedMonth,
  onMonthChange,
  expenseLimit,
  onExpenseLimitChange
}) => {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [newLimit, setNewLimit] = React.useState(expenseLimit.toString());
  const [animationPercentage, setAnimationPercentage] = useState(0);
  const [startAngle, setStartAngle] = useState(90);
  const { toast } = useToast();

  const handleSaveLimit = () => {
    const limit = parseFloat(newLimit);
    if (!isNaN(limit) && limit > 0) {
      onExpenseLimitChange(limit);
      setIsDialogOpen(false);
      toast({
        title: "Limite atualizado",
        description: `Novo limite de gastos: R$ ${limit.toFixed(2)}`,
      });
    } else {
      toast({
        title: "Erro",
        description: "Por favor, insira um valor válido maior que zero.",
        variant: "destructive",
      });
    }
  };

  const donutData = [
    { name: 'Usado', value: expenses.reduce((acc, curr) => acc + curr.amount, 0) },
    { name: 'Restante', value: Math.max(0, expenseLimit - expenses.reduce((acc, curr) => acc + curr.amount, 0)) }
  ];

  const totalExpenses = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const percentageUsed = Math.round((totalExpenses / expenseLimit) * 100);

  useEffect(() => {
    setAnimationPercentage(0);
    setStartAngle(90);

    const animationDuration = 1500; // 1.5 segundos
    const steps = 60; // 60 frames
    const stepDuration = animationDuration / steps;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      
      // Animação do preenchimento
      const newPercentage = (currentStep / steps) * percentageUsed;
      setAnimationPercentage(Math.round(newPercentage));

      // Animação do ângulo (sentido anti-horário)
      const newAngle = 90 - ((currentStep / steps) * 360);
      setStartAngle(newAngle);

      if (currentStep >= steps) {
        clearInterval(timer);
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [percentageUsed, expenses]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle>Distribuição de Gastos</CardTitle>
          <CardDescription>Distribuição dos gastos por categoria</CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Select value={selectedMonth} onValueChange={onMonthChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Selecione o mês" />
            </SelectTrigger>
            <SelectContent>
              {availableMonths.map((month) => (
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
                startAngle={startAngle}
                endAngle={startAngle - 360}
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={0}
                dataKey="value"
              >
                <Cell fill="#8B5CF6" />
                <Cell fill="#E2E8F0" />
              </Pie>
              <Tooltip formatter={(value: number) => `R$ ${value.toFixed(2)}`} />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl font-bold">
            {animationPercentage}%
          </div>
        </div>
        <div className="mt-4 text-center text-sm text-muted-foreground">
          <span>R$ {totalExpenses.toFixed(2)} / R$ {expenseLimit.toFixed(2)}</span>
        </div>
      </CardContent>
    </Card>
  );
};