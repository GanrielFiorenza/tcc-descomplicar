import React, { useState } from 'react';
import { Bell, SquareCheck } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

interface MaintenanceItem {
  id: string;
  date: string;
  description: string;
}

interface MaintenanceListProps {
  maintenanceList: MaintenanceItem[];
  checkedMaintenances: string[];
  onCheck: (id: string) => void;
  onConfirm: (id: string) => void;
}

const MaintenanceList: React.FC<MaintenanceListProps> = ({ maintenanceList, checkedMaintenances, onCheck, onConfirm }) => {
  const [tempChecked, setTempChecked] = useState<string | null>(null);

  const handleCheck = (id: string) => {
    setTempChecked(id);
    onCheck(id);
  };

  const handleCancel = () => {
    if (tempChecked !== null) {
      onCheck(tempChecked);
      setTempChecked(null);
    }
  };

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
                onClick={() => handleCheck(maintenance.id)}
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
                <AlertDialogCancel onClick={handleCancel}>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={() => {
                  onConfirm(maintenance.id);
                  setTempChecked(null);
                }} className="bg-blue-500 text-white">
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