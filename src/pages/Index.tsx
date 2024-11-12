import { useState } from "react";
import { Link } from "react-router-dom";
import LoginForm from "@/components/LoginForm";
import GoogleLoginButton from "@/components/GoogleLoginButton";
import { Car } from "lucide-react";

interface IndexProps {
  onLogin: () => void;
}

const Index = ({ onLogin }: IndexProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-sm sm:max-w-md space-y-8">
          <div className="text-center">
            <div className="flex justify-center items-center mb-4">
              <Car className="h-8 w-8 sm:h-10 sm:w-10 text-blue-800" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Bem-vindo de volta
            </h2>
            <p className="text-sm sm:text-base text-gray-600">
              Entre com sua conta para continuar
            </p>
          </div>

          <div className="bg-white py-6 sm:py-8 px-4 sm:px-10 shadow rounded-lg space-y-6">
            <LoginForm
              onLogin={onLogin}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
            />

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-xs sm:text-sm uppercase">
                <span className="px-2 bg-white text-gray-500">Ou continue com</span>
              </div>
            </div>

            <GoogleLoginButton onLogin={onLogin} isLoading={isLoading} />

            <p className="text-center text-xs sm:text-sm text-gray-600">
              Não tem uma conta?{" "}
              <Link
                to="/create-account"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Registre-se
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;