import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Fuel, Wrench, FileText, DollarSign, Plus } from 'lucide-react';

interface Expense {
  id: number;
  vehicleId: number;
  date: string;
  category: string;
  amount: number;
  description: string;
}

const ExpenseControl = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [vehicles, setVehicles] = useState([
    { id: 1, name: "Carro 1" },
    { id: 2, name: "Carro 2" },
  ]);
  const [selectedVehicle, setSelectedVehicle] = useState<number | null>(null);
  const [newExpense, setNewExpense] = useState<Omit<Expense, 'id'>>({
    vehicleId: 0,
    date: '',
    category: '',
    amount: 0,
    description: '',
  });
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewExpense(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newExpense.vehicleId && newExpense.date && newExpense.category && newExpense.amount) {
      setExpenses([...expenses, { ...newExpense, id: Date.now() }]);
      setNewExpense({
        vehicleId: 0,
        date: '',
        category: '',
        amount: 0,
        description: '',
      });
      toast({
        title: "Despesa adicionada",
        description: "A nova despesa foi registrada com sucesso.",
      });
    } else {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Combustível':
        return <Fuel className="h-4 w-4 text-yellow-500" />;
      case 'Peças':
      case 'Serviços':
        return <Wrench className="h-4 w-4 text-blue-500" />;
      case 'Impostos':
        return <FileText className="h-4 w-4 text-red-500" />;
      default:
        return <DollarSign className="h-4 w-4 text-green-500" />;
    }
  };

  const filteredExpenses = selectedVehicle
    ? expenses.filter(expense => expense.vehicleId === selectedVehicle)
    : expenses;

  const chartData = filteredExpenses.reduce((acc, expense) => {
    const existingCategory = acc.find(item => item.category === expense.category);
    if (existingCategory) {
      existingCategory.amount += expense.amount;
    } else {
      acc.push({ category: expense.category, amount: expense.amount });
    }
    return acc;
  }, [] as { category: string; amount: number }[]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Controle de Despesas</h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Plus className="mr-2" />
            Adicionar Nova Despesa
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Select onValueChange={(value) => setNewExpense(prev => ({ ...prev, vehicleId: Number(value) }))}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o veículo" />
              </SelectTrigger>
              <SelectContent>
                {vehicles.map(vehicle => (
                  <SelectItem key={vehicle.id} value={vehicle.id.toString()}>{vehicle.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              type="date"
              name="date"
              value={newExpense.date}
              onChange={handleInputChange}
              required
            />
            <Select onValueChange={(value) => setNewExpense(prev => ({ ...prev, category: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Combustível">Combustível</SelectItem>
                <SelectItem value="Peças">Peças</SelectItem>
                <SelectItem value="Serviços">Serviços</SelectItem>
                <SelectItem value="Impostos">Impostos</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="number"
              name="amount"
              placeholder="Valor"
              value={newExpense.amount}
              onChange={handleInputChange}
              required
            />
            <Input
              name="description"
              placeholder="Descrição"
              value={newExpense.description}
              onChange={handleInputChange}
            />
            <Button type="submit" className="w-full">
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Despesa
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filtrar por Veículo</CardTitle>
        </CardHeader>
        <CardContent>
          <Select onValueChange={(value) => setSelectedVehicle(value === 'all' ? null : Number(value))}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o veículo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os veículos</SelectItem>
              {vehicles.map(vehicle => (
                <SelectItem key={vehicle.id} value={vehicle.id.toString()}>{vehicle.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Resumo de Despesas</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="amount" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Despesas Registradas</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Veículo</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Descrição</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredExpenses.map((expense) => (
                <TableRow key={expense.id}>
                  <TableCell>{expense.date}</TableCell>
                  <TableCell>{vehicles.find(v => v.id === expense.vehicleId)?.name}</TableCell>
                  <TableCell className="flex items-center">
                    {getCategoryIcon(expense.category)}
                    <span className="ml-2">{expense.category}</span>
                  </TableCell>
                  <TableCell className={expense.amount > 1000 ? "text-red-500 font-bold" : ""}>
                    R$ {expense.amount.toFixed(2)}
                  </TableCell>
                  <TableCell>{expense.description}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExpenseControl;