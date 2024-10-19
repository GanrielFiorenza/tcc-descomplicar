import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface ReportTableProps {
  reportType: string;
  reportData: any[];
}

export const ReportTable: React.FC<ReportTableProps> = ({ reportType, reportData }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Mês</TableHead>
          <TableHead>Valor</TableHead>
          <TableHead>Descrição</TableHead>
          <TableHead>Tipo de Gasto</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {reportData.map((item, index) => (
          <TableRow key={index}>
            <TableCell>{item.month}</TableCell>
            <TableCell>
              {reportType === 'general'
                ? `R$ ${((item.maintenance || 0) + (item.fuel || 0) + (item.taxes || 0)).toFixed(2)}`
                : `R$ ${(item.amount || 0).toFixed(2)}`}
            </TableCell>
            <TableCell>{item.description}</TableCell>
            <TableCell>{item.type}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};