import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Check, X, CalendarIcon } from 'lucide-react';
import { format } from "date-fns";
import { Maintenance } from '../types/maintenance';
import { useToast } from "@/hooks/use-toast";

interface MaintenanceEditFormProps {
  maintenance: Maintenance;
  onSave: (maintenance: Maintenance) => void;
  onCancel: () => void;
}

const serviceTypeOptions = [
  { value: 'oil_change', label: 'Troca de Óleo' },
  { value: 'brake_replacement', label: 'Troca de Freios' },
  { value: 'tire_rotation', label: 'Rodízio de Pneus' },
  { value: 'other', label: 'Outro' },
];

export const MaintenanceEditForm: React.FC<MaintenanceEditFormProps> = ({ maintenance, onSave, onCancel }) => {
  const [editedMaintenance, setEditedMaintenance] = React.useState<Maintenance>(maintenance);
  const { toast } = useToast();

  const handleSave = () => {
    if (!editedMaintenance.date || !editedMaintenance.serviceType || !editedMaintenance.cost) {
      toast({
        title: "Erro de validação",
        description: "Todos os campos são obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    if (editedMaintenance.cost <= 0) {
      toast({
        title: "Erro de validação",
        description: "O custo deve ser um valor positivo.",
        variant: "destructive",
      });
      return;
    }

    onSave(editedMaintenance);
  };

  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">
            <CalendarIcon className="mr-2 h-4 w-4" />
            {editedMaintenance.date}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={new Date(editedMaintenance.date)}
            onSelect={(date) => setEditedMaintenance({...editedMaintenance, date: format(date as Date, 'yyyy-MM-dd')})}
            initialFocus
          />
        </PopoverContent>
      </Popover>
      <Select 
        value={editedMaintenance.serviceType}
        onValueChange={(value) => setEditedMaintenance({...editedMaintenance, serviceType: value})}
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
      <Input
        type="number"
        value={editedMaintenance.cost}
        onChange={(e) => setEditedMaintenance({...editedMaintenance, cost: parseFloat(e.target.value)})}
        className="w-[100px]"
      />
      <Input
        value={editedMaintenance.observations}
        onChange={(e) => setEditedMaintenance({...editedMaintenance, observations: e.target.value})}
      />
      <Button
        variant="outline"
        size="sm"
        onClick={handleSave}
        className="mr-2 bg-green-500 text-white hover:bg-green-600"
      >
        <Check className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={onCancel}
        className="bg-red-500 text-white hover:bg-red-600"
      >
        <X className="h-4 w-4" />
      </Button>
    </>
  );
};