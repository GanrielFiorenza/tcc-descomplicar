import React from 'react';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pencil, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { VehicleForm } from '@/components/VehicleForm';
import { Vehicle } from '@/services/vehicleService';

interface VehicleTableProps {
  vehicles: Vehicle[];
  editingVehicle: Vehicle | null;
  setEditingVehicle: (vehicle: Vehicle | null) => void;
  handleEditVehicle: (vehicle: Vehicle) => void;
  handleDeleteVehicle: (id: string) => void;
}

const VehicleTable: React.FC<VehicleTableProps> = ({
  vehicles,
  editingVehicle,
  setEditingVehicle,
  handleEditVehicle,
  handleDeleteVehicle,
}) => {
  return (
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
              <TableCell colSpan={6} className="hidden sm:table-cell">
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
                  <div className="flex space-x-2">
                    <Dialog open={editingVehicle?.id === vehicle.id} onOpenChange={(open) => !open && setEditingVehicle(null)}>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingVehicle(vehicle)}
                          className="sm:hidden"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:hidden">
                        <DialogHeader>
                          <DialogTitle>Editar Veículo</DialogTitle>
                        </DialogHeader>
                        <VehicleForm
                          vehicle={vehicle}
                          onSave={handleEditVehicle}
                          onCancel={() => setEditingVehicle(null)}
                          isNewVehicle={false}
                        />
                      </DialogContent>
                    </Dialog>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingVehicle(vehicle)}
                      className="hidden sm:inline-flex"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-500"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                          <AlertDialogDescription>
                            Excluir esse veículo irá excluir permanentemente todos os dados relacionados a ele.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteVehicle(vehicle.id)}
                            className="bg-red-500 text-white hover:bg-red-600"
                          >
                            Excluir
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default VehicleTable;