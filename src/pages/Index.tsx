import { useState } from "react";
import { Link } from "react-router-dom";
import LoginForm from "@/components/LoginForm";
import GoogleLoginButton from "@/components/GoogleLoginButton";
import Header from "@/components/Header";

interface IndexProps {
  onLogin: () => void;
}

const Index = ({ onLogin }: IndexProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex min-h-[calc(100vh-73px)] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
              Entre na sua conta
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Gerencie seus veículos de forma simples e eficiente
            </p>
          </div>

          <div className="mt-8 space-y-6">
            <div className="space-y-6">
              <LoginForm
                onLogin={onLogin}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
              />
            </div>

            <GoogleLoginButton onLogin={onLogin} isLoading={isLoading} />

            <p className="text-center text-xs sm:text-sm text-gray-600">
              Não tem uma conta?{" "}
              <Link
                to="/create-account"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Criar conta
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;