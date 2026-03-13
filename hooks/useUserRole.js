/**
 * useUserRole Hook
 * 
 * React hook for fetching and managing user role from Firestore.
 * Provides role-based routing and access control.
 */

import { useState, useEffect } from 'react';
import { getUserProfile } from '@/services/userService';

/**
 * Hook to fetch user role from Firestore
 * 
 * @param {string} userId - User ID
 * @returns {Object} { role, loading, error }
 */
export const useUserRole = (userId) => {
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRole = async () => {
      if (!userId) {
        setRole(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const profile = await getUserProfile(userId);
        
        if (profile && profile.role) {
          setRole(profile.role);
        } else {
          setRole('customer'); // Default role
        }
      } catch (err) {
        setError(err.message);
        console.error('Error fetching user role:', err);
        setRole('customer'); // Default role on error
      } finally {
        setLoading(false);
      }
    };

    fetchRole();
  }, [userId]);

  return {
    role,
    loading,
    error
  };
};

/**
 * Get dashboard route based on role
 * 
 * @param {string} role - User role
 * @returns {string} Dashboard route
 */
export const getDashboardRouteByRole = (role) => {
  const routes = {
    customer: '/',
    provider: '/provider-dashboard',
    admin: '/admin-dashboard',
    staff: '/staff-dashboard'
  };
  
  return routes[role] || '/';
};