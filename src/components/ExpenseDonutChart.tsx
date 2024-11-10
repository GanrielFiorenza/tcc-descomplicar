import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pen, DollarSign } from 'lucide-react';
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
    { name: 'Manutenção', value: expenses.filter(e => e.type === 'Manutenção').reduce((acc, curr) => acc + curr.amount, 0) },
    { name: 'Combustível', value: expenses.filter(e => e.type === 'Combustível').reduce((acc, curr) => acc + curr.amount, 0) },
    { name: 'Impostos', value: expenses.filter(e => e.type === 'Impostos').reduce((acc, curr) => acc + curr.amount, 0) },
    { name: 'Outros', value: expenses.filter(e => !['Manutenção', 'Combustível', 'Impostos'].includes(e.type)).reduce((acc, curr) => acc + curr.amount, 0) },
  ].filter(item => item.value > 0);

  const totalExpenses = donutData.reduce((acc, curr) => acc + curr.value, 0);
  const percentageUsed = Math.round((totalExpenses / expenseLimit) * 100);

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
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
              >
                {donutData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => `R$ ${value.toFixed(2)}`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl font-bold">
            {percentageUsed}%
          </div>
        </div>
        <div className="mt-4 flex justify-between items-center text-sm text-muted-foreground">
          <div className="flex items-center">
            <DollarSign className="h-4 w-4 mr-1" />
            <span>Total: R$ {totalExpenses.toFixed(2)}</span>
          </div>
          <div className="flex items-center">
            <DollarSign className="h-4 w-4 mr-1" />
            <span>Limite: R$ {expenseLimit.toFixed(2)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};