'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Zap, Droplet, Sparkles, Wind, Wrench, Truck, CircleAlert as AlertCircle, Clock, CircleCheck as CheckCircle, Star, Heart, Bell } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import ServiceCard from '@/components/ServiceCard';
import ChatWidget from '@/components/ChatWidget';
import AudioAssistant from '@/components/AudioAssistant';
import { useRequireAuth } from '@/lib/withAuth';
import { useLanguage } from '@/contexts/LanguageContext';
import { speak } from '@/lib/tts';
import { toast } from 'sonner';

const services = [
  { icon: Zap, titleKey: 'electrician', price: '299', rating: '4.8', description: 'Wiring, switches, repairs' },
  { icon: Droplet, titleKey: 'plumber', price: '249', rating: '4.7', description: 'Pipes, leaks, fittings' },
  { icon: Sparkles, titleKey: 'cleaning', price: '499', rating: '4.9', description: 'Deep cleaning, sanitization' },
  { icon: Wind, titleKey: 'acRepair', price: '399', rating: '4.6', description: 'Service, gas refill, repair' },
  { icon: Wrench, titleKey: 'applianceRepair', price: '349', rating: '4.8', description: 'Washing machine, fridge' },
  { icon: Truck, titleKey: 'deliveryHelper', price: '199', rating: '4.5', description: 'Moving, packing' },
];

const recentBookings = [
  { id: 1, service: 'Electrician', status: 'completed', date: '2024-03-10', technician: 'Rajesh Kumar', rating: 5 },
  { id: 2, service: 'Plumber', status: 'in-progress', date: '2024-03-12', technician: 'Amit Sharma', rating: null },
];

export default function CustomerDashboard() {
  const { user, loading } = useRequireAuth('customer');
  const { t, lang } = useLanguage();
  const router = useRouter();
  const [favourites, setFavourites] = useState([]);
  const [greeted, setGreeted] = useState(false);

  useEffect(() => {
    if (user && !greeted) {
      setGreeted(true);
      const msg = `${t('hello')} ${user.name}! ${t('ttsWelcome')}`;
      setTimeout(() => speak(msg, lang), 600);
    }
  }, [user, greeted]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#2D4FE0] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const toggleFavourite = (idx) => {
    setFavourites((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
    toast.success(favourites.includes(idx) ? 'Removed from favourites' : '❤️ Added to favourites');
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex">
      <Sidebar />
      <div className="flex-1 min-w-0">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[#111827] mb-1">
                {t('hello')}, {user.name}! <span className="wave">👋</span>
              </h1>
              <p className="text-gray-500">{t('whatServiceToday')}</p>
            </div>
            <Badge className="bg-blue-100 text-[#2D4FE0] text-sm px-3 py-1">
              📍 {user.location}
            </Badge>
          </div>

          {/* Emergency Banner */}
          <div className="mb-8">
            <Card className="p-5 bg-gradient-to-r from-[#F38C00] to-[#e67c00] text-white border-0 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <AlertCircle className="w-5 h-5" />
                    <h3 className="text-lg font-bold">{t('emergencyAvailable')}</h3>
                  </div>
                  <p className="opacity-90 text-sm">{t('emergencyDesc')}</p>
                </div>
                <Button onClick={() => router.push('/booking')} className="bg-white text-[#F38C00] hover:bg-gray-100 font-semibold">
                  {t('callNow')} 🚨
                </Button>
              </div>
            </Card>
          </div>

          {/* Services Grid */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-[#111827] mb-5">{t('popularServices')}</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {services.map((svc, idx) => (
                <div key={idx} className="relative">
                  <ServiceCard
                    icon={svc.icon}
                    title={t(svc.titleKey)}
                    description={svc.description}
                    price={svc.price}
                    rating={svc.rating}
                    onClick={() => router.push('/booking')}
                  />
                  <button
                    onClick={() => toggleFavourite(idx)}
                    className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-md hover:scale-110 transition"
                  >
                    <Heart
                      className={`w-4 h-4 transition-colors ${favourites.includes(idx) ? 'fill-red-500 text-red-500' : 'text-gray-400'}`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Grid */}
          <div className="grid lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-xl font-bold text-[#111827] mb-4">{t('recentBookings')}</h3>
              <div className="space-y-3">
                {recentBookings.map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <h4 className="font-semibold text-[#111827]">{booking.service}</h4>
                      <p className="text-sm text-gray-500">{booking.technician}</p>
                      <p className="text-xs text-gray-400">{booking.date}</p>
                    </div>
                    <div className="text-right">
                      {booking.status === 'completed' ? (
                        <div className="flex items-center space-x-1 text-[#10A753]">
                          <CheckCircle className="w-4 h-4" />
                          <span className="text-sm font-medium">{t('completed')}</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-1 text-[#F38C00]">
                          <Clock className="w-4 h-4" />
                          <span className="text-sm font-medium">{t('inProgress')}</span>
                        </div>
                      )}
                      {booking.rating && (
                        <div className="flex items-center space-x-0.5 mt-1">
                          {[...Array(booking.rating)].map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4" onClick={() => router.push('/tracking')}>
                {t('viewAllBookings')}
              </Button>
            </Card>

            <Card className="p-6">
              <h3 className="text-xl font-bold text-[#111827] mb-4">{t('quickStats')}</h3>
              <div className="space-y-3">
                {[
                  { label: t('totalBookings'), value: user.totalBookings || 12, icon: Clock, bg: 'bg-blue-50', color: 'text-[#2D4FE0]', iconBg: 'bg-[#2D4FE0]' },
                  { label: t('completed'), value: user.completedBookings || 10, icon: CheckCircle, bg: 'bg-green-50', color: 'text-[#10A753]', iconBg: 'bg-[#10A753]' },
                  { label: t('moneySaved'), value: '₹1,250', icon: Star, bg: 'bg-purple-50', color: 'text-[#8C3CFF]', iconBg: 'bg-[#8C3CFF]' },
                ].map((stat, i) => (
                  <div key={i} className={`flex items-center justify-between p-4 ${stat.bg} rounded-xl`}>
                    <div>
                      <p className="text-sm text-gray-500">{stat.label}</p>
                      <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                    </div>
                    <div className={`w-11 h-11 ${stat.iconBg} rounded-xl flex items-center justify-center`}>
                      <stat.icon className="w-5 h-5 text-white" />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>

      <ChatWidget />
      <AudioAssistant />

      <style jsx>{`
        .wave { animation: wave 0.6s ease-in-out infinite; display: inline-block; }
        @keyframes wave { 0%, 100% { transform: rotate(0deg); } 50% { transform: rotate(20deg); } }
      `}</style>
    </div>
  );
}
