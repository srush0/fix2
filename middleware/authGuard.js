/**
 * Authentication Guard Middleware
 * 
 * Protects routes by checking for valid JWT token.
 * Redirects unauthenticated users to login page.
 * 
 * Usage:
 * - Wrap protected components with this HOC
 * - Or use in Next.js middleware for route protection
 */

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getStoredToken } from '@/services/authService';

/**
 * Higher-Order Component for route protection
 * 
 * @param {React.Component} Component - Component to protect
 * @returns {React.Component} Protected component
 */
export const withAuthGuard = (Component) => {
  return function ProtectedRoute(props) {
    const router = useRouter();

    useEffect(() => {
      // Check if JWT token exists in localStorage
      const token = getStoredToken();

      if (!token) {
        // No token found - redirect to login
        router.push('/login');
      }
    }, [router]);

    // Render component if authenticated
    return <Component {...props} />;
  };
};

/**
 * Check authentication status
 * 
 * @returns {boolean} True if user has valid token
 */
export const isAuthenticated = () => {
  if (typeof window === 'undefined') return false;
  
  const token = getStoredToken();
  return !!token;
};

/**
 * Redirect to login if not authenticated
 * 
 * Use this in page components or useEffect hooks
 */
export const requireAuth = (router) => {
  const token = getStoredToken();
  
  if (!token) {
    router.push('/login');
    return false;
  }
  
  return true;
};
