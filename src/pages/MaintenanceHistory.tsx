import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import MaintenanceTable from '../components/MaintenanceTable';
import { MaintenanceForm } from '../components/MaintenanceForm';
import { MaintenancePeriodFilter } from '../components/MaintenancePeriodFilter';
import { Maintenance } from '../types/maintenance';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { addMaintenance, getUserMaintenances, updateMaintenance, deleteMaintenance } from '@/services/maintenanceService';
import { getUserVehicles, Vehicle } from '@/services/vehicleService';
import { MaintenanceFilters } from '../components/MaintenanceFilters';

const formatVehicleName = (vehicle: Vehicle) => {
  return `${vehicle.brand} ${vehicle.model} (${vehicle.plate})`;
};

const MaintenanceHistory: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);
  const [period, setPeriod] = useState('all');
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: rawVehicles = [] } = useQuery({
    queryKey: ['vehicles'],
    queryFn: getUserVehicles,
  });

  const vehicles = rawVehicles.map(vehicle => ({
    id: vehicle.id,
    name: formatVehicleName(vehicle)
  }));

  const { data: maintenances = [] } = useQuery({
    queryKey: ['maintenances', period, startDate, endDate],
    queryFn: () => getUserMaintenances(period, startDate, endDate),
  });

  const filteredMaintenances = maintenances.filter(maintenance => {
    const matchesSearch = maintenance.serviceType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         maintenance.observations.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || maintenance.serviceType === filterType;
    const matchesVehicle = !selectedVehicle || maintenance.vehicleId === selectedVehicle;
    
    return matchesSearch && matchesType && matchesVehicle;
  });

  const addMaintenanceMutation = useMutation({
    mutationFn: addMaintenance,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maintenances'] });
      setIsModalOpen(false);
      toast({
        title: "Manutenção Adicionada",
        description: "O registro de manutenção foi adicionado com sucesso.",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Erro ao adicionar manutenção",
        description: error.message,
      });
    },
  });

  const updateMaintenanceMutation = useMutation({
    mutationFn: updateMaintenance,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maintenances'] });
      toast({
        title: "Manutenção Atualizada",
        description: "O registro de manutenção foi atualizado com sucesso.",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Erro ao atualizar manutenção",
        description: error.message,
      });
    },
  });

  const deleteMaintenanceMutation = useMutation({
    mutationFn: deleteMaintenance,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maintenances'] });
      toast({
        title: "Manutenção Removida",
        description: "O registro de manutenção foi removido com sucesso.",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Erro ao remover manutenção",
        description: error.message,
      });
    },
  });

  const handleAddMaintenance = (newMaintenance: Omit<Maintenance, 'id' | 'userId'>) => {
    addMaintenanceMutation.mutate(newMaintenance);
  };

  const handleDeleteMaintenance = (id: string) => {
    deleteMaintenanceMutation.mutate(id);
  };

  const handleEditMaintenance = (editedMaintenance: Maintenance) => {
    if (editedMaintenance.userId) {
      updateMaintenanceMutation.mutate(editedMaintenance as any);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">
        Histórico de Manutenção
      </h1>
      
      <MaintenancePeriodFilter
        period={period}
        onPeriodChange={setPeriod}
        startDate={startDate}
        endDate={endDate}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
      />
      
      <MaintenanceFilters
        vehicles={vehicles}
        selectedVehicle={selectedVehicle}
        onSelectVehicle={setSelectedVehicle}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filterType={filterType}
        onFilterTypeChange={setFilterType}
      />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              Manutenções Realizadas
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
                <MaintenanceForm 
                  onSubmit={handleAddMaintenance} 
                  onCancel={() => setIsModalOpen(false)}
                  vehicles={vehicles}
                />
              </DialogContent>
            </Dialog>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <MaintenanceTable 
            maintenances={filteredMaintenances} 
            onDelete={handleDeleteMaintenance}
            onEdit={handleEditMaintenance}
            vehicles={vehicles}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default MaintenanceHistory;