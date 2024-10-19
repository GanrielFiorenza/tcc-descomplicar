import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface ReportChartProps {
  reportType: string;
  reportData: any[];
}

export const ReportChart: React.FC<ReportChartProps> = ({ reportType, reportData }) => {
  if (reportType === 'general') {
    return (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={reportData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="maintenance" fill="#8884d8" name="Manutenção" />
          <Bar dataKey="fuel" fill="#82ca9d" name="Combustível" />
          <Bar dataKey="taxes" fill="#ffc658" name="Impostos" />
        </BarChart>
      </ResponsiveContainer>
    );
  } else {
    return (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={reportData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="amount" fill="#8884d8" name="Valor" />
        </BarChart>
      </ResponsiveContainer>
    );
  }
};