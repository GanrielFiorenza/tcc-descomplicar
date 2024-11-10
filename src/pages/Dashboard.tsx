import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Bell, CirclePlus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import MaintenanceList from '../components/MaintenanceList';
import { useMonthlyExpenses } from '@/hooks/useMonthlyExpenses';
import { ExpenseDonutChart } from '../components/ExpenseDonutChart';

const Dashboard = () => {
  const [newMaintenanceDate, setNewMaintenanceDate] = useState('');
  const [newMaintenanceDescription, setNewMaintenanceDescription] = useState('');
  const [maintenanceList, setMaintenanceList] = useState([
    { id: 1, date: '2024-03-15', description: 'Troca de óleo em 500 km' },
    { id: 2, date: '2024-03-30', description: 'Revisão anual em 15 dias' },
    { id: 3, date: '2024-04-15', description: 'Renovação do seguro em 1 mês' },
  ]);
  const [selectedMonth, setSelectedMonth] = useState('2024-03');
  const [expenseLimit, setExpenseLimit] = useState(5000);
  const [checkedMaintenances, setCheckedMaintenances] = useState<number[]>([]);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const { toast } = useToast();
  const { data: monthlyExpensesData, isLoading: isLoadingExpenses } = useMonthlyExpenses();

  const availableMonths = [
    { value: '2024-01', label: 'Janeiro 2024' },
    { value: '2024-02', label: 'Fevereiro 2024' },
    { value: '2024-03', label: 'Março 2024' },
  ];

  const handleAddMaintenance = () => {
    if (newMaintenanceDate && newMaintenanceDescription) {
      const newMaintenance = { 
        id: maintenanceList.length + 1, 
        date: newMaintenanceDate, 
        description: newMaintenanceDescription 
      };
      const updatedList = [...maintenanceList, newMaintenance].sort((a, b) => 
        new Date(a.date).getTime() - new Date(b.date).getTime()
      );
      setMaintenanceList(updatedList);
      setNewMaintenanceDate('');
      setNewMaintenanceDescription('');
      toast({
        title: "Manutenção agendada",
        description: `Nova manutenção agendada para ${newMaintenanceDate}`,
      });
    }
  };

  const handleCheckMaintenance = (id: number) => {
    setCheckedMaintenances(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleConfirmMaintenance = (id: number) => {
    setMaintenanceList(prev => prev.filter(item => item.id !== id));
    setCheckedMaintenances(prev => prev.filter(item => item !== id));
    toast({
      title: "Manutenção concluída",
      description: "A tarefa de manutenção foi marcada como concluída e removida da lista.",
    });
  };

  // Transform monthly expenses data to match ExpenseDonutChart's expected format
  const donutChartData = monthlyExpensesData?.map(item => ({
    type: item.name,
    amount: item.gastos
  })) || [];

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
          expenses={donutChartData}
          availableMonths={availableMonths}
          selectedMonth={selectedMonth}
          onMonthChange={setSelectedMonth}
          expenseLimit={expenseLimit}
          onExpenseLimitChange={setExpenseLimit}
        />

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-2xl font-bold flex items-center">
              <Bell className="mr-2 h-6 w-6 text-blue-500" />
              Próximas Manutenções
            </CardTitle>
            <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
              <PopoverTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <CirclePlus className="h-6 w-6 text-blue-500 hover:text-blue-600 transition-colors" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium leading-none">Agendar Manutenção</h4>
                    <p className="text-sm text-muted-foreground">
                      Defina a data e descrição da próxima manutenção.
                    </p>
                  </div>
                  <div className="grid gap-2">
                    <div className="grid grid-cols-3 items-center gap-4">
                      <Label htmlFor="date">Data</Label>
                      <Input
                        id="date"
                        type="date"
                        className="col-span-2"
                        value={newMaintenanceDate}
                        onChange={(e) => setNewMaintenanceDate(e.target.value)}
                      />
                    </div>
                    <div className="grid grid-cols-3 items-center gap-4">
                      <Label htmlFor="description">Descrição</Label>
                      <Input
                        id="description"
                        className="col-span-2"
                        value={newMaintenanceDescription}
                        onChange={(e) => setNewMaintenanceDescription(e.target.value)}
                      />
                    </div>
                  </div>
                  <Button onClick={handleAddMaintenance}>Agendar</Button>
                </div>
              </PopoverContent>
            </Popover>
          </CardHeader>
          <CardContent>
            <MaintenanceList
              maintenanceList={maintenanceList}
              checkedMaintenances={checkedMaintenances}
              onCheck={handleCheckMaintenance}
              onConfirm={handleConfirmMaintenance}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-2xl font-bold flex items-center">
              <Bell className="mr-2 h-6 w-6 text-green-500" />
              Últimas Manutenções
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {maintenanceList.map((maintenance, index) => (
                <li key={index} className="flex items-center">
                  <Bell className="mr-2 h-4 w-4 text-green-500" />
                  <span>{maintenance.date} - {maintenance.description}</span>
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