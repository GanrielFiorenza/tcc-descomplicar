import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, LayoutDashboard, Car, Wrench, Wallet, FileText, Settings, LogOut } from 'lucide-react';

interface SidebarProps {
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onLogout }) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className={`bg-gray-800 text-white h-screen ${isOpen ? 'w-64' : 'w-16'} transition-all duration-300 ease-in-out flex flex-col fixed top-0 left-0 overflow-y-auto`}>
      <div className="flex justify-between items-center p-4 sticky top-0 bg-gray-800 z-10">
        {isOpen && <h2 className="text-xl font-bold">Menu</h2>}
        <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <ChevronLeft /> : <ChevronRight />}
        </Button>
      </div>
      <nav className="flex-grow">
        <Link to="/dashboard" className="flex items-center p-4 hover:bg-gray-700">
          <LayoutDashboard className="h-5 w-5" />
          {isOpen && <span className="ml-4">Dashboard</span>}
        </Link>
        <Link to="/vehicles" className="flex items-center p-4 hover:bg-gray-700">
          <Car className="h-5 w-5" />
          {isOpen && <span className="ml-4">Veículos</span>}
        </Link>
        <Link to="/maintenance" className="flex items-center p-4 hover:bg-gray-700">
          <Wrench className="h-5 w-5" />
          {isOpen && <span className="ml-4">Manutenções</span>}
        </Link>
        <Link to="/expenses" className="flex items-center p-4 hover:bg-gray-700">
          <Wallet className="h-5 w-5" />
          {isOpen && <span className="ml-4">Despesas</span>}
        </Link>
        <Link to="/reports" className="flex items-center p-4 hover:bg-gray-700">
          <FileText className="h-5 w-5" />
          {isOpen && <span className="ml-4">Relatórios</span>}
        </Link>
        <Link to="/settings" className="flex items-center p-4 hover:bg-gray-700">
          <Settings className="h-5 w-5" />
          {isOpen && <span className="ml-4">Configurações</span>}
        </Link>
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