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
}

export const MaintenanceEditForm: React.FC<MaintenanceEditFormProps> = ({ maintenance, onSave, onCancel }) => {
  const [editedMaintenance, setEditedMaintenance] = useState<Maintenance>(maintenance);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const { toast } = useToast();

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!editedMaintenance.date) newErrors.date = "Este campo não pode ficar vazio";
    if (!editedMaintenance.serviceType) newErrors.serviceType = "Este campo não pode ficar vazio";
    if (!editedMaintenance.cost || editedMaintenance.cost <= 0) newErrors.cost = "O custo deve ser um valor positivo";
    if (!editedMaintenance.observations.trim()) newErrors.observations = "Este campo não pode ficar vazio";
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
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="w-[120px]">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={`w-full ${errors.date ? "border-red-500" : ""}`}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {editedMaintenance.date ? format(new Date(editedMaintenance.date), 'dd/MM/yyyy') : "Selecione"}
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
      {errors.date && <AlertCircle className="text-red-500" size={16} />}

      <TooltipProvider>
        <Tooltip>
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
      {errors.serviceType && <AlertCircle className="text-red-500" size={16} />}

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Input
              type="number"
              value={editedMaintenance.cost}
              onChange={(e) => setEditedMaintenance({...editedMaintenance, cost: parseFloat(e.target.value) || 0})}
              className={`w-[100px] ${errors.cost ? "border-red-500" : ""}`}
              placeholder="Custo"
            />
          </TooltipTrigger>
          {errors.cost && <TooltipContent>{errors.cost}</TooltipContent>}
        </Tooltip>
      </TooltipProvider>
      {errors.cost && <AlertCircle className="text-red-500" size={16} />}

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Input
              value={editedMaintenance.observations}
              onChange={(e) => setEditedMaintenance({...editedMaintenance, observations: e.target.value})}
              placeholder="Observações"
              className={`w-[200px] ${errors.observations ? "border-red-500" : ""}`}
            />
          </TooltipTrigger>
          {errors.observations && <TooltipContent>{errors.observations}</TooltipContent>}
        </Tooltip>
      </TooltipProvider>
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