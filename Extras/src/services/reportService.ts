import { db, auth } from "@/config/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { Maintenance } from "../types/maintenance";
import { Expense } from "../types/expense";

export interface ReportData {
  maintenances: Maintenance[];
  expenses: Expense[];
}

export const getReportData = async (): Promise<ReportData> => {
  const user = auth.currentUser;
  if (!user) throw new Error('User must be logged in to get report data');

  // Get maintenance data
  const maintenancesQuery = query(
    collection(db, "maintenances"),
    where("userId", "==", user.uid)
  );
  const maintenanceSnapshot = await getDocs(maintenancesQuery);
  const maintenances = maintenanceSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Maintenance[];

  // Get expenses data
  const expensesQuery = query(
    collection(db, "expenses"),
    where("userId", "==", user.uid)
  );
  const expenseSnapshot = await getDocs(expensesQuery);
  const expenses = expenseSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Expense[];

  return { maintenances, expenses };
};