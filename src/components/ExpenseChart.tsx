import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

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
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar 
              dataKey="amount" 
              name="Valor"
              fill={(entry) => categoryColors[entry.category as string] || '#8884d8'}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};