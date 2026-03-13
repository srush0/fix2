/**
 * Service Service
 * 
 * Handles all service-related operations with Firestore:
 * - Fetch available service types
 * - Get service details
 * - Manage service catalog
 */

import { 
  collection, 
  getDocs, 
  doc, 
  getDoc,
  query,
  where,
  orderBy
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

/**
 * Get all available services
 * 
 * @returns {Promise<Array>} Array of service objects
 */
export const getAllServices = async () => {
  try {
    const servicesRef = collection(db, 'services');
    const q = query(servicesRef, orderBy('name', 'asc'));
    const querySnapshot = await getDocs(q);
    
    const services = [];
    querySnapshot.forEach((doc) => {
      services.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return services;
  } catch (error) {
    console.error('Error fetching services:', error);
    throw new Error('Failed to fetch services');
  }
};

/**
 * Get service by ID
 * 
 * @param {string} serviceId - Service ID
 * @returns {Promise<Object|null>} Service object or null
 */
export const getServiceById = async (serviceId) => {
  try {
    const serviceRef = doc(db, 'services', serviceId);
    const serviceSnap = await getDoc(serviceRef);
    
    if (serviceSnap.exists()) {
      return {
        id: serviceSnap.id,
        ...serviceSnap.data()
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching service:', error);
    throw new Error('Failed to fetch service');
  }
};

/**
 * Get active services only
 * 
 * @returns {Promise<Array>} Array of active service objects
 */
export const getActiveServices = async () => {
  try {
    const servicesRef = collection(db, 'services');
    const q = query(
      servicesRef, 
      where('active', '==', true),
      orderBy('name', 'asc')
    );
    const querySnapshot = await getDocs(q);
    
    const services = [];
    querySnapshot.forEach((doc) => {
      services.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return services;
  } catch (error) {
    console.error('Error fetching active services:', error);
    throw new Error('Failed to fetch active services');
  }
};