'use client';

/**
 * Auth Context Provider
 * 
 * Provides authentication state and functions throughout the app.
 * Integrates with Firebase Authentication, Firestore, and JWT token management.
 */

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { loginWithGoogle, logoutUser as firebaseLogout, getUserData } from '@/services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Subscribe to Firebase auth state changes
    // This handles automatic session restoration and JWT token refresh
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // User is authenticated - get fresh JWT token and user data from Firestore
        try {
          const token = await firebaseUser.getIdToken();
          
          // Store token in localStorage
          localStorage.setItem('fixoo_token', token);

          // Create or update user in Firestore and get role
          const { createOrUpdateUser } = await import('@/services/userService');
          const role = await createOrUpdateUser(firebaseUser);

          // Update user state with Firestore data
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
            token: token,
            role: role
          });
        } catch (error) {
          console.error('Error getting user data:', error);
          setUser(null);
        }
      } else {
        // User is not authenticated
        setUser(null);
        localStorage.removeItem('fixoo_token');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  /**
   * Login with Google OAuth and assign role
   */
  const login = useCallback(async (role = 'customer') => {
    try {
      const userData = await loginWithGoogle(role);
      setUser(userData);
      return userData;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }, []);

  /**
   * Logout user
   */
  const logout = useCallback(async () => {
    try {
      await firebaseLogout();
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }, []);

  const isAuthenticated = !!user;

  const hasRole = useCallback(
    (role) => user?.role === role,
    [user]
  );

  const dashboardRoute = user ? getDashboardRoute(user.role) : '/login-selector';

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

/**
 * Get dashboard route based on user role
 */
function getDashboardRoute(role) {
  const routes = {
    customer: '/',
    provider: '/provider-dashboard',
    admin: '/admin-dashboard',
    staff: '/staff-dashboard'
  };
  return routes[role] || '/';
}
