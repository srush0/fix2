'use client';

import { Star } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function ServiceCard({
  icon: Icon,
  title,
  description,
  price,
  rating,
  onClick,
  emergency = false
}) {
  return (
    <Card
      className={`p-6 hover:shadow-xl transition-all duration-300 cursor-pointer group ${
        emergency ? 'border-[#F38C00] bg-orange-50' : 'hover:border-[#2D4FE0]'
      }`}
      onClick={onClick}
    >
      <div className="flex flex-col items-center text-center space-y-4">
        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform ${
          emergency ? 'bg-[#F38C00]' : 'fixoo-gradient'
        }`}>
          <Icon className="w-8 h-8 text-white" />
        </div>

        <div>
          <h3 className="font-semibold text-lg text-gray-900 mb-1">{title}</h3>
          {description && (
            <p className="text-sm text-gray-600">{description}</p>
          )}
        </div>

        <div className="flex items-center space-x-1 text-yellow-500">
          <Star className="w-4 h-4 fill-current" />
          <span className="text-sm font-medium text-gray-700">{rating || '4.5'}</span>
        </div>

        <div className="w-full">
          <div className="text-sm text-gray-500 mb-2">Starting from</div>
          <div className="text-2xl font-bold text-[#2D4FE0]">₹{price}</div>
        </div>

        <Button
          className={`w-full ${
            emergency
              ? 'bg-[#F38C00] hover:bg-[#d97a00]'
              : 'bg-[#2D4FE0] hover:bg-[#1e3bc4]'
          }`}
        >
          {emergency ? 'Emergency Booking' : 'Book Now'}
        </Button>
      </div>
    </Card>
  );
}
