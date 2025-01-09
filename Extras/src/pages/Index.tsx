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
      if (!event?.key || typeof event.key !== 'string') {
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
      <div className="min-h-screen flex flex-col items-center px-4 sm:px-6 md:px-8 pt-8 sm:pt-12 md:pt-16">
        <div className="text-center mb-6 sm:mb-8 space-y-2 w-full">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-900 flex items-center justify-center gap-2">
            <Car className="h-6 w-6 sm:h-8 sm:w-8 text-blue-500" />
            <span className="text-sm sm:text-base md:text-lg lg:text-xl">Bem-vindo ao DescompliCar</span>
            <Car className="h-6 w-6 sm:h-8 sm:w-8 text-blue-500" />
          </h1>
          <p className="text-sm sm:text-base text-gray-600 flex items-center justify-center gap-2">
            <Info className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
            Faça login para gerenciar seu veículo de forma simples e eficiente
          </p>
        </div>

        <div className="w-full max-w-[90%] sm:max-w-md md:max-w-lg p-4 sm:p-6 md:p-8">
          <div className="shadow-[0_0_40px_rgba(0,0,0,0.4)] rounded-lg">
            <Card className="w-full relative backdrop-blur-sm bg-white/90">
              <CardHeader>
                <CardDescription className="text-center text-sm sm:text-base">
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
                  className="w-full text-sm sm:text-base" 
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