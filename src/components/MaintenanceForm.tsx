import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CalendarIcon, DollarSign, Wrench, ClipboardIcon, AlertCircle, Car } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format, addDays } from "date-fns";
import { cn } from "@/lib/utils";
import { Maintenance } from '../types/maintenance';
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const serviceTypeOptions = [
  { value: 'oil_change', label: 'Troca de Óleo' },
  { value: 'brake_replacement', label: 'Troca de Freios' },
  { value: 'tire_rotation', label: 'Rodízio de Pneus' },
  { value: 'other', label: 'Outro' },
];

interface MaintenanceFormProps {
  onSubmit: (maintenance: Omit<Maintenance, 'id' | 'userId'>) => void;
  onCancel: () => void;
  vehicles: { id: string; name: string }[];
}

export const MaintenanceForm: React.FC<MaintenanceFormProps> = ({ onSubmit, onCancel, vehicles }) => {
  const [newMaintenance, setNewMaintenance] = useState<Partial<Maintenance>>({
    date: '',
    serviceType: '',
    cost: 0,
    observations: '',
    vehicleId: '',
  });
  const { toast } = useToast();
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [observationsError, setObservationsError] = useState(false);

  const handleSubmit = () => {
    setObservationsError(false);

    if (!newMaintenance.date || !newMaintenance.serviceType || !newMaintenance.cost || !newMaintenance.vehicleId) {
      setAlertMessage("Por favor, preencha todos os campos obrigatórios.");
      setIsAlertOpen(true);
      return;
    }

    if (!newMaintenance.observations?.trim()) {
      setObservationsError(true);
      setAlertMessage("Por favor, adicione uma descrição para a manutenção.");
      setIsAlertOpen(true);
      return;
    }

    if (typeof newMaintenance.cost !== 'number' || newMaintenance.cost <= 0) {
      setAlertMessage("O custo deve ser um número positivo.");
      setIsAlertOpen(true);
      return;
    }

    onSubmit(newMaintenance as Omit<Maintenance, 'id' | 'userId'>);
    
    toast({
      title: "Manutenção adicionada",
      description: "A nova manutenção foi registrada com sucesso.",
      variant: "default",
    });
  };

  return (
    <>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Car className="h-4 w-4 text-purple-500" />
          <Select 
            value={newMaintenance.vehicleId} 
            onValueChange={(value) => setNewMaintenance({...newMaintenance, vehicleId: value})}
          >
            <SelectTrigger className="w-[280px]">
              <SelectValue placeholder="Selecione o veículo" />
            </SelectTrigger>
            <SelectContent>
              {vehicles.map((vehicle) => (
                <SelectItem key={vehicle.id} value={vehicle.id}>{vehicle.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <CalendarIcon className="h-4 w-4 text-blue-500" />
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[280px] justify-start text-left font-normal",
                  !newMaintenance.date && "text-muted-foreground"
                )}
              >
                {newMaintenance.date ? format(new Date(newMaintenance.date), "PPP") : <span>Selecione a data</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={newMaintenance.date ? new Date(newMaintenance.date) : undefined}
                onSelect={(date) => {
                  if (date) {
                    const adjustedDate = addDays(date, 1);
                    const formattedDate = format(adjustedDate, 'yyyy-MM-dd');
                    setNewMaintenance({...newMaintenance, date: formattedDate});
                  }
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Wrench className="h-4 w-4 text-green-500" />
          <Select onValueChange={(value) => setNewMaintenance({...newMaintenance, serviceType: value})}>
            <SelectTrigger className="w-[280px]">
              <SelectValue placeholder="Tipo de Serviço" />
            </SelectTrigger>
            <SelectContent>
              {serviceTypeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <DollarSign className="h-4 w-4 text-yellow-500" />
          <Input
            type="number"
            placeholder="Custo"
            className="w-[280px]"
            value={newMaintenance.cost}
            onChange={(e) => setNewMaintenance({...newMaintenance, cost: parseFloat(e.target.value)})}
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <ClipboardIcon className="h-4 w-4 text-purple-500" />
          <Textarea
            placeholder="Observações"
            className={cn("w-[280px]", observationsError && "border-red-500")}
            value={newMaintenance.observations}
            onChange={(e) => {
              setNewMaintenance({...newMaintenance, observations: e.target.value});
              setObservationsError(false);
            }}
          />
        </div>

        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} className="bg-green-500 hover:bg-green-600">
            <AlertCircle className="mr-2 h-4 w-4" />
            Salvar
          </Button>
        </div>
      </div>

      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Atenção</AlertDialogTitle>
            <AlertDialogDescription>{alertMessage}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setIsAlertOpen(false)}>OK</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};