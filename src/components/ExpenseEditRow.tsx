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
      <td>
        <Input
          type="date"
          value={editedValues.date}
          onChange={(e) => handleInputChange('date', e.target.value)}
          className="w-28 h-8 text-sm"
        />
      </td>
      <td>
        <Select
          value={editedValues.vehicleId.toString()}
          onValueChange={(value) => handleInputChange('vehicleId', value)}
        >
          <SelectTrigger className="w-28 h-8 text-sm">
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
      <td>
        <Select
          value={editedValues.category}
          onValueChange={(value) => handleInputChange('category', value)}
        >
          <SelectTrigger className="w-28 h-8 text-sm">
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
      <td>
        <Input
          type="number"
          value={editedValues.amount}
          onChange={(e) => handleInputChange('amount', e.target.value)}
          className="w-24 h-8 text-sm"
        />
      </td>
      <td>
        <Input
          type="text"
          value={editedValues.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          className="w-40 h-8 text-sm"
        />
      </td>
      <td>
        <Button variant="ghost" size="sm" onClick={handleSaveEdit}>
          <Check className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={handleCancelEdit}>
          <X className="h-4 w-4" />
        </Button>
      </td>
    </>
  );
};