import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from 'lucide-react';

interface ExpenseFormProps {
  onSubmit: (expense: any) => void;
  vehicles: { id: number; name: string }[];
}

export const ExpenseForm: React.FC<ExpenseFormProps> = ({ onSubmit, vehicles }) => {
  const [newExpense, setNewExpense] = useState({
    vehicleId: 0,
    date: '',
    category: '',
    amount: 0,
    description: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewExpense(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newExpense.vehicleId && newExpense.date && newExpense.category && newExpense.amount) {
      onSubmit(newExpense);
      setNewExpense({
        vehicleId: 0,
        date: '',
        category: '',
        amount: 0,
        description: '',
      });
    }
  };

  return (
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
  );
};