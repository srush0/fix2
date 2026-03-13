'use client';

import { useState } from 'react';
import { Users, Wrench, TrendingUp, IndianRupee, Activity, MapPin, Star, CircleAlert as AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import { useRequireAuth } from '@/lib/withAuth';
import { useLanguage } from '@/contexts/LanguageContext';

const recentActivities = [
  { id: 1, user: 'Priya Sharma', action: 'Booked Electrician', time: '2 mins ago', type: 'booking' },
  { id: 2, user: 'Rajesh Kumar', action: 'Completed job - ₹650', time: '5 mins ago', type: 'provider' },
  { id: 3, user: 'Amit Patel', action: 'New registration', time: '10 mins ago', type: 'user' },
  { id: 4, user: 'Rohit Verma', action: 'Booked Plumber', time: '15 mins ago', type: 'booking' },
  { id: 5, user: 'Sneha Joshi', action: 'Dispute filed', time: '22 mins ago', type: 'dispute' },
];

const topProviders = [
  { name: 'Rajesh Kumar', service: 'Plumber', rating: 4.9, jobs: 342, earnings: 125000 },
  { name: 'Amit Sharma', service: 'Electrician', rating: 4.8, jobs: 298, earnings: 110000 },
  { name: 'Vikram Singh', service: 'AC Repair', rating: 4.7, jobs: 256, earnings: 98000 },
];

const cityStats = [
  { city: 'Mumbai', users: 12500, providers: 1200, revenue: 2500000 },
  { city: 'Pune', users: 8900, providers: 890, revenue: 1800000 },
  { city: 'Nashik', users: 5600, providers: 560, revenue: 1200000 },
  { city: 'Delhi', users: 15000, providers: 1500, revenue: 3000000 },
];

const servicesDemand = [
  { service: 'Electrician', bookings: 450, color: 'bg-[#2D4FE0]', percent: 90 },
  { service: 'Plumber', bookings: 380, color: 'bg-[#10A753]', percent: 76 },
  { service: 'AC Repair', bookings: 320, color: 'bg-[#F38C00]', percent: 64 },
  { service: 'Cleaning', bookings: 280, color: 'bg-[#8C3CFF]', percent: 56 },
  { service: 'Appliance Repair', bookings: 150, color: 'bg-gray-400', percent: 30 },
];

const TYPE_COLORS = {
  booking: 'bg-blue-500',
  provider: 'bg-green-500',
  user: 'bg-purple-500',
  dispute: 'bg-red-500',
};

export default function AdminDashboard() {
  const { user, loading } = useRequireAuth('admin');
  const { t } = useLanguage();

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#8C3CFF] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const kpis = [
    { label: t('totalUsers'), value: '42,584', icon: Users, bg: 'bg-blue-50', iconColor: 'text-[#2D4FE0]', iconBg: 'bg-blue-100', trend: '↑ 12% from last month' },
    { label: t('activeProviders'), value: '4,150', icon: Wrench, bg: 'bg-green-50', iconColor: 'text-[#10A753]', iconBg: 'bg-green-100', trend: '↑ 8% from last month' },
    { label: t('bookingsToday'), value: '1,256', icon: Activity, bg: 'bg-orange-50', iconColor: 'text-[#F38C00]', iconBg: 'bg-orange-100', trend: '↑ 5% from yesterday' },
    { label: t('revenueToday'), value: '₹3.2L', icon: IndianRupee, bg: 'bg-purple-50', iconColor: 'text-[#8C3CFF]', iconBg: 'bg-purple-100', trend: '↑ 15% from yesterday' },
  ];

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex">
      <Sidebar />
      <div className="flex-1 min-w-0">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#111827] mb-1">{t('adminDashboard')}</h1>
            <p className="text-gray-500">{t('platformOverview')} • Welcome, {user.name}</p>
          </div>

          {/* KPI Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            {kpis.map((kpi, i) => (
              <Card key={i} className="p-6 hover:shadow-lg transition border-0 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm text-gray-500">{kpi.label}</p>
                  <div className={`w-11 h-11 ${kpi.iconBg} rounded-xl flex items-center justify-center`}>
                    <kpi.icon className={`w-5 h-5 ${kpi.iconColor}`} />
                  </div>
                </div>
                <p className="text-3xl font-bold text-[#111827] mb-1">{kpi.value}</p>
                <p className="text-xs text-[#10A753] font-medium">{kpi.trend}</p>
              </Card>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-6 mb-6">
            {/* Service Demand */}
            <div className="lg:col-span-2">
              <Card className="p-6 border-0 shadow-sm">
                <h2 className="text-xl font-bold text-[#111827] mb-5">{t('serviceDemand')}</h2>
                <div className="space-y-4">
                  {servicesDemand.map((item) => (
                    <div key={item.service}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-sm font-medium text-gray-700">{item.service}</span>
                        <span className="text-sm font-bold text-[#111827]">{item.bookings} bookings</span>
                      </div>
                      <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className={`h-full ${item.color} rounded-full transition-all`} style={{ width: `${item.percent}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card className="p-6 border-0 shadow-sm">
              <h2 className="text-xl font-bold text-[#111827] mb-5">{t('activity')}</h2>
              <div className="space-y-4">
                {recentActivities.map((a) => (
                  <div key={a.id} className="flex items-start space-x-3">
                    <div className={`w-2 h-2 rounded-full ${TYPE_COLORS[a.type]} mt-2 flex-shrink-0`} />
                    <div>
                      <p className="text-sm font-medium text-[#111827]">{a.user}</p>
                      <p className="text-xs text-gray-500">{a.action}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{a.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div className="grid lg:grid-cols-2 gap-6 mb-6">
            {/* Top Providers */}
            <Card className="p-6 border-0 shadow-sm">
              <h2 className="text-xl font-bold text-[#111827] mb-5">{t('topProviders')}</h2>
              <div className="space-y-3">
                {topProviders.map((p, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 fixoo-gradient rounded-xl flex items-center justify-center text-white font-bold">{i + 1}</div>
                      <div>
                        <h4 className="font-bold text-[#111827] text-sm">{p.name}</h4>
                        <p className="text-xs text-gray-500">{p.service}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-1">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold text-sm">{p.rating}</span>
                      </div>
                      <p className="text-xs text-gray-500">{p.jobs} jobs</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* City Performance */}
            <Card className="p-6 border-0 shadow-sm">
              <h2 className="text-xl font-bold text-[#111827] mb-5">{t('cityPerformance')}</h2>
              <div className="space-y-3">
                {cityStats.map((city, i) => (
                  <div key={i} className="p-4 border border-gray-100 rounded-xl hover:border-blue-200 transition">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-[#2D4FE0]" />
                        <h4 className="font-bold text-[#111827] text-sm">{city.city}</h4>
                      </div>
                      <Badge className="bg-[#10A753] text-white text-xs">Active</Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div><p className="text-xs text-gray-500">Users</p><p className="text-sm font-bold">{city.users.toLocaleString()}</p></div>
                      <div><p className="text-xs text-gray-500">Providers</p><p className="text-sm font-bold">{city.providers}</p></div>
                      <div><p className="text-xs text-gray-500">Revenue</p><p className="text-sm font-bold">₹{(city.revenue / 100000).toFixed(1)}L</p></div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Bottom summary */}
          <div className="grid lg:grid-cols-3 gap-5">
            <Card className="p-5 bg-yellow-50 border-yellow-200">
              <div className="flex items-center space-x-3 mb-2">
                <AlertCircle className="w-5 h-5 text-yellow-600" />
                <h3 className="font-bold text-yellow-900 text-sm">{t('pendingVerifications')}</h3>
              </div>
              <p className="text-3xl font-bold text-yellow-900 mb-3">28</p>
              <Button variant="outline" size="sm" className="w-full border-yellow-300 text-yellow-700">{t('reviewNow')}</Button>
            </Card>
            <Card className="p-5 bg-blue-50 border-blue-200">
              <div className="flex items-center space-x-3 mb-2">
                <TrendingUp className="w-5 h-5 text-[#2D4FE0]" />
                <h3 className="font-bold text-[#2D4FE0] text-sm">{t('growthRate')}</h3>
              </div>
              <p className="text-3xl font-bold text-[#2D4FE0] mb-1">+24%</p>
              <p className="text-sm text-gray-600">{t('thisMonth')}</p>
            </Card>
            <Card className="p-5 bg-green-50 border-green-200">
              <div className="flex items-center space-x-3 mb-2">
                <Star className="w-5 h-5 text-[#10A753]" />
                <h3 className="font-bold text-[#10A753] text-sm">{t('platformRating')}</h3>
              </div>
              <p className="text-3xl font-bold text-[#10A753] mb-1">4.8/5.0</p>
              <p className="text-sm text-gray-600">Based on 15K reviews</p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
