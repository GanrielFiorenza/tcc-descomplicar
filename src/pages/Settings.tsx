import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Globe, Bell, User, Save } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

const Settings = () => {
  const [language, setLanguage] = useState('pt-BR');
  const [notifications, setNotifications] = useState(true);
  const [username, setUsername] = useState('');
  const { toast } = useToast();

  const handleSave = () => {
    // Aqui você implementaria a lógica para salvar as configurações
    toast({
      title: "Configurações salvas",
      description: "Suas preferências foram atualizadas com sucesso.",
    });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Configurações</h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Globe className="mr-2 text-blue-500" />
            Idioma
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Select onValueChange={setLanguage} defaultValue={language}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Selecione o idioma" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pt-BR">Português (BR)</SelectItem>
              <SelectItem value="en-US">English (US)</SelectItem>
              <SelectItem value="es-ES">Español</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="mr-2 text-yellow-500" />
            Notificações
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <Switch
              checked={notifications}
              onCheckedChange={setNotifications}
            />
            <Label htmlFor="notifications">Ativar notificações</Label>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="mr-2 text-green-500" />
            Perfil do Usuário
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Nome de usuário</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Seu nome de usuário"
              />
            </div>
            {/* Adicione mais campos de perfil conforme necessário */}
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleSave} className="w-full">
        <Save className="mr-2 h-4 w-4" /> Salvar Configurações
      </Button>
    </div>
  );
};

export default Settings;