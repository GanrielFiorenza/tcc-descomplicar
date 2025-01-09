import { db, auth } from "@/config/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { format, isWithinInterval, subDays, addDays } from "date-fns";
import { Notification } from "./notificationService";

const checkAndSendNotificationEmails = async () => {
  const user = auth.currentUser;
  if (!user) return;

  const notificationsRef = collection(db, "notifications");
  const q = query(
    notificationsRef,
    where("userId", "==", user.uid),
    where("status", "==", "open")
  );

  const querySnapshot = await getDocs(q);
  const today = new Date();

  querySnapshot.forEach((doc) => {
    const notification = doc.data() as Notification;
    const notificationDate = new Date(notification.date);
    
    // Verifica se a data da notificação é amanhã
    const tomorrow = addDays(today, 1);
    if (format(notificationDate, 'yyyy-MM-dd') === format(tomorrow, 'yyyy-MM-dd')) {
      sendNotificationEmail(user.email!, notification);
    }
  });
};

const sendNotificationEmail = async (userEmail: string, notification: Notification) => {
  try {
    // Aqui você implementaria a lógica de envio de e-mail
    // Pode ser usando um serviço como SendGrid, Amazon SES, ou similar
    console.log(`Email would be sent to ${userEmail} about notification: ${notification.description}`);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

export { checkAndSendNotificationEmails };