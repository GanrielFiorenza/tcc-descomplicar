import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChartBar } from 'lucide-react';
import { jsPDF } from "jspdf";
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import html2canvas from 'html2canvas';
import { useToast } from "@/hooks/use-toast";
import { ReportChart } from '@/components/ReportChart';
import { ReportTable } from '@/components/ReportTable';
import { ReportFilters } from '@/components/filters/ReportFilters';
import { ReportTypeSelector } from '@/components/reports/ReportTypeSelector';
import { ReportActions } from '@/components/reports/ReportActions';
import { useQuery } from '@tanstack/react-query';
import { getReportData } from '@/services/reportService';
import { processReportData, filterReportData } from '../utils/reportDataProcessor';
import { subMonths, subYears, isWithinInterval, parseISO } from 'date-fns';

const CustomReports = () => {
  const [reportType, setReportType] = useState('all');
  const [selectedReportType, setSelectedReportType] = useState('all');
  const [selectedVehicle, setSelectedVehicle] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const { toast } = useToast();
  const chartRef = React.useRef<HTMLDivElement>(null);

  const { data: reportData, isLoading } = useQuery({
    queryKey: ['reports'],
    queryFn: getReportData,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

  const getFilteredData = () => {
    const processedData = processReportData(reportData);
    let filteredData = filterReportData(processedData, reportType);

    // Filter by vehicle
    if (selectedVehicle !== 'all') {
      filteredData = filteredData.filter(item => item.vehicleId === selectedVehicle);
    }

    // Filter by date
    const now = new Date();
    let dateFilteredData = filteredData;

    switch (dateFilter) {
      case '1year':
        const oneYearAgo = subYears(now, 1);
        dateFilteredData = filteredData.filter(item => {
          const itemDate = parseISO(item.month + '-01');
          return itemDate >= oneYearAgo;
        });
        break;
      case '6months':
        const sixMonthsAgo = subMonths(now, 6);
        dateFilteredData = filteredData.filter(item => {
          const itemDate = parseISO(item.month + '-01');
          return itemDate >= sixMonthsAgo;
        });
        break;
      case '1month':
        const oneMonthAgo = subMonths(now, 1);
        dateFilteredData = filteredData.filter(item => {
          const itemDate = parseISO(item.month + '-01');
          return itemDate >= oneMonthAgo;
        });
        break;
      case 'custom':
        if (startDate && endDate) {
          dateFilteredData = filteredData.filter(item => {
            const itemDate = parseISO(item.month + '-01');
            return isWithinInterval(itemDate, { start: startDate, end: endDate });
          });
        }
        break;
      default:
        dateFilteredData = filteredData;
    }

    return dateFilteredData;
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

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <ChartBar className="mr-2" />
            Gerar Relatório
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <ReportFilters
              selectedVehicle={selectedVehicle}
              onVehicleChange={setSelectedVehicle}
              dateFilter={dateFilter}
              startDate={startDate}
              endDate={endDate}
              onDateFilterChange={setDateFilter}
              onStartDateSelect={(date) => setStartDate(date || null)}
              onEndDateSelect={(date) => setEndDate(date || null)}
            />

            <ReportTypeSelector
              reportType={reportType}
              onReportTypeChange={setReportType}
            />

            <Button onClick={generateReport}>Gerar Relatório</Button>
          </div>

          <div className="space-y-4 mt-4">
            <div ref={chartRef}>
              <ReportChart reportType={selectedReportType} reportData={getFilteredData()} />
            </div>
            <ReportTable reportType={selectedReportType} reportData={getFilteredData()} />
            <ReportActions
              reportType={selectedReportType}
              filteredData={getFilteredData()}
              onExportPDF={exportToPDF}
              onExportExcel={exportToExcel}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomReports;
