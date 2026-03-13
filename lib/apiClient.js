/**
 * API Client with JWT Authentication
 * 
 * Utility functions for making authenticated API requests.
 * Automatically includes Firebase JWT token in request headers.
 */

import { getStoredToken } from '@/services/authService';

/**
 * Make authenticated API request
 * 
 * @param {string} url - API endpoint URL
 * @param {Object} options - Fetch options
 * @returns {Promise<Response>} Fetch response
 */
export const authenticatedFetch = async (url, options = {}) => {
  // Get JWT token from localStorage
  const token = getStoredToken();
  
  if (!token) {
    throw new Error('No authentication token found. Please login.');
  }
  
  // Add Authorization header with JWT token
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
    ...options.headers
  };
  
  // Make request with token
  const response = await fetch(url, {
    ...options,
    headers
  });
  
  // Handle 401 Unauthorized - token may be expired
  if (response.status === 401) {
    // Clear invalid token
    localStorage.removeItem('fixoo_token');
    throw new Error('Authentication expired. Please login again.');
  }
  
  return response;
};

/**
 * GET request with authentication
 * 
 * @param {string} url - API endpoint
 * @returns {Promise<Object>} Response data
 */
export const apiGet = async (url) => {
  const response = await authenticatedFetch(url, {
    method: 'GET'
  });
  
  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }
  
  return response.json();
};

/**
 * POST request with authentication
 * 
 * @param {string} url - API endpoint
 * @param {Object} data - Request body data
 * @returns {Promise<Object>} Response data
 */
export const apiPost = async (url, data) => {
  const response = await authenticatedFetch(url, {
    method: 'POST',
    body: JSON.stringify(data)
  });
  
  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }
  
  return response.json();
};

/**
 * PUT request with authentication
 * 
 * @param {string} url - API endpoint
 * @param {Object} data - Request body data
 * @returns {Promise<Object>} Response data
 */
export const apiPut = async (url, data) => {
  const response = await authenticatedFetch(url, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
  
  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }
  
  return response.json();
};

/**
 * DELETE request with authentication
 * 
 * @param {string} url - API endpoint
 * @returns {Promise<Object>} Response data
 */
export const apiDelete = async (url) => {
  const response = await authenticatedFetch(url, {
    method: 'DELETE'
  });
  
  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }
  
  return response.json();
};

/**
 * Example usage in a component:
 * 
 * ```javascript
 * import { apiGet, apiPost } from '@/lib/apiClient';
 * 
 * // GET request
 * const data = await apiGet('/api/protected');
 * 
 * // POST request
 * const result = await apiPost('/api/bookings', {
 *   service: 'Electrician',
 *   date: '2024-03-15'
 * });
 * ```
 */
