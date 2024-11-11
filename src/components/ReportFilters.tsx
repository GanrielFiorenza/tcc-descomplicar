import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DateRangeFilter } from './filters/DateRangeFilter';
import { startOfDay } from "date-fns";
import { useQuery } from '@tanstack/react-query';
import { getUserVehicles } from '@/services/vehicleService';

interface ReportFiltersProps {
  selectedVehicle: string | null;
  onSelectVehicle: (vehicleId: string | null) => void;
  onDateFilterChange: (startDate: Date | null, endDate: Date | null) => void;
}

export const ReportFilters: React.FC<ReportFiltersProps> = ({
  selectedVehicle,
  onSelectVehicle,
  onDateFilterChange,
}) => {
  const [dateFilter, setDateFilter] = useState('all');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const { data: vehicles = [], isLoading } = useQuery({
    queryKey: ['vehicles'],
    queryFn: getUserVehicles
  });

  const handleDateFilterChange = (value: string) => {
    setDateFilter(value);
    let newStartDate: Date | null = null;
    let newEndDate: Date | null = null;

    const today = new Date();
    
    switch (value) {
      case '1year':
        newStartDate = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());
        newEndDate = today;
        break;
      case '6months':
        newStartDate = new Date(today.getFullYear(), today.getMonth() - 6, today.getDate());
        newEndDate = today;
        break;
      case '1month':
        newStartDate = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
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

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Filtros</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Select onValueChange={(value) => onSelectVehicle(value === 'all' ? null : value)}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o veículo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os veículos</SelectItem>
              {vehicles.map(vehicle => (
                <SelectItem key={vehicle.id} value={vehicle.id}>{`${vehicle.brand} ${vehicle.model}`}</SelectItem>
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