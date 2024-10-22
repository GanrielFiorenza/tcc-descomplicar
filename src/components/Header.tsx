import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { Car, LogIn, UserPlus } from 'lucide-react';

const Header = () => {
  const navigate = useNavigate();
  
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <button 
          onClick={() => navigate('/')} 
          className="text-2xl font-bold text-blue-900 flex items-center hover:text-blue-800 transition-colors"
        >
          <Car className="h-6 w-6 mr-2 text-blue-800" />
          DescompliCar
        </button>
        <div className="flex gap-4">
          <Button 
            variant="ghost"
            className="flex items-center gap-2 text-blue-800 hover:text-blue-900 hover:bg-blue-50"
            onClick={() => navigate('/login')}
          >
            <LogIn className="h-4 w-4" />
            Login
          </Button>
          <Button 
            className="flex items-center gap-2 bg-blue-800 hover:bg-blue-900"
            onClick={() => navigate('/create-account')}
          >
            <UserPlus className="h-4 w-4" />
            Criar Conta
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;