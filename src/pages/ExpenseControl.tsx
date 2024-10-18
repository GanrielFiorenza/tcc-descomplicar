import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Plus } from 'lucide-react';
import { ExpenseTable } from '@/components/ExpenseTable';
import { ExpenseChart } from '@/components/ExpenseChart';
import { VehicleFilter } from '@/components/VehicleFilter';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ExpenseForm } from '@/components/ExpenseForm';

interface Expense {
  id: number;
  vehicleId: number;
  date: string;
  category: string;
  amount: number;
  description: string;
}

const ExpenseControl = () => {
  const [vehicles] = useState([
    { id: 1, name: "Carro 1" },
    { id: 2, name: "Carro 2" },
    { id: 3, name: "Carro 3" },
  ]);

  // Mocked initial expenses
  const initialExpenses: Expense[] = [
    { id: 1, vehicleId: 1, date: '2024-03-01', category: 'Combustível', amount: 150.00, description: 'Abastecimento mensal' },
    { id: 2, vehicleId: 1, date: '2024-03-05', category: 'Manutenção', amount: 300.00, description: 'Troca de óleo' },
    { id: 3, vehicleId: 2, date: '2024-03-02', category: 'Combustível', amount: 120.00, description: 'Abastecimento semanal' },
    { id: 4, vehicleId: 2, date: '2024-03-10', category: 'Peças', amount: 450.00, description: 'Substituição de pneus' },
    { id: 5, vehicleId: 3, date: '2024-03-03', category: 'Impostos', amount: 200.00, description: 'IPVA' },
    { id: 6, vehicleId: 3, date: '2024-03-15', category: 'Combustível', amount: 180.00, description: 'Abastecimento quinzenal' },
  ];

  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);
  const [selectedVehicle, setSelectedVehicle] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();

  const handleAddExpense = (newExpense: Omit<Expense, 'id'>) => {
    const expenseWithId = { ...newExpense, id: Date.now(), vehicleId: Number(newExpense.vehicleId) };
    setExpenses([...expenses, expenseWithId]);
    setIsModalOpen(false);
    toast({
      title: "Despesa adicionada",
      description: "A nova despesa foi registrada com sucesso.",
    });
  };

  const handleEditExpense = (editedExpense: Expense) => {
    setExpenses(expenses.map(expense => 
      expense.id === editedExpense.id ? editedExpense : expense
    ));
    toast({
      title: "Despesa atualizada",
      description: "A despesa foi atualizada com sucesso.",
    });
  };

  const handleDeleteExpense = (expenseId: number) => {
    setExpenses(expenses.filter(expense => expense.id !== expenseId));
    toast({
      title: "Despesa removida",
      description: "A despesa foi removida com sucesso.",
      variant: "destructive",
    });
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Controle de Despesas</h1>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-700 hover:bg-blue-800">
              <Plus className="mr-2 h-4 w-4" />
              Nova Despesa
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Nova Despesa</DialogTitle>
            </DialogHeader>
            <ExpenseForm onSubmit={handleAddExpense} vehicles={vehicles} onCancel={() => setIsModalOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>
      
      <VehicleFilter
        vehicles={vehicles}
        selectedVehicle={selectedVehicle}
        onSelectVehicle={setSelectedVehicle}
      />
      
      <ExpenseChart chartData={chartData} />
      
      <ExpenseTable
        expenses={filteredExpenses}
        vehicles={vehicles}
        onEdit={handleEditExpense}
        onDelete={handleDeleteExpense}
      />
    </div>
  );
};

export default ExpenseControl;