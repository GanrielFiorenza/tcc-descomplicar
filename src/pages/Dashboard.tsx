import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Bell, CirclePlus, DollarSign } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import MaintenanceList from '../components/MaintenanceList';
import MonthlyExpenses from '../components/MonthlyExpenses';

const data = [
  { name: 'Jan', gastos: 4000 },
  { name: 'Fev', gastos: 3000 },
  { name: 'Mar', gastos: 2000 },
  { name: 'Abr', gastos: 2780 },
  { name: 'Mai', gastos: 1890 },
  { name: 'Jun', gastos: 2390 },
];

const AnimatedBellIcon = ({ className }: { className?: string }) => {
  const [isRinging, setIsRinging] = useState(false);

  useEffect(() => {
    setIsRinging(true);
    const timer = setTimeout(() => setIsRinging(false), 1000); // Reduced from 2000ms to 1000ms
    return () => clearTimeout(timer);
  }, []);

  return (
    <Bell
      className={`${className} ${
        isRinging ? 'animate-[wiggle_0.5s_ease-in-out_infinite] scale-110 text-yellow-400' : ''
      } transition-all duration-300`}
    />
  );
};

const Dashboard = () => {
  const [newMaintenanceDate, setNewMaintenanceDate] = useState('');
  const [newMaintenanceDescription, setNewMaintenanceDescription] = useState('');
  const [maintenanceList, setMaintenanceList] = useState([
    { id: 1, date: '2024-03-15', description: 'Troca de óleo em 500 km' },
    { id: 2, date: '2024-03-30', description: 'Revisão anual em 15 dias' },
    { id: 3, date: '2024-04-15', description: 'Renovação do seguro em 1 mês' },
  ]);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [checkedMaintenances, setCheckedMaintenances] = useState<number[]>([]);
  const { toast } = useToast();

  const handleAddMaintenance = () => {
    if (newMaintenanceDate && newMaintenanceDescription) {
      const newMaintenance = { 
        id: maintenanceList.length + 1, 
        date: newMaintenanceDate, 
        description: newMaintenanceDescription 
      };
      const updatedList = [...maintenanceList, newMaintenance].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      setMaintenanceList(updatedList);
      setNewMaintenanceDate('');
      setNewMaintenanceDescription('');
      setIsPopoverOpen(false);
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

  const lastMaintenanceList = [
    { date: '2024-02-15', description: 'Troca de óleo' },
    { date: '2024-01-30', description: 'Alinhamento e balanceamento' },
    { date: '2023-12-20', description: 'Troca de filtro de ar' },
    { date: '2023-11-10', description: 'Revisão dos freios' },
    { date: '2023-10-05', description: 'Troca de pneus' },
  ];

  // Mock data for MonthlyExpenses
  const totalExpenses = 2150.75;
  const estimatedExpenses = 3000;

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
              <BarChart data={data}>
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

        <MonthlyExpenses totalExpenses={totalExpenses} estimatedExpenses={estimatedExpenses} />

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-2xl font-bold flex items-center">
              <AnimatedBellIcon className="mr-2 h-6 w-6 text-blue-500" />
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
              <AnimatedBellIcon className="mr-2 h-6 w-6 text-green-500" />
              Últimas Manutenções
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {lastMaintenanceList.map((maintenance, index) => (
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
