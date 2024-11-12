import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface ExpenseMobileEditProps {
  editedValues: any;
  handleInputChange: (field: string, value: string) => void;
  handleSaveEdit: () => void;
  handleCancelEdit: () => void;
  vehicles: { id: string; name: string }[];
  categories: string[];
}

export const ExpenseMobileEdit: React.FC<ExpenseMobileEditProps> = ({
  editedValues,
  handleInputChange,
  handleSaveEdit,
  handleCancelEdit,
  vehicles,
  categories
}) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="date">Data</Label>
        <Input
          id="date"
          type="date"
          value={editedValues.date}
          onChange={(e) => handleInputChange('date', e.target.value)}
          className="w-full text-sm"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="vehicle">Veículo</Label>
        <Select
          value={editedValues.vehicleId}
          onValueChange={(value) => handleInputChange('vehicleId', value)}
        >
          <SelectTrigger id="vehicle" className="w-full text-sm">
            <SelectValue placeholder="Veículo" />
          </SelectTrigger>
          <SelectContent>
            {vehicles.map((vehicle) => (
              <SelectItem key={vehicle.id} value={vehicle.id}>
                {vehicle.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Categoria</Label>
        <Select
          value={editedValues.category}
          onValueChange={(value) => handleInputChange('category', value)}
        >
          <SelectTrigger id="category" className="w-full text-sm">
            <SelectValue placeholder="Categoria" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="amount">Valor</Label>
        <Input
          id="amount"
          type="number"
          value={editedValues.amount}
          onChange={(e) => handleInputChange('amount', e.target.value)}
          className="w-full text-sm"
          step="0.01"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descrição</Label>
        <Input
          id="description"
          type="text"
          value={editedValues.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          className="w-full text-sm"
        />
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button variant="outline" onClick={handleCancelEdit}>
          Cancelar
        </Button>
        <Button onClick={handleSaveEdit} className="bg-green-500 hover:bg-green-600">
          Salvar
        </Button>
      </div>
    </div>
  );
};