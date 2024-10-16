import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, LayoutDashboard, Car, Menu } from 'lucide-react';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className={`bg-gray-800 text-white h-screen ${isOpen ? 'w-64' : 'w-16'} transition-all duration-300 ease-in-out`}>
      <div className="flex justify-between items-center p-4">
        {isOpen && <h2 className="text-xl font-bold">Menu</h2>}
        <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <ChevronLeft /> : <ChevronRight />}
        </Button>
      </div>
      <nav className="mt-8">
        <Link to="/dashboard" className="flex items-center p-4 hover:bg-gray-700">
          <LayoutDashboard className="h-5 w-5" />
          {isOpen && <span className="ml-4">Dashboard</span>}
        </Link>
        <Link to="/vehicles" className="flex items-center p-4 hover:bg-gray-700">
          <Car className="h-5 w-5" />
          {isOpen && <span className="ml-4">Veículos</span>}
        </Link>
      </nav>
    </div>
  );
};

export default Sidebar;