/**
 * useBooking Hook
 * 
 * React hook for managing booking data from Firestore.
 * Provides real-time updates, loading states, and error handling.
 */

import { useState, useEffect } from 'react';
import { 
  createBooking,
  getBookingById,
  getBookingsByCustomer,
  getBookingsByProvider,
  updateBookingStatus,
  cancelBooking,
  assignProvider,
  subscribeToBooking,
  subscribeToCustomerBookings
} from '@/services/bookingService';

/**
 * Hook to fetch a single booking by ID with real-time updates
 * 
 * @param {string} bookingId - Booking ID
 * @param {boolean} realtime - Enable real-time updates (default: true)
 * @returns {Object} { booking, loading, error, refetch, updateStatus, cancel }
 */
export const useBooking = (bookingId, realtime = true) => {
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!bookingId) {
      setBooking(null);
      setLoading(false);
      return;
    }

    if (realtime) {
      // Subscribe to real-time updates
      const unsubscribe = subscribeToBooking(bookingId, (data) => {
        setBooking(data);
        setLoading(false);
        if (!data) {
          setError('Booking not found');
        }
      });

      return () => unsubscribe();
    } else {
      // Fetch once
      const fetchBooking = async () => {
        try {
          setLoading(true);
          setError(null);
          const data = await getBookingById(bookingId);
          setBooking(data);
          if (!data) {
            setError('Booking not found');
          }
        } catch (err) {
          setError(err.message);
          console.error('Error in useBooking:', err);
        } finally {
          setLoading(false);
        }
      };

      fetchBooking();
    }
  }, [bookingId, realtime]);

  const updateStatus = async (status) => {
    try {
      await updateBookingStatus(bookingId, status);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const cancel = async () => {
    try {
      await cancelBooking(bookingId);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const refetch = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getBookingById(bookingId);
      setBooking(data);
    } catch (err) {
      setError(err.message);
      console.error('Error refetching booking:', err);
    } finally {
      setLoading(false);
    }
  };

  return {
    booking,
    loading,
    error,
    refetch,
    updateStatus,
    cancel
  };
};

/**
 * Hook to fetch customer bookings with real-time updates
 * 
 * @param {string} customerId - Customer user ID
 * @param {boolean} realtime - Enable real-time updates (default: true)
 * @returns {Object} { bookings, loading, error, refetch }
 */
export const useCustomerBookings = (customerId, realtime = true) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!customerId) {
      setBookings([]);
      setLoading(false);
      return;
    }

    if (realtime) {
      // Subscribe to real-time updates
      const unsubscribe = subscribeToCustomerBookings(customerId, (data) => {
        setBookings(data);
        setLoading(false);
      });

      return () => unsubscribe();
    } else {
      // Fetch once
      const fetchBookings = async () => {
        try {
          setLoading(true);
          setError(null);
          const data = await getBookingsByCustomer(customerId);
          setBookings(data);
        } catch (err) {
          setError(err.message);
          console.error('Error in useCustomerBookings:', err);
        } finally {
          setLoading(false);
        }
      };

      fetchBookings();
    }
  }, [customerId, realtime]);

  const refetch = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getBookingsByCustomer(customerId);
      setBookings(data);
    } catch (err) {
      setError(err.message);
      console.error('Error refetching bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  return {
    bookings,
    loading,
    error,
    refetch
  };
};

/**
 * Hook to fetch provider bookings
 * 
 * @param {string} providerId - Provider ID
 * @returns {Object} { bookings, loading, error, refetch }
 */
export const useProviderBookings = (providerId) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBookings = async () => {
    if (!providerId) {
      setBookings([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await getBookingsByProvider(providerId);
      setBookings(data);
    } catch (err) {
      setError(err.message);
      console.error('Error in useProviderBookings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [providerId]);

  return {
    bookings,
    loading,
    error,
    refetch: fetchBookings
  };
};

/**
 * Hook to create a new booking
 * 
 * @returns {Object} { createNewBooking, loading, error }
 */
export const useCreateBooking = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createNewBooking = async (bookingData) => {
    try {
      setLoading(true);
      setError(null);
      const booking = await createBooking(bookingData);
      return booking;
    } catch (err) {
      setError(err.message);
      console.error('Error creating booking:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    createNewBooking,
    loading,
    error
  };
};