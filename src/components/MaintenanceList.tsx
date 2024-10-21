import React from 'react';
import { Bell, SquareCheck } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

interface Maintenance {
  id: number;
  date: string;
  description: string;
}

interface MaintenanceListProps {
  maintenanceList: Maintenance[];
  checkedMaintenances: number[];
  onCheck: (id: number) => void;
  onConfirm: (id: number) => void;
}

const MaintenanceList: React.FC<MaintenanceListProps> = ({ maintenanceList, checkedMaintenances, onCheck, onConfirm }) => {
  return (
    <ul className="space-y-2">
      {maintenanceList.map((maintenance) => (
        <li key={maintenance.id} className="flex items-center justify-between">
          <div className="flex items-center">
            <Bell className="mr-2 h-4 w-4 text-blue-500" />
            <span>{maintenance.date} - {maintenance.description}</span>
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <SquareCheck
                className={`h-6 w-6 cursor-pointer transition-colors hover:text-gray-600 ${
                  checkedMaintenances.includes(maintenance.id) ? 'text-green-500' : 'text-gray-400'
                }`}
                onClick={() => onCheck(maintenance.id)}
              />
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirmar conclusão de tarefa?</AlertDialogTitle>
                <AlertDialogDescription>
                  Tem certeza que deseja marcar esta tarefa de manutenção como concluída?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={() => onConfirm(maintenance.id)} className="bg-blue-500 text-white">
                  Confirmar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </li>
      ))}
    </ul>
  );
};

export default MaintenanceList;