'use client';

import { useState } from 'react';
import { Calendar, Clock, MapPin, Upload, IndianRupee } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function BookingForm({ serviceType, onSubmit }) {
  const [formData, setFormData] = useState({
    service: serviceType || '',
    description: '',
    address: '',
    date: '',
    time: '',
    photo: null,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) onSubmit(formData);
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="service">Service Type</Label>
          <Select
            value={formData.service}
            onValueChange={(value) => setFormData({ ...formData, service: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a service" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="electrician">Electrician</SelectItem>
              <SelectItem value="plumber">Plumber</SelectItem>
              <SelectItem value="cleaning">Cleaning</SelectItem>
              <SelectItem value="ac-repair">AC Repair</SelectItem>
              <SelectItem value="appliance">Appliance Repair</SelectItem>
              <SelectItem value="delivery">Delivery Helper</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="description">Problem Description</Label>
          <Textarea
            id="description"
            placeholder="Describe your issue in detail..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={4}
          />
        </div>

        <div>
          <Label htmlFor="address">Service Address</Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <Input
              id="address"
              placeholder="Sector 21, Nerul, Navi Mumbai"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="pl-10"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="date">Preferred Date</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="pl-10"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="time">Preferred Time</Label>
            <div className="relative">
              <Clock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="pl-10"
              />
            </div>
          </div>
        </div>

        <div>
          <Label htmlFor="photo">Upload Photo (Optional)</Label>
          <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#2D4FE0] transition cursor-pointer">
            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
            <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 10MB</p>
            <input
              id="photo"
              type="file"
              className="hidden"
              accept="image/*"
              onChange={(e) => setFormData({ ...formData, photo: e.target.files[0] })}
            />
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Estimated Service Price</p>
              <div className="flex items-center space-x-2 mt-1">
                <IndianRupee className="w-5 h-5 text-[#2D4FE0]" />
                <span className="text-2xl font-bold text-[#2D4FE0]">299 - 499</span>
              </div>
            </div>
            <Button type="submit" className="bg-[#2D4FE0] hover:bg-[#1e3bc4]">
              Book Now
            </Button>
          </div>
        </div>
      </form>
    </Card>
  );
}
