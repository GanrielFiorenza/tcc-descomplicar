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
          <TableHead>Tipo de Gasto</TableHead>
          <TableHead>Valor</TableHead>
          <TableHead>Descrição</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {reportData.map((item, index) => (
          <TableRow key={index}>
            <TableCell>{item.month}</TableCell>
            <TableCell>{item.type}</TableCell>
            <TableCell>R$ {item.amount?.toFixed(2) || '0.00'}</TableCell>
            <TableCell>{item.description}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};