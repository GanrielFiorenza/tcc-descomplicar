import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, DollarSign, FileText, Tag } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface ExpenseFormProps {
  onSubmit: (expense: any) => void;
  onCancel: () => void;
  vehicles: { id: number; name: string }[];
}

export const ExpenseForm: React.FC<ExpenseFormProps> = ({ onSubmit, onCancel, vehicles }) => {
  const [newExpense, setNewExpense] = useState({
    vehicleId: '',
    date: '',
    category: '',
    amount: '',
    description: '',
  });
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewExpense(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const errors: string[] = [];

    if (!newExpense.vehicleId) errors.push("Selecione um veículo");
    if (!newExpense.date) errors.push("Selecione uma data");
    if (!newExpense.category) errors.push("Selecione uma categoria");
    if (!newExpense.amount) errors.push("Insira um valor para a despesa");
    if (!newExpense.description.trim()) errors.push("Insira uma descrição para a despesa");

    const amount = parseFloat(newExpense.amount);
    if (isNaN(amount) || amount <= 0) {
      errors.push("Insira um valor válido para a despesa (maior que zero)");
    }

    if (errors.length > 0) {
      toast({
        title: "Erro de validação",
        description: (
          <ul className="list-disc pl-4">
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        ),
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit({
        ...newExpense,
        amount: parseFloat(newExpense.amount),
      });
      setNewExpense({
        vehicleId: '',
        date: '',
        category: '',
        amount: '',
        description: '',
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center space-x-2">
        <Tag className="text-blue-500" />
        <Select
          value={newExpense.vehicleId}
          onValueChange={(value) => setNewExpense(prev => ({ ...prev, vehicleId: value }))}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Selecione o veículo" />
          </SelectTrigger>
          <SelectContent>
            {vehicles.map(vehicle => (
              <SelectItem key={vehicle.id} value={vehicle.id.toString()}>{vehicle.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex items-center space-x-2">
        <Calendar className="text-green-500" />
        <Input
          type="date"
          name="date"
          value={newExpense.date}
          onChange={handleInputChange}
          required
        />
      </div>
      
      <div className="flex items-center space-x-2">
        <FileText className="text-yellow-500" />
        <Select
          value={newExpense.category}
          onValueChange={(value) => setNewExpense(prev => ({ ...prev, category: value }))}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Combustível">Combustível</SelectItem>
            <SelectItem value="Peças">Peças</SelectItem>
            <SelectItem value="Serviços">Serviços</SelectItem>
            <SelectItem value="Impostos">Impostos</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex items-center space-x-2">
        <DollarSign className="text-red-500" />
        <Input
          type="number"
          name="amount"
          placeholder="Valor"
          value={newExpense.amount}
          onChange={handleInputChange}
          required
          step="0.01"
          min="0.01"
        />
      </div>
      
      <div className="flex items-center space-x-2">
        <FileText className="text-purple-500" />
        <Input
          name="description"
          placeholder="Descrição"
          value={newExpense.description}
          onChange={handleInputChange}
          required
        />
      </div>
      
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" className="bg-green-500 hover:bg-green-600">
          Salvar
        </Button>
      </div>
    </form>
  );
};