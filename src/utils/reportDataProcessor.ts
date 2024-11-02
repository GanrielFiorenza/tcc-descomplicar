import { ReportData } from "../services/reportService";
import { Maintenance } from "../types/maintenance";
import { Expense } from "../types/expense";

export interface ProcessedReportData {
  month: string;
  type: string;
  amount: number;
  description: string;
}

export const processReportData = (reportData: ReportData | undefined): ProcessedReportData[] => {
  if (!reportData) return [];

  const processedData: ProcessedReportData[] = [];

  // Process maintenances
  reportData.maintenances.forEach((maintenance: Maintenance) => {
    processedData.push({
      month: maintenance.date.substring(0, 7),
      type: 'Manutenção',
      amount: maintenance.cost,
      description: maintenance.observations
    });
  });

  // Process expenses
  reportData.expenses.forEach((expense: Expense) => {
    processedData.push({
      month: expense.date.substring(0, 7),
      type: expense.category,
      amount: expense.amount,
      description: expense.description
    });
  });

  // Sort by date
  return processedData.sort((a, b) => a.month.localeCompare(b.month));
};

export const filterReportData = (data: ProcessedReportData[], reportType: string): ProcessedReportData[] => {
  if (reportType === 'all') return data;

  return data.filter(item => {
    switch (reportType) {
      case 'maintenance':
        return item.type === 'Manutenção';
      case 'fuel':
        return item.type === 'Combustível';
      case 'taxes':
        return item.type === 'Impostos';
      case 'others':
        return !['Manutenção', 'Combustível', 'Impostos'].includes(item.type);
      default:
        return true;
    }
  });
};