import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";

interface ExpenseFormProps {
  onSubmit: (expense: any) => void;
  onCancel: () => void;
  vehicles: { id: string; name: string }[];
}

export const ExpenseForm: React.FC<ExpenseFormProps> = ({ onSubmit, onCancel, vehicles }) => {
  const [newExpense, setNewExpense] = useState({
    vehicleId: '',
    date: '',
    category: '',
    amount: '',
    description: '',
  });
  const [errors, setErrors] = useState({
    vehicleId: '',
    category: '',
    date: '',
    amount: '',
    description: '',
  });
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewExpense(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {
      vehicleId: !newExpense.vehicleId ? "Selecione um veículo" : "",
      category: !newExpense.category ? "Selecione uma categoria" : "",
      date: !newExpense.date ? "Selecione uma data" : "",
      amount: !newExpense.amount ? "Insira um valor para a despesa" : "",
      description: !newExpense.description.trim() ? "Insira uma descrição para a despesa" : "",
    };

    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some(error => error !== "");
    if (hasErrors) {
      toast({
        title: "Erro de validação",
        description: "Por favor, corrija os campos destacados.",
        variant: "destructive",
      });
    }

    return !hasErrors;
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
      <div className="space-y-2">
        <Label htmlFor="vehicleId">Veículo</Label>
        <Select
          value={newExpense.vehicleId}
          onValueChange={(value) => {
            setNewExpense(prev => ({ ...prev, vehicleId: value }));
            setErrors(prev => ({ ...prev, vehicleId: '' }));
          }}
        >
          <SelectTrigger className={`w-full ${errors.vehicleId ? 'border-red-500' : ''}`}>
            <SelectValue placeholder="Selecione o veículo" />
          </SelectTrigger>
          <SelectContent>
            {vehicles.map(vehicle => (
              <SelectItem key={vehicle.id} value={vehicle.id}>{vehicle.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.vehicleId && <p className="text-red-500 text-sm">{errors.vehicleId}</p>}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="date">Data</Label>
        <Input
          type="date"
          name="date"
          value={newExpense.date}
          onChange={handleInputChange}
          className={errors.date ? 'border-red-500' : ''}
        />
        {errors.date && <p className="text-red-500 text-sm">{errors.date}</p>}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="category">Categoria</Label>
        <Select
          value={newExpense.category}
          onValueChange={(value) => {
            setNewExpense(prev => ({ ...prev, category: value }));
            setErrors(prev => ({ ...prev, category: '' }));
          }}
        >
          <SelectTrigger className={`w-full ${errors.category ? 'border-red-500' : ''}`}>
            <SelectValue placeholder="Categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Combustível">Combustível</SelectItem>
            <SelectItem value="Peças">Peças</SelectItem>
            <SelectItem value="Serviços">Serviços</SelectItem>
            <SelectItem value="Impostos">Impostos</SelectItem>
          </SelectContent>
        </Select>
        {errors.category && <p className="text-red-500 text-sm">{errors.category}</p>}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="amount">Valor</Label>
        <Input
          type="number"
          name="amount"
          value={newExpense.amount}
          onChange={handleInputChange}
          step="0.01"
          min="0.01"
          className={errors.amount ? 'border-red-500' : ''}
        />
        {errors.amount && <p className="text-red-500 text-sm">{errors.amount}</p>}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Descrição</Label>
        <Input
          name="description"
          value={newExpense.description}
          onChange={handleInputChange}
          className={errors.description ? 'border-red-500' : ''}
        />
        {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
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
