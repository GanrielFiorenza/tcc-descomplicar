import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bell, User, Save, Edit, X, Mail, Calendar, Users } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

const Settings = () => {
  const [notifications, setNotifications] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [userData, setUserData] = useState({
    username: 'gabriel',
    email: 'gabriel@exemplo.com',
    birthDate: '1990-01-01',
    gender: 'masculino'
  });
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { toast } = useToast();

  const handleSave = () => {
    setEditMode(false);
    // Here you would implement the logic to save the settings
    toast({
      title: "Configurações salvas",
      description: "Suas preferências foram atualizadas com sucesso.",
    });
  };

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleCancel = () => {
    setEditMode(false);
    // Reset any changes made
    setPassword('');
    setConfirmPassword('');
  };

  const handleInputChange = (field: string, value: string) => {
    setUserData(prev => ({ ...prev, [field]: value }));
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
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <User className="mr-2 text-green-500" />
              Perfil do Usuário
            </div>
            {!editMode && (
              <Button onClick={handleEdit} variant="outline" className="bg-blue-800 text-white hover:bg-blue-900">
                <Edit className="mr-2 h-4 w-4" /> Editar Perfil
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="flex items-center">
                <User className="mr-2 h-4 w-4 text-blue-500" />
                Nome de usuário
              </Label>
              {editMode ? (
                <Input
                  id="username"
                  value={userData.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  placeholder="Seu nome de usuário"
                />
              ) : (
                <div className="p-2 bg-gray-100 rounded">{userData.username}</div>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center">
                <Mail className="mr-2 h-4 w-4 text-blue-500" />
                E-mail
              </Label>
              {editMode ? (
                <Input
                  id="email"
                  type="email"
                  value={userData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Seu e-mail"
                />
              ) : (
                <div className="p-2 bg-gray-100 rounded">{userData.email}</div>
              )}
            </div>
            {editMode && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="password" className="flex items-center">
                    <X className="mr-2 h-4 w-4 text-red-500" />
                    Nova senha
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Digite uma nova senha"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="flex items-center">
                    <X className="mr-2 h-4 w-4 text-red-500" />
                    Confirmar nova senha
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirme a nova senha"
                  />
                </div>
              </>
            )}
            <div className="space-y-2">
              <Label htmlFor="birthDate" className="flex items-center">
                <Calendar className="mr-2 h-4 w-4 text-blue-500" />
                Data de nascimento
              </Label>
              {editMode ? (
                <Input
                  id="birthDate"
                  type="date"
                  value={userData.birthDate}
                  onChange={(e) => handleInputChange('birthDate', e.target.value)}
                />
              ) : (
                <div className="p-2 bg-gray-100 rounded">{userData.birthDate}</div>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender" className="flex items-center">
                <Users className="mr-2 h-4 w-4 text-blue-500" />
                Gênero
              </Label>
              {editMode ? (
                <Select onValueChange={(value) => handleInputChange('gender', value)} value={userData.gender}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione o gênero" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="masculino">Masculino</SelectItem>
                    <SelectItem value="feminino">Feminino</SelectItem>
                    <SelectItem value="outros">Outros</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <div className="p-2 bg-gray-100 rounded">{userData.gender}</div>
              )}
            </div>
          </div>
          {editMode && (
            <div className="mt-6 flex justify-end space-x-4">
              <Button onClick={handleCancel} variant="outline" className="bg-gray-200 text-gray-800 hover:bg-gray-300">
                <X className="mr-2 h-4 w-4" /> Cancelar
              </Button>
              <Button onClick={handleSave} className="bg-blue-800 text-white hover:bg-blue-900">
                <Save className="mr-2 h-4 w-4" /> Salvar
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;