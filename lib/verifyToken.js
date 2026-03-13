/**
 * JWT Token Verification Utility
 * 
 * Use this on your backend/API routes to verify Firebase JWT tokens.
 * 
 * Note: For production, you should use Firebase Admin SDK
 * to verify tokens server-side.
 */

/**
 * Extract token from Authorization header
 * 
 * @param {Request} request - Next.js API request
 * @returns {string|null} JWT token or null
 */
export const extractToken = (request) => {
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  
  return authHeader.substring(7); // Remove 'Bearer ' prefix
};

/**
 * Verify Firebase JWT token (client-side check)
 * 
 * For production, use Firebase Admin SDK on server:
 * 
 * ```javascript
 * import admin from 'firebase-admin';
 * 
 * const decodedToken = await admin.auth().verifyIdToken(token);
 * const uid = decodedToken.uid;
 * ```
 * 
 * @param {string} token - Firebase ID token
 * @returns {boolean} True if token exists
 */
export const verifyToken = (token) => {
  // Basic check - token exists and is not empty
  // In production, verify with Firebase Admin SDK
  return !!token && token.length > 0;
};

/**
 * Example API route with authentication
 * 
 * Create this in: app/api/protected/route.js
 * 
 * ```javascript
 * import { NextResponse } from 'next/server';
 * import { extractToken, verifyToken } from '@/lib/verifyToken';
 * 
 * export async function GET(request) {
 *   const token = extractToken(request);
 *   
 *   if (!token || !verifyToken(token)) {
 *     return NextResponse.json(
 *       { error: 'Unauthorized' },
 *       { status: 401 }
 *     );
 *   }
 *   
 *   // Token is valid - proceed with request
 *   return NextResponse.json({ 
 *     message: 'Protected data',
 *     data: { ... }
 *   });
 * }
 * ```
 */

/**
 * Middleware for API route protection
 * 
 * @param {Function} handler - API route handler
 * @returns {Function} Protected handler
 */
export const withAuth = (handler) => {
  return async (request, context) => {
    const token = extractToken(request);
    
    if (!token || !verifyToken(token)) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { 
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    // Add token to request for use in handler
    request.token = token;
    
    return handler(request, context);
  };
};
