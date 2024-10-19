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
    // Simulação de geração de relatório com dados atualizados
    const mockData = {
      general: [
        { month: 'Jan', maintenance: 4000, fuel: 1500, taxes: 500, description: 'Manutenção do motor, abastecimento e IPVA', type: 'Geral' },
        { month: 'Fev', maintenance: 800, fuel: 3000, taxes: 200, description: 'Alinhamento, abastecimento mensal e licenciamento', type: 'Geral' },
        { month: 'Mar', maintenance: 1200, fuel: 1800, taxes: 2000, description: 'Troca de pastilhas, abastecimento e IPVA', type: 'Geral' },
        { month: 'Abr', maintenance: 2780, fuel: 2000, taxes: 100, description: 'Troca de pneus, abastecimento e taxa de renovação', type: 'Geral' },
        { month: 'Mai', maintenance: 900, fuel: 1890, taxes: 300, description: 'Troca de filtros, abastecimento e multa', type: 'Geral' },
        { month: 'Jun', maintenance: 1100, fuel: 2100, taxes: 2390, description: 'Revisão geral, abastecimento e licenciamento', type: 'Geral' },
      ],
      maintenance: [
        { month: 'Jan', amount: 1000, description: 'Troca de óleo', type: 'Manutenção' },
        { month: 'Fev', amount: 800, description: 'Alinhamento e balanceamento', type: 'Manutenção' },
        { month: 'Mar', amount: 1200, description: 'Troca de pastilhas de freio', type: 'Manutenção' },
        { month: 'Abr', amount: 2780, description: 'Troca de pneus', type: 'Manutenção' },
        { month: 'Mai', amount: 900, description: 'Troca de filtros', type: 'Manutenção' },
        { month: 'Jun', amount: 1100, description: 'Revisão geral', type: 'Manutenção' },
      ],
      fuel: [
        { month: 'Jan', amount: 500, description: 'Abastecimento semanal', type: 'Combustível' },
        { month: 'Fev', amount: 550, description: 'Abastecimento semanal', type: 'Combustível' },
        { month: 'Mar', amount: 480, description: 'Abastecimento semanal', type: 'Combustível' },
        { month: 'Abr', amount: 520, description: 'Abastecimento semanal', type: 'Combustível' },
        { month: 'Mai', amount: 490, description: 'Abastecimento semanal', type: 'Combustível' },
        { month: 'Jun', amount: 510, description: 'Abastecimento semanal', type: 'Combustível' },
      ],
      taxes: [
        { month: 'Jan', amount: 1000, description: 'IPVA', type: 'Impostos' },
        { month: 'Fev', amount: 200, description: 'Licenciamento', type: 'Impostos' },
        { month: 'Mar', amount: 150, description: 'Seguro obrigatório', type: 'Impostos' },
        { month: 'Abr', amount: 100, description: 'Taxa de renovação', type: 'Impostos' },
        { month: 'Mai', amount: 300, description: 'Multa de trânsito', type: 'Impostos' },
        { month: 'Jun', amount: 80, description: 'Taxa de vistoria', type: 'Impostos' },
      ],
    };
    setReportData(mockData[reportType as keyof typeof mockData]);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text(`Relatório de ${getReportTitle()}`, 14, 15);
    doc.autoTable({
      head: [['Mês', 'Valor', 'Descrição', 'Tipo']],
      body: reportData.map(item => [item.month, `R$ ${item.amount}`, item.description, item.type]),
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

  const renderTable = () => {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Mês</TableHead>
            <TableHead>Valor</TableHead>
            <TableHead>Descrição</TableHead>
            <TableHead>Tipo de Gasto</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reportData.map((item, index) => (
            <TableRow key={index}>
              <TableCell>{item.month}</TableCell>
              <TableCell>
                {reportType === 'general'
                  ? `R$ ${(item.maintenance + item.fuel + item.taxes).toFixed(2)}`
                  : `R$ ${item.amount.toFixed(2)}`}
              </TableCell>
              <TableCell>{item.description}</TableCell>
              <TableCell>{item.type}</TableCell>
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