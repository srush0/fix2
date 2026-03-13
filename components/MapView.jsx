'use client';

import { MapPin, Navigation } from 'lucide-react';
import { Card } from '@/components/ui/card';

export default function MapView({ providers = [] }) {
  const mockProviders = providers.length > 0 ? providers : [
    { id: 1, name: 'Rajesh Kumar', type: 'Electrician', lat: 19.076, lng: 72.877, distance: '1.2 km' },
    { id: 2, name: 'Amit Sharma', type: 'Plumber', lat: 19.078, lng: 72.879, distance: '1.5 km' },
    { id: 3, name: 'Vikram Singh', type: 'AC Repair', lat: 19.074, lng: 72.875, distance: '0.8 km' },
  ];

  return (
    <Card className="w-full h-96 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Navigation className="w-16 h-16 text-[#2D4FE0] mx-auto mb-4 animate-pulse" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Map View</h3>
          <p className="text-gray-600 mb-4">Google Maps Integration Coming Soon</p>
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
            <MapPin className="w-4 h-4 text-[#8C3CFF]" />
            <span>Your Location: Mumbai, Maharashtra</span>
          </div>
        </div>
      </div>

      <div className="absolute bottom-4 left-4 right-4 flex space-x-2 overflow-x-auto">
        {mockProviders.map((provider) => (
          <Card key={provider.id} className="min-w-[200px] p-3 bg-white/95 backdrop-blur">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 rounded-full bg-[#10A753]"></div>
              <div>
                <h4 className="font-semibold text-sm">{provider.name}</h4>
                <p className="text-xs text-gray-600">{provider.type}</p>
                <p className="text-xs text-[#2D4FE0]">{provider.distance} away</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </Card>
  );
}
