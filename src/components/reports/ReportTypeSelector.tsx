import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ReportTypeSelectorProps {
  reportType: string;
  onReportTypeChange: (value: string) => void;
}

export const ReportTypeSelector: React.FC<ReportTypeSelectorProps> = ({
  reportType,
  onReportTypeChange
}) => {
  return (
    <Select value={reportType} onValueChange={onReportTypeChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Tipo de Relatório" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">Todos os Gastos</SelectItem>
        <SelectItem value="maintenance">Gastos com Manutenção</SelectItem>
        <SelectItem value="fuel">Gastos com Combustível</SelectItem>
        <SelectItem value="taxes">Gastos com Impostos</SelectItem>
        <SelectItem value="others">Outros Gastos</SelectItem>
      </SelectContent>
    </Select>
  );
};