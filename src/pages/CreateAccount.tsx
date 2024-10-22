import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import CreateAccountForm from "@/components/CreateAccountForm";
import { useState } from "react";

const CreateAccount = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [gender, setGender] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
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
    if (validateForm()) {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        localStorage.setItem('isLoggedIn', 'true');
        
        toast({
          title: "Conta criada com sucesso!",
          description: "Você será redirecionado para o dashboard.",
          duration: 3000,
        });
        
        navigate('/dashboard');
      } catch (error) {
        console.error('Error creating account:', error);
        toast({
          title: "Erro ao criar conta",
          description: "Por favor, tente novamente mais tarde.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Header />
      
      <div className="min-h-screen flex items-center justify-center">
        <div className="relative p-8">
          <div className="shadow-[0_0_40px_rgba(0,0,0,0.4)] rounded-lg">
            <Card className="w-full max-w-md relative backdrop-blur-sm bg-white/90">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-center">Bem-vindo ao descompliCar</CardTitle>
                <CardDescription className="text-center">Preencha os dados para criar sua conta</CardDescription>
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
                <Button variant="link" className="w-full" onClick={() => navigate('/login')}>
                  Já tem uma conta? Faça login
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateAccount;