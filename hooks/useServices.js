/**
 * useServices Hook
 * 
 * React hook for fetching and managing service data from Firestore.
 * Provides loading states and error handling.
 */

import { useState, useEffect } from 'react';
import { 
  getAllServices,
  getServiceById,
  getActiveServices
} from '@/services/serviceService';

/**
 * Hook to fetch all services
 * 
 * @returns {Object} { services, loading, error, refetch }
 */
export const useServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchServices = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllServices();
      setServices(data);
    } catch (err) {
      setError(err.message);
      console.error('Error in useServices:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  return {
    services,
    loading,
    error,
    refetch: fetchServices
  };
};

/**
 * Hook to fetch active services only
 * 
 * @returns {Object} { services, loading, error, refetch }
 */
export const useActiveServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchServices = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getActiveServices();
      setServices(data);
    } catch (err) {
      setError(err.message);
      console.error('Error in useActiveServices:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  return {
    services,
    loading,
    error,
    refetch: fetchServices
  };
};

/**
 * Hook to fetch a single service by ID
 * 
 * @param {string} serviceId - Service ID
 * @returns {Object} { service, loading, error, refetch }
 */
export const useService = (serviceId) => {
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchService = async () => {
    if (!serviceId) {
      setService(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await getServiceById(serviceId);
      setService(data);
    } catch (err) {
      setError(err.message);
      console.error('Error in useService:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchService();
  }, [serviceId]);

  return {
    service,
    loading,
    error,
    refetch: fetchService
  };
};