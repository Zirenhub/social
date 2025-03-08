'use client';

import { createContext, useContext } from 'react';
import { SessionUser } from '@/types/api';

type UserContextType = {
  user: SessionUser | null;
};

export const UserContext = createContext<UserContextType>({ user: null });

export function useUser() {
  const context = useContext(UserContext);
  if (!context.user) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context.user;
}
