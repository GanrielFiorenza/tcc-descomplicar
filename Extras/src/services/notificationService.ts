import { db, auth } from "@/config/firebase";
import { collection, addDoc, getDocs, updateDoc, doc, query, where } from "firebase/firestore";
import { format } from "date-fns";

export interface Notification {
  id?: string;
  userId: string;
  date: string;
  description: string;
  status: 'open' | 'closed';
}

export const addNotification = async (description: string, date: string): Promise<void> => {
  const user = auth.currentUser;
  if (!user) throw new Error('User must be logged in to add notification');

  await addDoc(collection(db, "notifications"), {
    userId: user.uid,
    description,
    date,
    status: 'open',
  });
};

export const getOpenNotifications = async (): Promise<Notification[]> => {
  const user = auth.currentUser;
  if (!user) throw new Error('User must be logged in to get notifications');

  const notificationsQuery = query(
    collection(db, "notifications"),
    where("userId", "==", user.uid),
    where("status", "==", "open")
  );

  const querySnapshot = await getDocs(notificationsQuery);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Notification[];
};

export const closeNotification = async (notificationId: string): Promise<void> => {
  const user = auth.currentUser;
  if (!user) throw new Error('User must be logged in to update notification');

  const notificationRef = doc(db, "notifications", notificationId);
  await updateDoc(notificationRef, {
    status: 'closed'
  });
};