import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Fuel, Wrench, FileText, DollarSign, Pencil, Trash2, X, Check } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface ExpenseTableProps {
  expenses: any[];
  vehicles: { id: number; name: string }[];
  onEdit: (editedExpense: any) => void;
  onDelete: (expenseId: number) => void;
}

export const ExpenseTable: React.FC<ExpenseTableProps> = ({ expenses, vehicles, onEdit, onDelete }) => {
  const [editingExpense, setEditingExpense] = useState<number | null>(null);
  const [editedValues, setEditedValues] = useState<any>({});

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

  const formatAmount = (amount: any) => {
    if (typeof amount === 'number') {
      return `R$ ${amount.toFixed(2)}`;
    } else if (typeof amount === 'string') {
      const numAmount = parseFloat(amount);
      return isNaN(numAmount) ? 'Invalid Amount' : `R$ ${numAmount.toFixed(2)}`;
    } else {
      return 'Invalid Amount';
    }
  };

  const getVehicleName = (vehicleId: number | string) => {
    const vehicle = vehicles.find(v => v.id === Number(vehicleId));
    return vehicle ? vehicle.name : 'Veículo não encontrado';
  };

  const handleEditClick = (expense: any) => {
    setEditingExpense(expense.id);
    setEditedValues(expense);
  };

  const handleCancelEdit = () => {
    setEditingExpense(null);
    setEditedValues({});
  };

  const handleSaveEdit = () => {
    onEdit(editedValues);
    setEditingExpense(null);
    setEditedValues({});
  };

  const handleInputChange = (field: string, value: string) => {
    setEditedValues((prev: any) => ({ ...prev, [field]: value }));
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
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {expenses.map((expense) => (
              <TableRow key={expense.id}>
                {editingExpense === expense.id ? (
                  <>
                    <TableCell>
                      <Input
                        type="date"
                        value={editedValues.date}
                        onChange={(e) => handleInputChange('date', e.target.value)}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="text"
                        value={editedValues.vehicleId}
                        onChange={(e) => handleInputChange('vehicleId', e.target.value)}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="text"
                        value={editedValues.category}
                        onChange={(e) => handleInputChange('category', e.target.value)}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={editedValues.amount}
                        onChange={(e) => handleInputChange('amount', e.target.value)}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="text"
                        value={editedValues.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                      />
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" onClick={handleSaveEdit}>
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={handleCancelEdit}>
                        <X className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </>
                ) : (
                  <>
                    <TableCell>{expense.date}</TableCell>
                    <TableCell>{getVehicleName(expense.vehicleId)}</TableCell>
                    <TableCell className="flex items-center">
                      {getCategoryIcon(expense.category)}
                      <span className="ml-2">{expense.category}</span>
                    </TableCell>
                    <TableCell className={parseFloat(expense.amount) > 1000 ? "text-red-500 font-bold" : ""}>
                      {formatAmount(expense.amount)}
                    </TableCell>
                    <TableCell>{expense.description}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" onClick={() => handleEditClick(expense)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                            <AlertDialogDescription>
                              Você deseja excluir esses dados permanentemente?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => onDelete(expense.id)}
                              className="bg-red-500 text-white hover:bg-red-600"
                            >
                              Excluir
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
