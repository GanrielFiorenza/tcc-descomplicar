import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, LayoutDashboard, Car, Wrench, Wallet, FileText, Settings, LogOut } from 'lucide-react';

interface SidebarProps {
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onLogout }) => {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();

  const navItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/vehicles', icon: Car, label: 'Veículos' },
    { path: '/maintenance', icon: Wrench, label: 'Manutenções' },
    { path: '/expenses', icon: Wallet, label: 'Despesas' },
    { path: '/reports', icon: FileText, label: 'Relatórios' },
    { path: '/settings', icon: Settings, label: 'Configurações' },
  ];

  return (
    <div className={`bg-gray-800 text-white h-screen ${isOpen ? 'w-64' : 'w-16'} transition-all duration-300 ease-in-out flex flex-col fixed top-0 left-0 overflow-y-auto`}>
      <div className="flex justify-between items-center p-4 sticky top-0 bg-gray-800 z-10">
        {isOpen && <h2 className="text-xl font-bold">Menu</h2>}
        <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <ChevronLeft /> : <ChevronRight />}
        </Button>
      </div>
      <nav className="flex-grow">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center p-4 hover:bg-gray-700 transition-colors ${
              location.pathname === item.path ? 'bg-gray-900' : ''
            }`}
          >
            <item.icon className="h-5 w-5" />
            {isOpen && <span className="ml-4">{item.label}</span>}
          </Link>
        ))}
      </nav>
      {isOpen && (
        <Button
          variant="destructive"
          className="m-4 sticky bottom-0"
          onClick={onLogout}
        >
          <LogOut className="h-5 w-5 mr-2" />
          Sair
        </Button>
      )}
    </div>
  );
};

export default Sidebar;