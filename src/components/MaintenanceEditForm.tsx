import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Check, X, CalendarIcon, AlertCircle } from 'lucide-react';
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
  const [editedMaintenance, setEditedMaintenance] = useState<Maintenance>(maintenance);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const { toast } = useToast();

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!editedMaintenance.date) newErrors.date = "Data é obrigatória";
    if (!editedMaintenance.serviceType) newErrors.serviceType = "Tipo de serviço é obrigatório";
    if (!editedMaintenance.cost || editedMaintenance.cost <= 0) newErrors.cost = "Custo deve ser um valor positivo";
    if (!editedMaintenance.observations.trim()) newErrors.observations = "Observações são obrigatórias";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave(editedMaintenance);
    } else {
      const errorMessages = Object.values(errors).join(', ');
      toast({
        title: "Erro de validação",
        description: `Por favor, corrija os seguintes erros: ${errorMessages}`,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className={errors.date ? "border-red-500" : ""}>
            <CalendarIcon className="mr-2 h-4 w-4" />
            {editedMaintenance.date || "Selecione a data"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={editedMaintenance.date ? new Date(editedMaintenance.date) : undefined}
            onSelect={(date) => setEditedMaintenance({...editedMaintenance, date: date ? format(date, 'yyyy-MM-dd') : ''})}
            initialFocus
          />
        </PopoverContent>
      </Popover>
      {errors.date && <AlertCircle className="text-red-500" size={16} />}

      <Select 
        value={editedMaintenance.serviceType}
        onValueChange={(value) => setEditedMaintenance({...editedMaintenance, serviceType: value})}
      >
        <SelectTrigger className={`w-[180px] ${errors.serviceType ? "border-red-500" : ""}`}>
          <SelectValue placeholder="Tipo de Serviço" />
        </SelectTrigger>
        <SelectContent>
          {serviceTypeOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      {errors.serviceType && <AlertCircle className="text-red-500" size={16} />}

      <Input
        type="number"
        value={editedMaintenance.cost}
        onChange={(e) => setEditedMaintenance({...editedMaintenance, cost: parseFloat(e.target.value) || 0})}
        className={`w-[100px] ${errors.cost ? "border-red-500" : ""}`}
        placeholder="Custo"
      />
      {errors.cost && <AlertCircle className="text-red-500" size={16} />}

      <Input
        value={editedMaintenance.observations}
        onChange={(e) => setEditedMaintenance({...editedMaintenance, observations: e.target.value})}
        placeholder="Observações"
        className={`w-[200px] ${errors.observations ? "border-red-500" : ""}`}
      />
      {errors.observations && <AlertCircle className="text-red-500" size={16} />}

      <Button
        variant="outline"
        size="sm"
        onClick={handleSave}
        className="bg-green-500 text-white hover:bg-green-600"
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
    </div>
  );
};