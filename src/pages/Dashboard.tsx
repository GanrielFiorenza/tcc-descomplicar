import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Bell } from 'lucide-react';

const data = [
  { name: 'Jan', gastos: 4000 },
  { name: 'Fev', gastos: 3000 },
  { name: 'Mar', gastos: 2000 },
  { name: 'Abr', gastos: 2780 },
  { name: 'Mai', gastos: 1890 },
  { name: 'Jun', gastos: 2390 },
];

const Dashboard = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Gastos Mensais</CardTitle>
            <CardDescription>Visão geral dos gastos nos últimos 6 meses</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="gastos" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Próximas Manutenções</CardTitle>
            <CardDescription>Eventos importantes</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-center">
                <Bell className="mr-2 h-4 w-4 text-blue-500" />
                <span>Troca de óleo em 500 km</span>
              </li>
              <li className="flex items-center">
                <Bell className="mr-2 h-4 w-4 text-blue-500" />
                <span>Revisão anual em 15 dias</span>
              </li>
              <li className="flex items-center">
                <Bell className="mr-2 h-4 w-4 text-blue-500" />
                <span>Renovação do seguro em 1 mês</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;