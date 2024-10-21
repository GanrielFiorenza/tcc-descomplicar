import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Bell, CirclePlus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

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
    { date: '2024-03-15', description: 'Troca de óleo em 500 km' },
    { date: '2024-03-30', description: 'Revisão anual em 15 dias' },
    { date: '2024-04-15', description: 'Renovação do seguro em 1 mês' },
  ]);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const { toast } = useToast();

  const handleAddMaintenance = () => {
    if (newMaintenanceDate && newMaintenanceDescription) {
      const newMaintenance = { date: newMaintenanceDate, description: newMaintenanceDescription };
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
              {maintenanceList.map((maintenance, index) => (
                <li key={index} className="flex items-center">
                  <Bell className="mr-2 h-4 w-4 text-blue-500" />
                  <span>{new Date(maintenance.date).toLocaleDateString()} - {maintenance.description}</span>
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