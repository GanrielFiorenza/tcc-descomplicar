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
import { ProcessedReportData, processReportData, filterReportData } from '../utils/reportDataProcessor';
import { ReportFilters } from '@/components/ReportFilters';

const CustomReports = () => {
  const [reportType, setReportType] = useState('all');
  const [selectedReportType, setSelectedReportType] = useState('all');
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const { toast } = useToast();
  const chartRef = useRef<HTMLDivElement>(null);

  const { data: reportData, isLoading, error } = useQuery({
    queryKey: ['reports', selectedVehicle, startDate, endDate],
    queryFn: () => getReportData(selectedVehicle, startDate, endDate),
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });

  const getFilteredData = () => {
    const processedData = processReportData(reportData);
    return filterReportData(processedData, reportType);
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
      item.type,
      `R$ ${item.amount.toFixed(2)}`,
      item.description
    ]);

    doc.autoTable({
      head: [['Mês', 'Tipo', 'Valor', 'Descrição']],
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
      Tipo: item.type,
      Valor: item.amount,
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

      <ReportFilters
        selectedVehicle={selectedVehicle}
        onSelectVehicle={setSelectedVehicle}
        onDateFilterChange={(start, end) => {
          setStartDate(start);
          setEndDate(end);
        }}
      />

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