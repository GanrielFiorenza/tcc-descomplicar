import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Vehicle {
  id: number;
  brand: string;
  model: string;
  year: string;
  mileage: string;
  plate: string;
}

interface VehicleFormProps {
  vehicle: Vehicle;
  onSave: (vehicle: Vehicle) => void;
  onCancel: () => void;
}

export const VehicleForm: React.FC<VehicleFormProps> = ({ vehicle, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Vehicle>(vehicle);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="brand">Marca</Label>
        <Input
          id="brand"
          name="brand"
          value={formData.brand}
          onChange={handleChange}
          placeholder="Marca do veículo"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="model">Modelo</Label>
        <Input
          id="model"
          name="model"
          value={formData.model}
          onChange={handleChange}
          placeholder="Modelo do veículo"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="year">Ano</Label>
        <Input
          id="year"
          name="year"
          value={formData.year}
          onChange={handleChange}
          placeholder="Ano do veículo"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="mileage">Quilometragem</Label>
        <Input
          id="mileage"
          name="mileage"
          value={formData.mileage}
          onChange={handleChange}
          placeholder="Quilometragem do veículo"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="plate">Placa</Label>
        <Input
          id="plate"
          name="plate"
          value={formData.plate}
          onChange={handleChange}
          placeholder="Placa do veículo"
          required
        />
      </div>
      
      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">Salvar</Button>
      </div>
    </form>
  );
};