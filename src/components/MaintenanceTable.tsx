import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { CalendarIcon, DollarSign, Wrench, Trash2, AlertTriangle } from 'lucide-react';
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

interface MaintenanceTableProps {
  maintenances: Maintenance[];
  onDelete: (id: number) => void;
}

const serviceTypeTranslations: { [key: string]: string } = {
  'oil_change': 'Troca de Óleo',
  'brake_replacement': 'Troca de Freios',
  'tire_rotation': 'Rodízio de Pneus',
  // Adicione mais traduções conforme necessário
};

const MaintenanceTable: React.FC<MaintenanceTableProps> = ({ maintenances, onDelete }) => {
  const [maintenanceToDelete, setMaintenanceToDelete] = useState<number | null>(null);

  const handleDelete = (id: number) => {
    setMaintenanceToDelete(id);
  };

  const confirmDelete = () => {
    if (maintenanceToDelete !== null) {
      onDelete(maintenanceToDelete);
      setMaintenanceToDelete(null);
    }
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Data</TableHead>
            <TableHead>Tipo de Serviço</TableHead>
            <TableHead>Custo</TableHead>
            <TableHead>Observações</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {maintenances.map((maintenance) => (
            <TableRow key={maintenance.id}>
              <TableCell>
                <CalendarIcon className="inline mr-2" size={16} />
                {maintenance.date}
              </TableCell>
              <TableCell>
                <Wrench className="inline mr-2" size={16} />
                {serviceTypeTranslations[maintenance.serviceType] || maintenance.serviceType}
              </TableCell>
              <TableCell className={maintenance.cost > 100 ? "text-red-500" : "text-green-500"}>
                <DollarSign className="inline mr-2" size={16} />
                R$ {maintenance.cost.toFixed(2)}
              </TableCell>
              <TableCell>{maintenance.observations}</TableCell>
              <TableCell>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(maintenance.id)}
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
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};

export default MaintenanceTable;