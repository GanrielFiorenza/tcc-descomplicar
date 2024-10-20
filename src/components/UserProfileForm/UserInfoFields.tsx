import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Mail, Calendar, Users } from 'lucide-react';
import { format } from 'date-fns';

interface UserData {
  username: string;
  email: string;
  birthDate: string;
  gender: string;
}

interface UserInfoFieldsProps {
  userData: UserData;
  editMode: boolean;
  errors: { [key: string]: string };
  handleInputChange: (field: keyof UserData, value: string) => void;
}

const UserInfoFields: React.FC<UserInfoFieldsProps> = ({ userData, editMode, errors, handleInputChange }) => {
  const formatBirthDate = (date: string) => {
    try {
      return format(new Date(date), 'dd/MM/yyyy');
    } catch {
      return date;
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="username" className="flex items-center">
          <User className="mr-2 h-4 w-4 text-blue-500" />
          Nome de usuário
        </Label>
        {editMode ? (
          <Input
            id="username"
            value={userData.username}
            onChange={(e) => handleInputChange('username', e.target.value)}
            placeholder="Seu nome de usuário"
            className={errors.username ? "border-red-500" : ""}
          />
        ) : (
          <div className="p-2 bg-gray-100 rounded">{userData.username}</div>
        )}
        {errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="flex items-center">
          <Mail className="mr-2 h-4 w-4 text-blue-500" />
          E-mail
        </Label>
        {editMode ? (
          <Input
            id="email"
            type="email"
            value={userData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            placeholder="Seu e-mail"
            className={errors.email ? "border-red-500" : ""}
          />
        ) : (
          <div className="p-2 bg-gray-100 rounded">{userData.email}</div>
        )}
        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="birthDate" className="flex items-center">
            <Calendar className="mr-2 h-4 w-4 text-blue-500" />
            Data de nascimento
          </Label>
          {editMode ? (
            <Input
              id="birthDate"
              type="date"
              value={userData.birthDate}
              onChange={(e) => handleInputChange('birthDate', e.target.value)}
            />
          ) : (
            <div className="p-2 bg-gray-100 rounded">
              {formatBirthDate(userData.birthDate)}
            </div>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="gender" className="flex items-center">
            <Users className="mr-2 h-4 w-4 text-blue-500" />
            Gênero
          </Label>
          {editMode ? (
            <Select onValueChange={(value) => handleInputChange('gender', value)} value={userData.gender}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione o gênero" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="masculino">Masculino</SelectItem>
                <SelectItem value="feminino">Feminino</SelectItem>
                <SelectItem value="outros">Outros</SelectItem>
              </SelectContent>
            </Select>
          ) : (
            <div className="p-2 bg-gray-100 rounded">{userData.gender}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserInfoFields;