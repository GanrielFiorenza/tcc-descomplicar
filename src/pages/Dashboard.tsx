import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, CirclePlus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import MaintenanceList from '../components/MaintenanceList';
import { useMonthlyExpenses } from '@/hooks/useMonthlyExpenses';
import { ExpenseDonutChart } from '../components/ExpenseDonutChart';
import { useExpenseLimit } from '@/hooks/useExpenseLimit';
import { useQuery } from '@tanstack/react-query';
import { getUserMaintenances } from '../services/maintenanceService';
import { format } from 'date-fns';
import { serviceTypeTranslations } from '../utils/translations';
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar } from 'recharts';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { addNotification, getOpenNotifications, closeNotification } from "@/services/notificationService";
import { toast } from "sonner";

const Dashboard = () => {
  const [newNotificationDate, setNewNotificationDate] = useState('');
  const [newNotificationDescription, setNewNotificationDescription] = useState('');
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const queryClient = useQueryClient();
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

  const { data: notifications, isLoading: isLoadingNotifications } = useQuery({
    queryKey: ['notifications'],
    queryFn: getOpenNotifications
  });

  const addNotificationMutation = useMutation({
    mutationFn: () => addNotification(newNotificationDescription, newNotificationDate),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      setIsPopoverOpen(false);
      setNewNotificationDate('');
      setNewNotificationDescription('');
      toast.success("Notificação adicionada com sucesso!");
    },
    onError: (error) => {
      toast.error("Erro ao adicionar notificação: " + error.message);
    }
  });

  const closeNotificationMutation = useMutation({
    mutationFn: closeNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast.success("Notificação concluída com sucesso!");
    },
    onError: (error) => {
      toast.error("Erro ao concluir notificação: " + error.message);
    }
  });

  const handleAddNotification = () => {
    if (!newNotificationDate || !newNotificationDescription) {
      toast.error("Por favor, preencha todos os campos");
      return;
    }
    addNotificationMutation.mutate();
  };

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

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <Bell className="mr-2 h-6 w-6 text-yellow-500" />
                Notificações
              </div>
              <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="icon">
                    <CirclePlus className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <h4 className="font-medium leading-none">Adicionar Notificação</h4>
                      <p className="text-sm text-muted-foreground">
                        Agende uma nova notificação
                      </p>
                    </div>
                    <div className="grid gap-2">
                      <div className="grid grid-cols-3 items-center gap-4">
                        <Label htmlFor="date">Data</Label>
                        <Input
                          id="date"
                          type="date"
                          className="col-span-2"
                          value={newNotificationDate}
                          onChange={(e) => setNewNotificationDate(e.target.value)}
                        />
                      </div>
                      <div className="grid grid-cols-3 items-center gap-4">
                        <Label htmlFor="description">Descrição</Label>
                        <Input
                          id="description"
                          className="col-span-2"
                          value={newNotificationDescription}
                          onChange={(e) => setNewNotificationDescription(e.target.value)}
                        />
                      </div>
                      <Button onClick={handleAddNotification}>Adicionar</Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingNotifications ? (
              <div>Carregando...</div>
            ) : (
              <MaintenanceList
                maintenanceList={notifications?.map(notification => ({
                  id: notification.id!,
                  date: format(new Date(notification.date), 'dd/MM/yyyy'),
                  description: notification.description
                })) || []}
                checkedMaintenances={[]}
                onCheck={() => {}}
                onConfirm={(id) => closeNotificationMutation.mutate(id)}
              />
            )}
          </CardContent>
        </Card>

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
