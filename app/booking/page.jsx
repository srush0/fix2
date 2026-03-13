'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import BookingForm from '@/components/BookingForm';
import MapView from '@/components/MapView';
import ChatWidget from '@/components/ChatWidget';
import AudioAssistant from '@/components/AudioAssistant';

export default function BookingPage() {
  const router = useRouter();

  const handleBookingSubmit = (formData) => {
    console.log('Booking submitted:', formData);
    router.push('/tracking');
  };

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
            <BookingForm onSubmit={handleBookingSubmit} />
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-[#111827] mb-4">Nearby Service Providers</h3>
              <MapView />
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
