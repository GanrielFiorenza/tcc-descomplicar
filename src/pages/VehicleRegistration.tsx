import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { VehicleForm } from '@/components/VehicleForm';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { addVehicle, getUserVehicles, updateVehicle, deleteVehicle, Vehicle } from '@/services/vehicleService';
import VehicleTable from '@/components/VehicleTable';

const VehicleRegistration = () => {
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: vehicles = [], isLoading } = useQuery({
    queryKey: ['vehicles'],
    queryFn: getUserVehicles,
  });

  const addVehicleMutation = useMutation({
    mutationFn: addVehicle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      setIsModalOpen(false);
      toast({
        title: "Veículo Adicionado",
        description: "Um novo veículo foi adicionado com sucesso.",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Erro ao adicionar veículo",
        description: error.message,
      });
    },
  });

  const updateVehicleMutation = useMutation({
    mutationFn: updateVehicle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      setEditingVehicle(null);
      toast({
        title: "Veículo Atualizado",
        description: "O veículo foi atualizado com sucesso.",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Erro ao atualizar veículo",
        description: error.message,
      });
    },
  });

  const deleteVehicleMutation = useMutation({
    mutationFn: deleteVehicle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      toast({
        title: "Veículo Removido",
        description: "O veículo foi removido com sucesso.",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Erro ao remover veículo",
        description: error.message,
      });
    },
  });

  const handleAddVehicle = (newVehicle: Omit<Vehicle, 'id' | 'userId'>) => {
    addVehicleMutation.mutate(newVehicle);
  };

  const handleEditVehicle = (editedVehicle: Vehicle) => {
    updateVehicleMutation.mutate(editedVehicle);
  };

  const handleDeleteVehicle = (id: string) => {
    deleteVehicleMutation.mutate(id);
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Carregando...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Registro de Veículos</h1>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-700 hover:bg-blue-800">
              <Plus className="mr-2 h-4 w-4" />
              Novo Veículo
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Novo Veículo</DialogTitle>
            </DialogHeader>
            <VehicleForm
              onSave={handleAddVehicle}
              onCancel={() => setIsModalOpen(false)}
              isNewVehicle={true}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Veículos Cadastrados</CardTitle>
        </CardHeader>
        <CardContent>
          <VehicleTable
            vehicles={vehicles}
            editingVehicle={editingVehicle}
            setEditingVehicle={setEditingVehicle}
            handleEditVehicle={handleEditVehicle}
            handleDeleteVehicle={handleDeleteVehicle}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default VehicleRegistration;