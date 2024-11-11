import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, CirclePlus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { format } from 'date-fns';
import { toast } from "sonner";
import MaintenanceList from './MaintenanceList';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { addNotification, getOpenNotifications, closeNotification } from "@/services/notificationService";

const NotificationsCard = () => {
  const [newNotificationDate, setNewNotificationDate] = useState('');
  const [newNotificationDescription, setNewNotificationDescription] = useState('');
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: notifications, isLoading } = useQuery({
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

  return (
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
        {isLoading ? (
          <div>Carregando...</div>
        ) : (
          <MaintenanceList
            maintenanceList={notifications?.map(notification => ({
              id: notification.id,
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
  );
};

export default NotificationsCard;