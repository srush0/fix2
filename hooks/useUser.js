/**
 * useUser Hook
 * 
 * React hook for managing user profile data from Firestore.
 * Provides loading states and error handling.
 */

import { useState, useEffect } from 'react';
import { 
  getUserProfile,
  updateUserProfile,
  getUserBookingStats
} from '@/services/userService';

/**
 * Hook to fetch user profile
 * 
 * @param {string} userId - User ID
 * @returns {Object} { profile, loading, error, refetch, updateProfile }
 */
export const useUserProfile = (userId) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProfile = async () => {
    if (!userId) {
      setProfile(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await getUserProfile(userId);
      setProfile(data);
    } catch (err) {
      setError(err.message);
      console.error('Error in useUserProfile:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [userId]);

  const updateProfile = async (updates) => {
    try {
      setError(null);
      await updateUserProfile(userId, updates);
      await fetchProfile(); // Refresh profile
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return {
    profile,
    loading,
    error,
    refetch: fetchProfile,
    updateProfile
  };
};

/**
 * Hook to fetch user booking statistics
 * 
 * @param {string} userId - User ID
 * @param {string} role - User role (customer or provider)
 * @returns {Object} { stats, loading, error, refetch }
 */
export const useUserStats = (userId, role = 'customer') => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    if (!userId) {
      setStats(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await getUserBookingStats(userId, role);
      setStats(data);
    } catch (err) {
      setError(err.message);
      console.error('Error in useUserStats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [userId, role]);

  return {
    stats,
    loading,
    error,
    refetch: fetchStats
  };
};