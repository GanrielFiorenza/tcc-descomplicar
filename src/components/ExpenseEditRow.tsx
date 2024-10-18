import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check, X } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ExpenseEditRowProps {
  editedValues: any;
  handleInputChange: (field: string, value: string) => void;
  handleSaveEdit: () => void;
  handleCancelEdit: () => void;
  vehicles: { id: number; name: string }[];
  categories: string[];
}

export const ExpenseEditRow: React.FC<ExpenseEditRowProps> = ({
  editedValues,
  handleInputChange,
  handleSaveEdit,
  handleCancelEdit,
  vehicles,
  categories
}) => {
  return (
    <>
      <td className="p-2 h-16">
        <Input
          type="date"
          value={editedValues.date}
          onChange={(e) => handleInputChange('date', e.target.value)}
          className="w-full h-full text-sm"
        />
      </td>
      <td className="p-2 h-16">
        <Select
          value={editedValues.vehicleId.toString()}
          onValueChange={(value) => handleInputChange('vehicleId', value)}
        >
          <SelectTrigger className="w-full h-full text-sm">
            <SelectValue placeholder="Veículo" />
          </SelectTrigger>
          <SelectContent>
            {vehicles.map((vehicle) => (
              <SelectItem key={vehicle.id} value={vehicle.id.toString()}>
                {vehicle.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </td>
      <td className="p-2 h-16">
        <Select
          value={editedValues.category}
          onValueChange={(value) => handleInputChange('category', value)}
        >
          <SelectTrigger className="w-full h-full text-sm">
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
      </td>
      <td className="p-2 h-16">
        <Input
          type="number"
          value={editedValues.amount}
          onChange={(e) => handleInputChange('amount', e.target.value)}
          className="w-full h-full text-sm"
        />
      </td>
      <td className="p-2 h-16">
        <Input
          type="text"
          value={editedValues.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          className="w-full h-full text-sm"
        />
      </td>
      <td className="p-2 h-16">
        <div className="flex h-full">
          <Button variant="ghost" size="sm" onClick={handleSaveEdit} className="flex-1 h-full">
            <Check className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={handleCancelEdit} className="flex-1 h-full">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </td>
    </>
  );
};