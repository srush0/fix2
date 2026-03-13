/**
 * useAuth Hook
 * 
 * React hook for managing authentication state and operations.
 * Provides:
 * - Current user state with role from Firestore
 * - Loading state
 * - Login/logout functions
 * - Automatic auth state synchronization
 */

import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { loginWithGoogle, logoutUser, getStoredToken, getUserData } from '@/services/authService';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Listen to Firebase auth state changes
    // This automatically handles:
    // - User login
    // - User logout
    // - Token refresh
    // - Session restoration on page reload
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // User is signed in
        try {
          // Get fresh JWT token
          const token = await firebaseUser.getIdToken();
          
          // Update localStorage with fresh token
          localStorage.setItem('fixoo_token', token);

          // Get user data from Firestore (includes role)
          const userData = await getUserData(firebaseUser.uid);

          if (userData) {
            // Set user state with Firestore data
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName || userData.name,
              photoURL: firebaseUser.photoURL || userData.photoURL,
              token: token,
              role: userData.role || 'customer'
            });
          } else {
            // Fallback if Firestore data not found
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName,
              photoURL: firebaseUser.photoURL,
              token: token,
              role: 'customer'
            });
          }
        } catch (err) {
          console.error('Error getting user data:', err);
          setError(err.message);
        }
      } else {
        // User is signed out
        setUser(null);
        localStorage.removeItem('fixoo_token');
      }
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  /**
   * Login with Google and assign role
   * 
   * @param {string} role - User role (customer, provider, admin, staff)
   */
  const login = async (role = 'customer') => {
    try {
      setError(null);
      setLoading(true);
      const userData = await loginWithGoogle(role);
      setUser(userData);
      return userData;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Logout user
   */
  const logout = async () => {
    try {
      setError(null);
      await logoutUser();
      setUser(null);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  /**
   * Check if user is authenticated
   */
  const isAuthenticated = () => {
    return !!user && !!getStoredToken();
  };

  /**
   * Check if user has specific role
   */
  const hasRole = (role) => {
    return user?.role === role;
  };

  return {
    user,
    loading,
    error,
    login,
    logout,
    isAuthenticated,
    hasRole
  };
};
