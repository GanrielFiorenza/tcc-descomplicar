import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from '@tanstack/react-query';
import { getUserVehicles } from '@/services/vehicleService';
import { DateRangeFilter } from './DateRangeFilter';

interface ReportFiltersProps {
  selectedVehicle: string;
  onVehicleChange: (value: string) => void;
  dateFilter: string;
  startDate: Date | null;
  endDate: Date | null;
  onDateFilterChange: (value: string) => void;
  onStartDateSelect: (date: Date | undefined) => void;
  onEndDateSelect: (date: Date | undefined) => void;
}

export const ReportFilters: React.FC<ReportFiltersProps> = ({
  selectedVehicle,
  onVehicleChange,
  dateFilter,
  startDate,
  endDate,
  onDateFilterChange,
  onStartDateSelect,
  onEndDateSelect,
}) => {
  const { data: vehicles, isLoading } = useQuery({
    queryKey: ['vehicles'],
    queryFn: getUserVehicles,
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="w-full md:w-[200px]">
          <Select value={selectedVehicle} onValueChange={onVehicleChange}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione um veículo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os veículos</SelectItem>
              {vehicles?.map((vehicle) => (
                <SelectItem key={vehicle.id} value={vehicle.id}>
                  {vehicle.plate} - {vehicle.model}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <DateRangeFilter
          dateFilter={dateFilter}
          startDate={startDate}
          endDate={endDate}
          onDateFilterChange={onDateFilterChange}
          onStartDateSelect={onStartDateSelect}
          onEndDateSelect={onEndDateSelect}
        />
      </div>
    </div>
  );
};