import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from "@/components/ui/card"
import { UserPlus, Info, Car } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from "@/components/Header";
import LoginForm from "@/components/LoginForm";
import GoogleLoginButton from "@/components/GoogleLoginButton";

interface IndexProps {
  onLogin: () => void;
}

const Index: React.FC<IndexProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ensure event and key exist and are of the correct type
      if (!event || typeof event.key !== 'string') {
        return;
      }

      const key = event.key.toLowerCase();
      
      if (key === 'enter') {
        const activeElement = document.activeElement;
        if (!activeElement || activeElement === document.body) {
          const loginButton = document.querySelector('button[type="submit"]');
          if (loginButton instanceof HTMLButtonElement && !loginButton.disabled) {
            loginButton.click();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Header />
      <div className="min-h-screen flex flex-col items-center pt-16">
        <div className="text-center mb-8 space-y-2">
          <h1 className="text-4xl font-bold text-blue-900 flex items-center justify-center gap-2">
            <Car className="h-8 w-8 text-blue-500" />
            Bem-vindo ao DescompliCar
            <Car className="h-8 w-8 text-blue-500" />
          </h1>
          <p className="text-gray-600 flex items-center justify-center gap-2">
            <Info className="h-5 w-5 text-blue-500" />
            Faça login para gerenciar seu veículo de forma simples e eficiente
          </p>
        </div>

        <div className="relative p-8">
          <div className="shadow-[0_0_40px_rgba(0,0,0,0.4)] rounded-lg">
            <Card className="w-full max-w-md relative backdrop-blur-sm bg-white/90">
              <CardHeader>
                <CardDescription className="text-center">
                  Acesse sua conta para acompanhar seus gastos e revisões
                </CardDescription>
              </CardHeader>
              <CardContent>
                <LoginForm 
                  onLogin={onLogin}
                  isLoading={isLoading}
                  setIsLoading={setIsLoading}
                  email={email}
                  setEmail={setEmail}
                  password={password}
                  setPassword={setPassword}
                />
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <GoogleLoginButton onLogin={onLogin} isLoading={isLoading} />
                <Button 
                  variant="link" 
                  className="w-full" 
                  onClick={() => navigate('/create-account')}
                  disabled={isLoading}
                >
                  <UserPlus className="mr-2 h-4 w-4" /> Criar uma conta
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;