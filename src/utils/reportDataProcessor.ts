import { ReportData } from "../services/reportService";
import { Maintenance } from "../types/maintenance";
import { Expense } from "../types/expense";

export interface ProcessedReportData {
  month: string;
  maintenance: number;
  fuel: number;
  taxes: number;
  others: number;
  description: string;
}

export const processReportData = (reportData: ReportData | undefined): ProcessedReportData[] => {
  if (!reportData) return [];

  const monthlyData = new Map<string, ProcessedReportData>();

  // Process maintenances
  reportData.maintenances.forEach((maintenance: Maintenance) => {
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
  reportData.expenses.forEach((expense: Expense) => {
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

export const filterReportData = (data: ProcessedReportData[], reportType: string): ProcessedReportData[] => {
  if (reportType === 'all') return data;

  return data.map(item => {
    const filtered = { ...item };
    const numericKeys = ['maintenance', 'fuel', 'taxes', 'others'] as const;
    
    numericKeys.forEach(key => {
      if (key !== reportType) {
        filtered[key] = 0;
      }
    });
    
    return filtered;
  });
};