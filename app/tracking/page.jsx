'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Phone, MessageCircle, Star, MapPin, Clock, CircleCheck as CheckCircle, CreditCard } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import Navbar from '@/components/Navbar';
import MapView from '@/components/MapView';
import ChatWidget from '@/components/ChatWidget';
import AudioAssistant from '@/components/AudioAssistant';
import { useAuth } from '@/contexts/AuthContext';
import { useBooking } from '@/hooks/useBooking';
import { useProvider } from '@/hooks/useProviders';
import { toast } from 'sonner';

const getStatusSteps = (currentStatus) => {
  const allSteps = [
    { key: 'pending', label: 'Booking Confirmed', time: '' },
    { key: 'accepted', label: 'Technician Assigned', time: '' },
    { key: 'on_the_way', label: 'On The Way', time: '' },
    { key: 'in_progress', label: 'Service In Progress', time: '' },
    { key: 'completed', label: 'Completed', time: '' },
  ];

  const statusOrder = ['pending', 'accepted', 'on_the_way', 'in_progress', 'completed'];
  const currentIndex = statusOrder.indexOf(currentStatus);

  return allSteps.map((step, idx) => ({
    ...step,
    status: idx < currentIndex ? 'completed' : idx === currentIndex ? 'current' : 'pending'
  }));
};

const getStatusBadge = (status) => {
  const badges = {
    pending: { label: 'Pending', className: 'bg-yellow-500' },
    accepted: { label: 'Accepted', className: 'bg-blue-500' },
    on_the_way: { label: 'On The Way', className: 'bg-purple-500' },
    in_progress: { label: 'In Progress', className: 'bg-orange-500' },
    completed: { label: 'Completed', className: 'bg-green-500' },
    cancelled: { label: 'Cancelled', className: 'bg-red-500' },
  };
  return badges[status] || badges.pending;
};

