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
  const [reportType, setReportType] = useState('general');
  const [reportData, setReportData] = useState<any[]>([]);
  const { toast } = useToast();

  const generateReport = () => {
    // Simulação de geração de relatório
    const mockData = {
      general: [
        { month: 'Jan', amount: 4000 },
        { month: 'Fev', amount: 3000 },
        { month: 'Mar', amount: 2000 },
        { month: 'Abr', amount: 2780 },
        { month: 'Mai', amount: 1890 },
        { month: 'Jun', amount: 2390 },
      ],
      maintenance: [
        { month: 'Jan', amount: 1000 },
        { month: 'Fev', amount: 800 },
        { month: 'Mar', amount: 1200 },
        { month: 'Abr', amount: 600 },
        { month: 'Mai', amount: 900 },
        { month: 'Jun', amount: 1100 },
      ],
      fuel: [
        { month: 'Jan', amount: 500 },
        { month: 'Fev', amount: 550 },
        { month: 'Mar', amount: 480 },
        { month: 'Abr', amount: 520 },
        { month: 'Mai', amount: 490 },
        { month: 'Jun', amount: 510 },
      ],
      taxes: [
        { month: 'Jan', amount: 200 },
        { month: 'Fev', amount: 200 },
        { month: 'Mar', amount: 200 },
        { month: 'Abr', amount: 200 },
        { month: 'Mai', amount: 200 },
        { month: 'Jun', amount: 200 },
      ],
    };
    setReportData(mockData[reportType as keyof typeof mockData]);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text(`Relatório de ${getReportTitle()}`, 14, 15);
    doc.autoTable({
      head: [['Mês', 'Valor']],
      body: reportData.map(item => [item.month, `R$ ${item.amount}`]),
    });
    doc.save(`relatorio_${reportType}.pdf`);
    toast({
      title: "PDF Exportado",
      description: "O relatório foi exportado com sucesso para PDF.",
    });
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(reportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Relatório");
    XLSX.writeFile(wb, `relatorio_${reportType}.xlsx`);
    toast({
      title: "Excel Exportado",
      description: "O relatório foi exportado com sucesso para Excel.",
    });
  };

  const getReportTitle = () => {
    switch (reportType) {
      case 'general': return 'Gastos Gerais';
      case 'maintenance': return 'Gastos com Manutenção';
      case 'fuel': return 'Gastos com Abastecimento';
      case 'taxes': return 'Gastos com Impostos';
      default: return 'Relatório';
    }
  };

  const renderChart = () => {
    return (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={reportData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="amount" fill="#8884d8" />
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
            <TableHead>Valor</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reportData.map((item, index) => (
            <TableRow key={index}>
              <TableCell>{item.month}</TableCell>
              <TableCell>R$ {item.amount}</TableCell>
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
                <SelectItem value="general">Gastos Gerais</SelectItem>
                <SelectItem value="maintenance">Gastos com Manutenção</SelectItem>
                <SelectItem value="fuel">Gastos com Abastecimento</SelectItem>
                <SelectItem value="taxes">Gastos com Impostos</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={generateReport}>Gerar Relatório</Button>
          </div>
          {reportData.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">{getReportTitle()}</h2>
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