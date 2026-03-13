'use client';

import { useState } from 'react';
import { Bell, CheckCheck, Trash2, Package, CreditCard, Tag, Settings } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import { useRequireAuth } from '@/lib/withAuth';
import { useLanguage } from '@/contexts/LanguageContext';

const SAMPLE_NOTIFICATIONS = [
  { id: 1, type: 'booking', icon: Package, title: 'Booking Confirmed', message: 'Your Electrician booking #BK001 is confirmed for today 2 PM.', time: '5 min ago', read: false, color: 'bg-blue-100 text-[#2D4FE0]' },
  { id: 2, type: 'payment', icon: CreditCard, title: 'Payment Received', message: '₹650 credited to your Fixoo wallet for job #JB042.', time: '1 hr ago', read: false, color: 'bg-green-100 text-[#10A753]' },
  { id: 3, type: 'promo', icon: Tag, title: '20% Off This Weekend!', message: 'Book any cleaning service this weekend & get 20% discount. Use code CLEAN20.', time: '3 hr ago', read: true, color: 'bg-orange-100 text-[#F38C00]' },
  { id: 4, type: 'booking', icon: Package, title: 'Provider On The Way', message: 'Rajesh Kumar is on his way to your location. ETA: 10 minutes.', time: '2 hr ago', read: true, color: 'bg-blue-100 text-[#2D4FE0]' },
  { id: 5, type: 'system', icon: Settings, title: 'App Updated', message: 'Fixoo has been updated with new features. Check out the Staff Dashboard!', time: '1 day ago', read: true, color: 'bg-purple-100 text-[#8C3CFF]' },
];

const TABS = [
  { key: 'all', label: 'All' },
  { key: 'booking', label: 'Bookings' },
  { key: 'payment', label: 'Payments' },
  { key: 'promo', label: 'Promos' },
  { key: 'system', label: 'System' },
];

export default function NotificationsPage() {
  const { user, loading } = useRequireAuth(null);
  const { t } = useLanguage();
  const [notifications, setNotifications] = useState(SAMPLE_NOTIFICATIONS);
  const [activeTab, setActiveTab] = useState('all');

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#2D4FE0] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const markAllRead = () => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  const clearAll = () => setNotifications([]);
  const markRead = (id) => setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
  const remove = (id) => setNotifications((prev) => prev.filter((n) => n.id !== id));

  const filtered = activeTab === 'all' ? notifications : notifications.filter((n) => n.type === activeTab);
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex">
      <Sidebar />
      <div className="flex-1 min-w-0">
        <Navbar />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[#111827] mb-1 flex items-center space-x-3">
                <Bell className="w-8 h-8 text-[#2D4FE0]" />
                <span>{t('notifications')}</span>
                {unreadCount > 0 && (
                  <Badge className="bg-[#F38C00] text-white">{unreadCount} new</Badge>
                )}
              </h1>
              <p className="text-gray-500">Stay up to date with your activity</p>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={markAllRead} className="text-xs">
                <CheckCheck className="w-3 h-3 mr-1" /> Mark all read
              </Button>
              <Button variant="outline" size="sm" onClick={clearAll} className="text-xs text-red-500 border-red-200">
                <Trash2 className="w-3 h-3 mr-1" /> Clear all
              </Button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl mb-6">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 px-3 py-2 text-sm font-medium rounded-lg transition-all ${
                  activeTab === tab.key
                    ? 'bg-white text-[#2D4FE0] shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Notifications */}
          <div className="space-y-3">
            {filtered.length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                <Bell className="w-14 h-14 mx-auto mb-4 opacity-30" />
                <p className="text-lg font-medium">No notifications here</p>
                <p className="text-sm">You're all caught up!</p>
              </div>
            ) : (
              filtered.map((notif) => (
                <Card
                  key={notif.id}
                  className={`p-4 flex items-start space-x-4 transition-all cursor-pointer hover:shadow-md border-l-4 ${
                    notif.read ? 'border-l-gray-200 opacity-75' : 'border-l-[#2D4FE0]'
                  }`}
                  onClick={() => markRead(notif.id)}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${notif.color}`}>
                    <notif.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <h3 className={`text-sm font-semibold ${notif.read ? 'text-gray-500' : 'text-[#111827]'}`}>
                        {notif.title}
                        {!notif.read && <span className="ml-2 w-2 h-2 bg-[#2D4FE0] rounded-full inline-block" />}
                      </h3>
                      <button
                        onClick={(e) => { e.stopPropagation(); remove(notif.id); }}
                        className="text-gray-300 hover:text-red-400 ml-2 flex-shrink-0"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="text-sm text-gray-500 mt-0.5 leading-relaxed">{notif.message}</p>
                    <p className="text-xs text-gray-400 mt-1">{notif.time}</p>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
