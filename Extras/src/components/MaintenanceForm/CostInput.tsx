import React from 'react';
import { Input } from "@/components/ui/input";
import { DollarSign } from 'lucide-react';

interface CostInputProps {
  value: number;
  onChange: (value: number) => void;
  error?: boolean;
}

export const CostInput: React.FC<CostInputProps> = ({ value, onChange, error }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    onChange(inputValue === '' ? 0 : parseFloat(inputValue));
  };

  return (
    <div className="grid grid-cols-4 items-center gap-3 sm:gap-4">
      <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-500" />
      <Input
        type="number"
        placeholder="Insira o valor gasto"
        className={`w-[200px] sm:w-[280px] text-xs sm:text-sm h-8 sm:h-10 ${error ? 'border-red-500' : ''}`}
        value={value === 0 ? '' : value}
        onChange={handleChange}
        min={0}
        step={0.01}
      />
    </div>
  );
};