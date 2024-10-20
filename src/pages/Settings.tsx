import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bell, User, Save } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

const Settings = () => {
  const [notifications, setNotifications] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [gender, setGender] = useState('');
  const { toast } = useToast();

  const handleSave = () => {
    // Here you would implement the logic to save the settings
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
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Seu e-mail"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Nova senha</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite uma nova senha"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar nova senha</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirme a nova senha"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="birthDate">Data de nascimento</Label>
              <Input
                id="birthDate"
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender">Gênero</Label>
              <Select onValueChange={setGender} value={gender}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione o gênero" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="masculino">Masculino</SelectItem>
                  <SelectItem value="feminino">Feminino</SelectItem>
                  <SelectItem value="outros">Outros</SelectItem>
                </SelectContent>
              </Select>
            </div>
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