import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle, Check, X } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
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
  isNewVehicle?: boolean;
}

export const VehicleForm: React.FC<VehicleFormProps> = ({ vehicle, onSave, onCancel, isNewVehicle = false }) => {
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

  const renderInput = (field: keyof Vehicle, placeholder: string, type: string = 'text', className: string) => (
    <TooltipProvider>
      <Tooltip open={!!errors[field]}>
        <TooltipTrigger asChild>
          <div className={className}>
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

  if (isNewVehicle) {
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
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="model">Modelo</Label>
          <Input
            id="model"
            name="model"
            value={editedVehicle.model}
            onChange={handleInputChange}
            placeholder="Modelo do veículo"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="year">Ano</Label>
          <Select
            value={editedVehicle.year}
            onValueChange={(value) => setEditedVehicle({...editedVehicle, year: value})}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Ano" />
            </SelectTrigger>
            <SelectContent>
              {yearOptions.map((year) => (
                <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="mileage">Quilometragem</Label>
          <Input
            id="mileage"
            name="mileage"
            value={editedVehicle.mileage}
            onChange={handleInputChange}
            placeholder="Quilometragem do veículo"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="plate">Placa</Label>
          <Input
            id="plate"
            name="plate"
            value={editedVehicle.plate}
            onChange={handleInputChange}
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
  }

  return (
    <div className="grid grid-cols-12 gap-2 items-center">
      {renderInput('brand', 'Marca', 'text', 'col-span-2')}
      {renderInput('model', 'Modelo', 'text', 'col-span-2')}
      <TooltipProvider>
        <Tooltip open={!!errors.year}>
          <TooltipTrigger asChild>
            <div className="col-span-2">
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
      {renderInput('mileage', 'Quilometragem', 'text', 'col-span-2')}
      {renderInput('plate', 'Placa', 'text', 'col-span-2')}
      <div className="col-span-2 flex space-x-1">
        <Button
          variant="outline"
          size="sm"
          onClick={handleSave}
          className="bg-green-500 text-white hover:bg-green-600 px-2 flex-grow"
        >
          <Check className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onCancel}
          className="bg-red-500 text-white hover:bg-red-600 px-2 flex-grow"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};