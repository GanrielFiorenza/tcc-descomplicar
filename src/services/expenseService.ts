import { db, auth } from "@/config/firebase";
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, query, where } from "firebase/firestore";

export interface Expense {
  id: string;
  vehicleId: string;
  userId: string;
  date: string;
  category: string;
  amount: number;
  description: string;
}

export const addExpense = async (expense: Omit<Expense, 'id' | 'userId'>) => {
  const user = auth.currentUser;
  if (!user) throw new Error('User must be logged in to add an expense');

  const expenseWithUser = {
    ...expense,
    userId: user.uid,
  };

  const docRef = await addDoc(collection(db, "expenses"), expenseWithUser);
  return {
    id: docRef.id,
    ...expenseWithUser
  };
};

export const getUserExpenses = async () => {
  const user = auth.currentUser;
  if (!user) throw new Error('User must be logged in to get expenses');

  const expensesQuery = query(
    collection(db, "expenses"),
    where("userId", "==", user.uid)
  );

  const querySnapshot = await getDocs(expensesQuery);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Expense[];
};

export const updateExpense = async (expense: Expense) => {
  const user = auth.currentUser;
  if (!user) throw new Error('User must be logged in to update an expense');
  if (expense.userId !== user.uid) throw new Error('Unauthorized to update this expense');

  const { id, ...updateData } = expense;
  const expenseRef = doc(db, "expenses", id);
  await updateDoc(expenseRef, updateData);
  return expense;
};

export const deleteExpense = async (expenseId: string) => {
  const user = auth.currentUser;
  if (!user) throw new Error('User must be logged in to delete an expense');

  const expenseRef = doc(db, "expenses", expenseId);
  await deleteDoc(expenseRef);
};