export default function TrackingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookingId = searchParams.get('id');
  const { user, loading: authLoading } = useAuth();
  const { booking, loading: bookingLoading, error, cancel } = useBooking(bookingId, true);
  const { provider } = useProvider(booking?.providerId);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  // Protect route
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login-selector');
    }
  }, [user, authLoading, router]);

  // Check if booking ID is provided
  useEffect(() => {
    if (!bookingId) {
      toast.error('No booking ID provided');
      router.push('/');
    }
  }, [bookingId, router]);

  const handleCancelBooking = async () => {
    try {
      setCancelling(true);
      await cancel();
      toast.success('Booking cancelled successfully');
      setShowCancelDialog(false);
      setTimeout(() => router.push('/'), 2000);
    } catch (error) {
      console.error('Cancel error:', error);
      toast.error('Failed to cancel booking', {
        description: error.message
      });
    } finally {
      setCancelling(false);
    }
  };

  if (authLoading || bookingLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading booking details...</p>
        </div>
      </div>
    );
  }

  if (!user || !booking) {
    return null;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-6 max-w-md">
          <h2 className="text-xl font-bold text-red-600 mb-2">Error Loading Booking</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => router.push('/')}>Go to Home</Button>
        </Card>
      </div>
    );
  }

  const statusBadge = getStatusBadge(booking.status);
  const statusSteps = getStatusSteps(booking.status);
  const canCancel = booking.status === 'pending' || booking.status === 'accepted';

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-6 flex items-center space-x-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Button>

        <div className="mb-6">
          <h1 className="text-4xl font-bold text-[#111827] mb-2">Track Your Service</h1>
          <p className="text-gray-600">Booking ID: {bookingId}</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {provider && booking.status !== 'pending' && booking.status !== 'cancelled' && (
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-[#111827]">Technician Details</h3>
                  <Badge className={statusBadge.className}>
                    {statusBadge.label}
                  </Badge>
                </div>

                <div className="flex items-start space-x-4 mb-6">
                  <Avatar className="w-20 h-20">
                    <AvatarImage src={provider.avatar} alt={provider.name} />
                    <AvatarFallback>{provider.name?.charAt(0)}</AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <h4 className="text-xl font-bold text-[#111827]">{provider.name}</h4>
                    <div className="flex items-center space-x-4 mt-2">
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold text-gray-700">{provider.rating}</span>
                      </div>
                      <span className="text-gray-600">•</span>
                      <span className="text-gray-600">{provider.experience}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {provider.completedJobs || 0} completed jobs
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Button className="flex items-center space-x-2 bg-[#2D4FE0] hover:bg-[#1e3bc4]">
                    <Phone className="w-4 h-4" />
                    <span>Call Technician</span>
                  </Button>
                  <Button variant="outline" className="flex items-center space-x-2">
                    <MessageCircle className="w-4 h-4" />
                    <span>Message</span>
                  </Button>
                </div>
              </Card>
            )}

            {booking.status !== 'cancelled' && (
              <Card className="p-6">
                <h3 className="text-xl font-bold text-[#111827] mb-4">Live Tracking</h3>
                <MapView />
                <div className="mt-4 flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Clock className="w-5 h-5 text-[#2D4FE0]" />
                    <div>
                      <p className="text-sm text-gray-600">Estimated Arrival</p>
                      <p className="text-lg font-bold text-[#2D4FE0]">
                        {booking.status === 'on_the_way' ? '15 mins' : 'TBD'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-[#2D4FE0]" />
                    <div>
                      <p className="text-sm text-gray-600">Location</p>
                      <p className="text-sm font-semibold text-[#111827]">
                        {provider ? '2.3 km away' : 'Waiting for assignment'}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            <Card className="p-6">
              <h3 className="text-xl font-bold text-[#111827] mb-6">Service Progress</h3>
              <div className="space-y-4">
                {statusSteps.map((step, idx) => (
                  <div key={idx} className="flex items-start space-x-4">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          step.status === 'completed'
                            ? 'bg-[#10A753]'
                            : step.status === 'current'
                            ? 'bg-[#2D4FE0]'
                            : 'bg-gray-200'
                        }`}
                      >
                        {step.status === 'completed' ? (
                          <CheckCircle className="w-5 h-5 text-white" />
                        ) : (
                          <div
                            className={`w-3 h-3 rounded-full ${
                              step.status === 'current' ? 'bg-white' : 'bg-gray-400'
                            }`}
                          ></div>
                        )}
                      </div>
                      {idx < statusSteps.length - 1 && (
                        <div
                          className={`w-0.5 h-12 ${
                            step.status === 'completed' ? 'bg-[#10A753]' : 'bg-gray-200'
                          }`}
                        ></div>
                      )}
                    </div>

                    <div className="flex-1 pb-8">
                      <h4 className="font-semibold text-[#111827]">{step.label}</h4>
                      <p className="text-sm text-gray-600">{step.time || '-'}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-bold text-[#111827] mb-4">Booking Details</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Service</p>
                  <p className="font-semibold text-[#111827]">{booking.serviceType}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Description</p>
                  <p className="font-semibold text-[#111827]">{booking.description}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Preferred Date & Time</p>
                  <p className="font-semibold text-[#111827]">
                    {booking.preferredDate} at {booking.preferredTime}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Address</p>
                  <p className="font-semibold text-[#111827]">{booking.address}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Estimated Cost</p>
                  <p className="text-2xl font-bold text-[#2D4FE0]">₹299 - ₹499</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <Badge className={statusBadge.className}>{statusBadge.label}</Badge>
                </div>
              </div>
            </Card>

            {canCancel && (
              <Card className="p-6 bg-red-50 border-red-200">
                <h3 className="text-lg font-bold text-red-900 mb-2">Need to Cancel?</h3>
                <p className="text-sm text-red-700 mb-4">
                  {booking.status === 'pending' 
                    ? 'Free cancellation available' 
                    : 'Cancellation available before technician arrives'}
                </p>
                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={() => setShowCancelDialog(true)}
                  disabled={cancelling}
                >
                  Cancel Booking
                </Button>
              </Card>
            )}

            {booking.paymentRequired && booking.status === 'completed' && (
              <Card className="p-6 bg-green-50 border-green-200">
                <h3 className="text-lg font-bold text-green-900 mb-2">Service Completed!</h3>
                <p className="text-sm text-green-700 mb-4">
                  Your service has been completed successfully. Please proceed with payment.
                </p>
                <Button
                  className="w-full bg-[#10A753] hover:bg-[#0d8642]"
                  onClick={() => router.push(`/payment/${bookingId}`)}
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  Proceed to Payment
                </Button>
              </Card>
            )}

            {booking.status === 'cancelled' && (
              <Card className="p-6 bg-gray-50 border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Booking Cancelled</h3>
                <p className="text-sm text-gray-600 mb-4">
                  This booking has been cancelled
                </p>
              </Card>
            )}

            <Card className="p-6 bg-blue-50 border-blue-200">
              <h3 className="text-lg font-bold text-[#111827] mb-2">Need Help?</h3>
              <p className="text-sm text-gray-600 mb-4">
                Our support team is available 24/7
              </p>
              <Button variant="outline" className="w-full">
                Contact Support
              </Button>
            </Card>
          </div>
        </div>
      </div>

      {/* Cancel Confirmation Dialog */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Booking?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel this booking? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={cancelling}>Keep Booking</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancelBooking}
              disabled={cancelling}
              className="bg-red-600 hover:bg-red-700"
            >
              {cancelling ? 'Cancelling...' : 'Yes, Cancel'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <ChatWidget />
      <AudioAssistant />
    </div>
  );
}
