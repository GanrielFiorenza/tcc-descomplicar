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
    <div 
      className={`
        fixed top-0 left-0 h-screen bg-gray-800 text-white
        transition-all duration-300 ease-in-out z-50
        md:translate-x-0
        ${isOpen ? 'w-64 translate-x-0' : 'w-16 -translate-x-full md:translate-x-0'}
        flex flex-col
      `}
    >
      <div className="flex justify-between items-center p-4 sticky top-0 bg-gray-800 z-10">
        {isOpen && (
          <div className="flex items-center w-full">
            <Avatar className="h-10 w-10 mr-3">
              <AvatarImage src="/fotos/Captura de tela de 2024-10-17 14-01-55.png" alt="User profile" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <h2 className="text-xl font-bold">Menu</h2>
          </div>
        )}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleSidebar} 
          className={`
            ${isOpen ? '' : 'mx-auto'}
            md:hidden fixed top-4 right-4 z-50 bg-gray-800
            ${!isOpen ? 'translate-x-16' : ''}
          `}
        >
          {isOpen ? <ChevronLeft /> : <ChevronRight />}
        </Button>
      </div>
      <nav className="flex-grow">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`
              flex items-center p-4 hover:bg-gray-700 transition-colors
              ${location.pathname === item.path ? 'bg-gray-900' : ''}
              ${isOpen ? '' : 'justify-center'}
            `}
          >
            <item.icon className="h-5 w-5" />
            {isOpen && <span className="ml-4">{item.label}</span>}
          </Link>
        ))}
      </nav>
      {isOpen ? (
        <Button
          variant="destructive"
          className="m-4 sticky bottom-0"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5 mr-2" />
          Sair
        </Button>
      ) : (
        <Button
          variant="ghost"
          size="icon"
          className="m-4 sticky bottom-0"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5" />
        </Button>
      )}
    </div>
  );
};

export default Sidebar;