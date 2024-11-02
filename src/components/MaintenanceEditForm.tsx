import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Check, X, CalendarIcon } from 'lucide-react';
import { format } from "date-fns";
import { Maintenance } from '../types/maintenance';
import { useToast } from "@/hooks/use-toast";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

const serviceTypeOptions = [
  { value: 'oil_change', label: 'Troca de Óleo' },
  { value: 'brake_replacement', label: 'Troca de Freios' },
  { value: 'tire_rotation', label: 'Rodízio de Pneus' },
  { value: 'other', label: 'Outro' },
];

interface MaintenanceEditFormProps {
  maintenance: Maintenance;
  onSave: (maintenance: Maintenance) => void;
  onCancel: () => void;
  vehicles: { id: string; name: string }[];
}

export const MaintenanceEditForm: React.FC<MaintenanceEditFormProps> = ({ 
  maintenance, 
  onSave, 
  onCancel, 
  vehicles 
}) => {
  const [editedMaintenance, setEditedMaintenance] = useState<Maintenance>(maintenance);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const { toast } = useToast();

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!editedMaintenance.date) newErrors.date = "Data é obrigatória";
    if (!editedMaintenance.serviceType) newErrors.serviceType = "Tipo de serviço é obrigatório";
    if (!editedMaintenance.cost || editedMaintenance.cost <= 0) newErrors.cost = "Custo deve ser maior que zero";
    if (!editedMaintenance.observations.trim()) newErrors.observations = "Observações são obrigatórias";
    if (!editedMaintenance.vehicleId) newErrors.vehicleId = "Veículo é obrigatório";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave(editedMaintenance);
      toast({
        title: "Manutenção atualizada",
        description: "Os dados foram atualizados com sucesso.",
        variant: "default",
      });
    } else {
      toast({
        title: "Erro de validação",
        description: "Por favor, corrija os campos destacados.",
        variant: "destructive",
      });
    }
  };

  return (
    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
      <td className="p-4 align-middle" style={{ width: '15%' }}>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className={`w-full justify-start text-left font-normal ${errors.date ? "border-red-500" : ""}`}>
              <CalendarIcon className="mr-1 h-4 w-4" />
              {editedMaintenance.date ? format(new Date(editedMaintenance.date), 'dd/MM/yy') : "Selecione"}
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
      </td>

      <td className="p-4 align-middle" style={{ width: '20%' }}>
        <Select 
          value={editedMaintenance.vehicleId}
          onValueChange={(value) => setEditedMaintenance({...editedMaintenance, vehicleId: value})}
        >
          <SelectTrigger className={`w-full ${errors.vehicleId ? "border-red-500" : ""}`}>
            <SelectValue placeholder="Veículo" />
          </SelectTrigger>
          <SelectContent>
            {vehicles.map((vehicle) => (
              <SelectItem key={vehicle.id} value={vehicle.id}>{vehicle.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </td>

      <td className="p-4 align-middle" style={{ width: '20%' }}>
        <Select 
          value={editedMaintenance.serviceType}
          onValueChange={(value) => setEditedMaintenance({...editedMaintenance, serviceType: value})}
        >
          <SelectTrigger className={`w-full ${errors.serviceType ? "border-red-500" : ""}`}>
            <SelectValue placeholder="Tipo de Serviço" />
          </SelectTrigger>
          <SelectContent>
            {serviceTypeOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </td>

      <td className="p-4 align-middle" style={{ width: '15%' }}>
        <Input
          type="number"
          value={editedMaintenance.cost}
          onChange={(e) => setEditedMaintenance({...editedMaintenance, cost: parseFloat(e.target.value)})}
          placeholder="Custo"
          className={`w-full ${errors.cost ? "border-red-500" : ""}`}
        />
      </td>

      <td className="p-4 align-middle" style={{ width: '20%' }}>
        <Textarea
          value={editedMaintenance.observations}
          onChange={(e) => setEditedMaintenance({...editedMaintenance, observations: e.target.value})}
          placeholder="Observações"
          className={`w-full ${errors.observations ? "border-red-500" : ""}`}
        />
      </td>

      <td className="p-4 align-middle w-[100px]">
        <div className="flex justify-end space-x-2">
          <Button variant="outline" size="sm" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
          <Button size="sm" onClick={handleSave} className="bg-green-500 hover:bg-green-600">
            <Check className="h-4 w-4" />
          </Button>
        </div>
      </td>

    </tr>
  );
};
