import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Bell, CirclePlus, SquareCheck } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const data = [
  { name: 'Jan', gastos: 4000 },
  { name: 'Fev', gastos: 3000 },
  { name: 'Mar', gastos: 2000 },
  { name: 'Abr', gastos: 2780 },
  { name: 'Mai', gastos: 1890 },
  { name: 'Jun', gastos: 2390 },
];

const Dashboard = () => {
  const [newMaintenanceDate, setNewMaintenanceDate] = useState('');
  const [newMaintenanceDescription, setNewMaintenanceDescription] = useState('');
  const [maintenanceList, setMaintenanceList] = useState([
    { id: 1, date: '2024-03-15', description: 'Troca de óleo em 500 km' },
    { id: 2, date: '2024-03-30', description: 'Revisão anual em 15 dias' },
    { id: 3, date: '2024-04-15', description: 'Renovação do seguro em 1 mês' },
  ]);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedMaintenanceId, setSelectedMaintenanceId] = useState<number | null>(null);
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
    setSelectedMaintenanceId(id);
    setConfirmDialogOpen(true);
  };

  const confirmMaintenanceCompletion = () => {
    if (selectedMaintenanceId) {
      setMaintenanceList(maintenanceList.filter(item => item.id !== selectedMaintenanceId));
      setConfirmDialogOpen(false);
      toast({
        title: "Manutenção concluída",
        description: "A tarefa de manutenção foi marcada como concluída.",
      });
    }
  };

  const lastMaintenanceList = [
    { date: '2024-02-15', description: 'Troca de óleo' },
    { date: '2024-01-30', description: 'Alinhamento e balanceamento' },
    { date: '2023-12-20', description: 'Troca de filtro de ar' },
    { date: '2023-11-10', description: 'Revisão dos freios' },
    { date: '2023-10-05', description: 'Troca de pneus' },
  ];

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

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-2xl font-bold">
              Próximas Manutenções
            </CardTitle>
            <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
              <PopoverTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <CirclePlus className="h-6 w-6 text-blue-500" />
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
            <ul className="space-y-2">
              {maintenanceList.map((maintenance) => (
                <li key={maintenance.id} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Bell className="mr-2 h-4 w-4 text-blue-500" />
                    <span>{maintenance.date} - {maintenance.description}</span>
                  </div>
                  <SquareCheck
                    className="h-6 w-6 text-gray-400 cursor-pointer hover:text-gray-600 transition-colors"
                    onClick={() => handleCheckMaintenance(maintenance.id)}
                  />
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-2xl font-bold">
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

      <AlertDialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar conclusão de tarefa?</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja marcar esta tarefa de manutenção como concluída?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmMaintenanceCompletion} className="bg-blue-500 text-white">
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Dashboard;
