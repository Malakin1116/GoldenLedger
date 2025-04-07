// src/context/UserContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { getCurrentUser } from '../api/userApi';

interface User {
  id: string;
  name: string;
  budget: number;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  fetchUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const fetchUser = async () => {
    try {
      const userData = await getCurrentUser();
      setUser({
        id: userData._id,
        name: userData.name || '',
        budget: userData.budget || 0,
      });
    } catch (error) {
      console.error('Failed to fetch user:', error);
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser, fetchUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within a UserProvider');
  return context;
};