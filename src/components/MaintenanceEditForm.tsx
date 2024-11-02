import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Check, X, CalendarIcon } from 'lucide-react';
import { format } from "date-fns";
import { Maintenance } from '../types/maintenance';
import { useToast } from "@/hooks/use-toast";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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
  vehicles: { id: number; name: string }[];
}

export const MaintenanceEditForm: React.FC<MaintenanceEditFormProps> = ({ maintenance, onSave, onCancel, vehicles }) => {
  const [editedMaintenance, setEditedMaintenance] = useState<Maintenance>(maintenance);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const { toast } = useToast();

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!editedMaintenance.date) newErrors.date = "Este campo não pode ficar vazio";
    if (!editedMaintenance.serviceType) newErrors.serviceType = "Este campo não pode ficar vazio";
    if (!editedMaintenance.cost || editedMaintenance.cost <= 0) newErrors.cost = "O custo deve ser um valor positivo";
    if (!editedMaintenance.observations.trim()) newErrors.observations = "Este campo não pode ficar vazio";
    if (!editedMaintenance.vehicleId) newErrors.vehicleId = "Selecione um veículo";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave(editedMaintenance);
    } else {
      toast({
        title: "Erro de validação",
        description: "Por favor, corrija os campos destacados.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <TooltipProvider>
        <Tooltip open={!!errors.vehicleId}>
          <TooltipTrigger asChild>
            <div className="w-[120px]">
              <Select 
                value={editedMaintenance.vehicleId.toString()}
                onValueChange={(value) => setEditedMaintenance({...editedMaintenance, vehicleId: parseInt(value)})}
              >
                <SelectTrigger className={`w-full ${errors.vehicleId ? "border-red-500" : ""}`}>
                  <SelectValue placeholder="Veículo" />
                </SelectTrigger>
                <SelectContent>
                  {vehicles.map((vehicle) => (
                    <SelectItem key={vehicle.id} value={vehicle.id.toString()}>{vehicle.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </TooltipTrigger>
          {errors.vehicleId && <TooltipContent>{errors.vehicleId}</TooltipContent>}
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip open={!!errors.date}>
          <TooltipTrigger asChild>
            <div className="w-[120px]">
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
            </div>
          </TooltipTrigger>
          {errors.date && <TooltipContent>{errors.date}</TooltipContent>}
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip open={!!errors.serviceType}>
          <TooltipTrigger asChild>
            <div className="w-[180px]">
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
            </div>
          </TooltipTrigger>
          {errors.serviceType && <TooltipContent>{errors.serviceType}</TooltipContent>}
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip open={!!errors.cost}>
          <TooltipTrigger asChild>
            <div className="w-[100px]">
              <Input
                type="number"
                value={editedMaintenance.cost}
                onChange={(e) => setEditedMaintenance({...editedMaintenance, cost: parseFloat(e.target.value)})}
                placeholder="Custo"
                className={`w-full ${errors.cost ? "border-red-500" : ""}`}
              />
            </div>
          </TooltipTrigger>
          {errors.cost && <TooltipContent>{errors.cost}</TooltipContent>}
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip open={!!errors.observations}>
          <TooltipTrigger asChild>
            <div className="w-[200px]">
              <Input
                type="text"
                value={editedMaintenance.observations}
                onChange={(e) => setEditedMaintenance({...editedMaintenance, observations: e.target.value})}
                placeholder="Observações"
                className={`w-full ${errors.observations ? "border-red-500" : ""}`}
              />
            </div>
          </TooltipTrigger>
          {errors.observations && <TooltipContent>{errors.observations}</TooltipContent>}
        </Tooltip>
      </TooltipProvider>

      <div className="flex space-x-2">
        <Button variant="outline" size="sm" onClick={onCancel}>
          <X className="h-4 w-4" />
        </Button>
        <Button size="sm" onClick={handleSave} className="bg-green-500 hover:bg-green-600">
          <Check className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};