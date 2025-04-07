// src/context/TransactionContext.tsx
import React, { createContext, useContext, useState } from 'react';

interface Transaction {
  id: string;
  name: string;
  amount: number;
  type: string;
  date: string;
  category?: string;
}

interface TransactionContextType {
  monthlyTransactions: Transaction[];
  setMonthlyTransactions: (transactions: Transaction[]) => void;
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

export const TransactionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [monthlyTransactions, setMonthlyTransactions] = useState<Transaction[]>([]);

  return (
    <TransactionContext.Provider value={{ monthlyTransactions, setMonthlyTransactions }}>
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransactions = (): TransactionContextType => {
  const context = useContext(TransactionContext);
  return (
    context || {
      monthlyTransactions: [],
      setMonthlyTransactions: () => {},
    }
  );
};