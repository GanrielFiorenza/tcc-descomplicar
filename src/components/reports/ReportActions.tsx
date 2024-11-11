import React from 'react';
import { Button } from "@/components/ui/button";
import { Download, Printer } from 'lucide-react';
import { jsPDF } from "jspdf";
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { useToast } from "@/hooks/use-toast";

interface ReportActionsProps {
  reportType: string;
  filteredData: any[];
  onExportPDF: () => void;
  onExportExcel: () => void;
}

export const ReportActions: React.FC<ReportActionsProps> = ({
  onExportPDF,
  onExportExcel
}) => {
  return (
    <div className="flex justify-end space-x-2">
      <Button onClick={onExportPDF} variant="outline">
        <Download className="mr-2 h-4 w-4" />
        Exportar PDF
      </Button>
      <Button onClick={onExportExcel} variant="outline">
        <Download className="mr-2 h-4 w-4" />
        Exportar Excel
      </Button>
      <Button onClick={() => window.print()} variant="outline">
        <Printer className="mr-2 h-4 w-4" />
        Imprimir
      </Button>
    </div>
  );
};