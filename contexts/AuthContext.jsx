'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { loginUser, logoutUser, getSessionUser, getDashboardRoute } from '@/lib/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load session on mount (client-only)
    const session = getSessionUser();
    setUser(session);
    setLoading(false);
  }, []);

  const login = useCallback((role) => {
    const session = loginUser(role);
    setUser(session);
    return session;
  }, []);

  const logout = useCallback(() => {
    logoutUser();
    setUser(null);
  }, []);

  const isAuthenticated = !!user;

  const hasRole = useCallback(
    (role) => user?.role === role,
    [user]
  );

  const dashboardRoute = user ? getDashboardRoute(user.role) : '/landing';

  return (
    <AuthContext.Provider
      value={{ user, login, logout, isAuthenticated, hasRole, dashboardRoute, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
