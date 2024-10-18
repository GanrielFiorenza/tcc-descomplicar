import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pencil, Trash2, Plus, Car } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface Vehicle {
  id: number;
  brand: string;
  model: string;
  year: string;
  mileage: string;
  plate: string;
}

const VehicleRegistration = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [newVehicle, setNewVehicle] = useState<Omit<Vehicle, 'id'>>({
    brand: '',
    model: '',
    year: '',
    mileage: '',
    plate: '',
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();

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
    setNewVehicle({ brand: '', model: '', year: '', mileage: '', plate: '' });
    setIsModalOpen(false);
    toast({
      title: editingId !== null ? "Veículo Atualizado" : "Veículo Adicionado",
      description: editingId !== null ? "O veículo foi atualizado com sucesso." : "Um novo veículo foi adicionado com sucesso.",
    });
  };

  const handleEdit = (vehicle: Vehicle) => {
    setNewVehicle(vehicle);
    setEditingId(vehicle.id);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    setVehicles(vehicles.filter(v => v.id !== id));
    toast({
      title: "Veículo Removido",
      description: "O veículo foi removido com sucesso.",
      variant: "destructive",
    });
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Registro de Veículos</h1>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-green-500 hover:bg-green-600">
              <Plus className="mr-2 h-4 w-4" />
              Novo Veículo
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingId !== null ? 'Editar Veículo' : 'Adicionar Novo Veículo'}</DialogTitle>
            </DialogHeader>
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
                placeholder="Placa"
                name="plate"
                value={newVehicle.plate}
                onChange={handleInputChange}
                required
              />
              <Button type="submit" className="w-full bg-green-500 hover:bg-green-600">
                <Plus className="mr-2 h-4 w-4" />
                {editingId !== null ? 'Atualizar Veículo' : 'Adicionar Veículo'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

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
                <TableHead>Placa</TableHead>
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
                  <TableCell>{vehicle.plate}</TableCell>
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