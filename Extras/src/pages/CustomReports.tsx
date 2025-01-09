import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, Printer, ChartBar } from 'lucide-react';
import { jsPDF } from "jspdf";
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import html2canvas from 'html2canvas';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useToast } from "@/hooks/use-toast";
import { ReportChart } from '@/components/ReportChart';
import { ReportTable } from '@/components/ReportTable';
import { useQuery } from '@tanstack/react-query';
import { getReportData } from '@/services/reportService';
import { ProcessedReportData, processReportData, filterReportData } from '../utils/reportDataProcessor';
import { ReportFilters } from '@/components/ReportFilters';
import { getUserVehicles, Vehicle } from '@/services/vehicleService';

// Add print-specific styles
const printStyles = `
  @media print {
    body * {
      visibility: hidden;
    }
    .print-content, .print-content * {
      visibility: visible;
    }
    .print-content {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
    }
    .no-print {
      display: none !important;
    }
    @page {
      size: auto;
      margin: 20mm;
    }
  }
`;

const CustomReports = () => {
  const [reportType, setReportType] = useState('all');
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const { toast } = useToast();
  const chartRef = React.useRef<HTMLDivElement>(null);

  const { data: reportData, isLoading: isLoadingReports } = useQuery({
    queryKey: ['reports'],
    queryFn: getReportData,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

  const { data: vehicles = [], isLoading: isLoadingVehicles } = useQuery({
    queryKey: ['vehicles'],
    queryFn: getUserVehicles,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

  const formattedVehicles = vehicles.map((vehicle: Vehicle) => ({
    id: vehicle.id,
    name: `${vehicle.brand} ${vehicle.model} (${vehicle.plate})`
  }));

  const getFilteredData = () => {
    if (!reportData) return [];
    let processedData = processReportData(reportData);
    
    if (selectedVehicle) {
      processedData = processedData.filter(item => item.vehicleId === selectedVehicle);
    }

    if (startDate && endDate) {
      processedData = processedData.filter(item => {
        const itemDate = new Date(item.date);
        return itemDate >= startDate && itemDate <= endDate;
      });
    }

    return filterReportData(processedData, reportType);
  };

  const exportToPDF = async () => {
    const doc = new jsPDF();
    doc.text("Relatório de Gastos", 14, 15);

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

  const handlePrint = () => {
    // Add print styles dynamically
    const style = document.createElement('style');
    style.innerHTML = printStyles;
    document.head.appendChild(style);

    // Create a print-specific container
    const printContainer = document.createElement('div');
    printContainer.className = 'print-content';
    
    // Add title
    const title = document.createElement('h1');
    title.textContent = "Relatório de Gastos";
    title.style.fontSize = '24px';
    title.style.marginBottom = '20px';
    printContainer.appendChild(title);

    // Clone and append the chart
    if (chartRef.current) {
      const chartClone = chartRef.current.cloneNode(true);
      printContainer.appendChild(chartClone);
    }

    // Clone and append the table
    const tableContainer = document.createElement('div');
    tableContainer.style.marginTop = '20px';
    const tableData = getFilteredData();
    const table = document.createElement('table');
    table.style.width = '100%';
    table.style.borderCollapse = 'collapse';
    
    // Add table header
    const thead = document.createElement('thead');
    thead.innerHTML = `
      <tr>
        <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Data</th>
        <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Tipo de Gasto</th>
        <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Valor</th>
        <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Descrição</th>
      </tr>
    `;
    table.appendChild(thead);

    // Add table body
    const tbody = document.createElement('tbody');
    tableData.forEach(item => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td style="border: 1px solid #ddd; padding: 8px;">${format(new Date(item.date), 'dd/MM/yyyy', { locale: ptBR })}</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${item.type}</td>
        <td style="border: 1px solid #ddd; padding: 8px;">R$ ${item.amount.toFixed(2)}</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${item.description}</td>
      `;
      tbody.appendChild(row);
    });
    table.appendChild(tbody);
    tableContainer.appendChild(table);
    printContainer.appendChild(tableContainer);

    // Add to document, print, and cleanup
    document.body.appendChild(printContainer);
    window.print();
    document.body.removeChild(printContainer);
    document.head.removeChild(style);
  };

  if (isLoadingReports || isLoadingVehicles) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Relatórios Personalizados</h1>
      </div>

      <ReportFilters
        vehicles={formattedVehicles}
        selectedVehicle={selectedVehicle}
        onSelectVehicle={setSelectedVehicle}
        onDateFilterChange={(start, end) => {
          setStartDate(start);
          setEndDate(end);
        }}
        reportType={reportType}
        onReportTypeChange={setReportType}
      />

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <ChartBar className="mr-2" />
            Relatório
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div ref={chartRef}>
              <ReportChart reportType={reportType} reportData={getFilteredData()} />
            </div>
            <ReportTable reportType={reportType} reportData={getFilteredData()} />
            <div className="flex flex-wrap justify-end gap-2 md:space-x-2">
              <Button 
                onClick={exportToPDF} 
                variant="outline"
                className="w-full sm:w-auto text-sm md:text-base p-2 md:p-3"
              >
                <Download className="mr-2 h-4 w-4" />
                Exportar PDF
              </Button>
              <Button 
                onClick={exportToExcel} 
                variant="outline"
                className="w-full sm:w-auto text-sm md:text-base p-2 md:p-3"
              >
                <Download className="mr-2 h-4 w-4" />
                Exportar Excel
              </Button>
              <Button 
                onClick={handlePrint} 
                variant="outline"
                className="w-full sm:w-auto text-sm md:text-base p-2 md:p-3"
              >
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