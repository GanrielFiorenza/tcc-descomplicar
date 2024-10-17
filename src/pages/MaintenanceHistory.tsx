import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Calendar, DollarSign, Wrench, Search, Filter, PlusCircle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

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
  const [filterType, setFilterType] = useState('');
  const { toast } = useToast();

  const filteredMaintenances = maintenances.filter(maintenance =>
    (maintenance.serviceType.toLowerCase().includes(searchTerm.toLowerCase()) ||
     maintenance.observations.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (filterType === '' || maintenance.serviceType === filterType)
  );

  const handleAddMaintenance = () => {
    // This is where you'd typically open a modal or navigate to a new page to add a maintenance record
    toast({
      title: "Add New Maintenance",
      description: "Feature to add new maintenance record coming soon!",
    });
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
            <Button onClick={handleAddMaintenance} className="bg-green-500 hover:bg-green-600">
              <PlusCircle className="mr-2 h-4 w-4" />
              Adicionar Manutenção
            </Button>
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
                <SelectItem value="">Todos</SelectItem>
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
                    <Calendar className="inline mr-2" size={16} />
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