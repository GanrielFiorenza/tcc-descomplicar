import { useQuery } from "@tanstack/react-query";
import { getUserExpenses } from "@/services/expenseService";
import { getUserMaintenances } from "@/services/maintenanceService";
import { startOfMonth, subMonths, format } from "date-fns";

interface MonthlyTotal {
  name: string;
  gastos: number;
}

export const useMonthlyExpenses = () => {
  return useQuery({
    queryKey: ['monthlyExpenses'],
    queryFn: async () => {
      const [expenses, maintenances] = await Promise.all([
        getUserExpenses(),
        getUserMaintenances()
      ]);

      // Get the current date and calculate 6 months ago
      const today = new Date();
      const sixMonthsAgo = subMonths(today, 5); // 5 because we want current month + 5 previous

      // Initialize monthly totals for the last 6 months
      const monthlyTotals: { [key: string]: number } = {};
      
      // Initialize all months with zero
      for (let i = 0; i < 6; i++) {
        const monthDate = subMonths(today, i);
        const monthKey = format(monthDate, 'MMM');
        monthlyTotals[monthKey] = 0;
      }

      // Add expense amounts
      expenses.forEach(expense => {
        const expenseDate = new Date(expense.date);
        if (expenseDate >= startOfMonth(sixMonthsAgo)) {
          const monthKey = format(expenseDate, 'MMM');
          monthlyTotals[monthKey] += expense.amount;
        }
      });

      // Add maintenance costs
      maintenances.forEach(maintenance => {
        const maintenanceDate = new Date(maintenance.date);
        if (maintenanceDate >= startOfMonth(sixMonthsAgo)) {
          const monthKey = format(maintenanceDate, 'MMM');
          monthlyTotals[monthKey] += maintenance.cost;
        }
      });

      // Convert to array format expected by the chart
      return Object.entries(monthlyTotals)
        .map(([name, gastos]) => ({
          name,
          gastos: Number(gastos.toFixed(2))
        }))
        .reverse();
    }
  });
};