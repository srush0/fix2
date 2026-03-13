'use client';

/**
 * Home Page (Protected Route)
 * 
 * Example of a protected page that requires authentication.
 * Users must be logged in to access this page.
 */

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

export default function HomePage() {
  const router = useRouter();
  const { user, logout, loading } = useAuth();

  // Protect route - redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      router.push('/login');
    } catch (error) {
      toast.error('Logout failed', {
        description: error.message
      });
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-3xl">Welcome to Fixoo!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* User Info */}
            <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg">
              {user.photoURL && (
                <img
                  src={user.photoURL}
                  alt={user.displayName}
                  className="w-16 h-16 rounded-full"
                />
              )}
              <div>
                <h2 className="text-xl font-semibold">{user.displayName}</h2>
                <p className="text-gray-600">{user.email}</p>
                <p className="text-sm text-gray-500 mt-1">User ID: {user.uid}</p>
              </div>
            </div>

            {/* JWT Token Info */}
            <div className="p-4 bg-green-50 rounded-lg">
              <h3 className="font-semibold text-green-900 mb-2">
                🔐 Authentication Status
              </h3>
              <p className="text-sm text-green-800">
                You are authenticated with Firebase JWT token
              </p>
              <p className="text-xs text-green-700 mt-2 font-mono break-all">
                Token: {user.token?.substring(0, 50)}...
              </p>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <Button
                onClick={() => router.push('/booking')}
                className="w-full"
                size="lg"
              >
                Book a Service
              </Button>
              <Button
                onClick={() => router.push('/customer-dashboard')}
                variant="outline"
                className="w-full"
                size="lg"
              >
                Go to Dashboard
              </Button>
              <Button
                onClick={handleLogout}
                variant="destructive"
                className="w-full"
                size="lg"
              >
                Logout
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
