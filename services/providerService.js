/**
 * Provider Service
 * 
 * Handles all provider-related operations with Firestore:
 * - Fetch providers by service type
 * - Get provider details
 * - Filter and search providers
 */

import { 
  collection, 
  getDocs, 
  doc, 
  getDoc,
  query,
  where,
  orderBy,
  limit
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

/**
 * Get all providers
 * 
 * @returns {Promise<Array>} Array of provider objects
 */
export const getAllProviders = async () => {
  try {
    const providersRef = collection(db, 'providers');
    const querySnapshot = await getDocs(providersRef);
    
    const providers = [];
    querySnapshot.forEach((doc) => {
      providers.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return providers;
  } catch (error) {
    console.error('Error fetching providers:', error);
    throw new Error('Failed to fetch providers');
  }
};

/**
 * Get providers by service type
 * 
 * @param {string} serviceType - Service type (e.g., 'electrician', 'plumber')
 * @returns {Promise<Array>} Array of provider objects
 */
export const getProvidersByService = async (serviceType) => {
  try {
    const providersRef = collection(db, 'providers');
    const q = query(
      providersRef,
      where('serviceType', '==', serviceType),
      where('available', '==', true),
      orderBy('rating', 'desc'),
      limit(10)
    );
    
    const querySnapshot = await getDocs(q);
    
    const providers = [];
    querySnapshot.forEach((doc) => {
      providers.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return providers;
  } catch (error) {
    console.error('Error fetching providers by service:', error);
    throw new Error('Failed to fetch providers');
  }
};

/**
 * Get provider by ID
 * 
 * @param {string} providerId - Provider ID
 * @returns {Promise<Object|null>} Provider object or null
 */
export const getProviderById = async (providerId) => {
  try {
    const providerRef = doc(db, 'providers', providerId);
    const providerSnap = await getDoc(providerRef);
    
    if (providerSnap.exists()) {
      return {
        id: providerSnap.id,
        ...providerSnap.data()
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching provider:', error);
    throw new Error('Failed to fetch provider');
  }
};

/**
 * Get available providers by service type
 * 
 * @param {string} serviceType - Service type
 * @returns {Promise<Array>} Array of available provider objects
 */
export const getAvailableProviders = async (serviceType) => {
  try {
    const providersRef = collection(db, 'providers');
    const q = query(
      providersRef,
      where('serviceType', '==', serviceType),
      where('available', '==', true),
      orderBy('rating', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    
    const providers = [];
    querySnapshot.forEach((doc) => {
      providers.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return providers;
  } catch (error) {
    console.error('Error fetching available providers:', error);
    throw new Error('Failed to fetch available providers');
  }
};

/**
 * Get top-rated providers
 * 
 * @param {number} limitCount - Number of providers to fetch
 * @returns {Promise<Array>} Array of top-rated provider objects
 */
export const getTopRatedProviders = async (limitCount = 5) => {
  try {
    const providersRef = collection(db, 'providers');
    const q = query(
      providersRef,
      where('available', '==', true),
      orderBy('rating', 'desc'),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    
    const providers = [];
    querySnapshot.forEach((doc) => {
      providers.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return providers;
  } catch (error) {
    console.error('Error fetching top-rated providers:', error);
    throw new Error('Failed to fetch top-rated providers');
  }
};