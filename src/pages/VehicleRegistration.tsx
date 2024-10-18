import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pencil, Trash2, Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { VehicleForm } from '@/components/VehicleForm';

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
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();

  const handleAddVehicle = (newVehicle: Omit<Vehicle, 'id'>) => {
    setVehicles([...vehicles, { ...newVehicle, id: Date.now() }]);
    setIsModalOpen(false);
    toast({
      title: "Veículo Adicionado",
      description: "Um novo veículo foi adicionado com sucesso.",
    });
  };

  const handleEditVehicle = (editedVehicle: Vehicle) => {
    setVehicles(vehicles.map(v => v.id === editedVehicle.id ? editedVehicle : v));
    setEditingVehicle(null);
    toast({
      title: "Veículo Atualizado",
      description: "O veículo foi atualizado com sucesso.",
    });
  };

  const handleDeleteVehicle = (id: number) => {
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
            <Button className="bg-blue-700 hover:bg-blue-800">
              <Plus className="mr-2 h-4 w-4" />
              Novo Veículo
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Novo Veículo</DialogTitle>
            </DialogHeader>
            <VehicleForm
              vehicle={{ id: 0, brand: '', model: '', year: '', mileage: '', plate: '' }}
              onSave={handleAddVehicle}
              onCancel={() => setIsModalOpen(false)}
              isNewVehicle={true}
            />
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
                  {editingVehicle?.id === vehicle.id ? (
                    <TableCell colSpan={6}>
                      <VehicleForm
                        vehicle={editingVehicle}
                        onSave={handleEditVehicle}
                        onCancel={() => setEditingVehicle(null)}
                        isNewVehicle={false}
                      />
                    </TableCell>
                  ) : (
                    <>
                      <TableCell>{vehicle.brand}</TableCell>
                      <TableCell>{vehicle.model}</TableCell>
                      <TableCell>{vehicle.year}</TableCell>
                      <TableCell>{vehicle.mileage}</TableCell>
                      <TableCell>{vehicle.plate}</TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingVehicle(vehicle)}
                          className="mr-2"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteVehicle(vehicle.id)}
                          className="text-red-500"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </>
                  )}
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