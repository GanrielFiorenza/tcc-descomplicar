import React from 'react';
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon } from "lucide-react";
import { format, startOfDay } from "date-fns";
import { cn } from "@/lib/utils";

interface DateRangeFilterProps {
  dateFilter: string;
  startDate: Date | null;
  endDate: Date | null;
  onDateFilterChange: (value: string) => void;
  onStartDateSelect: (date: Date | undefined) => void;
  onEndDateSelect: (date: Date | undefined) => void;
}

const dateFilterOptions = [
  { value: 'all', label: 'Todos os registros' },
  { value: '1year', label: 'Último ano' },
  { value: '6months', label: 'Últimos 6 meses' },
  { value: '1month', label: 'Último mês' },
  { value: 'custom', label: 'Personalizado' },
];

export const DateRangeFilter: React.FC<DateRangeFilterProps> = ({
  dateFilter,
  startDate,
  endDate,
  onDateFilterChange,
  onStartDateSelect,
  onEndDateSelect,
}) => {
  return (
    <div className="flex gap-2">
      <Select value={dateFilter || 'all'} onValueChange={onDateFilterChange}>
        <SelectTrigger>
          <SelectValue placeholder="Período">
            {dateFilterOptions.find(option => option.value === dateFilter)?.label || 'Todos os registros'}
          </SelectValue>
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
                onSelect={onStartDateSelect}
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
                onSelect={onEndDateSelect}
                disabled={(date) => date < (startDate || new Date())}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      )}
    </div>
  );
};