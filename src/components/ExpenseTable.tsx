import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Fuel, Wrench, FileText, DollarSign, Pencil, Trash2 } from 'lucide-react';
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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ExpenseEditRow } from './ExpenseEditRow';
import { ExpenseMobileEdit } from './ExpenseMobileEdit';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ExpenseTableProps {
  expenses: any[];
  vehicles: { id: string; name: string }[];
  onEdit: (editedExpense: any) => void;
  onDelete: (expenseId: string) => void;
}

export const ExpenseTable: React.FC<ExpenseTableProps> = ({ expenses, vehicles, onEdit, onDelete }) => {
  const [editingExpense, setEditingExpense] = useState<string | null>(null);
  const [editedValues, setEditedValues] = useState<any>({});
  const [isMobileEditOpen, setIsMobileEditOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  const categories = ['Combustível', 'Peças', 'Serviços', 'Impostos', 'Outros'];

  // Sort expenses by date in descending order
  const sortedExpenses = [...expenses].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

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

  const getVehicleName = (vehicleId: string) => {
    const vehicle = vehicles.find(v => v.id === vehicleId);
    return vehicle ? vehicle.name : 'Veículo não encontrado';
  };

  const handleEditClick = (expense: any) => {
    if (isMobile) {
      setEditedValues(expense);
      setIsMobileEditOpen(true);
    } else {
      setEditingExpense(expense.id);
      setEditedValues(expense);
    }
  };

  const handleCancelEdit = () => {
    setEditingExpense(null);
    setEditedValues({});
    setIsMobileEditOpen(false);
  };

  const handleSaveEdit = () => {
    onEdit(editedValues);
    setEditingExpense(null);
    setEditedValues({});
    setIsMobileEditOpen(false);
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
              <TableHead className="w-[100px]">Data</TableHead>
              <TableHead>Veículo</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {expenses.map((expense) => (
              <TableRow key={expense.id} className="h-16">
                {editingExpense === expense.id ? (
                  <ExpenseEditRow
                    editedValues={editedValues}
                    handleInputChange={handleInputChange}
                    handleSaveEdit={handleSaveEdit}
                    handleCancelEdit={handleCancelEdit}
                    vehicles={vehicles}
                    categories={categories}
                  />
                ) : (
                  <>
                    <TableCell className="p-2 h-16">
                      {format(new Date(expense.date), 'dd/MM/yyyy', { locale: ptBR })}
                    </TableCell>
                    <TableCell className="p-2 h-16">{getVehicleName(expense.vehicleId)}</TableCell>
                    <TableCell className="p-2 h-16 flex items-center">
                      {getCategoryIcon(expense.category)}
                      <span className="ml-2">{expense.category}</span>
                    </TableCell>
                    <TableCell className={`p-2 h-16 ${parseFloat(expense.amount) > 1000 ? "text-red-500 font-bold" : ""}`}>
                      {formatAmount(expense.amount)}
                    </TableCell>
                    <TableCell className="p-2 h-16">{expense.description}</TableCell>
                    <TableCell className="p-2 h-16 text-right">
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

        <Dialog open={isMobileEditOpen} onOpenChange={setIsMobileEditOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Editar Despesa</DialogTitle>
            </DialogHeader>
            <ExpenseMobileEdit
              editedValues={editedValues}
              handleInputChange={handleInputChange}
              handleSaveEdit={handleSaveEdit}
              handleCancelEdit={handleCancelEdit}
              vehicles={vehicles}
              categories={categories}
            />
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default ExpenseTable;