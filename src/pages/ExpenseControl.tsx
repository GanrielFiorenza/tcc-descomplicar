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
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [vehicles] = useState([
    { id: 1, name: "Carro 1" },
    { id: 2, name: "Carro 2" },
  ]);
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
      
      <ExpenseTable expenses={filteredExpenses} vehicles={vehicles} />
    </div>
  );
};

export default ExpenseControl;