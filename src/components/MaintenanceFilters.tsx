import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format, subMonths, subYears, startOfDay } from "date-fns";
import { cn } from "@/lib/utils";

interface MaintenanceFiltersProps {
  vehicles: { id: string; name: string }[];
  selectedVehicle: string | null;
  onSelectVehicle: (vehicleId: string | null) => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filterType: string;
  onFilterTypeChange: (value: string) => void;
  onDateFilterChange: (startDate: Date | null, endDate: Date | null) => void;
}

const serviceTypeOptions = [
  { value: 'all', label: 'Selecione o tipo' },
  { value: 'oil_change', label: 'Troca de Óleo' },
  { value: 'brake_replacement', label: 'Troca de Freios' },
  { value: 'tire_rotation', label: 'Rodízio de Pneus' },
  { value: 'other', label: 'Outro' },
];

const dateFilterOptions = [
  { value: 'all', label: 'Todos os registros' },
  { value: '1year', label: 'Último ano' },
  { value: '6months', label: 'Últimos 6 meses' },
  { value: '1month', label: 'Último mês' },
  { value: 'custom', label: 'Personalizado' },
];

export const MaintenanceFilters: React.FC<MaintenanceFiltersProps> = ({
  vehicles,
  selectedVehicle,
  onSelectVehicle,
  searchTerm,
  onSearchChange,
  filterType,
  onFilterTypeChange,
  onDateFilterChange,
}) => {
  const [dateFilter, setDateFilter] = useState('all');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const handleDateFilterChange = (value: string) => {
    setDateFilter(value);
    let newStartDate: Date | null = null;
    let newEndDate: Date | null = null;

    const today = new Date();
    
    switch (value) {
      case '1year':
        newStartDate = subYears(today, 1);
        newEndDate = today;
        break;
      case '6months':
        newStartDate = subMonths(today, 6);
        newEndDate = today;
        break;
      case '1month':
        newStartDate = subMonths(today, 1);
        newEndDate = today;
        break;
      case 'custom':
        // Keep current custom dates if they exist
        newStartDate = startDate;
        newEndDate = endDate;
        break;
      default:
        // 'all' case - reset dates
        newStartDate = null;
        newEndDate = null;
    }

    setStartDate(newStartDate);
    setEndDate(newEndDate);
    onDateFilterChange(newStartDate, newEndDate);
  };

  const handleStartDateSelect = (date: Date | undefined) => {
    if (date) {
      const newStartDate = startOfDay(date);
      setStartDate(newStartDate);
      if (endDate && endDate < newStartDate) {
        setEndDate(null);
      }
      onDateFilterChange(newStartDate, endDate);
    }
  };

  const handleEndDateSelect = (date: Date | undefined) => {
    if (date) {
      const newEndDate = startOfDay(date);
      setEndDate(newEndDate);
      onDateFilterChange(startDate, newEndDate);
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Filtros</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar pelas observações"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select onValueChange={(value) => onSelectVehicle(value === 'all' ? null : value)}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o veículo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os veículos</SelectItem>
              {vehicles.map(vehicle => (
                <SelectItem key={vehicle.id} value={vehicle.id}>{vehicle.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select onValueChange={onFilterTypeChange} value={filterType}>
            <SelectTrigger>
              <SelectValue placeholder="Tipo de Serviço" />
            </SelectTrigger>
            <SelectContent>
              {serviceTypeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={dateFilter} onValueChange={handleDateFilterChange}>
            <SelectTrigger>
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              {dateFilterOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {dateFilter === 'custom' && (
            <div className="flex gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "justify-start text-left font-normal",
                      !startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "dd/MM/yyyy") : <span>Data inicial</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={handleStartDateSelect}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "justify-start text-left font-normal",
                      !endDate && "text-muted-foreground"
                    )}
                    disabled={!startDate}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "dd/MM/yyyy") : <span>Data final</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={handleEndDateSelect}
                    disabled={(date) => date < (startDate || new Date())}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
