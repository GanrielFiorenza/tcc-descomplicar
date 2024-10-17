import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { CalendarIcon, DollarSign, Wrench, Trash2, AlertTriangle, Edit, Check, X } from 'lucide-react';
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
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";

interface MaintenanceTableProps {
  maintenances: Maintenance[];
  onDelete: (id: number) => void;
  onEdit: (maintenance: Maintenance) => void;
}

const serviceTypeOptions = [
  { value: 'oil_change', label: 'Troca de Óleo' },
  { value: 'brake_replacement', label: 'Troca de Freios' },
  { value: 'tire_rotation', label: 'Rodízio de Pneus' },
  { value: 'other', label: 'Outro' },
];

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

  const handleSaveEdit = () => {
    if (editingMaintenance) {
      onEdit(editingMaintenance);
      setEditingMaintenance(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingMaintenance(null);
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
                {editingMaintenance?.id === maintenance.id ? (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {editingMaintenance.date}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={new Date(editingMaintenance.date)}
                        onSelect={(date) => setEditingMaintenance({...editingMaintenance, date: format(date as Date, 'yyyy-MM-dd')})}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                ) : (
                  <>
                    <CalendarIcon className="inline mr-2" size={16} />
                    {maintenance.date}
                  </>
                )}
              </TableCell>
              <TableCell>
                {editingMaintenance?.id === maintenance.id ? (
                  <Select 
                    value={editingMaintenance.serviceType}
                    onValueChange={(value) => setEditingMaintenance({...editingMaintenance, serviceType: value})}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Tipo de Serviço" />
                    </SelectTrigger>
                    <SelectContent>
                      {serviceTypeOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <>
                    <Wrench className="inline mr-2" size={16} />
                    {serviceTypeTranslations[maintenance.serviceType] || maintenance.serviceType}
                  </>
                )}
              </TableCell>
              <TableCell className={maintenance.cost > 100 ? "text-red-500" : "text-green-500"}>
                {editingMaintenance?.id === maintenance.id ? (
                  <Input
                    type="number"
                    value={editingMaintenance.cost}
                    onChange={(e) => setEditingMaintenance({...editingMaintenance, cost: parseFloat(e.target.value)})}
                    className="w-[100px]"
                  />
                ) : (
                  <>
                    <DollarSign className="inline mr-2" size={16} />
                    R$ {maintenance.cost.toFixed(2)}
                  </>
                )}
              </TableCell>
              <TableCell>
                {editingMaintenance?.id === maintenance.id ? (
                  <Input
                    value={editingMaintenance.observations}
                    onChange={(e) => setEditingMaintenance({...editingMaintenance, observations: e.target.value})}
                  />
                ) : (
                  maintenance.observations
                )}
              </TableCell>
              <TableCell>
                {editingMaintenance?.id === maintenance.id ? (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleSaveEdit}
                      className="mr-2 bg-green-500 text-white hover:bg-green-600"
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCancelEdit}
                      className="bg-red-500 text-white hover:bg-red-600"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </>
                ) : (
                  <>
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
                  </>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};

export default MaintenanceTable;