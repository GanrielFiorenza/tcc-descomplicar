import { useState } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { LogIn, UserPlus, Mail, Lock, Info, Check, AlertTriangle, Car } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from "@/components/Header";

interface IndexProps {
  onLogin: () => void;
}

const Index: React.FC<IndexProps> = ({ onLogin }) => {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === 'gabriel@exemplo.com' && password === 'gabi123') {
      onLogin();
      navigate('/dashboard');
    } else {
      showToast("Credenciais inválidas. Tente novamente.");
    }
  }

  const handleGoogleLogin = () => {
    showToast("Funcionalidade de login com Google será implementada em breve.");
  }

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
                <CardDescription className="text-center flex items-center justify-center gap-2">
                  <Check className="h-5 w-5 text-green-500" />
                  Acesse sua conta para acompanhar seus gastos e revisões
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input 
                        id="email" 
                        placeholder="seu@email.com" 
                        type="email" 
                        className="pl-10" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="password" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Senha</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input 
                        id="password" 
                        type="password" 
                        className="pl-10"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                  </div>
                  <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600">
                    <LogIn className="mr-2 h-4 w-4" /> Entrar
                  </Button>
                </form>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <Button variant="outline" className="w-full" onClick={handleGoogleLogin}>
                  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                    <path fill="none" d="M1 1h22v22H1z" />
                  </svg>
                  Entrar com Google
                </Button>
                <Button variant="link" className="w-full" onClick={() => navigate('/create-account')}>
                  <UserPlus className="mr-2 h-4 w-4" /> Criar uma conta
                </Button>
              </CardFooter>
            </Card>
          </div>
          {toastMessage && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-400" />
              {toastMessage}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;