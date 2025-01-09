import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Edit } from 'lucide-react';
import { auth, db } from "@/config/firebase";
import { doc, getDoc } from "firebase/firestore";
import UserInfoFields from './UserInfoFields';
import PasswordFields from './PasswordFields';
import { ConfirmDialog } from './ConfirmDialog';
import { ReauthDialog } from './ReauthDialog';
import { useProfileUpdate } from './hooks/useProfileUpdate';

interface UserData {
  username: string;
  email: string;
  birthDate: string;
  gender: string;
}

interface UserProfileFormProps {
  userData: UserData;
  setUserData: React.Dispatch<React.SetStateAction<UserData>>;
  forceEditMode?: boolean;
  onEditModeChange?: (editMode: boolean) => void;
  onDataLoaded?: () => void;
}

const UserProfileForm: React.FC<UserProfileFormProps> = ({ 
  userData, 
  setUserData, 
  forceEditMode,
  onEditModeChange,
  onDataLoaded 
}) => {
  const [editMode, setEditMode] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [isReauthDialogOpen, setIsReauthDialogOpen] = useState(false);

  useEffect(() => {
    if (forceEditMode !== undefined) {
      setEditMode(forceEditMode);
    }
  }, [forceEditMode]);

  useEffect(() => {
    if (onEditModeChange) {
      onEditModeChange(editMode);
    }
  }, [editMode, onEditModeChange]);

  const { confirmSave, handleReauthSubmit } = useProfileUpdate(
    userData,
    password,
    setEditMode,
    setPassword,
    setConfirmPassword,
    setIsConfirmDialogOpen,
    setIsReauthDialogOpen
  );

  useEffect(() => {
    const fetchUserData = async () => {
      if (auth.currentUser) {
        const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setUserData({
            username: data.name,
            email: auth.currentUser.email || '',
            birthDate: data.birthDate,
            gender: data.gender
          });
          onDataLoaded?.();
        }
      }
    };

    fetchUserData();
  }, [setUserData, onDataLoaded]);

  const handleInputChange = (field: keyof UserData, value: string) => {
    setUserData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Perfil do Usuário</h2>
        {!editMode && (
          <Button 
            onClick={() => setEditMode(true)} 
            variant="outline" 
            className="bg-blue-800 text-white hover:bg-blue-900 text-sm md:text-base p-2 md:p-3"
          >
            <Edit className="mr-2 h-4 w-4" /> 
            <span className="whitespace-nowrap">Editar Perfil</span>
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
          <Button onClick={() => setEditMode(false)} variant="outline" className="bg-gray-200 text-gray-800 hover:bg-gray-300">
            Cancelar
          </Button>
          <Button onClick={() => setIsConfirmDialogOpen(true)} className="bg-blue-800 text-white hover:bg-blue-900">
            Salvar
          </Button>
        </div>
      )}

      <ConfirmDialog
        isOpen={isConfirmDialogOpen}
        onOpenChange={setIsConfirmDialogOpen}
        onConfirm={confirmSave}
      />

      <ReauthDialog
        isOpen={isReauthDialogOpen}
        onOpenChange={setIsReauthDialogOpen}
        onConfirm={handleReauthSubmit}
      />
    </div>
  );
};

export default UserProfileForm;
