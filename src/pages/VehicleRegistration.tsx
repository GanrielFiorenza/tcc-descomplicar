import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pencil, Trash2, Plus, Car } from 'lucide-react';

interface Vehicle {
  id: number;
  brand: string;
  model: string;
  year: string;
  mileage: string;
  vin: string;
}

const VehicleRegistration = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [newVehicle, setNewVehicle] = useState<Omit<Vehicle, 'id'>>({
    brand: '',
    model: '',
    year: '',
    mileage: '',
    vin: '',
  });
  const [editingId, setEditingId] = useState<number | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewVehicle(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId !== null) {
      setVehicles(vehicles.map(v => v.id === editingId ? { ...newVehicle, id: editingId } : v));
      setEditingId(null);
    } else {
      setVehicles([...vehicles, { ...newVehicle, id: Date.now() }]);
    }
    setNewVehicle({ brand: '', model: '', year: '', mileage: '', vin: '' });
  };

  const handleEdit = (vehicle: Vehicle) => {
    setNewVehicle(vehicle);
    setEditingId(vehicle.id);
  };

  const handleDelete = (id: number) => {
    setVehicles(vehicles.filter(v => v.id !== id));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Registro de Veículos</h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>
            <Car className="inline-block mr-2" />
            {editingId !== null ? 'Editar Veículo' : 'Adicionar Novo Veículo'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              placeholder="Marca"
              name="brand"
              value={newVehicle.brand}
              onChange={handleInputChange}
              required
            />
            <Input
              placeholder="Modelo"
              name="model"
              value={newVehicle.model}
              onChange={handleInputChange}
              required
            />
            <Input
              placeholder="Ano"
              name="year"
              value={newVehicle.year}
              onChange={handleInputChange}
              required
            />
            <Input
              placeholder="Quilometragem"
              name="mileage"
              value={newVehicle.mileage}
              onChange={handleInputChange}
              required
            />
            <Input
              placeholder="VIN"
              name="vin"
              value={newVehicle.vin}
              onChange={handleInputChange}
              required
            />
            <Button type="submit" className="w-full">
              <Plus className="mr-2 h-4 w-4" />
              {editingId !== null ? 'Atualizar Veículo' : 'Adicionar Veículo'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Veículos Cadastrados</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Marca</TableHead>
                <TableHead>Modelo</TableHead>
                <TableHead>Ano</TableHead>
                <TableHead>Quilometragem</TableHead>
                <TableHead>VIN</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vehicles.map((vehicle) => (
                <TableRow key={vehicle.id}>
                  <TableCell>{vehicle.brand}</TableCell>
                  <TableCell>{vehicle.model}</TableCell>
                  <TableCell>{vehicle.year}</TableCell>
                  <TableCell>{vehicle.mileage}</TableCell>
                  <TableCell>{vehicle.vin}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="icon" onClick={() => handleEdit(vehicle)} className="mr-2">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => handleDelete(vehicle.id)} className="text-red-500">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default VehicleRegistration;