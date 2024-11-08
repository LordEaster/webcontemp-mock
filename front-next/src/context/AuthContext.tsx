// context/AuthContext.tsx
'use client';

import { createContext, useState, useEffect, ReactNode } from 'react';
import apiClient from '../lib/apiClient';

interface AuthContextType {
  token: string | null;
  userId: number | null;
  login: (token: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    // Load token and userId from localStorage on mount
    const storedToken = localStorage.getItem('token');
    const storedUserId = localStorage.getItem('userId');
    if (storedToken) {
      setToken(storedToken);
      setUserId(Number(storedUserId));
    }
  }, []);

  const login = (token: string) => {
    setToken(token);
    localStorage.setItem('token', token);

    // Decode JWT to get userId
    const payload = JSON.parse(atob(token.split('.')[1]));
    setUserId(payload.userId);
    localStorage.setItem('userId', payload.userId);
  };

  const logout = () => {
    setToken(null);
    setUserId(null);
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
  };

  // Set the Authorization header for all requests
  if (token) {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common['Authorization'];
  }

  return (
    <AuthContext.Provider value={{ token, userId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};