import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast"; // Updated import path
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Fuel, Wrench, FileText, DollarSign, Plus } from 'lucide-react';
import { ExpenseForm } from '@/components/ExpenseForm';
import { ExpenseTable } from '@/components/ExpenseTable';
import { ExpenseChart } from '@/components/ExpenseChart';
import { VehicleFilter } from '@/components/VehicleFilter';

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
  const { toast } = useToast();

  const handleAddExpense = (newExpense: Omit<Expense, 'id'>) => {
    setExpenses([...expenses, { ...newExpense, id: Date.now() }]);
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
      <h1 className="text-3xl font-bold mb-6">Controle de Despesas</h1>
      
      <ExpenseForm onSubmit={handleAddExpense} vehicles={vehicles} />
      
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