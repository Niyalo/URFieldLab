'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { SessionData } from '@/lib/session';

interface AuthContextType {
  user: SessionData | null;
  isLoading: boolean;
  login: (login_name: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  signup: (formData: FormData) => Promise<{ success: boolean; message?: string; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for an active session when the app loads
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/auth/user');
        if (res.ok) {
          const userData = await res.json();
          setUser(userData);
        }
      } catch (error) {
        console.error("Failed to fetch user session", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, []);

  const signup = async (formData: FormData) => {
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      body: formData, // Send FormData directly, no Content-Type header needed
    });
    const data = await res.json();
    if (res.ok) {
      return { success: true, message: data.message };
    }
    return { success: false, error: data.message || 'An unknown error occurred.' };
  };

  const login = async (login_name: string, password: string) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ login_name, password }),
    });
    const data = await res.json();
    if (res.ok) {
      setUser(data);
      return { success: true };
    }
    // On failure, return an object with the error message
    return { success: false, error: data.message || 'An unknown error occurred.' };
  };

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
  };

  const value = { user, isLoading, login, logout, signup };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}