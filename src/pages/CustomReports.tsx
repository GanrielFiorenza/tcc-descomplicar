import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FileText, Download, Printer, ChartBar } from 'lucide-react';

const CustomReports = () => {
  const [reportType, setReportType] = useState('');
  const [reportData, setReportData] = useState<any[]>([]);

  const generateReport = () => {
    // Simulação de geração de relatório
    const mockData = [
      { month: 'Jan', expenses: 4000, income: 2400 },
      { month: 'Fev', expenses: 3000, income: 1398 },
      { month: 'Mar', expenses: 2000, income: 9800 },
      { month: 'Abr', expenses: 2780, income: 3908 },
      { month: 'Mai', expenses: 1890, income: 4800 },
      { month: 'Jun', expenses: 2390, income: 3800 },
    ];
    setReportData(mockData);
  };

  const exportReport = (format: 'pdf' | 'excel') => {
    // Simulação de exportação
    console.log(`Exportando relatório em formato ${format}`);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 flex items-center">
        <FileText className="mr-2" />
        Relatórios Personalizados
      </h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <ChartBar className="mr-2" />
            Gerar Relatório
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4 mb-4">
            <Select onValueChange={setReportType}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Tipo de Relatório" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="financial">Financeiro</SelectItem>
                <SelectItem value="expenses">Despesas</SelectItem>
                <SelectItem value="income">Receitas</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={generateReport}>Gerar Relatório</Button>
          </div>
          {reportData.length > 0 && (
            <div className="space-y-4">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={reportData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="month"
                    tick={{}} // Use an empty object as a default prop
                    tickLine={{}} // Use an empty object as a default prop
                    axisLine={{}} // Use an empty object as a default prop
                  />
                  <YAxis
                    tick={{}} // Use an empty object as a default prop
                    tickLine={{}} // Use an empty object as a default prop
                    axisLine={{}} // Use an empty object as a default prop
                  />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="expenses" fill="#8884d8" />
                  <Bar dataKey="income" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mês</TableHead>
                    <TableHead>Despesas</TableHead>
                    <TableHead>Receitas</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reportData.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.month}</TableCell>
                      <TableCell className="text-red-500">R$ {item.expenses}</TableCell>
                      <TableCell className="text-green-500">R$ {item.income}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="flex justify-end space-x-2">
                <Button onClick={() => exportReport('pdf')} variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Exportar PDF
                </Button>
                <Button onClick={() => exportReport('excel')} variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Exportar Excel
                </Button>
                <Button onClick={() => window.print()} variant="outline">
                  <Printer className="mr-2 h-4 w-4" />
                  Imprimir
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomReports;