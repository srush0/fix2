'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, Calendar, Star, Award, MapPin, Clock, IndianRupee, CircleCheck as CheckCircle, Circle as XCircle, Radio, RadioTower } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import ChatWidget from '@/components/ChatWidget';
import AudioAssistant from '@/components/AudioAssistant';
import { useRequireAuth } from '@/lib/withAuth';
import { useLanguage } from '@/contexts/LanguageContext';
import { speak } from '@/lib/tts';
import { toast } from 'sonner';

const jobRequests = [
  { id: 1, service: 'Pipe Leakage Repair', customer: 'Priya Sharma', location: 'Andheri East, Mumbai', distance: '1.2 km', time: '10 mins ago', payout: 450, urgent: false },
  { id: 2, service: 'Electrical Wiring Issue', customer: 'Amit Patel', location: 'Powai, Mumbai', distance: '2.5 km', time: '15 mins ago', payout: 650, urgent: true },
  { id: 3, service: 'AC Gas Refill', customer: 'Rohit Verma', location: 'Bandra West, Mumbai', distance: '3.8 km', time: '20 mins ago', payout: 800, urgent: false },
];

export default function ProviderDashboard() {
  const { user, loading } = useRequireAuth('provider');
  const { t, lang } = useLanguage();
  const [acceptedJobs, setAcceptedJobs] = useState([]);
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    if (user && isOnline) {
      setTimeout(() => speak(t('ttsOnline'), lang), 500);
    }
  }, [user]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#10A753] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const toggleOnline = () => {
    const next = !isOnline;
    setIsOnline(next);
    const msg = next ? t('ttsOnline') : t('ttsOffline');
    speak(msg, lang);
    toast.success(next ? '🟢 You are now Online' : '🔴 You are now Offline');
  };

  const handleAcceptJob = (jobId) => {
    setAcceptedJobs([...acceptedJobs, jobId]);
    toast.success('✅ Job accepted! Customer notified.');
    speak(t('ttsBookingConfirmed'), lang);
  };

  const stats = [
    { label: t('todayEarnings'), value: '₹1,250', icon: IndianRupee, gradient: 'from-[#2D4FE0] to-[#4f6ef7]', sub: '+15% from yesterday' },
    { label: t('weeklyEarnings'), value: '₹8,700', icon: TrendingUp, gradient: 'from-[#10A753] to-[#22c97a]', sub: 'This week' },
    { label: t('completedJobs'), value: user.totalJobs || '15', icon: Calendar, gradient: 'from-[#F38C00] to-[#e67c00]', sub: 'This month' },
    { label: t('trustScore'), value: `${user.trustScore}%`, icon: Award, gradient: 'from-[#8C3CFF] to-[#a855f7]', sub: `⭐ ${user.rating} Rating` },
  ];

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex">
      <Sidebar />
      <div className="flex-1 min-w-0">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

          {/* Header */}
          <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-[#111827] mb-1">{t('welcomeBack')}, {user.name}!</h1>
              <p className="text-gray-500">{t('performanceOverview')}</p>
            </div>
            <button
              onClick={toggleOnline}
              className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-md ${
                isOnline
                  ? 'bg-[#10A753] text-white hover:bg-[#0d8642]'
                  : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
              }`}
            >
              <RadioTower className="w-4 h-4" />
              <span>{isOnline ? t('goOffline') : t('goOnline')}</span>
              <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-white animate-pulse' : 'bg-gray-400'}`} />
            </button>
          </div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            {stats.map((stat, i) => (
              <Card key={i} className={`p-6 bg-gradient-to-br ${stat.gradient} text-white border-0 shadow-lg`}>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm opacity-90">{stat.label}</p>
                  <stat.icon className="w-5 h-5 opacity-80" />
                </div>
                <p className="text-3xl font-bold">{stat.value}</p>
                <p className="text-xs opacity-75 mt-1">{stat.sub}</p>
              </Card>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Job Requests */}
            <div className="lg:col-span-2">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-xl font-bold text-[#111827]">{t('newJobRequests')}</h2>
                  <Badge className="bg-[#F38C00] text-white">{jobRequests.length} {t('available')}</Badge>
                </div>
                <div className="space-y-4">
                  {jobRequests.map((job) => (
                    <Card key={job.id}
                      className={`p-5 transition-all ${job.urgent ? 'border-[#F38C00] border-2 bg-orange-50' : ''} ${acceptedJobs.includes(job.id) ? 'opacity-60' : ''}`}>
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-bold text-[#111827]">{job.service}</h3>
                            {job.urgent && <Badge className="bg-[#F38C00] text-white text-xs">{t('urgent')}</Badge>}
                          </div>
                          <p className="text-sm text-gray-500">{job.customer}</p>
                          <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                            <span className="flex items-center"><MapPin className="w-3 h-3 mr-1" />{job.location}</span>
                            <span className="flex items-center"><Clock className="w-3 h-3 mr-1" />{job.time}</span>
                          </div>
                        </div>
                        <div className="text-right text-sm">
                          <p className="text-gray-500">{t('distance')}</p>
                          <p className="font-bold text-[#2D4FE0]">{job.distance}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                        <div>
                          <p className="text-xs text-gray-500">{t('estimated')}</p>
                          <p className="text-xl font-bold text-[#10A753]">₹{job.payout}</p>
                        </div>
                        {!acceptedJobs.includes(job.id) ? (
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm" className="border-red-200 text-red-500">
                              <XCircle className="w-3 h-3 mr-1" /> {t('rejectJob')}
                            </Button>
                            <Button size="sm" onClick={() => handleAcceptJob(job.id)} className="bg-[#10A753] hover:bg-[#0d8642]">
                              <CheckCircle className="w-3 h-3 mr-1" /> {t('acceptJob')}
                            </Button>
                          </div>
                        ) : (
                          <Badge className="bg-[#10A753] text-white">{t('accepted')}</Badge>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              </Card>
            </div>

            {/* Right panel */}
            <div className="space-y-5">
              <Card className="p-5">
                <h3 className="text-lg font-bold text-[#111827] mb-4">{t('performance')}</h3>
                {[
                  { label: t('acceptanceRate'), val: 92, color: 'bg-[#10A753]' },
                  { label: t('completionRate'), val: 98, color: 'bg-[#2D4FE0]' },
                  { label: t('responseTime'), val: 85, color: 'bg-[#F38C00]' },
                ].map((item) => (
                  <div key={item.label} className="mb-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">{item.label}</span>
                      <span className="font-bold">{item.val}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full">
                      <div className={`h-full ${item.color} rounded-full transition-all`} style={{ width: `${item.val}%` }} />
                    </div>
                  </div>
                ))}
              </Card>

              <Card className="p-5 bg-gradient-to-br from-[#2D4FE0] to-[#8C3CFF] text-white border-0">
                <h3 className="font-bold mb-2">Boost Your Earnings</h3>
                <p className="text-sm opacity-90 mb-4">Complete 5 more jobs this week to earn a ₹500 bonus!</p>
                <div className="w-full h-2 bg-white/30 rounded-full mb-1">
                  <div className="h-full bg-white rounded-full" style={{ width: '60%' }} />
                </div>
                <p className="text-xs opacity-75">3 of 5 jobs completed</p>
              </Card>

              <Card className="p-5">
                <h3 className="text-lg font-bold text-[#111827] mb-3">{t('quickActions')}</h3>
                <div className="space-y-2">
                  {[
                    { icon: Calendar, label: t('viewSchedule') },
                    { icon: TrendingUp, label: t('earningsReport') },
                    { icon: Star, label: t('customerReviews') },
                  ].map((action) => (
                    <Button key={action.label} variant="outline" className="w-full justify-start text-sm">
                      <action.icon className="w-4 h-4 mr-2" /> {action.label}
                    </Button>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
      <ChatWidget />
      <AudioAssistant />
    </div>
  );
}
