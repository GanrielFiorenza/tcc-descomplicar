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
        {reportData.flatMap((item, index) => {
          if (reportType === 'general') {
            return [
              { month: item.month, type: 'Manutenção', amount: item.maintenance, description: item.description },
              { month: item.month, type: 'Combustível', amount: item.fuel, description: item.description },
              { month: item.month, type: 'Impostos', amount: item.taxes, description: item.description }
            ].map((expense, subIndex) => (
              <TableRow key={`${index}-${subIndex}`}>
                <TableCell>{expense.month}</TableCell>
                <TableCell>{expense.type}</TableCell>
                <TableCell>R$ {expense.amount?.toFixed(2) || '0.00'}</TableCell>
                <TableCell>{expense.description}</TableCell>
              </TableRow>
            ));
          } else {
            return (
              <TableRow key={index}>
                <TableCell>{item.month}</TableCell>
                <TableCell>{item.type}</TableCell>
                <TableCell>R$ {item.amount?.toFixed(2) || '0.00'}</TableCell>
                <TableCell>{item.description}</TableCell>
              </TableRow>
            );
          }
        })}
      </TableBody>
    </Table>
  );
};