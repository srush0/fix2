/**
 * Booking Service
 * 
 * Handles all booking-related operations with Firestore:
 * - Create new bookings
 * - Update booking status
 * - Cancel bookings
 * - Fetch booking details
 * - Real-time booking updates
 */

import { 
  collection, 
  doc, 
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  onSnapshot
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

/**
 * Create a new booking
 * 
 * @param {Object} bookingData - Booking data
 * @param {string} bookingData.customerId - Customer user ID
 * @param {string} bookingData.providerId - Provider ID
 * @param {string} bookingData.serviceType - Service type
 * @param {string} bookingData.description - Problem description
 * @param {string} bookingData.address - Service address
 * @param {string} bookingData.preferredDate - Preferred date
 * @param {string} bookingData.preferredTime - Preferred time
 * @param {string} bookingData.photoUrl - Photo URL (optional)
 * @returns {Promise<Object>} Created booking object with ID
 */
export const createBooking = async (bookingData) => {
  try {
    const bookingsRef = collection(db, 'bookings');
    
    const newBooking = {
      customerId: bookingData.customerId,
      providerId: bookingData.providerId || null,
      serviceType: bookingData.serviceType,
      description: bookingData.description,
      address: bookingData.address,
      preferredDate: bookingData.preferredDate,
      preferredTime: bookingData.preferredTime,
      photoUrl: bookingData.photoUrl || null,
      status: 'pending',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    const docRef = await addDoc(bookingsRef, newBooking);
    
    return {
      id: docRef.id,
      ...newBooking
    };
  } catch (error) {
    console.error('Error creating booking:', error);
    throw new Error('Failed to create booking');
  }
};

/**
 * Get booking by ID
 * 
 * @param {string} bookingId - Booking ID
 * @returns {Promise<Object|null>} Booking object or null
 */
export const getBookingById = async (bookingId) => {
  try {
    const bookingRef = doc(db, 'bookings', bookingId);
    const bookingSnap = await getDoc(bookingRef);
    
    if (bookingSnap.exists()) {
      return {
        id: bookingSnap.id,
        ...bookingSnap.data()
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching booking:', error);
    throw new Error('Failed to fetch booking');
  }
};

/**
 * Get bookings by customer ID
 * 
 * @param {string} customerId - Customer user ID
 * @returns {Promise<Array>} Array of booking objects
 */
export const getBookingsByCustomer = async (customerId) => {
  try {
    const bookingsRef = collection(db, 'bookings');
    const q = query(
      bookingsRef,
      where('customerId', '==', customerId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    
    const bookings = [];
    querySnapshot.forEach((doc) => {
      bookings.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return bookings;
  } catch (error) {
    console.error('Error fetching customer bookings:', error);
    throw new Error('Failed to fetch bookings');
  }
};

/**
 * Get bookings by provider ID
 * 
 * @param {string} providerId - Provider ID
 * @returns {Promise<Array>} Array of booking objects
 */
export const getBookingsByProvider = async (providerId) => {
  try {
    const bookingsRef = collection(db, 'bookings');
    const q = query(
      bookingsRef,
      where('providerId', '==', providerId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    
    const bookings = [];
    querySnapshot.forEach((doc) => {
      bookings.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return bookings;
  } catch (error) {
    console.error('Error fetching provider bookings:', error);
    throw new Error('Failed to fetch bookings');
  }
};

/**
 * Update booking status
 * 
 * @param {string} bookingId - Booking ID
 * @param {string} status - New status (pending, accepted, on_the_way, in_progress, completed, cancelled)
 * @returns {Promise<void>}
 */
export const updateBookingStatus = async (bookingId, status) => {
  try {
    const bookingRef = doc(db, 'bookings', bookingId);
    
    const updateData = {
      status: status,
      updatedAt: serverTimestamp()
    };

    // If status is completed, trigger payment requirement
    if (status === 'completed') {
      updateData.paymentRequired = true;
      updateData.paymentStatus = 'pending';
      updateData.completedAt = serverTimestamp();
    }
    
    await updateDoc(bookingRef, updateData);
  } catch (error) {
    console.error('Error updating booking status:', error);
    throw new Error('Failed to update booking status');
  }
};

/**
 * Cancel booking
 * 
 * @param {string} bookingId - Booking ID
 * @returns {Promise<void>}
 */
export const cancelBooking = async (bookingId) => {
  try {
    const bookingRef = doc(db, 'bookings', bookingId);
    
    await updateDoc(bookingRef, {
      status: 'cancelled',
      cancelledAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error cancelling booking:', error);
    throw new Error('Failed to cancel booking');
  }
};

/**
 * Assign provider to booking (Accept booking)
 * 
 * @param {string} bookingId - Booking ID
 * @param {string} providerId - Provider ID
 * @returns {Promise<void>}
 */
export const assignProvider = async (bookingId, providerId) => {
  try {
    const bookingRef = doc(db, 'bookings', bookingId);
    
    await updateDoc(bookingRef, {
      providerId: providerId,
      status: 'accepted',
      acceptedAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error assigning provider:', error);
    throw new Error('Failed to assign provider');
  }
};

/**
 * Reject booking
 * 
 * @param {string} bookingId - Booking ID
 * @returns {Promise<void>}
 */
export const rejectBooking = async (bookingId) => {
  try {
    const bookingRef = doc(db, 'bookings', bookingId);
    
    await updateDoc(bookingRef, {
      status: 'cancelled',
      rejectedAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error rejecting booking:', error);
    throw new Error('Failed to reject booking');
  }
};

/**
 * Get pending bookings (for provider dashboard)
 * 
 * @returns {Promise<Array>} Array of pending booking objects
 */
export const getPendingBookings = async () => {
  try {
    const bookingsRef = collection(db, 'bookings');
    const q = query(
      bookingsRef,
      where('status', '==', 'pending'),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    
    const bookings = [];
    querySnapshot.forEach((doc) => {
      bookings.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return bookings;
  } catch (error) {
    console.error('Error fetching pending bookings:', error);
    throw new Error('Failed to fetch pending bookings');
  }
};

/**
 * Subscribe to booking updates (real-time)
 * 
 * @param {string} bookingId - Booking ID
 * @param {Function} callback - Callback function to handle updates
 * @returns {Function} Unsubscribe function
 */
export const subscribeToBooking = (bookingId, callback) => {
  try {
    const bookingRef = doc(db, 'bookings', bookingId);
    
    const unsubscribe = onSnapshot(bookingRef, (doc) => {
      if (doc.exists()) {
        callback({
          id: doc.id,
          ...doc.data()
        });
      } else {
        callback(null);
      }
    }, (error) => {
      console.error('Error in booking subscription:', error);
      callback(null);
    });
    
    return unsubscribe;
  } catch (error) {
    console.error('Error subscribing to booking:', error);
    throw new Error('Failed to subscribe to booking');
  }
};

/**
 * Subscribe to customer bookings (real-time)
 * 
 * @param {string} customerId - Customer user ID
 * @param {Function} callback - Callback function to handle updates
 * @returns {Function} Unsubscribe function
 */
export const subscribeToCustomerBookings = (customerId, callback) => {
  try {
    const bookingsRef = collection(db, 'bookings');
    const q = query(
      bookingsRef,
      where('customerId', '==', customerId),
      orderBy('createdAt', 'desc')
    );
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const bookings = [];
      querySnapshot.forEach((doc) => {
        bookings.push({
          id: doc.id,
          ...doc.data()
        });
      });
      callback(bookings);
    }, (error) => {
      console.error('Error in customer bookings subscription:', error);
      callback([]);
    });
    
    return unsubscribe;
  } catch (error) {
    console.error('Error subscribing to customer bookings:', error);
    throw new Error('Failed to subscribe to customer bookings');
  }
};