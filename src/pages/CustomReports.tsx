import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FileText, Download, Printer, ChartBar } from 'lucide-react';
import { jsPDF } from "jspdf";
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { useToast } from "@/hooks/use-toast";

const CustomReports = () => {
  const [reportType, setReportType] = useState('financial');
  const [reportData, setReportData] = useState<any[]>([]);
  const { toast } = useToast();

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

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Relatório Financeiro", 14, 15);
    doc.autoTable({
      head: [['Mês', 'Despesas', 'Receitas']],
      body: reportData.map(item => [item.month, `R$ ${item.expenses}`, `R$ ${item.income}`]),
    });
    doc.save("relatorio_financeiro.pdf");
    toast({
      title: "PDF Exportado",
      description: "O relatório foi exportado com sucesso para PDF.",
    });
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(reportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Relatório");
    XLSX.writeFile(wb, "relatorio_financeiro.xlsx");
    toast({
      title: "Excel Exportado",
      description: "O relatório foi exportado com sucesso para Excel.",
    });
  };

  const getChartData = () => {
    switch (reportType) {
      case 'expenses':
        return reportData.map(item => ({ month: item.month, expenses: item.expenses }));
      case 'income':
        return reportData.map(item => ({ month: item.month, income: item.income }));
      default:
        return reportData;
    }
  };

  const renderChart = () => {
    const data = getChartData();
    return (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          {reportType === 'financial' || reportType === 'expenses' ? <Bar dataKey="expenses" fill="#8884d8" /> : null}
          {reportType === 'financial' || reportType === 'income' ? <Bar dataKey="income" fill="#82ca9d" /> : null}
        </BarChart>
      </ResponsiveContainer>
    );
  };

  const renderTable = () => {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Mês</TableHead>
            {reportType === 'financial' || reportType === 'expenses' ? <TableHead>Despesas</TableHead> : null}
            {reportType === 'financial' || reportType === 'income' ? <TableHead>Receitas</TableHead> : null}
          </TableRow>
        </TableHeader>
        <TableBody>
          {reportData.map((item, index) => (
            <TableRow key={index}>
              <TableCell>{item.month}</TableCell>
              {reportType === 'financial' || reportType === 'expenses' ? <TableCell className="text-red-500">R$ {item.expenses}</TableCell> : null}
              {reportType === 'financial' || reportType === 'income' ? <TableCell className="text-green-500">R$ {item.income}</TableCell> : null}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
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
            <Select value={reportType} onValueChange={setReportType}>
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
              {renderChart()}
              {renderTable()}
              <div className="flex justify-end space-x-2">
                <Button onClick={exportToPDF} variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Exportar PDF
                </Button>
                <Button onClick={exportToExcel} variant="outline">
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
