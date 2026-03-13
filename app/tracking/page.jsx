'use client';

import { useState } from 'react';
import { ArrowLeft, Phone, MessageCircle, Star, MapPin, Clock, CircleCheck as CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/Navbar';
import MapView from '@/components/MapView';
import ChatWidget from '@/components/ChatWidget';
import AudioAssistant from '@/components/AudioAssistant';

const mockBooking = {
  id: 'FX-12345',
  service: 'Plumbing Service',
  status: 'on-the-way',
  technician: {
    name: 'Rajesh Kumar',
    phone: '+91 98765 43210',
    avatar: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=200',
    rating: 4.8,
    experience: '6 years',
    completedJobs: 342,
  },
  estimatedArrival: '15 mins',
  bookingTime: '10:30 AM',
  address: 'Sector 21, Nerul, Navi Mumbai',
};

const statusSteps = [
  { label: 'Booking Confirmed', status: 'completed', time: '10:30 AM' },
  { label: 'Technician Assigned', status: 'completed', time: '10:35 AM' },
  { label: 'On The Way', status: 'current', time: '10:45 AM' },
  { label: 'Service In Progress', status: 'pending', time: '-' },
  { label: 'Completed', status: 'pending', time: '-' },
];

export default function TrackingPage() {
  const router = useRouter();
  const [showCancelDialog, setShowCancelDialog] = useState(false);

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
          <p className="text-gray-600">Booking ID: {mockBooking.id}</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-[#111827]">Technician Details</h3>
                <Badge className="bg-[#10A753] hover:bg-[#0d8642]">
                  {mockBooking.status === 'on-the-way' ? 'On The Way' : 'In Progress'}
                </Badge>
              </div>

              <div className="flex items-start space-x-4 mb-6">
                <Avatar className="w-20 h-20">
                  <AvatarImage src={mockBooking.technician.avatar} alt={mockBooking.technician.name} />
                  <AvatarFallback>RK</AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <h4 className="text-xl font-bold text-[#111827]">{mockBooking.technician.name}</h4>
                  <div className="flex items-center space-x-4 mt-2">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold text-gray-700">{mockBooking.technician.rating}</span>
                    </div>
                    <span className="text-gray-600">•</span>
                    <span className="text-gray-600">{mockBooking.technician.experience} experience</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {mockBooking.technician.completedJobs} completed jobs
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

            <Card className="p-6">
              <h3 className="text-xl font-bold text-[#111827] mb-4">Live Tracking</h3>
              <MapView />
              <div className="mt-4 flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-[#2D4FE0]" />
                  <div>
                    <p className="text-sm text-gray-600">Estimated Arrival</p>
                    <p className="text-lg font-bold text-[#2D4FE0]">{mockBooking.estimatedArrival}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-[#2D4FE0]" />
                  <div>
                    <p className="text-sm text-gray-600">Location</p>
                    <p className="text-sm font-semibold text-[#111827]">2.3 km away</p>
                  </div>
                </div>
              </div>
            </Card>

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
                      <p className="text-sm text-gray-600">{step.time}</p>
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
                  <p className="font-semibold text-[#111827]">{mockBooking.service}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Booking Time</p>
                  <p className="font-semibold text-[#111827]">{mockBooking.bookingTime}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Address</p>
                  <p className="font-semibold text-[#111827]">{mockBooking.address}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Estimated Cost</p>
                  <p className="text-2xl font-bold text-[#2D4FE0]">₹299 - ₹499</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-red-50 border-red-200">
              <h3 className="text-lg font-bold text-red-900 mb-2">Need to Cancel?</h3>
              <p className="text-sm text-red-700 mb-4">
                Free cancellation available before technician arrives
              </p>
              <Button
                variant="destructive"
                className="w-full"
                onClick={() => setShowCancelDialog(true)}
              >
                Cancel Booking
              </Button>
            </Card>

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

      <ChatWidget />
      <AudioAssistant />
    </div>
  );
}
