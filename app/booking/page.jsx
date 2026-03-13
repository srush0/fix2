'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Star, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/Navbar';
import BookingForm from '@/components/BookingForm';
import MapView from '@/components/MapView';
import ChatWidget from '@/components/ChatWidget';
import AudioAssistant from '@/components/AudioAssistant';
import { useAuth } from '@/contexts/AuthContext';
import { useCreateBooking } from '@/hooks/useBooking';
import { useProvidersByService } from '@/hooks/useProviders';
import { toast } from 'sonner';

export default function BookingPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { createNewBooking, loading: bookingLoading } = useCreateBooking();
  const [selectedService, setSelectedService] = useState('');
  const [selectedProvider, setSelectedProvider] = useState(null);
  const { providers, loading: providersLoading } = useProvidersByService(selectedService);

  // Protect route - redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login-selector');
    }
  }, [user, authLoading, router]);

  const handleBookingSubmit = async (formData) => {
    if (!user) {
      toast.error('Please login to book a service');
      router.push('/login-selector');
      return;
    }

    try {
      const bookingData = {
        customerId: user.uid,
        providerId: selectedProvider?.id || null,
        serviceType: formData.service,
        description: formData.description,
        address: formData.address,
        preferredDate: formData.date,
        preferredTime: formData.time,
        photoUrl: formData.photoUrl || null
      };

      const booking = await createNewBooking(bookingData);
      
      toast.success('Booking created successfully!', {
        description: 'Redirecting to tracking page...'
      });

      // Redirect to tracking page with booking ID
      router.push(`/tracking?id=${booking.id}`);
    } catch (error) {
      console.error('Booking error:', error);
      toast.error('Failed to create booking', {
        description: error.message || 'Please try again'
      });
    }
  };

  const handleServiceChange = (service) => {
    setSelectedService(service);
    setSelectedProvider(null);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

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
          <span>Back</span>
        </Button>

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#111827] mb-2">Book a Service</h1>
          <p className="text-xl text-gray-600">Fill in the details and we'll connect you with the best professionals</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div>
            <BookingForm 
              onSubmit={handleBookingSubmit} 
              onServiceChange={handleServiceChange}
              loading={bookingLoading}
            />
          </div>

          <div className="space-y-6">
            {/* Nearby Service Providers */}
            <div>
              <h3 className="text-xl font-bold text-[#111827] mb-4">
                {selectedService ? 'Available Providers' : 'Nearby Service Providers'}
              </h3>
              
              {selectedService ? (
                providersLoading ? (
                  <Card className="p-6">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                      <p className="mt-2 text-sm text-gray-600">Loading providers...</p>
                    </div>
                  </Card>
                ) : providers.length > 0 ? (
                  <div className="space-y-3">
                    {providers.map((provider) => (
                      <Card 
                        key={provider.id}
                        className={`p-4 cursor-pointer transition-all ${
                          selectedProvider?.id === provider.id 
                            ? 'border-2 border-blue-600 bg-blue-50' 
                            : 'hover:border-blue-300'
                        }`}
                        onClick={() => setSelectedProvider(provider)}
                      >
                        <div className="flex items-start space-x-3">
                          <Avatar className="w-12 h-12">
                            <AvatarImage src={provider.avatar} alt={provider.name} />
                            <AvatarFallback>{provider.name?.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h4 className="font-semibold text-gray-900">{provider.name}</h4>
                              {provider.available && (
                                <Badge className="bg-green-500">Available</Badge>
                              )}
                            </div>
                            <div className="flex items-center space-x-2 mt-1">
                              <div className="flex items-center space-x-1">
                                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                <span className="text-sm font-medium">{provider.rating}</span>
                              </div>
                              <span className="text-gray-400">•</span>
                              <span className="text-sm text-gray-600">{provider.experience}</span>
                            </div>
                            <div className="flex items-center space-x-1 mt-1">
                              <MapPin className="w-3 h-3 text-gray-400" />
                              <span className="text-xs text-gray-500">{provider.distance || '2.5 km'} away</span>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card className="p-6">
                    <p className="text-center text-gray-600">No providers available for this service</p>
                  </Card>
                )
              ) : (
                <MapView />
              )}
            </div>

            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h3 className="text-lg font-bold text-[#111827] mb-4">Why Choose Fixoo?</h3>
              <ul className="space-y-3">
                <li className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-[#10A753] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Verified Professionals</p>
                    <p className="text-sm text-gray-600">All service providers are background verified</p>
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-[#10A753] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">30-Minute Response</p>
                    <p className="text-sm text-gray-600">Quick arrival guaranteed or service is free</p>
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-[#10A753] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Fair Pricing</p>
                    <p className="text-sm text-gray-600">Transparent pricing with no hidden charges</p>
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-[#10A753] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Service Warranty</p>
                    <p className="text-sm text-gray-600">30-day warranty on all services</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <ChatWidget />
      <AudioAssistant />
    </div>
  );
}
