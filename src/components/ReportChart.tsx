import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { ProcessedReportData } from '../utils/reportDataProcessor';

interface ReportChartProps {
  reportType: string;
  reportData: ProcessedReportData[];
}

export const ReportChart: React.FC<ReportChartProps> = ({ reportType, reportData }) => {
  // Agrupar dados por mês e tipo
  const groupedData = reportData.reduce((acc: any[], curr) => {
    const existingMonth = acc.find(item => item.month === curr.month);
    
    if (existingMonth) {
      // Se for combustível ou impostos, adiciona diretamente
      if (curr.type === 'Combustível') {
        existingMonth.combustivel = (existingMonth.combustivel || 0) + curr.amount;
      } else if (curr.type === 'Impostos') {
        existingMonth.impostos = (existingMonth.impostos || 0) + curr.amount;
      } else {
        // Se não for combustível nem impostos, soma em outros
        existingMonth.outros = (existingMonth.outros || 0) + curr.amount;
      }
    } else {
      // Criar novo mês com valores iniciais
      const newMonth = { 
        month: curr.month,
        combustivel: curr.type === 'Combustível' ? curr.amount : 0,
        impostos: curr.type === 'Impostos' ? curr.amount : 0,
        outros: (!['Combustível', 'Impostos'].includes(curr.type)) ? curr.amount : 0
      };
      acc.push(newMonth);
    }
    return acc;
  }, []);

  // Ordenar por mês
  const sortedData = groupedData.sort((a, b) => a.month.localeCompare(b.month));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={sortedData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip formatter={(value) => `R$ ${Number(value).toFixed(2)}`} />
        <Legend />
        <Bar 
          dataKey="combustivel" 
          name="Combustível" 
          fill="#82ca9d" 
        />
        <Bar 
          dataKey="impostos" 
          name="Impostos" 
          fill="#ffc658" 
        />
        <Bar 
          dataKey="outros" 
          name="Outros Gastos" 
          fill="#ff7300" 
        />
      </BarChart>
    </ResponsiveContainer>
  );
};