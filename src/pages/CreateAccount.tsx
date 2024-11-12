import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from "@/components/ui/card";
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import CreateAccountForm from "@/components/CreateAccountForm";
import { useState } from "react";
import { Car, Shield } from "lucide-react";
import { auth, db } from "@/config/firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const CreateAccount = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [gender, setGender] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showEmailInUseDialog, setShowEmailInUseDialog] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (password.length < 6) {
      newErrors.password = "A senha deve ter pelo menos 6 caracteres";
    }
    
    if (password !== confirmPassword) {
      newErrors.confirmPassword = "As senhas não coincidem";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    if (validateForm()) {
      setIsLoading(true);
      try {
        // Criar usuário com email e senha
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Salvar dados adicionais no Firestore
        await setDoc(doc(db, "users", user.uid), {
          name,
          birthDate,
          gender,
          email,
          createdAt: new Date().toISOString()
        });

        // Realizar login automático
        await signInWithEmailAndPassword(auth, email, password);
        
        localStorage.setItem('isLoggedIn', 'true');
        
        setShowSuccessDialog(true);
      } catch (error: any) {
        let errorMessage = "Erro ao criar conta. Tente novamente.";
        
        if (error.code === 'auth/email-already-in-use') {
          setErrors(prev => ({
            ...prev,
            email: "Este e-mail já está cadastrado. Por favor, utilize outro e-mail ou faça login."
          }));
          setShowEmailInUseDialog(true);
        } else {
          toast({
            title: "Erro ao criar conta",
            description: errorMessage,
            variant: "destructive",
            duration: 3000,
          });
        }
        console.error('Error creating account:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSuccessConfirm = () => {
    setShowSuccessDialog(false);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Header />
      
      <div className="flex flex-col items-center justify-center pt-4 sm:pt-8 pb-2 sm:pb-4 px-4 sm:px-0">
        <h1 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-blue-900 flex items-center justify-center gap-2 mb-2">
          <Car className="h-6 w-6 sm:h-8 sm:w-8 text-blue-500" />
          Bem-vindo ao DescompliCar
          <Car className="h-6 w-6 sm:h-8 sm:w-8 text-blue-500" />
        </h1>
        <p className="text-sm sm:text-base text-gray-600 flex items-center gap-2">
          <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
          Crie sua conta de forma segura e comece a gerenciar seu veículo
        </p>
      </div>

      <div className="min-h-screen flex items-center justify-center -mt-20">
        <div className="relative p-4 sm:p-8 w-full max-w-md">
          <div className="shadow-[0_0_40px_rgba(0,0,0,0.4)] rounded-lg">
            <Card className="w-full relative backdrop-blur-sm bg-white/90">
              <CardHeader>
                <CardDescription className="text-center text-sm sm:text-base">
                  Preencha os dados para criar sua conta
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CreateAccountForm
                  name={name}
                  email={email}
                  password={password}
                  confirmPassword={confirmPassword}
                  birthDate={birthDate}
                  gender={gender}
                  errors={errors}
                  onSubmit={handleSubmit}
                  onNameChange={(e) => setName(e.target.value)}
                  onEmailChange={(e) => setEmail(e.target.value)}
                  onPasswordChange={(e) => setPassword(e.target.value)}
                  onConfirmPasswordChange={(e) => setConfirmPassword(e.target.value)}
                  onBirthDateChange={(e) => setBirthDate(e.target.value)}
                  onGenderChange={setGender}
                />
              </CardContent>
              <CardFooter>
                <Button 
                  variant="link" 
                  className="w-full text-sm sm:text-base" 
                  onClick={() => navigate('/login')}
                >
                  Já tem uma conta? Faça login
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>

      <AlertDialog open={showEmailInUseDialog} onOpenChange={setShowEmailInUseDialog}>
        <AlertDialogContent className="sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg sm:text-xl">E-mail já cadastrado</AlertDialogTitle>
            <AlertDialogDescription className="text-sm sm:text-base">
              Este E-mail já está em uso, faça login ou cadastre um outro e-mail
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowEmailInUseDialog(false)}>
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <AlertDialogContent className="sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg sm:text-xl">Conta criada com sucesso</AlertDialogTitle>
            <AlertDialogDescription className="text-sm sm:text-base">
              Sua conta foi criada com sucesso! Clique em OK para continuar.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={handleSuccessConfirm}>
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CreateAccount;