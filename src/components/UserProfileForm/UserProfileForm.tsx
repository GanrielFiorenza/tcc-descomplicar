import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Edit } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { isValidEmail } from '@/utils/validation';
import { isValidUsername, isValidPassword, doPasswordsMatch } from '@/utils/formValidation';
import UserInfoFields from './UserInfoFields';
import PasswordFields from './PasswordFields';

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
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const { toast } = useToast();

  const handleInputChange = (field: keyof UserData, value: string) => {
    setUserData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleSave = () => {
    const newErrors: { [key: string]: string } = {};

    if (!isValidUsername(userData.username)) {
      newErrors.username = "O nome de usuário não pode estar vazio";
    }

    if (!isValidEmail(userData.email)) {
      newErrors.email = "O e-mail inserido não é válido";
    }

    if (password || confirmPassword) {
      if (!isValidPassword(password)) {
        newErrors.password = "A senha deve ter pelo menos 6 caracteres";
      }
      if (!doPasswordsMatch(password, confirmPassword)) {
        newErrors.confirmPassword = "As senhas não coincidem";
      }
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setEditMode(false);
      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram salvas com sucesso.",
      });
    } else {
      toast({
        title: "Erro de validação",
        description: "Por favor, corrija os campos destacados.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleCancel = () => {
    setEditMode(false);
    setPassword('');
    setConfirmPassword('');
    setErrors({});
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

      <UserInfoFields
        userData={userData}
        editMode={editMode}
        errors={errors}
        handleInputChange={handleInputChange}
      />

      {editMode && (
        <PasswordFields
          password={password}
          setPassword={setPassword}
          confirmPassword={confirmPassword}
          setConfirmPassword={setConfirmPassword}
          errors={errors}
        />
      )}

      {editMode && (
        <div className="mt-6 flex justify-end space-x-4">
          <Button onClick={handleCancel} variant="outline" className="bg-gray-200 text-gray-800 hover:bg-gray-300">
            Cancelar
          </Button>
          <Button onClick={handleSave} className="bg-blue-800 text-white hover:bg-blue-900">
            Salvar
          </Button>
        </div>
      )}
    </div>
  );
};

export default UserProfileForm;