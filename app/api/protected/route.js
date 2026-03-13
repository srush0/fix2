/**
 * Protected API Route Example
 * 
 * This demonstrates how to protect API routes with JWT authentication.
 * Only authenticated users with valid Firebase tokens can access this endpoint.
 */

import { NextResponse } from 'next/server';
import { extractToken, verifyToken } from '@/lib/verifyToken';

/**
 * GET /api/protected
 * 
 * Example protected endpoint
 * Requires Authorization header with Bearer token
 */
export async function GET(request) {
  // Extract JWT token from Authorization header
  const token = extractToken(request);
  
  // Verify token exists and is valid
  if (!token || !verifyToken(token)) {
    return NextResponse.json(
      { 
        error: 'Unauthorized',
        message: 'Valid authentication token required'
      },
      { status: 401 }
    );
  }
  
  // Token is valid - return protected data
  return NextResponse.json({ 
    success: true,
    message: 'You have access to protected data!',
    data: {
      services: ['Electrician', 'Plumber', 'Cleaner'],
      timestamp: new Date().toISOString()
    }
  });
}

/**
 * POST /api/protected
 * 
 * Example protected POST endpoint
 */
export async function POST(request) {
  const token = extractToken(request);
  
  if (!token || !verifyToken(token)) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  
  // Parse request body
  const body = await request.json();
  
  // Process authenticated request
  return NextResponse.json({ 
    success: true,
    message: 'Data received',
    received: body
  });
}
