/**
 * usePayment Hook
 * 
 * React hooks for payment operations:
 * - Process payments
 * - Get payment history
 * - Get payment by booking ID
 */

import { useState, useEffect } from 'react';
import {
  processDemoPayment,
  getPaymentByBookingId,
  getPaymentHistory,
  getProviderEarnings,
  getCustomerSpending
} from '@/services/paymentService';

/**
 * Hook to process a payment
 * 
 * @returns {Object} { processPayment, loading, error }
 */
export const useProcessPayment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const processPayment = async (paymentData) => {
    try {
      setLoading(true);
      setError(null);
      const result = await processDemoPayment(paymentData);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    processPayment,
    loading,
    error
  };
};

/**
 * Hook to get payment by booking ID
 * 
 * @param {string} bookingId - Booking ID
 * @returns {Object} { payment, loading, error }
 */
export const usePaymentByBooking = (bookingId) => {
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPayment = async () => {
      if (!bookingId) {
        setPayment(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const paymentData = await getPaymentByBookingId(bookingId);
        setPayment(paymentData);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching payment:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPayment();
  }, [bookingId]);

  return {
    payment,
    loading,
    error
  };
};

/**
 * Hook to get payment history
 * 
 * @param {string} userId - User ID
 * @param {string} role - User role (customer or provider)
 * @returns {Object} { payments, loading, error, refresh }
 */
export const usePaymentHistory = (userId, role = 'customer') => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPayments = async () => {
    if (!userId) {
      setPayments([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const paymentData = await getPaymentHistory(userId, role);
      setPayments(paymentData);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching payment history:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [userId, role]);

  return {
    payments,
    loading,
    error,
    refresh: fetchPayments
  };
};

/**
 * Hook to get provider earnings
 * 
 * @param {string} providerId - Provider ID
 * @returns {Object} { earnings, loading, error, refresh }
 */
export const useProviderEarnings = (providerId) => {
  const [earnings, setEarnings] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEarnings = async () => {
    if (!providerId) {
      setEarnings(0);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const total = await getProviderEarnings(providerId);
      setEarnings(total);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching provider earnings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEarnings();
  }, [providerId]);

  return {
    earnings,
    loading,
    error,
    refresh: fetchEarnings
  };
};

/**
 * Hook to get customer spending
 * 
 * @param {string} customerId - Customer ID
 * @returns {Object} { spending, loading, error, refresh }
 */
export const useCustomerSpending = (customerId) => {
  const [spending, setSpending] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSpending = async () => {
    if (!customerId) {
      setSpending(0);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const total = await getCustomerSpending(customerId);
      setSpending(total);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching customer spending:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSpending();
  }, [customerId]);

  return {
    spending,
    loading,
    error,
    refresh: fetchSpending
  };
};
