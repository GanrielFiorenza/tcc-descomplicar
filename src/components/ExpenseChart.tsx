import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

interface ExpenseChartProps {
  chartData: { category: string; amount: number }[];
}

// Define colors for each expense category
const categoryColors: { [key: string]: string } = {
  'Manutenção': '#8884d8',
  'Combustível': '#82ca9d',
  'Impostos': '#ffc658',
  'Multas': '#ff7300',
  'Seguro': '#0088fe',
  'Outros': '#ff8042'
};

export const ExpenseChart: React.FC<ExpenseChartProps> = ({ chartData }) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Resumo de Despesas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex flex-wrap gap-4">
          {Object.entries(categoryColors).map(([category, color]) => (
            <div key={category} className="flex items-center">
              <div 
                className="w-4 h-4 mr-2 rounded-sm" 
                style={{ backgroundColor: color }}
              />
              <span className="text-sm">{category}</span>
            </div>
          ))}
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="amount" name="Valor">
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={categoryColors[entry.category] || '#8884d8'} 
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};