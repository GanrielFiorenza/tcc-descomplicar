import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface VehicleFilterProps {
  vehicles: { id: string; name: string }[];
  selectedVehicle: string | null;
  onSelectVehicle: (vehicleId: string | null) => void;
}

export const VehicleFilter: React.FC<VehicleFilterProps> = ({ vehicles, selectedVehicle, onSelectVehicle }) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Filtrar por Veículo</CardTitle>
      </CardHeader>
      <CardContent>
        <Select onValueChange={(value) => onSelectVehicle(value === 'all' ? null : value)}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione o veículo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os veículos</SelectItem>
            {vehicles.map(vehicle => (
              <SelectItem key={vehicle.id} value={vehicle.id}>{vehicle.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  );
};