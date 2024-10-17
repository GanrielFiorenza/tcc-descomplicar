import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CalendarIcon, DollarSign, Wrench, X, Save } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Maintenance } from '../types/maintenance';

const serviceTypeOptions = [
  { value: 'oil_change', label: 'Troca de Óleo' },
  { value: 'brake_replacement', label: 'Troca de Freios' },
  { value: 'tire_rotation', label: 'Rodízio de Pneus' },
  // Adicione mais opções conforme necessário
];

interface MaintenanceFormProps {
  onSubmit: (maintenance: Omit<Maintenance, 'id' | 'vehicleId'>) => void;
  onCancel: () => void;
}

export const MaintenanceForm: React.FC<MaintenanceFormProps> = ({ onSubmit, onCancel }) => {
  const [newMaintenance, setNewMaintenance] = useState<Partial<Maintenance>>({
    date: '',
    serviceType: '',
    cost: 0,
    observations: '',
  });

  const handleSubmit = () => {
    if (newMaintenance.date && newMaintenance.serviceType && newMaintenance.cost) {
      onSubmit(newMaintenance as Omit<Maintenance, 'id' | 'vehicleId'>);
    }
  };

  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <CalendarIcon className="h-4 w-4" />
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
              onSelect={(date) => setNewMaintenance({...newMaintenance, date: date ? format(date, 'yyyy-MM-dd') : ''})}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Wrench className="h-4 w-4" />
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
        <DollarSign className="h-4 w-4" />
        <Input
          type="number"
          placeholder="Custo"
          className="w-[280px]"
          value={newMaintenance.cost}
          onChange={(e) => setNewMaintenance({...newMaintenance, cost: parseFloat(e.target.value)})}
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Textarea
          placeholder="Observações"
          className="w-[280px]"
          value={newMaintenance.observations}
          onChange={(e) => setNewMaintenance({...newMaintenance, observations: e.target.value})}
        />
      </div>
      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={onCancel}>
          <X className="mr-2 h-4 w-4" />
          Cancelar
        </Button>
        <Button onClick={handleSubmit} className="bg-green-500 hover:bg-green-600">
          <Save className="mr-2 h-4 w-4" />
          Salvar
        </Button>
      </div>
    </div>
  );
};