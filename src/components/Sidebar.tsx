import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ChevronLeft, ChevronRight, LayoutDashboard, Car, Wrench, Wallet, FileText, Settings, LogOut } from 'lucide-react';
import { auth } from '@/config/firebase';
import { signOut } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';

interface SidebarProps {
  onLogout: () => void;
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onLogout, isOpen, toggleSidebar }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      onLogout();
      navigate('/login');
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao sair",
        description: "Ocorreu um erro ao tentar desconectar.",
      });
    }
  };

  const navItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/vehicles', icon: Car, label: 'Veículos' },
    { path: '/maintenance', icon: Wrench, label: 'Manutenções' },
    { path: '/expenses', icon: Wallet, label: 'Despesas' },
    { path: '/reports', icon: FileText, label: 'Relatórios' },
    { path: '/settings', icon: Settings, label: 'Configurações' },
  ];

  return (
    <div className={`bg-gray-800 text-white h-screen ${
      isOpen ? 'w-full sm:w-64' : 'w-16'
    } transition-all duration-300 ease-in-out flex flex-col fixed top-0 left-0 overflow-y-auto z-50`}>
      <div className="flex justify-between items-center p-2 sm:p-4 sticky top-0 bg-gray-800 z-10">
        {isOpen && (
          <div className="flex items-center w-full">
            <Avatar className="h-8 w-8 sm:h-10 sm:w-10 mr-2 sm:mr-3">
              <AvatarImage src="/fotos/Captura de tela de 2024-10-17 14-01-55.png" alt="User profile" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <h2 className="text-lg sm:text-xl font-bold">Menu</h2>
          </div>
        )}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleSidebar} 
          className={`${isOpen ? '' : 'mx-auto'} p-1 sm:p-2`}
        >
          {isOpen ? <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" /> : <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />}
        </Button>
      </div>
      <nav className="flex-grow">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center p-2 sm:p-4 hover:bg-gray-700 transition-colors ${
              location.pathname === item.path ? 'bg-gray-900' : ''
            } ${isOpen ? '' : 'justify-center'}`}
          >
            <item.icon className="h-4 w-4 sm:h-5 sm:w-5" />
            {isOpen && <span className="ml-2 sm:ml-4 text-sm sm:text-base">{item.label}</span>}
          </Link>
        ))}
      </nav>
      {isOpen ? (
        <Button
          variant="destructive"
          className="m-2 sm:m-4 text-sm sm:text-base sticky bottom-0"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
          Sair
        </Button>
      ) : (
        <Button
          variant="ghost"
          size="icon"
          className="m-2 sm:m-4 sticky bottom-0"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4 sm:h-5 sm:w-5" />
        </Button>
      )}
    </div>
  );
};

export default Sidebar;