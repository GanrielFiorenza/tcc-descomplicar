import { db, auth } from "@/config/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { Maintenance } from "../types/maintenance";
import { Expense } from "../types/expense";

export interface ReportData {
  maintenances: Maintenance[];
  expenses: Expense[];
}

export const getReportData = async (
  vehicleId: string | null = null,
  startDate: Date | null = null,
  endDate: Date | null = null
): Promise<ReportData> => {
  const user = auth.currentUser;
  if (!user) throw new Error('User must be logged in to get report data');

  // Build maintenance query
  let maintenanceQuery = query(
    collection(db, "maintenances"),
    where("userId", "==", user.uid)
  );

  if (vehicleId) {
    maintenanceQuery = query(maintenanceQuery, where("vehicleId", "==", vehicleId));
  }

  // Get maintenance data
  const maintenanceSnapshot = await getDocs(maintenanceQuery);
  let maintenances = maintenanceSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Maintenance[];

  // Build expenses query
  let expensesQuery = query(
    collection(db, "expenses"),
    where("userId", "==", user.uid)
  );

  if (vehicleId) {
    expensesQuery = query(expensesQuery, where("vehicleId", "==", vehicleId));
  }

  // Get expenses data
  const expenseSnapshot = await getDocs(expensesQuery);
  let expenses = expenseSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Expense[];

  // Apply date filters if provided
  if (startDate) {
    maintenances = maintenances.filter(m => new Date(m.date) >= startDate);
    expenses = expenses.filter(e => new Date(e.date) >= startDate);
  }

  if (endDate) {
    maintenances = maintenances.filter(m => new Date(m.date) <= endDate);
    expenses = expenses.filter(e => new Date(e.date) <= endDate);
  }

  return { maintenances, expenses };
};