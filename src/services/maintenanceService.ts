import { db, auth } from "@/config/firebase";
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, query, where, orderBy, Timestamp } from "firebase/firestore";
import { Maintenance } from '../types/maintenance';
import { subMonths, subYears, startOfDay, endOfDay } from 'date-fns';

export interface MaintenanceData extends Omit<Maintenance, 'id'> {
  userId: string;
  vehicleId: string;
  date: string;
  serviceType: string;
  cost: number;
  observations: string;
}

export const addMaintenance = async (maintenance: Omit<MaintenanceData, 'userId'>) => {
  const user = auth.currentUser;
  if (!user) throw new Error('User must be logged in to add maintenance');

  const maintenanceWithUser = {
    ...maintenance,
    userId: user.uid,
  };

  const docRef = await addDoc(collection(db, "maintenances"), maintenanceWithUser);
  return {
    id: docRef.id,
    ...maintenanceWithUser
  };
};

export const getUserMaintenances = async (period?: string, startDate?: Date, endDate?: Date): Promise<Maintenance[]> => {
  const user = auth.currentUser;
  if (!user) throw new Error('User must be logged in to get maintenances');

  let startDateFilter: Date;
  let endDateFilter: Date = endOfDay(new Date());

  switch (period) {
    case '1year':
      startDateFilter = startOfDay(subYears(new Date(), 1));
      break;
    case '6months':
      startDateFilter = startOfDay(subMonths(new Date(), 6));
      break;
    case '1month':
      startDateFilter = startOfDay(subMonths(new Date(), 1));
      break;
    case 'custom':
      if (startDate && endDate) {
        startDateFilter = startOfDay(startDate);
        endDateFilter = endOfDay(endDate);
      } else {
        startDateFilter = startOfDay(subYears(new Date(), 100)); // If no date range specified, show all
      }
      break;
    default:
      startDateFilter = startOfDay(subYears(new Date(), 100)); // Show all by default
  }

  const maintenancesQuery = query(
    collection(db, "maintenances"),
    where("userId", "==", user.uid),
    where("date", ">=", startDateFilter.toISOString()),
    where("date", "<=", endDateFilter.toISOString()),
    orderBy("date", "desc")
  );

  const querySnapshot = await getDocs(maintenancesQuery);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Maintenance[];
};

export const updateMaintenance = async (maintenance: Maintenance) => {
  const user = auth.currentUser;
  if (!user) throw new Error('User must be logged in to update maintenance');
  if (maintenance.userId !== user.uid) throw new Error('Unauthorized to update this maintenance');

  const { id, ...updateData } = maintenance;
  const maintenanceRef = doc(db, "maintenances", id);
  await updateDoc(maintenanceRef, updateData);
  return maintenance;
};

export const deleteMaintenance = async (maintenanceId: string) => {
  const user = auth.currentUser;
  if (!user) throw new Error('User must be logged in to delete maintenance');

  const maintenanceRef = doc(db, "maintenances", maintenanceId);
  await deleteDoc(maintenanceRef);
};