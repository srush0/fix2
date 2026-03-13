/**
 * useProviders Hook
 * 
 * React hook for fetching and managing provider data from Firestore.
 * Provides loading states and error handling.
 */

import { useState, useEffect } from 'react';
import { 
  getAllProviders, 
  getProvidersByService,
  getProviderById,
  getAvailableProviders,
  getTopRatedProviders
} from '@/services/providerService';

/**
 * Hook to fetch all providers
 * 
 * @returns {Object} { providers, loading, error, refetch }
 */
export const useProviders = () => {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProviders = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllProviders();
      setProviders(data);
    } catch (err) {
      setError(err.message);
      console.error('Error in useProviders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProviders();
  }, []);

  return {
    providers,
    loading,
    error,
    refetch: fetchProviders
  };
};

/**
 * Hook to fetch providers by service type
 * 
 * @param {string} serviceType - Service type to filter by
 * @returns {Object} { providers, loading, error, refetch }
 */
export const useProvidersByService = (serviceType) => {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProviders = async () => {
    if (!serviceType) {
      setProviders([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await getProvidersByService(serviceType);
      setProviders(data);
    } catch (err) {
      setError(err.message);
      console.error('Error in useProvidersByService:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProviders();
  }, [serviceType]);

  return {
    providers,
    loading,
    error,
    refetch: fetchProviders
  };
};

/**
 * Hook to fetch a single provider by ID
 * 
 * @param {string} providerId - Provider ID
 * @returns {Object} { provider, loading, error, refetch }
 */
export const useProvider = (providerId) => {
  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProvider = async () => {
    if (!providerId) {
      setProvider(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await getProviderById(providerId);
      setProvider(data);
    } catch (err) {
      setError(err.message);
      console.error('Error in useProvider:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProvider();
  }, [providerId]);

  return {
    provider,
    loading,
    error,
    refetch: fetchProvider
  };
};

/**
 * Hook to fetch available providers by service type
 * 
 * @param {string} serviceType - Service type to filter by
 * @returns {Object} { providers, loading, error, refetch }
 */
export const useAvailableProviders = (serviceType) => {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProviders = async () => {
    if (!serviceType) {
      setProviders([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await getAvailableProviders(serviceType);
      setProviders(data);
    } catch (err) {
      setError(err.message);
      console.error('Error in useAvailableProviders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProviders();
  }, [serviceType]);

  return {
    providers,
    loading,
    error,
    refetch: fetchProviders
  };
};

/**
 * Hook to fetch top-rated providers
 * 
 * @param {number} limit - Number of providers to fetch
 * @returns {Object} { providers, loading, error, refetch }
 */
export const useTopRatedProviders = (limit = 5) => {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProviders = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getTopRatedProviders(limit);
      setProviders(data);
    } catch (err) {
      setError(err.message);
      console.error('Error in useTopRatedProviders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProviders();
  }, [limit]);

  return {
    providers,
    loading,
    error,
    refetch: fetchProviders
  };
};