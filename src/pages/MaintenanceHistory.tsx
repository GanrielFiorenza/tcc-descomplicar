import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, DollarSign, Wrench, Search, Filter, PlusCircle, X, Save } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";

interface Maintenance {
  id: number;
  vehicleId: number;
  date: string;
  serviceType: string;
  cost: number;
  observations: string;
}

const MaintenanceHistory = () => {
  const [maintenances, setMaintenances] = useState<Maintenance[]>([
    { id: 1, vehicleId: 1, date: '2023-01-15', serviceType: 'Oil Change', cost: 50, observations: 'Regular maintenance' },
    { id: 2, vehicleId: 2, date: '2023-02-20', serviceType: 'Brake Replacement', cost: 200, observations: 'Front brakes replaced' },
    { id: 3, vehicleId: 1, date: '2023-03-10', serviceType: 'Tire Rotation', cost: 30, observations: 'Routine service' },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const { toast } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newMaintenance, setNewMaintenance] = useState<Partial<Maintenance>>({
    date: '',
    serviceType: '',
    cost: 0,
    observations: '',
  });

  const filteredMaintenances = maintenances.filter(maintenance =>
    (maintenance.serviceType.toLowerCase().includes(searchTerm.toLowerCase()) ||
     maintenance.observations.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (filterType === 'all' || maintenance.serviceType === filterType)
  );

  const handleAddMaintenance = () => {
    if (newMaintenance.date && newMaintenance.serviceType && newMaintenance.cost) {
      setMaintenances([...maintenances, {
        id: maintenances.length + 1,
        vehicleId: 1, // Assuming a default vehicle ID
        ...newMaintenance as Maintenance
      }]);
      setIsModalOpen(false);
      setNewMaintenance({
        date: '',
        serviceType: '',
        cost: 0,
        observations: '',
      });
      toast({
        title: "Manutenção Adicionada",
        description: "O registro de manutenção foi adicionado com sucesso.",
      });
    } else {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 flex items-center">
        <Wrench className="mr-2" />
        Histórico de Manutenção
      </h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Filter className="mr-2" />
              Filtros
            </div>
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogTrigger asChild>
                <Button className="bg-green-500 hover:bg-green-600">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Adicionar Manutenção
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Adicionar Nova Manutenção</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <CalendarIcon className="h-4 w-4" />
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[280px] justify-start text-left font-normal",
                            !newMaintenance.date && "text-muted-foreground"
                          )}
                        >
                          {newMaintenance.date ? format(new Date(newMaintenance.date), "PPP") : <span>Selecione a data</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={newMaintenance.date ? new Date(newMaintenance.date) : undefined}
                          onSelect={(date) => setNewMaintenance({...newMaintenance, date: date ? format(date, 'yyyy-MM-dd') : ''})}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Wrench className="h-4 w-4" />
                    <Select onValueChange={(value) => setNewMaintenance({...newMaintenance, serviceType: value})}>
                      <SelectTrigger className="w-[280px]">
                        <SelectValue placeholder="Tipo de Serviço" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Oil Change">Troca de Óleo</SelectItem>
                        <SelectItem value="Brake Replacement">Troca de Freios</SelectItem>
                        <SelectItem value="Tire Rotation">Rodízio de Pneus</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <DollarSign className="h-4 w-4" />
                    <Input
                      type="number"
                      placeholder="Custo"
                      className="w-[280px]"
                      value={newMaintenance.cost}
                      onChange={(e) => setNewMaintenance({...newMaintenance, cost: parseFloat(e.target.value)})}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Search className="h-4 w-4" />
                    <Textarea
                      placeholder="Observações"
                      className="w-[280px]"
                      value={newMaintenance.observations}
                      onChange={(e) => setNewMaintenance({...newMaintenance, observations: e.target.value})}
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                    <X className="mr-2 h-4 w-4" />
                    Cancelar
                  </Button>
                  <Button onClick={handleAddMaintenance} className="bg-green-500 hover:bg-green-600">
                    <Save className="mr-2 h-4 w-4" />
                    Salvar
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar por tipo de serviço ou observações"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10"
              />
            </div>
            <Select onValueChange={setFilterType} value={filterType}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Tipo de Serviço" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="Oil Change">Troca de Óleo</SelectItem>
                <SelectItem value="Brake Replacement">Troca de Freios</SelectItem>
                <SelectItem value="Tire Rotation">Rodízio de Pneus</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Manutenções Realizadas</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Tipo de Serviço</TableHead>
                <TableHead>Custo</TableHead>
                <TableHead>Observações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMaintenances.map((maintenance) => (
                <TableRow key={maintenance.id}>
                  <TableCell>
                    <CalendarIcon className="inline mr-2" size={16} />
                    {maintenance.date}
                  </TableCell>
                  <TableCell>
                    <Wrench className="inline mr-2" size={16} />
                    {maintenance.serviceType}
                  </TableCell>
                  <TableCell className={maintenance.cost > 100 ? "text-red-500" : "text-green-500"}>
                    <DollarSign className="inline mr-2" size={16} />
                    ${maintenance.cost}
                  </TableCell>
                  <TableCell>{maintenance.observations}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default MaintenanceHistory;