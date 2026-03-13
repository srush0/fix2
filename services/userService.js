/**
 * User Service
 * 
 * Handles all user-related operations with Firestore:
 * - Get user profile
 * - Update user profile
 * - Get user statistics
 * - Create or update user with role assignment
 */

import { 
  doc, 
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
  collection,
  query,
  where,
  getDocs
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

/**
 * Determine user role based on email
 * 
 * @param {string} email - User email
 * @returns {string} Role (customer, provider, admin, staff)
 */
const determineRoleFromEmail = (email) => {
  if (!email) return 'customer';
  
  const emailLower = email.toLowerCase();
  
  // Special provider email
  if (emailLower === 'echiesta-techsupport@eitfaridabad.co.in') {
    return 'provider';
  }
  
  // Add more special email rules here if needed
  // Example: admin emails
  // if (emailLower.endsWith('@admin.fixoo.com')) {
  //   return 'admin';
  // }
  
  // Default role
  return 'customer';
};

/**
 * Create or update user document in Firestore
 * 
 * @param {Object} firebaseUser - Firebase user object
 * @returns {Promise<string>} User role
 */
export const createOrUpdateUser = async (firebaseUser) => {
  try {
    const userRef = doc(db, 'users', firebaseUser.uid);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      // User exists - return existing role
      const userData = userSnap.data();
      return userData.role || 'customer';
    } else {
      // User doesn't exist - create new document with role based on email
      const role = determineRoleFromEmail(firebaseUser.email);
      
      await setDoc(userRef, {
        uid: firebaseUser.uid,
        name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
        email: firebaseUser.email,
        photoURL: firebaseUser.photoURL || '',
        role: role,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      return role;
    }
  } catch (error) {
    console.error('Error creating/updating user:', error);
    throw new Error('Failed to create or update user');
  }
};

/**
 * Get user profile by ID
 * 
 * @param {string} userId - User ID
 * @returns {Promise<Object|null>} User profile or null
 */
export const getUserProfile = async (userId) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      return {
        id: userSnap.id,
        ...userSnap.data()
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw new Error('Failed to fetch user profile');
  }
};

/**
 * Update user profile
 * 
 * @param {string} userId - User ID
 * @param {Object} updates - Profile updates
 * @returns {Promise<void>}
 */
export const updateUserProfile = async (userId, updates) => {
  try {
    const userRef = doc(db, 'users', userId);
    
    await updateDoc(userRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw new Error('Failed to update user profile');
  }
};

/**
 * Get user booking statistics
 * 
 * @param {string} userId - User ID
 * @param {string} role - User role (customer or provider)
 * @returns {Promise<Object>} Booking statistics
 */
export const getUserBookingStats = async (userId, role = 'customer') => {
  try {
    const bookingsRef = collection(db, 'bookings');
    const field = role === 'customer' ? 'customerId' : 'providerId';
    
    const q = query(bookingsRef, where(field, '==', userId));
    const querySnapshot = await getDocs(q);
    
    const stats = {
      total: 0,
      pending: 0,
      accepted: 0,
      on_the_way: 0,
      in_progress: 0,
      completed: 0,
      cancelled: 0
    };
    
    querySnapshot.forEach((doc) => {
      const booking = doc.data();
      stats.total++;
      if (booking.status) {
        stats[booking.status] = (stats[booking.status] || 0) + 1;
      }
    });
    
    return stats;
  } catch (error) {
    console.error('Error fetching user booking stats:', error);
    throw new Error('Failed to fetch booking statistics');
  }
};