import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Label } from "@/components/ui/label";
import { Vehicle } from '@/services/vehicleService';

interface VehicleFormProps {
  vehicle?: Vehicle;
  onSave: (vehicle: any) => void;
  onCancel: () => void;
  isNewVehicle?: boolean;
}

export const VehicleForm: React.FC<VehicleFormProps> = ({ 
  vehicle = { id: '', brand: '', model: '', year: '', mileage: '', plate: '', userId: '' },
  onSave,
  onCancel,
  isNewVehicle = false 
}) => {
  const [editedVehicle, setEditedVehicle] = useState(vehicle);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 50 }, (_, i) => currentYear - i);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!editedVehicle.brand.trim()) newErrors.brand = "Este campo não pode ficar vazio";
    if (!editedVehicle.model.trim()) newErrors.model = "Este campo não pode ficar vazio";
    if (!editedVehicle.year) newErrors.year = "Este campo não pode ficar vazio";
    if (!editedVehicle.mileage.trim()) newErrors.mileage = "Este campo não pode ficar vazio";
    if (!editedVehicle.plate.trim()) newErrors.plate = "Este campo não pode ficar vazio";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      const { id, userId, ...vehicleData } = editedVehicle;
      if (isNewVehicle) {
        onSave(vehicleData);
      } else {
        onSave(editedVehicle);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedVehicle({ ...editedVehicle, [name]: value });
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="brand">Marca</Label>
        <Input
          id="brand"
          name="brand"
          value={editedVehicle.brand}
          onChange={handleInputChange}
          placeholder="Marca do veículo"
          className={errors.brand ? "border-red-500" : ""}
        />
        {errors.brand && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <AlertCircle className="h-4 w-4 text-red-500" />
              </TooltipTrigger>
              <TooltipContent>{errors.brand}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="model">Modelo</Label>
        <Input
          id="model"
          name="model"
          value={editedVehicle.model}
          onChange={handleInputChange}
          placeholder="Modelo do veículo"
          className={errors.model ? "border-red-500" : ""}
        />
        {errors.model && <span className="text-red-500 text-sm">{errors.model}</span>}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="year">Ano</Label>
        <Select
          value={editedVehicle.year}
          onValueChange={(value) => setEditedVehicle({...editedVehicle, year: value})}
        >
          <SelectTrigger className={`w-full ${errors.year ? "border-red-500" : ""}`}>
            <SelectValue placeholder="Ano" />
          </SelectTrigger>
          <SelectContent>
            {yearOptions.map((year) => (
              <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.year && <span className="text-red-500 text-sm">{errors.year}</span>}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="mileage">Quilometragem</Label>
        <Input
          id="mileage"
          name="mileage"
          value={editedVehicle.mileage}
          onChange={handleInputChange}
          placeholder="Quilometragem do veículo"
          className={errors.mileage ? "border-red-500" : ""}
        />
        {errors.mileage && <span className="text-red-500 text-sm">{errors.mileage}</span>}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="plate">Placa</Label>
        <Input
          id="plate"
          name="plate"
          value={editedVehicle.plate}
          onChange={handleInputChange}
          placeholder="Placa do veículo"
          className={errors.plate ? "border-red-500" : ""}
        />
        {errors.plate && <span className="text-red-500 text-sm">{errors.plate}</span>}
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