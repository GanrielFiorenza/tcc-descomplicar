import { useState } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/config/firebase";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from 'react-router-dom';

interface LoginFormProps {
  onLogin: () => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
}

const LoginForm = ({ onLogin, isLoading, setIsLoading, email, setEmail, password, setPassword }: LoginFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({
        variant: "destructive",
        title: "Erro no login",
        description: "Por favor, preencha todos os campos.",
      });
      return;
    }

    setIsLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email.toLowerCase(), password);
      onLogin();
      navigate('/dashboard');
      toast({
        title: "Login realizado com sucesso",
        description: "Você foi conectado com sucesso.",
      });
    } catch (error: any) {
      let errorMessage = "Ocorreu um erro ao fazer login.";
      
      switch (error.code) {
        case 'auth/invalid-email':
          errorMessage = "E-mail inválido.";
          break;
        case 'auth/user-disabled':
          errorMessage = "Esta conta foi desativada.";
          break;
        case 'auth/user-not-found':
          errorMessage = "Usuário não encontrado.";
          break;
        case 'auth/wrong-password':
          errorMessage = "Senha incorreta.";
          break;
        case 'auth/too-many-requests':
          errorMessage = "Muitas tentativas de login. Tente novamente mais tarde.";
          break;
      }

      toast({
        variant: "destructive",
        title: "Erro no login",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
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
            value={email || ''}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            required
          />
        </div>
      </div>
      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Senha</label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input 
            id="password" 
            type={showPassword ? "text" : "password"}
            className="pl-10 pr-10"
            value={password || ''}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
            disabled={isLoading}
          >
            {showPassword ? (
              <Eye className="h-4 w-4" />
            ) : (
              <EyeOff className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>
      <Button 
        type="submit" 
        className="w-full bg-blue-500 hover:bg-blue-600"
        disabled={isLoading}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Entrando...
          </span>
        ) : (
          <>Login</>
        )}
      </Button>
    </form>
  );
};

export default LoginForm;