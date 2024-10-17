import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { CalendarIcon, DollarSign, Wrench, Trash2 } from 'lucide-react';
import { Maintenance } from '../types/maintenance';

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
  return (
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
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onDelete(maintenance.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default MaintenanceTable;