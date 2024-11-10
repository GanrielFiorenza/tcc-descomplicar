import { useQuery } from "@tanstack/react-query";
import { getUserExpenses } from "@/services/expenseService";
import { getUserMaintenances } from "@/services/maintenanceService";
import { format, parse, startOfMonth, endOfMonth } from "date-fns";
import { ptBR } from "date-fns/locale";

interface MonthlyTotal {
  month: string;
  total: number;
}

export const useMonthlyTotalExpenses = () => {
  return useQuery({
    queryKey: ['monthlyTotalExpenses'],
    queryFn: async () => {
      const [expenses, maintenances] = await Promise.all([
        getUserExpenses(),
        getUserMaintenances()
      ]);

      const monthlyTotals = new Map<string, number>();

      // Process expenses
      expenses.forEach(expense => {
        const date = new Date(expense.date);
        const monthKey = format(date, 'yyyy-MM');
        const currentTotal = monthlyTotals.get(monthKey) || 0;
        monthlyTotals.set(monthKey, currentTotal + expense.amount);
      });

      // Process maintenances
      maintenances.forEach(maintenance => {
        const date = new Date(maintenance.date);
        const monthKey = format(date, 'yyyy-MM');
        const currentTotal = monthlyTotals.get(monthKey) || 0;
        monthlyTotals.set(monthKey, currentTotal + maintenance.cost);
      });

      // Convert to array and sort by date
      const sortedMonths = Array.from(monthlyTotals.entries())
        .sort((a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime())
        .map(([month, total]) => ({
          value: month,
          label: format(parse(month, 'yyyy-MM', new Date()), 'MMMM yyyy', { locale: ptBR }),
          total
        }));

      return sortedMonths;
    }
  });
};