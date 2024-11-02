import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { ProcessedReportData } from '../utils/reportDataProcessor';

interface ReportChartProps {
  reportType: string;
  reportData: ProcessedReportData[];
}

export const ReportChart: React.FC<ReportChartProps> = ({ reportData }) => {
  // Group and process data by month
  const groupedData = reportData.reduce((acc: any[], curr) => {
    const month = curr.month;
    const existingMonth = acc.find(item => item.month === month);

    if (existingMonth) {
      // Update existing month's totals
      if (curr.type === 'Manutenção') {
        existingMonth.maintenance = (existingMonth.maintenance || 0) + curr.amount;
      } else if (curr.type === 'Combustível') {
        existingMonth.fuel = (existingMonth.fuel || 0) + curr.amount;
      } else if (curr.type === 'Impostos') {
        existingMonth.taxes = (existingMonth.taxes || 0) + curr.amount;
      } else {
        existingMonth.others = (existingMonth.others || 0) + curr.amount;
      }
    } else {
      // Create new month entry
      const newMonth = { 
        month,
        maintenance: curr.type === 'Manutenção' ? curr.amount : 0,
        fuel: curr.type === 'Combustível' ? curr.amount : 0,
        taxes: curr.type === 'Impostos' ? curr.amount : 0,
        others: !['Manutenção', 'Combustível', 'Impostos'].includes(curr.type) ? curr.amount : 0
      };
      acc.push(newMonth);
    }
    return acc;
  }, []);

  // Sort data by month
  const sortedData = groupedData.sort((a: any, b: any) => a.month.localeCompare(b.month));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={sortedData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip 
          formatter={(value: number) => `R$ ${value.toFixed(2)}`}
        />
        <Legend />
        <Bar dataKey="maintenance" name="Manutenção" fill="#8884d8" />
        <Bar dataKey="fuel" name="Combustível" fill="#82ca9d" />
        <Bar dataKey="taxes" name="Impostos" fill="#ffc658" />
        <Bar dataKey="others" name="Outros" fill="#ff7300" />
      </BarChart>
    </ResponsiveContainer>
  );
};