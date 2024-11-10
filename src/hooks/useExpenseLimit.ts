import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/config/firebase';

export const useExpenseLimit = () => {
  const [expenseLimit, setExpenseLimit] = useState<number>(5000);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchExpenseLimit = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;

        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists() && userDoc.data().expenseLimit) {
          setExpenseLimit(userDoc.data().expenseLimit);
        }
      } catch (error) {
        console.error('Error fetching expense limit:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchExpenseLimit();
  }, []);

  const updateExpenseLimit = async (newLimit: number) => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const userDocRef = doc(db, 'users', user.uid);
      await setDoc(userDocRef, { expenseLimit: newLimit }, { merge: true });
      setExpenseLimit(newLimit);

      return true;
    } catch (error) {
      console.error('Error updating expense limit:', error);
      return false;
    }
  };

  return { expenseLimit, updateExpenseLimit, isLoading };
};