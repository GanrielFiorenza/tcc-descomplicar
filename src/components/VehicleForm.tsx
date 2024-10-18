import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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
  const [editedVehicle, setEditedVehicle] = useState<Vehicle>(vehicle);
  const [errors, setErrors] = useState<{ [key in keyof Vehicle]?: string }>({});

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 50 }, (_, i) => currentYear - i);

  const validateForm = () => {
    const newErrors: { [key in keyof Vehicle]?: string } = {};
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
      onSave(editedVehicle);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedVehicle({ ...editedVehicle, [name]: value });
  };

  const renderInput = (field: keyof Vehicle, placeholder: string, type: string = 'text') => (
    <TooltipProvider>
      <Tooltip open={!!errors[field]}>
        <TooltipTrigger asChild>
          <div className="relative">
            <Input
              type={type}
              name={field}
              value={editedVehicle[field]}
              onChange={handleInputChange}
              placeholder={placeholder}
              className={`w-full ${errors[field] ? "border-red-500" : ""}`}
            />
            {errors[field] && (
              <AlertCircle className="absolute right-2 top-1/2 transform -translate-y-1/2 text-red-500" size={16} />
            )}
          </div>
        </TooltipTrigger>
        {errors[field] && <TooltipContent>{errors[field]}</TooltipContent>}
      </Tooltip>
    </TooltipProvider>
  );

  return (
    <div className={vehicle.id === 0 ? "space-y-4" : "flex flex-wrap gap-2"}>
      {renderInput('brand', 'Marca')}
      {renderInput('model', 'Modelo')}
      <TooltipProvider>
        <Tooltip open={!!errors.year}>
          <TooltipTrigger asChild>
            <div className={`relative ${vehicle.id === 0 ? "w-full" : "w-24"}`}>
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
              {errors.year && (
                <AlertCircle className="absolute right-2 top-1/2 transform -translate-y-1/2 text-red-500" size={16} />
              )}
            </div>
          </TooltipTrigger>
          {errors.year && <TooltipContent>{errors.year}</TooltipContent>}
        </Tooltip>
      </TooltipProvider>
      {renderInput('mileage', 'Quilometragem')}
      {renderInput('plate', 'Placa')}
      {vehicle.id === 0 && (
        <div className="flex space-x-2 w-full">
          <Button onClick={handleSave} className="bg-green-500 text-white hover:bg-green-600 flex-grow">
            Salvar
          </Button>
          <Button onClick={onCancel} className="bg-red-500 text-white hover:bg-red-600 flex-grow">
            Cancelar
          </Button>
        </div>
      )}
    </div>
  );
};