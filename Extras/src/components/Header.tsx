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
          className="text-xl sm:text-2xl font-bold text-blue-900 flex items-center hover:text-blue-800 transition-colors"
        >
          <Car className="h-5 w-5 sm:h-6 sm:w-6 mr-2 text-blue-800" />
          DescompliCar
        </button>
        <div className="flex gap-2 sm:gap-4">
          <Button 
            variant="ghost"
            className="flex items-center gap-1 text-xs sm:text-base text-blue-800 hover:text-blue-900 hover:bg-blue-50 px-2 py-1 sm:px-4 sm:py-2"
            onClick={() => navigate('/login')}
          >
            <LogIn className="h-3 w-3 sm:h-4 sm:w-4" />
            Login
          </Button>
          <Button 
            className="flex items-center gap-1 text-xs sm:text-base bg-blue-800 hover:bg-blue-900 px-2 py-1 sm:px-4 sm:py-2"
            onClick={() => navigate('/create-account')}
          >
            <UserPlus className="h-3 w-3 sm:h-4 sm:w-4" />
            Criar Conta
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;