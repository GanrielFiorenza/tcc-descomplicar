import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Download, Printer, ChartBar } from 'lucide-react';
import { jsPDF } from "jspdf";
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import html2canvas from 'html2canvas';
import { useToast } from "@/hooks/use-toast";
import { ReportChart } from '@/components/ReportChart';
import { ReportTable } from '@/components/ReportTable';
import { useQuery } from '@tanstack/react-query';
import { getReportData } from '@/services/reportService';

interface ProcessedReportData {
  month: string;
  maintenance: number;
  fuel: number;
  taxes: number;
  others: number;
  description: string;
}

const CustomReports = () => {
  const [reportType, setReportType] = useState('all');
  const [selectedReportType, setSelectedReportType] = useState('all');
  const { toast } = useToast();
  const chartRef = useRef<HTMLDivElement>(null);

  const { data: reportData, isLoading } = useQuery({
    queryKey: ['reports'],
    queryFn: getReportData,
  });

  const processReportData = (): ProcessedReportData[] => {
    if (!reportData) return [];

    const monthlyData = new Map<string, ProcessedReportData>();

    // Process maintenances
    reportData.maintenances.forEach(maintenance => {
      const month = maintenance.date.substring(0, 7); // Get YYYY-MM
      if (!monthlyData.has(month)) {
        monthlyData.set(month, {
          month,
          maintenance: 0,
          fuel: 0,
          taxes: 0,
          others: 0,
          description: ''
        });
      }
      const data = monthlyData.get(month)!;
      data.maintenance += maintenance.cost;
      data.description += `Manutenção: ${maintenance.observations}. `;
    });

    // Process expenses
    reportData.expenses.forEach(expense => {
      const month = expense.date.substring(0, 7);
      if (!monthlyData.has(month)) {
        monthlyData.set(month, {
          month,
          maintenance: 0,
          fuel: 0,
          taxes: 0,
          others: 0,
          description: ''
        });
      }
      const data = monthlyData.get(month)!;
      
      switch (expense.category.toLowerCase()) {
        case 'combustível':
          data.fuel += expense.amount;
          data.description += `Combustível: ${expense.description}. `;
          break;
        case 'impostos':
          data.taxes += expense.amount;
          data.description += `Impostos: ${expense.description}. `;
          break;
        default:
          data.others += expense.amount;
          data.description += `Outros: ${expense.description}. `;
      }
    });

    return Array.from(monthlyData.values())
      .sort((a, b) => a.month.localeCompare(b.month));
  };

  const getFilteredData = () => {
    const data = processReportData();
    if (reportType === 'all') return data;

    return data.map(item => {
      const filtered = { ...item };
      Object.keys(filtered).forEach(key => {
        if (key !== reportType && key !== 'month' && key !== 'description') {
          filtered[key] = 0;
        }
      });
      return filtered;
    });
  };

  const generateReport = () => {
    setSelectedReportType(reportType);
    toast({
      title: "Relatório Gerado",
      description: `O relatório foi gerado com sucesso.`,
    });
  };

  const exportToPDF = async () => {
    const doc = new jsPDF();
    doc.text(`Relatório de Gastos`, 14, 15);

    if (chartRef.current) {
      const canvas = await html2canvas(chartRef.current);
      const imgData = canvas.toDataURL('image/png');
      doc.addImage(imgData, 'PNG', 10, 20, 190, 100);
    }

    const tableData = getFilteredData().map(item => [
      item.month,
      `R$ ${item.maintenance.toFixed(2)}`,
      `R$ ${item.fuel.toFixed(2)}`,
      `R$ ${item.taxes.toFixed(2)}`,
      `R$ ${item.others.toFixed(2)}`,
      item.description
    ]);

    doc.autoTable({
      head: [['Mês', 'Manutenção', 'Combustível', 'Impostos', 'Outros', 'Descrição']],
      body: tableData,
      startY: 125
    });

    doc.save(`relatorio_${reportType}.pdf`);
    toast({
      title: "PDF Exportado",
      description: "O relatório foi exportado com sucesso para PDF.",
    });
  };

  const exportToExcel = () => {
    const data = getFilteredData().map(item => ({
      Mês: item.month,
      Manutenção: item.maintenance,
      Combustível: item.fuel,
      Impostos: item.taxes,
      Outros: item.others,
      Descrição: item.description
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Relatório");
    XLSX.writeFile(wb, `relatorio_${reportType}.xlsx`);
    toast({
      title: "Excel Exportado",
      description: "O relatório foi exportado com sucesso para Excel.",
    });
  };

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Relatórios Personalizados</h1>
      </div>

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
                <SelectItem value="all">Todos os Gastos</SelectItem>
                <SelectItem value="maintenance">Gastos com Manutenção</SelectItem>
                <SelectItem value="fuel">Gastos com Combustível</SelectItem>
                <SelectItem value="taxes">Gastos com Impostos</SelectItem>
                <SelectItem value="others">Outros Gastos</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={generateReport}>Gerar Relatório</Button>
          </div>

          <div className="space-y-4">
            <div ref={chartRef}>
              <ReportChart reportType={selectedReportType} reportData={getFilteredData()} />
            </div>
            <ReportTable reportType={selectedReportType} reportData={getFilteredData()} />
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
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomReports;