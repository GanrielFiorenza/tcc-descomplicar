import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { subMonths, subYears, startOfDay } from "date-fns";
import { SearchInput } from './filters/SearchInput';
import { DateRangeFilter } from './filters/DateRangeFilter';

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
        newStartDate = startDate;
        newEndDate = endDate;
        break;
      default:
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
        <SearchInput searchTerm={searchTerm} onSearchChange={onSearchChange} />
        
        <div className="grid grid-cols-3 gap-4">
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

          <DateRangeFilter
            dateFilter={dateFilter}
            startDate={startDate}
            endDate={endDate}
            onDateFilterChange={handleDateFilterChange}
            onStartDateSelect={handleStartDateSelect}
            onEndDateSelect={handleEndDateSelect}
          />
        </div>
      </CardContent>
    </Card>
  );
};