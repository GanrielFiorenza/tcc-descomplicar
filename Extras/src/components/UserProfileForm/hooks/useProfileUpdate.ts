import { auth, db } from "@/config/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { 
  updatePassword, 
  EmailAuthProvider, 
  reauthenticateWithCredential
} from "firebase/auth";
import { useToast } from "@/hooks/use-toast";

interface UserData {
  username: string;
  email: string;
  birthDate: string;
  gender: string;
}

export const useProfileUpdate = (
  userData: UserData,
  password: string,
  setEditMode: (value: boolean) => void,
  setPassword: (value: string) => void,
  setConfirmPassword: (value: string) => void,
  setIsConfirmDialogOpen: (value: boolean) => void,
  setIsReauthDialogOpen: (value: boolean) => void
) => {
  const { toast } = useToast();

  const handleReauthentication = async (currentPassword: string) => {
    if (!auth.currentUser?.email) return false;
    
    try {
      const credential = EmailAuthProvider.credential(
        auth.currentUser.email,
        currentPassword
      );
      await reauthenticateWithCredential(auth.currentUser, credential);
      return true;
    } catch (error) {
      console.error('Reauth error:', error);
      toast({
        title: "Erro na autenticação",
        description: "Senha atual incorreta",
        variant: "destructive",
      });
      return false;
    }
  };

  const updateUserData = async () => {
    if (!auth.currentUser) return;

    try {
      // Update basic user data in Firestore
      await updateDoc(doc(db, "users", auth.currentUser.uid), {
        name: userData.username,
        birthDate: userData.birthDate,
        gender: userData.gender,
        updatedAt: new Date().toISOString()
      });

      // Update password if provided
      if (password) {
        await updatePassword(auth.currentUser, password);
      }

      setIsConfirmDialogOpen(false);
      setIsReauthDialogOpen(false);
      setEditMode(false);
      setPassword('');
      setConfirmPassword('');

      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram salvas com sucesso.",
      });
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        title: "Erro ao atualizar",
        description: error.message || "Não foi possível atualizar suas informações.",
        variant: "destructive",
      });
    }
  };

  const confirmSave = async () => {
    try {
      if (!auth.currentUser) return;

      if (password) {
        setIsReauthDialogOpen(true);
        return;
      }

      await updateUserData();
    } catch (error) {
      console.error('Confirm save error:', error);
      toast({
        title: "Erro ao atualizar",
        description: "Não foi possível atualizar suas informações.",
        variant: "destructive",
      });
    }
  };

  const handleReauthSubmit = async (currentPassword: string) => {
    const isReauthSuccess = await handleReauthentication(currentPassword);
    if (isReauthSuccess) {
      await updateUserData();
    }
  };

  return {
    confirmSave,
    handleReauthSubmit
  };
};