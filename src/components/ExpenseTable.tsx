import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Fuel, Wrench, FileText, DollarSign } from 'lucide-react';

interface ExpenseTableProps {
  expenses: any[];
  vehicles: { id: number; name: string }[];
}

export const ExpenseTable: React.FC<ExpenseTableProps> = ({ expenses, vehicles }) => {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Combustível':
        return <Fuel className="h-4 w-4 text-yellow-500" />;
      case 'Peças':
      case 'Serviços':
        return <Wrench className="h-4 w-4 text-blue-500" />;
      case 'Impostos':
        return <FileText className="h-4 w-4 text-red-500" />;
      default:
        return <DollarSign className="h-4 w-4 text-green-500" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Despesas Registradas</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data</TableHead>
              <TableHead>Veículo</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Descrição</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {expenses.map((expense) => (
              <TableRow key={expense.id}>
                <TableCell>{expense.date}</TableCell>
                <TableCell>{vehicles.find(v => v.id === expense.vehicleId)?.name}</TableCell>
                <TableCell className="flex items-center">
                  {getCategoryIcon(expense.category)}
                  <span className="ml-2">{expense.category}</span>
                </TableCell>
                <TableCell className={expense.amount > 1000 ? "text-red-500 font-bold" : ""}>
                  R$ {expense.amount.toFixed(2)}
                </TableCell>
                <TableCell>{expense.description}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};