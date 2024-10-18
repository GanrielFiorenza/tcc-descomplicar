import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { PlusCircle, Search } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import MaintenanceTable from '../components/MaintenanceTable';
import { MaintenanceForm } from '../components/MaintenanceForm';
import { Maintenance } from '../types/maintenance';

const serviceTypeOptions = [
  { value: 'all', label: 'Todos' },
  { value: 'oil_change', label: 'Troca de Óleo' },
  { value: 'brake_replacement', label: 'Troca de Freios' },
  { value: 'tire_rotation', label: 'Rodízio de Pneus' },
  { value: 'other', label: 'Outro' },
];

const MaintenanceHistory: React.FC = () => {
  const [maintenances, setMaintenances] = useState<Maintenance[]>([
    { id: 1, vehicleId: 1, date: '2023-01-15', serviceType: 'oil_change', cost: 50, observations: 'Regular maintenance' },
    { id: 2, vehicleId: 2, date: '2023-02-20', serviceType: 'brake_replacement', cost: 200, observations: 'Front brakes replaced' },
    { id: 3, vehicleId: 1, date: '2023-03-10', serviceType: 'tire_rotation', cost: 30, observations: 'Routine service' },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const { toast } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredMaintenances = maintenances.filter(maintenance =>
    (maintenance.serviceType.toLowerCase().includes(searchTerm.toLowerCase()) ||
     maintenance.observations.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (filterType === 'all' || maintenance.serviceType === filterType)
  );

  const handleAddMaintenance = (newMaintenance: Omit<Maintenance, 'id' | 'vehicleId'>) => {
    setMaintenances([...maintenances, {
      id: maintenances.length + 1,
      vehicleId: 1, // Assuming a default vehicle ID
      ...newMaintenance
    }]);
    setIsModalOpen(false);
    toast({
      title: "Manutenção Adicionada",
      description: "O registro de manutenção foi adicionado com sucesso.",
    });
  };

  const handleDeleteMaintenance = (id: number) => {
    setMaintenances(maintenances.filter(maintenance => maintenance.id !== id));
    toast({
      title: "Manutenção Excluída",
      description: "O registro de manutenção foi excluído com sucesso.",
    });
  };

  const handleEditMaintenance = (editedMaintenance: Maintenance) => {
    setMaintenances(maintenances.map(maintenance => 
      maintenance.id === editedMaintenance.id ? editedMaintenance : maintenance
    ));
    toast({
      title: "Manutenção Atualizada",
      description: "O registro de manutenção foi atualizado com sucesso.",
    });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">
        Histórico de Manutenção
      </h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
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
                <MaintenanceForm onSubmit={handleAddMaintenance} onCancel={() => setIsModalOpen(false)} />
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
                {serviceTypeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                ))}
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
          <MaintenanceTable 
            maintenances={filteredMaintenances} 
            onDelete={handleDeleteMaintenance}
            onEdit={handleEditMaintenance}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default MaintenanceHistory;