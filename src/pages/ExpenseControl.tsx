import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Plus } from 'lucide-react';
import { ExpenseTable } from '@/components/ExpenseTable';
import { ExpenseChart } from '@/components/ExpenseChart';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ExpenseForm } from '@/components/ExpenseForm';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { addExpense, getUserExpenses, updateExpense, deleteExpense, Expense } from '@/services/expenseService';
import { getUserVehicles, Vehicle } from '@/services/vehicleService';

const formatVehicleName = (vehicle: Vehicle) => {
  return `${vehicle.brand} ${vehicle.model} (${vehicle.plate})`;
};

const ExpenseControl = () => {
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: rawVehicles = [] } = useQuery({
    queryKey: ['vehicles'],
    queryFn: getUserVehicles
  });

  const vehicles = rawVehicles.map(vehicle => ({
    id: vehicle.id,
    name: formatVehicleName(vehicle)
  }));

  const { data: expenses = [] } = useQuery({
    queryKey: ['expenses'],
    queryFn: getUserExpenses
  });

  const addExpenseMutation = useMutation({
    mutationFn: addExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      setIsModalOpen(false);
      toast({
        title: "Despesa adicionada",
        description: "A nova despesa foi registrada com sucesso.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao adicionar despesa",
        description: error instanceof Error ? error.message : "Ocorreu um erro ao adicionar a despesa",
        variant: "destructive",
      });
    }
  });

  const updateExpenseMutation = useMutation({
    mutationFn: updateExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      toast({
        title: "Despesa atualizada",
        description: "A despesa foi atualizada com sucesso.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao atualizar despesa",
        description: error instanceof Error ? error.message : "Ocorreu um erro ao atualizar a despesa",
        variant: "destructive",
      });
    }
  });

  const deleteExpenseMutation = useMutation({
    mutationFn: deleteExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      toast({
        title: "Despesa removida",
        description: "A despesa foi removida com sucesso.",
        variant: "destructive",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao remover despesa",
        description: error instanceof Error ? error.message : "Ocorreu um erro ao remover a despesa",
        variant: "destructive",
      });
    }
  });

  const handleAddExpense = (newExpense: Omit<Expense, 'id' | 'userId'>) => {
    addExpenseMutation.mutate(newExpense);
  };

  const handleEditExpense = (editedExpense: Expense) => {
    updateExpenseMutation.mutate(editedExpense);
  };

  const handleDeleteExpense = (expenseId: string) => {
    deleteExpenseMutation.mutate(expenseId);
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
