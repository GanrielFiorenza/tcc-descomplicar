import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface EmptyDataAlertProps {
  isOpen: boolean;
  onConfirm: () => void;
}

const EmptyDataAlert = ({ isOpen, onConfirm }: EmptyDataAlertProps) => {
  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Dados Incompletos</AlertDialogTitle>
          <AlertDialogDescription>
            Existem dados do perfil que precisam ser preenchidos. Deseja editar agora?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={onConfirm}>OK</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default EmptyDataAlert;