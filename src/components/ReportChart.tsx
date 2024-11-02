import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { ProcessedReportData } from '../utils/reportDataProcessor';

interface ReportChartProps {
  reportType: string;
  reportData: ProcessedReportData[];
}

export const ReportChart: React.FC<ReportChartProps> = ({ reportType, reportData }) => {
  // Group data by month and type
  const groupedData = reportData.reduce((acc: any[], curr) => {
    const existingMonth = acc.find(item => item.month === curr.month);
    if (existingMonth) {
      existingMonth[curr.type] = curr.amount;
    } else {
      const newMonth = { month: curr.month };
      newMonth[curr.type] = curr.amount;
      acc.push(newMonth);
    }
    return acc;
  }, []);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={groupedData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="Manutenção" fill="#8884d8" />
        <Bar dataKey="Combustível" fill="#82ca9d" />
        <Bar dataKey="Impostos" fill="#ffc658" />
        <Bar dataKey="Outros" fill="#ff7300" />
      </BarChart>
    </ResponsiveContainer>
  );
};