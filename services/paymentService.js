/**
 * Payment Service
 * 
 * Handles all payment-related operations with Firestore:
 * - Create payment records
 * - Process demo payments
 * - Update booking payment status
 * - Get payment history
 */

import { 
  collection,
  doc,
  addDoc,
  getDoc,
  updateDoc,
  query,
  where,
  getDocs,
  serverTimestamp,
  orderBy
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

/**
 * Create a payment record and update booking
 * 
 * @param {Object} paymentData - Payment data
 * @returns {Promise<Object>} Created payment document
 */
export const createPayment = async (paymentData) => {
  try {
    const { bookingId, customerId, providerId, amount } = paymentData;

    // Validate required fields
    if (!bookingId || !customerId || !amount) {
      throw new Error('Missing required payment fields');
    }

    // Create payment document
    const paymentRef = await addDoc(collection(db, 'payments'), {
      bookingId,
      customerId,
      providerId: providerId || null,
      amount: parseFloat(amount),
      status: 'paid',
      paymentMethod: 'demo',
      paidAt: serverTimestamp(),
      createdAt: serverTimestamp()
    });

    // Update booking with payment status
    const bookingRef = doc(db, 'bookings', bookingId);
    await updateDoc(bookingRef, {
      paymentRequired: false,
      paymentStatus: 'paid',
      paymentId: paymentRef.id,
      updatedAt: serverTimestamp()
    });

    // Get the created payment document
    const paymentSnap = await getDoc(paymentRef);
    
    return {
      id: paymentRef.id,
      ...paymentSnap.data()
    };
  } catch (error) {
    console.error('Error creating payment:', error);
    throw new Error(error.message || 'Failed to process payment');
  }
};

/**
 * Get payment by booking ID
 * 
 * @param {string} bookingId - Booking ID
 * @returns {Promise<Object|null>} Payment document or null
 */
export const getPaymentByBookingId = async (bookingId) => {
  try {
    const paymentsRef = collection(db, 'payments');
    const q = query(paymentsRef, where('bookingId', '==', bookingId));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return null;
    }

    const paymentDoc = querySnapshot.docs[0];
    return {
      id: paymentDoc.id,
      ...paymentDoc.data()
    };
  } catch (error) {
    console.error('Error fetching payment:', error);
    throw new Error('Failed to fetch payment');
  }
};

/**
 * Get payment history for a user
 * 
 * @param {string} userId - User ID
 * @param {string} role - User role (customer or provider)
 * @returns {Promise<Array>} Array of payment documents
 */
export const getPaymentHistory = async (userId, role = 'customer') => {
  try {
    const paymentsRef = collection(db, 'payments');
    const field = role === 'customer' ? 'customerId' : 'providerId';
    
    const q = query(
      paymentsRef,
      where(field, '==', userId),
      orderBy('paidAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    
    const payments = [];
    querySnapshot.forEach((doc) => {
      payments.push({
        id: doc.id,
        ...doc.data()
      });
    });

    return payments;
  } catch (error) {
    console.error('Error fetching payment history:', error);
    throw new Error('Failed to fetch payment history');
  }
};

/**
 * Get total earnings for a provider
 * 
 * @param {string} providerId - Provider ID
 * @returns {Promise<number>} Total earnings
 */
export const getProviderEarnings = async (providerId) => {
  try {
    const payments = await getPaymentHistory(providerId, 'provider');
    
    const total = payments.reduce((sum, payment) => {
      return sum + (payment.amount || 0);
    }, 0);

    return total;
  } catch (error) {
    console.error('Error calculating earnings:', error);
    throw new Error('Failed to calculate earnings');
  }
};

/**
 * Get total spending for a customer
 * 
 * @param {string} customerId - Customer ID
 * @returns {Promise<number>} Total spending
 */
export const getCustomerSpending = async (customerId) => {
  try {
    const payments = await getPaymentHistory(customerId, 'customer');
    
    const total = payments.reduce((sum, payment) => {
      return sum + (payment.amount || 0);
    }, 0);

    return total;
  } catch (error) {
    console.error('Error calculating spending:', error);
    throw new Error('Failed to calculate spending');
  }
};

/**
 * Process demo payment (simulates successful payment)
 * 
 * @param {Object} paymentData - Payment data
 * @returns {Promise<Object>} Payment result
 */
export const processDemoPayment = async (paymentData) => {
  try {
    // Simulate payment processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Create payment record
    const payment = await createPayment(paymentData);

    return {
      success: true,
      payment,
      message: 'Payment processed successfully'
    };
  } catch (error) {
    console.error('Error processing demo payment:', error);
    throw new Error(error.message || 'Payment processing failed');
  }
};
