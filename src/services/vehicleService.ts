import { db, auth } from "@/config/firebase";
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, query, where } from "firebase/firestore";

export interface Vehicle {
  id: string;
  brand: string;
  model: string;
  year: string;
  mileage: string;
  plate: string;
  userId: string;
}

export const addVehicle = async (vehicle: Omit<Vehicle, 'id' | 'userId'>) => {
  const user = auth.currentUser;
  if (!user) throw new Error('User must be logged in to add a vehicle');

  const vehicleWithUser = {
    ...vehicle,
    userId: user.uid,
  };

  const docRef = await addDoc(collection(db, "vehicles"), vehicleWithUser);
  return {
    id: docRef.id,
    ...vehicleWithUser
  };
};

export const getUserVehicles = async () => {
  const user = auth.currentUser;
  if (!user) throw new Error('User must be logged in to get vehicles');

  const vehiclesQuery = query(
    collection(db, "vehicles"),
    where("userId", "==", user.uid)
  );

  const querySnapshot = await getDocs(vehiclesQuery);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Vehicle[];
};

export const updateVehicle = async (vehicle: Vehicle) => {
  const user = auth.currentUser;
  if (!user) throw new Error('User must be logged in to update a vehicle');
  if (vehicle.userId !== user.uid) throw new Error('Unauthorized to update this vehicle');

  const vehicleRef = doc(db, "vehicles", vehicle.id);
  await updateDoc(vehicleRef, vehicle);
  return vehicle;
};

export const deleteVehicle = async (vehicleId: string) => {
  const user = auth.currentUser;
  if (!user) throw new Error('User must be logged in to delete a vehicle');

  const vehicleRef = doc(db, "vehicles", vehicleId);
  await deleteDoc(vehicleRef);
};