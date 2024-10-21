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

const CustomReports = () => {
  const [reportType, setReportType] = useState('general');
  const [reportData, setReportData] = useState<any[]>([]);
  const [selectedReportType, setSelectedReportType] = useState('general');
  const { toast } = useToast();

  const mockData = {
    general: [
      { month: 'Jan', maintenance: 4000, fuel: 1500, taxes: 500, description: 'Manutenção: Revisão completa do motor. Combustível: Abastecimento mensal. Impostos: Pagamento do IPVA.' },
      { month: 'Fev', maintenance: 800, fuel: 3000, taxes: 200, description: 'Manutenção: Alinhamento e balanceamento. Combustível: Abastecimento quinzenal. Impostos: Taxa de licenciamento.' },
      { month: 'Mar', maintenance: 1200, fuel: 1800, taxes: 2000, description: 'Manutenção: Troca de pastilhas de freio. Combustível: Abastecimento semanal. Impostos: Pagamento do IPVA atrasado.' },
      { month: 'Abr', maintenance: 2780, fuel: 2000, taxes: 100, description: 'Manutenção: Troca dos quatro pneus. Combustível: Abastecimento mensal. Impostos: Taxa de renovação da CNH.' },
      { month: 'Mai', maintenance: 900, fuel: 1890, taxes: 300, description: 'Manutenção: Troca de filtros e óleo. Combustível: Abastecimento quinzenal. Impostos: Multa de trânsito.' },
      { month: 'Jun', maintenance: 1100, fuel: 2100, taxes: 2390, description: 'Manutenção: Revisão geral semestral. Combustível: Abastecimento semanal. Impostos: Pagamento do IPVA e licenciamento.' },
    ],
    maintenance: [
      { month: 'Jan', amount: 1000, description: 'Troca de óleo e filtros', type: 'Manutenção' },
      { month: 'Fev', amount: 800, description: 'Alinhamento e balanceamento', type: 'Manutenção' },
      { month: 'Mar', amount: 1200, description: 'Troca de pastilhas de freio', type: 'Manutenção' },
      { month: 'Abr', amount: 2780, description: 'Troca dos quatro pneus', type: 'Manutenção' },
      { month: 'Mai', amount: 900, description: 'Revisão do sistema de arrefecimento', type: 'Manutenção' },
      { month: 'Jun', amount: 1100, description: 'Revisão geral semestral', type: 'Manutenção' },
    ],
    fuel: [
      { month: 'Jan', amount: 500, description: 'Abastecimento semanal - 1ª semana', type: 'Combustível' },
      { month: 'Fev', amount: 550, description: 'Abastecimento semanal - 2ª semana', type: 'Combustível' },
      { month: 'Mar', amount: 480, description: 'Abastecimento semanal - 3ª semana', type: 'Combustível' },
      { month: 'Abr', amount: 520, description: 'Abastecimento semanal - 4ª semana', type: 'Combustível' },
      { month: 'Mai', amount: 490, description: 'Abastecimento quinzenal - 1ª quinzena', type: 'Combustível' },
      { month: 'Jun', amount: 510, description: 'Abastecimento quinzenal - 2ª quinzena', type: 'Combustível' },
    ],
    taxes: [
      { month: 'Jan', amount: 1000, description: 'IPVA - Parcela 1', type: 'Impostos' },
      { month: 'Fev', amount: 200, description: 'Licenciamento anual', type: 'Impostos' },
      { month: 'Mar', amount: 150, description: 'Seguro obrigatório', type: 'Impostos' },
      { month: 'Abr', amount: 100, description: 'Taxa de renovação da CNH', type: 'Impostos' },
      { month: 'Mai', amount: 300, description: 'Multa de trânsito - Excesso de velocidade', type: 'Impostos' },
      { month: 'Jun', amount: 80, description: 'Taxa de vistoria veicular', type: 'Impostos' },
    ],
  };

  const generateReport = () => {
    setReportData(mockData[reportType as keyof typeof mockData]);
    setSelectedReportType(reportType);
    toast({
      title: "Relatório Gerado",
      description: `O relatório de ${getReportTitle()} foi gerado com sucesso.`,
    });
  };

  const exportToPDF = async () => {
    const doc = new jsPDF();
    doc.text(`Relatório de ${getReportTitle()}`, 14, 15);

    // Add chart to PDF
    if (chartRef.current) {
      const canvas = await html2canvas(chartRef.current);
      const imgData = canvas.toDataURL('image/png');
      doc.addImage(imgData, 'PNG', 10, 20, 190, 100);
    }

    // Add table to PDF
    doc.autoTable({
      head: [['Mês', 'Tipo de Gasto', 'Valor', 'Descrição']],
      body: reportData.flatMap(item => {
        if (reportType === 'general') {
          return [
            ['Manutenção', item.month, `R$ ${item.maintenance.toFixed(2)}`, item.description],
            ['Combustível', item.month, `R$ ${item.fuel.toFixed(2)}`, item.description],
            ['Impostos', item.month, `R$ ${item.taxes.toFixed(2)}`, item.description]
          ];
        } else {
          return [[item.month, item.type, `R$ ${item.amount.toFixed(2)}`, item.description]];
        }
      }),
      startY: 125 // Start the table below the chart
    });

    doc.save(`relatorio_${reportType}.pdf`);
    toast({
      title: "PDF Exportado",
      description: "O relatório foi exportado com sucesso para PDF.",
    });
  };

  const exportToExcel = () => {
    const tableData = reportData.flatMap((item) => {
      if (reportType === 'general') {
        return [
          { Mês: item.month, 'Tipo de Gasto': 'Manutenção', Valor: item.maintenance, Descrição: item.description },
          { Mês: item.month, 'Tipo de Gasto': 'Combustível', Valor: item.fuel, Descrição: item.description },
          { Mês: item.month, 'Tipo de Gasto': 'Impostos', Valor: item.taxes, Descrição: item.description }
        ];
      } else {
        return [{
          Mês: item.month,
          'Tipo de Gasto': item.type,
          Valor: item.amount,
          Descrição: item.description
        }];
      }
    });

    const ws = XLSX.utils.json_to_sheet(tableData);
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

  const chartRef = useRef(null);

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
              <div ref={chartRef}>
                <ReportChart reportType={selectedReportType} reportData={reportData} />
              </div>
              <ReportTable reportType={selectedReportType} reportData={reportData} />
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
