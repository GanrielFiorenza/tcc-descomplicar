import React from 'react';
import { Bell, SquareCheck } from 'lucide-react';

interface MaintenanceListItemProps {
  date: string;
  description: string;
  onCheck: () => void;
  isChecked: boolean;
}

const MaintenanceListItem: React.FC<MaintenanceListItemProps> = ({ date, description, onCheck, isChecked }) => {
  return (
    <li className="flex items-center justify-between">
      <div className="flex items-center">
        <Bell className="mr-2 h-4 w-4 text-blue-500" />
        <span>{date} - {description}</span>
      </div>
      <SquareCheck
        className={`h-6 w-6 cursor-pointer transition-colors ${
          isChecked ? 'text-green-500' : 'text-gray-400 hover:text-gray-600'
        }`}
        onClick={onCheck}
      />
    </li>
  );
};

export default MaintenanceListItem;