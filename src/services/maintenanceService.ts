import { db, auth } from "@/config/firebase";
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, query, where } from "firebase/firestore";
import { Maintenance } from '../types/maintenance';

export interface MaintenanceData extends Omit<Maintenance, 'id'> {
  userId: string;
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

export const getUserMaintenances = async () => {
  const user = auth.currentUser;
  if (!user) throw new Error('User must be logged in to get maintenances');

  const maintenancesQuery = query(
    collection(db, "maintenances"),
    where("userId", "==", user.uid)
  );

  const querySnapshot = await getDocs(maintenancesQuery);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as MaintenanceData[];
};

export const updateMaintenance = async (maintenance: MaintenanceData & { id: string }) => {
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