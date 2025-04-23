
import React, { createContext, useContext, useState, ReactNode } from 'react';

// Dummy context data (we don't use Supabase anymore)
type UserRole = 'patient' | 'doctor' | null;

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  profilePicture?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  userRole: UserRole;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Always use a default dummy user: patient role for all
const DUMMY_USER: User = {
  id: 'demo',
  name: 'John Doe',
  email: 'john@demo.com',
  role: 'patient',
  profilePicture: undefined
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // Always authenticated.
  const value = {
    user: DUMMY_USER,
    isAuthenticated: true,
    userRole: DUMMY_USER.role,
    login: async () => {},
    logout: () => {},
    isLoading: false,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
