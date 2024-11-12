import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ReportTableProps {
  reportType: string;
  reportData: any[];
}

export const ReportTable: React.FC<ReportTableProps> = ({ reportType, reportData }) => {
  // Sort data by date in descending order (newest first)
  const sortedData = [...reportData].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateB.getTime() - dateA.getTime();
  });

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Data</TableHead>
          <TableHead>Tipo de Gasto</TableHead>
          <TableHead>Valor</TableHead>
          <TableHead>Descrição</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedData.map((item, index) => (
          <TableRow key={index}>
            <TableCell>
              {format(new Date(item.date), 'dd/MM/yyyy', { locale: ptBR })}
            </TableCell>
            <TableCell>{item.type}</TableCell>
            <TableCell>R$ {item.amount?.toFixed(2) || '0.00'}</TableCell>
            <TableCell>{item.description}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};