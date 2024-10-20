import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Save, Edit, X, Mail, Calendar, Users, Lock } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { format } from 'date-fns';
import { isValidEmail } from '@/utils/validation';

interface UserData {
  username: string;
  email: string;
  birthDate: string;
  gender: string;
}

interface UserProfileFormProps {
  userData: UserData;
  setUserData: React.Dispatch<React.SetStateAction<UserData>>;
}

const UserProfileForm: React.FC<UserProfileFormProps> = ({ userData, setUserData }) => {
  const [editMode, setEditMode] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailError, setEmailError] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (field: keyof UserData, value: string) => {
    setUserData(prev => ({ ...prev, [field]: value }));
    if (field === 'email') {
      setEmailError(false);
    }
  };

  const formatBirthDate = (date: string) => {
    try {
      return format(new Date(date), 'dd/MM/yyyy');
    } catch {
      return date;
    }
  };

  const handleSave = () => {
    if (!isValidEmail(userData.email)) {
      setEmailError(true);
      toast({
        title: "Erro de validação",
        description: "O e-mail inserido não é válido.",
        variant: "destructive",
      });
      return;
    }
    setEditMode(false);
    toast({
      title: "Perfil atualizado",
      description: "Suas informações foram salvas com sucesso.",
    });
  };

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleCancel = () => {
    setEditMode(false);
    setPassword('');
    setConfirmPassword('');
    setEmailError(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Perfil do Usuário</h2>
        {!editMode && (
          <Button onClick={handleEdit} variant="outline" className="bg-blue-800 text-white hover:bg-blue-900">
            <Edit className="mr-2 h-4 w-4" /> Editar Perfil
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {/* Username field */}
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

        {/* Email field */}
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
              className={emailError ? "border-red-500" : ""}
            />
          ) : (
            <div className="p-2 bg-gray-100 rounded">{userData.email}</div>
          )}
          {emailError && (
            <p className="text-red-500 text-sm">Por favor, insira um e-mail válido.</p>
          )}
        </div>

        {/* Password fields */}
        {editMode && (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="password" className="flex items-center">
                <Lock className="mr-2 h-4 w-4 text-red-500" />
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
                <Lock className="mr-2 h-4 w-4 text-red-500" />
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
          </div>
        )}

        {/* Birth date and gender fields */}
        <div className="grid grid-cols-2 gap-4">
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
              <div className="p-2 bg-gray-100 rounded">
                {formatBirthDate(userData.birthDate)}
              </div>
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
    </div>
  );
};

export default UserProfileForm;