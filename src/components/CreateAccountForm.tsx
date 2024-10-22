import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Mail, Lock, Calendar, Users, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

interface CreateAccountFormProps {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  birthDate: string;
  gender: string;
  errors: { [key: string]: string };
  onSubmit: (e: React.FormEvent) => void;
  onNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onConfirmPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBirthDateChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onGenderChange: (value: string) => void;
}

const CreateAccountForm = ({
  name,
  email,
  password,
  confirmPassword,
  birthDate,
  errors,
  onSubmit,
  onNameChange,
  onEmailChange,
  onPasswordChange,
  onConfirmPasswordChange,
  onBirthDateChange,
  onGenderChange,
}: CreateAccountFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Nome</label>
        <div className="relative">
          <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input 
            id="name" 
            placeholder="Seu nome completo" 
            className="pl-10" 
            value={name}
            onChange={onNameChange}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Email</label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input 
            id="email" 
            type="email" 
            placeholder="seu@email.com" 
            className="pl-10" 
            value={email}
            onChange={onEmailChange}
            required
          />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Senha</label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input 
              id="password" 
              type={showPassword ? "text" : "password"}
              className={`pl-10 ${errors.password ? 'border-red-500' : ''}`}
              value={password}
              onChange={onPasswordChange}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}
        </div>
        <div className="space-y-2">
          <label htmlFor="confirmPassword" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Confirmar Senha</label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input 
              id="confirmPassword" 
              type={showConfirmPassword ? "text" : "password"}
              className={`pl-10 ${errors.confirmPassword ? 'border-red-500' : ''}`}
              value={confirmPassword}
              onChange={onConfirmPasswordChange}
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
            >
              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.confirmPassword && <p className="text-red-500 text-xs">{errors.confirmPassword}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="birthDate" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Data de Nascimento</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input 
              id="birthDate" 
              type="date" 
              className="pl-10"
              value={birthDate}
              onChange={onBirthDateChange}
              required
            />
          </div>
        </div>
        <div className="space-y-2">
          <label htmlFor="gender" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Gênero</label>
          <div className="relative">
            <Users className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Select onValueChange={onGenderChange} required>
              <SelectTrigger className="w-full pl-10">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="masculino">Masculino</SelectItem>
                <SelectItem value="feminino">Feminino</SelectItem>
                <SelectItem value="outros">Outros</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <Button type="submit" className="w-full bg-blue-800 hover:bg-blue-900">
        Criar Conta
      </Button>
    </form>
  );
};

export default CreateAccountForm;