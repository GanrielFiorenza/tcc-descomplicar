import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { CalendarIcon, DollarSign, Wrench, Trash2, AlertTriangle, Edit, Car } from 'lucide-react';
import { Maintenance } from '../types/maintenance';
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
import { MaintenanceEditForm } from './MaintenanceEditForm';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface MaintenanceTableProps {
  maintenances: Maintenance[];
  onDelete: (id: string) => void;
  onEdit: (maintenance: Maintenance) => void;
  vehicles: { id: string; name: string }[];
}

const MaintenanceTable: React.FC<MaintenanceTableProps> = ({ maintenances, onDelete, onEdit, vehicles }) => {
  const [maintenanceToDelete, setMaintenanceToDelete] = useState<string | null>(null);
  const [editingMaintenance, setEditingMaintenance] = useState<Maintenance | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleDelete = (id: string) => {
    setMaintenanceToDelete(id);
  };

  const confirmDelete = () => {
    if (maintenanceToDelete !== null) {
      onDelete(maintenanceToDelete);
      setMaintenanceToDelete(null);
    }
  };

  const handleEdit = (maintenance: Maintenance) => {
    setEditingMaintenance({ ...maintenance });
  };

  const handleSaveEdit = (updatedMaintenance: Maintenance) => {
    onEdit(updatedMaintenance);
    setEditingMaintenance(null);
    setIsDialogOpen(false);
  };

  const handleCancelEdit = () => {
    setEditingMaintenance(null);
    setIsDialogOpen(false);
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[120px]">Data</TableHead>
          <TableHead className="w-[120px]">Veículo</TableHead>
          <TableHead className="w-[180px]">Tipo de Serviço</TableHead>
          <TableHead className="w-[100px]">Custo</TableHead>
          <TableHead className="w-[200px]">Observações</TableHead>
          <TableHead className="w-[100px]">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {maintenances.map((maintenance) => (
          <TableRow key={maintenance.id}>
            {editingMaintenance?.id === maintenance.id ? (
              <TableCell colSpan={6} className="hidden md:table-cell">
                <MaintenanceEditForm
                  maintenance={editingMaintenance}
                  onSave={handleSaveEdit}
                  onCancel={handleCancelEdit}
                  vehicles={vehicles}
                />
              </TableCell>
            ) : (
              <>
                <TableCell className="w-[120px]">
                  <CalendarIcon className="inline mr-2" size={16} />
                  {new Date(maintenance.date).toLocaleDateString()}
                </TableCell>
                <TableCell className="w-[120px]">
                  <Car className="inline mr-2" size={16} />
                  {vehicles.find(v => v.id === maintenance.vehicleId)?.name || 'N/A'}
                </TableCell>
                <TableCell className="w-[180px]">
                  <Wrench className="inline mr-2" size={16} />
                  {maintenance.serviceType}
                </TableCell>
                <TableCell className="w-[100px]">
                  <DollarSign className="inline mr-2" size={16} />
                  R$ {maintenance.cost.toFixed(2)}
                </TableCell>
                <TableCell className="w-[200px]">{maintenance.observations}</TableCell>
                <TableCell className="w-[100px]">
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild className="md:hidden">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="md:hidden">
                      <DialogHeader>
                        <DialogTitle>Editar Manutenção</DialogTitle>
                      </DialogHeader>
                      <MaintenanceEditForm
                        maintenance={maintenance}
                        onSave={handleSaveEdit}
                        onCancel={handleCancelEdit}
                        vehicles={vehicles}
                      />
                    </DialogContent>
                  </Dialog>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(maintenance)}
                    className="hidden md:inline-flex mr-2"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="destructive"
                        size="sm"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center text-red-500">
                          <AlertTriangle className="mr-2 h-5 w-5" />
                          Confirmar exclusão
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          Tem certeza que deseja excluir esta manutenção? Esta ação não pode ser desfeita.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="bg-gray-200 text-gray-800 hover:bg-gray-300">
                          Cancelar
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={confirmDelete}
                          className="bg-red-500 text-white hover:bg-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Excluir
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default MaintenanceTable;