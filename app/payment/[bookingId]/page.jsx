'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, CreditCard, CheckCircle, Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/contexts/AuthContext';
import { useBooking } from '@/hooks/useBooking';
import { useProvider } from '@/hooks/useProviders';
import { processDemoPayment } from '@/services/paymentService';
import { toast } from 'sonner';

export default function PaymentPage() {
  const router = useRouter();
  const params = useParams();
  const bookingId = params.bookingId;
  const { user, loading: authLoading } = useAuth();
  const { booking, loading: bookingLoading } = useBooking(bookingId);
  const { provider } = useProvider(booking?.providerId);
  const [processing, setProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Protect route
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login-selector');
    }
  }, [user, authLoading, router]);

  // Check if booking requires payment
  useEffect(() => {
    if (booking && !booking.paymentRequired) {
      toast.info('Payment already completed');
      router.push(`/tracking?id=${bookingId}`);
    }
  }, [booking, bookingId, router]);

  const handlePayment = async () => {
    if (!booking || !user) return;

    try {
      setProcessing(true);

      // Calculate final amount (demo calculation)
      const baseAmount = 399;
      const finalAmount = baseAmount;

      // Process demo payment
      const result = await processDemoPayment({
        bookingId: bookingId,
        customerId: user.uid,
        providerId: booking.providerId,
        amount: finalAmount
      });

      if (result.success) {
        setPaymentSuccess(true);
        toast.success('Payment successful!', {
          description: 'Thank you for your payment'
        });

        // Redirect to tracking page after 2 seconds
        setTimeout(() => {
          router.push(`/tracking?id=${bookingId}`);
        }, 2000);
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Payment failed', {
        description: error.message || 'Please try again'
      });
    } finally {
      setProcessing(false);
    }
  };

  if (authLoading || bookingLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading payment details...</p>
        </div>
      </div>
    );
  }

  if (!user || !booking) {
    return null;
  }

  // Calculate amounts (demo calculation)
  const baseAmount = 399;
  const taxAmount = Math.round(baseAmount * 0.18); // 18% GST
  const finalAmount = baseAmount + taxAmount;

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-6 flex items-center space-x-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </Button>

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#111827] mb-2">Complete Payment</h1>
          <p className="text-gray-600">Booking ID: {bookingId}</p>
        </div>

        {paymentSuccess ? (
          <Card className="p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-[#111827] mb-2">Payment Successful!</h2>
            <p className="text-gray-600 mb-4">
              Your payment has been processed successfully
            </p>
            <p className="text-sm text-gray-500">
              Redirecting to tracking page...
            </p>
          </Card>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {/* Payment Details */}
            <div className="md:col-span-2 space-y-6">
              <Card className="p-6">
                <h3 className="text-xl font-bold text-[#111827] mb-4">Service Details</h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between py-3 border-b border-gray-100">
                    <span className="text-gray-600">Service Type</span>
                    <span className="font-semibold text-[#111827]">{booking.serviceType}</span>
                  </div>
                  
                  <div className="flex justify-between py-3 border-b border-gray-100">
                    <span className="text-gray-600">Service Date</span>
                    <span className="font-semibold text-[#111827]">
                      {booking.preferredDate} at {booking.preferredTime}
                    </span>
                  </div>
                  
                  <div className="flex justify-between py-3 border-b border-gray-100">
                    <span className="text-gray-600">Address</span>
                    <span className="font-semibold text-[#111827] text-right max-w-xs">
                      {booking.address}
                    </span>
                  </div>
                  
                  <div className="flex justify-between py-3 border-b border-gray-100">
                    <span className="text-gray-600">Status</span>
                    <Badge className="bg-green-500">Completed</Badge>
                  </div>
                </div>
              </Card>

              {provider && (
                <Card className="p-6">
                  <h3 className="text-xl font-bold text-[#111827] mb-4">Service Provider</h3>
                  
                  <div className="flex items-center space-x-4">
                    <Avatar className="w-16 h-16">
                      <AvatarImage src={provider.avatar} alt={provider.name} />
                      <AvatarFallback>{provider.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    
                    <div>
                      <h4 className="font-bold text-[#111827]">{provider.name}</h4>
                      <p className="text-sm text-gray-600">{provider.serviceType}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-sm text-gray-600">⭐ {provider.rating}</span>
                        <span className="text-gray-400">•</span>
                        <span className="text-sm text-gray-600">{provider.experience}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              )}

              <Card className="p-6 bg-blue-50 border-blue-200">
                <h3 className="font-bold text-[#111827] mb-2">Demo Payment Mode</h3>
                <p className="text-sm text-gray-600">
                  This is a demo payment. No actual transaction will be processed.
                  Click "Pay Now" to simulate a successful payment.
                </p>
              </Card>
            </div>

            {/* Payment Summary */}
            <div className="space-y-6">
              <Card className="p-6">
                <h3 className="text-xl font-bold text-[#111827] mb-4">Payment Summary</h3>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Service Charge</span>
                    <span className="font-semibold">₹{baseAmount}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">GST (18%)</span>
                    <span className="font-semibold">₹{taxAmount}</span>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between">
                      <span className="text-lg font-bold text-[#111827]">Total Amount</span>
                      <span className="text-2xl font-bold text-[#2D4FE0]">₹{finalAmount}</span>
                    </div>
                  </div>
                </div>

                <Button
                  className="w-full bg-[#10A753] hover:bg-[#0d8642] text-white py-6 text-lg"
                  onClick={handlePayment}
                  disabled={processing}
                >
                  {processing ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5 mr-2" />
                      Pay Now
                    </>
                  )}
                </Button>

                <p className="text-xs text-center text-gray-500 mt-4">
                  By proceeding, you agree to our terms and conditions
                </p>
              </Card>

              <Card className="p-6">
                <h3 className="font-bold text-[#111827] mb-3">Secure Payment</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>100% secure payment</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Instant payment confirmation</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>30-day service warranty</span>
                  </li>
                </ul>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
