import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell } from 'lucide-react';
import { useQuery } from "@tanstack/react-query";
import { useMonthlyExpenses } from '@/hooks/useMonthlyExpenses';
import { ExpenseDonutChart } from '../components/ExpenseDonutChart';
import { useExpenseLimit } from '@/hooks/useExpenseLimit';
import { getUserMaintenances } from '../services/maintenanceService';
import { format } from 'date-fns';
import { serviceTypeTranslations } from '../utils/translations';
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar } from 'recharts';
import NotificationsCard from '../components/NotificationsCard';

const Dashboard = () => {
  const { data: monthlyExpensesData, isLoading: isLoadingExpenses } = useMonthlyExpenses();
  const { expenseLimit, updateExpenseLimit, isLoading: isLoadingLimit } = useExpenseLimit();

  const { data: maintenances, isLoading: isLoadingMaintenances } = useQuery({
    queryKey: ['recent-maintenances'],
    queryFn: async () => {
      const allMaintenances = await getUserMaintenances();
      return allMaintenances
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5);
    },
  });

  if (isLoadingExpenses || isLoadingLimit || isLoadingMaintenances) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Gastos Mensais</CardTitle>
            <CardDescription>Visão geral dos gastos nos últimos 6 meses</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyExpensesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="gastos" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <ExpenseDonutChart
          expenseLimit={expenseLimit}
          onExpenseLimitChange={updateExpenseLimit}
        />

        <NotificationsCard />

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold flex items-center">
              <Bell className="mr-2 h-6 w-6 text-green-500" />
              Últimas Manutenções
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {maintenances && maintenances.map((maintenance, index) => (
                <li key={index} className="flex items-center">
                  <Bell className="mr-2 h-4 w-4 text-green-500" />
                  <span>
                    {format(new Date(maintenance.date), 'dd/MM/yyyy')} - {' '}
                    {serviceTypeTranslations[maintenance.serviceType] || maintenance.serviceType}: {' '}
                    {maintenance.observations}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;