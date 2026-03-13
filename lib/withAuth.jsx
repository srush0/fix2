'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Hook that enforces RBAC. Returns { user, loading }.
 * While loading=true or user is wrong role, the dashboard should render a spinner (not content).
 * Redirects unauthorized users immediately on mount.
 */
export function useRequireAuth(requiredRole = null) {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    if (authLoading) return; // Wait for AuthContext to restore session

    if (!user) {
      router.replace('/login-selector');
      return;
    }

    if (requiredRole && user.role !== requiredRole) {
      // Redirect to their actual dashboard
      const routes = {
        customer: '/customer-dashboard',
        provider: '/provider-dashboard',
        admin: '/admin-dashboard',
        staff: '/staff-dashboard',
      };
      router.replace(routes[user.role] || '/landing');
      return;
    }

    // User is authenticated with the correct role
    setAuthorized(true);
  }, [authLoading, user, requiredRole, router]);

  // loading=true until we know auth state AND have correct role
  const loading = authLoading || !authorized;

  return { user: authorized ? user : null, loading };
}

