import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { CalendarIcon, DollarSign, Wrench, Trash2, AlertTriangle, Edit } from 'lucide-react';
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

interface MaintenanceTableProps {
  maintenances: Maintenance[];
  onDelete: (id: number) => void;
  onEdit: (maintenance: Maintenance) => void;
}

const serviceTypeTranslations: { [key: string]: string } = {
  'oil_change': 'Troca de Óleo',
  'brake_replacement': 'Troca de Freios',
  'tire_rotation': 'Rodízio de Pneus',
  'other': 'Outro',
};

const MaintenanceTable: React.FC<MaintenanceTableProps> = ({ maintenances, onDelete, onEdit }) => {
  const [maintenanceToDelete, setMaintenanceToDelete] = useState<number | null>(null);
  const [editingMaintenance, setEditingMaintenance] = useState<Maintenance | null>(null);

  const handleDelete = (id: number) => {
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
  };

  const handleCancelEdit = () => {
    setEditingMaintenance(null);
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[120px]">Data</TableHead>
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
              <TableCell colSpan={5}>
                <MaintenanceEditForm
                  maintenance={editingMaintenance}
                  onSave={handleSaveEdit}
                  onCancel={handleCancelEdit}
                />
              </TableCell>
            ) : (
              <>
                <TableCell className="w-[120px]">
                  <CalendarIcon className="inline mr-2" size={16} />
                  {new Date(maintenance.date).toLocaleDateString()}
                </TableCell>
                <TableCell className="w-[180px]">
                  <Wrench className="inline mr-2" size={16} />
                  {serviceTypeTranslations[maintenance.serviceType] || maintenance.serviceType}
                </TableCell>
                <TableCell className={`w-[100px] ${maintenance.cost > 100 ? "text-red-500" : "text-green-500"}`}>
                  <DollarSign className="inline mr-2" size={16} />
                  R$ {maintenance.cost.toFixed(2)}
                </TableCell>
                <TableCell className="w-[200px]">{maintenance.observations}</TableCell>
                <TableCell className="w-[100px]">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(maintenance.id)}
                        className="mr-2"
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
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(maintenance)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
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