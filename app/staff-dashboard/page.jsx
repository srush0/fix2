'use client';

import { useState } from 'react';
import { Activity, CheckSquare, AlertTriangle, Clock, UserCheck, MessageSquare, CheckCircle, XCircle, ChevronUp } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import { useRequireAuth } from '@/lib/withAuth';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';

const liveBookings = [
  { id: 'BK001', customer: 'Priya Sharma', provider: 'Rajesh Kumar', service: 'Plumber', status: 'in-progress', city: 'Mumbai', time: '10:32 AM' },
  { id: 'BK002', customer: 'Amit Patel', provider: 'Suresh Mehta', service: 'Electrician', status: 'pending', city: 'Pune', time: '10:45 AM' },
  { id: 'BK003', customer: 'Rohit Verma', provider: 'Anil Gupta', service: 'AC Repair', status: 'completed', city: 'Delhi', time: '09:15 AM' },
  { id: 'BK004', customer: 'Sneha Joshi', provider: 'Pending', service: 'Cleaning', status: 'pending', city: 'Bangalore', time: '11:00 AM' },
];

const verificationQueue = [
  { id: 'P001', name: 'Mohan Das', service: 'Carpenter', city: 'Chennai', docs: 'Aadhaar, Police Clearance', submitted: '2 hours ago' },
  { id: 'P002', name: 'Kavita Singh', service: 'Nurse/Caretaker', city: 'Mumbai', docs: 'Aadhaar, Nursing Certificate', submitted: '4 hours ago' },
  { id: 'P003', name: 'Ravi Prasad', service: 'AC Technician', city: 'Hyderabad', docs: 'Aadhaar, Trade Certificate', submitted: '1 day ago' },
];

const disputes = [
  { id: 'D001', customer: 'Suman Roy', provider: 'Deepak Jain', issue: 'Provider arrived late by 2 hours', amount: 650, date: '2024-03-12', status: 'open' },
  { id: 'D002', customer: 'Aarti Soni', provider: 'Ramesh Patil', issue: 'Service quality not satisfactory', amount: 999, date: '2024-03-11', status: 'open' },
  { id: 'D003', customer: 'Nitin Shah', provider: 'Prakash Nair', issue: 'Double charged for same service', amount: 350, date: '2024-03-10', status: 'escalated' },
];

const STATUS_COLORS = {
  'in-progress': 'bg-blue-100 text-blue-700',
  pending: 'bg-yellow-100 text-yellow-700',
  completed: 'bg-green-100 text-green-700',
  escalated: 'bg-red-100 text-red-700',
  open: 'bg-orange-100 text-orange-700',
};

export default function StaffDashboard() {
  const { user, loading } = useRequireAuth('staff');
  const { t } = useLanguage();
  const [verifications, setVerifications] = useState(verificationQueue);
  const [disputeList, setDisputeList] = useState(disputes);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#0ea5e9] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const handleVerify = (id, approve) => {
    setVerifications((prev) => prev.filter((v) => v.id !== id));
    toast.success(approve ? `✅ Provider approved!` : `❌ Provider application rejected`);
  };

  const handleDispute = (id, action) => {
    setDisputeList((prev) =>
      prev.map((d) => d.id === id ? { ...d, status: action === 'resolve' ? 'completed' : 'escalated' } : d)
    );
    toast.success(action === 'resolve' ? '✅ Dispute resolved!' : '⬆️ Dispute escalated to admin');
  };

  const kpis = [
    { label: t('resolvedToday'), value: '17', icon: CheckCircle, gradient: 'from-[#10A753] to-[#22c97a]' },
    { label: t('avgResponseTime'), value: '4.2 min', icon: Clock, gradient: 'from-[#2D4FE0] to-[#4f6ef7]' },
    { label: t('openDisputes'), value: disputeList.filter(d => d.status === 'open').length.toString(), icon: AlertTriangle, gradient: 'from-[#F38C00] to-[#e67c00]' },
    { label: t('verificationQueue'), value: verifications.length.toString(), icon: UserCheck, gradient: 'from-[#0ea5e9] to-[#38bdf8]' },
  ];

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex">
      <Sidebar />
      <div className="flex-1 min-w-0">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#111827] mb-1">{t('staffDashboard')}</h1>
            <p className="text-gray-500">{t('staffOverview')} • {user.name} • {user.shift}</p>
          </div>

          {/* KPIs */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            {kpis.map((kpi, i) => (
              <Card key={i} className={`p-6 bg-gradient-to-br ${kpi.gradient} text-white border-0 shadow-lg`}>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm opacity-90">{kpi.label}</p>
                  <kpi.icon className="w-5 h-5 opacity-80" />
                </div>
                <p className="text-3xl font-bold">{kpi.value}</p>
              </Card>
            ))}
          </div>

          {/* Live Bookings */}
          <Card className="p-6 border-0 shadow-sm mb-6">
            <div className="flex items-center space-x-2 mb-5">
              <Activity className="w-5 h-5 text-[#2D4FE0]" />
              <h2 className="text-xl font-bold text-[#111827]">{t('liveBookings')}</h2>
              <span className="w-2 h-2 bg-[#10A753] rounded-full animate-pulse ml-1" />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left py-2 px-3 text-gray-500 font-medium">ID</th>
                    <th className="text-left py-2 px-3 text-gray-500 font-medium">Customer</th>
                    <th className="text-left py-2 px-3 text-gray-500 font-medium">Provider</th>
                    <th className="text-left py-2 px-3 text-gray-500 font-medium">Service</th>
                    <th className="text-left py-2 px-3 text-gray-500 font-medium">City</th>
                    <th className="text-left py-2 px-3 text-gray-500 font-medium">Time</th>
                    <th className="text-left py-2 px-3 text-gray-500 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {liveBookings.map((b) => (
                    <tr key={b.id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                      <td className="py-3 px-3 font-mono text-xs text-gray-400">{b.id}</td>
                      <td className="py-3 px-3 font-medium">{b.customer}</td>
                      <td className="py-3 px-3 text-gray-600">{b.provider}</td>
                      <td className="py-3 px-3 text-gray-600">{b.service}</td>
                      <td className="py-3 px-3 text-gray-500">{b.city}</td>
                      <td className="py-3 px-3 text-gray-500">{b.time}</td>
                      <td className="py-3 px-3">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[b.status]}`}>
                          {b.status.replace('-', ' ')}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Verification Queue */}
            <Card className="p-6 border-0 shadow-sm">
              <div className="flex items-center space-x-2 mb-5">
                <CheckSquare className="w-5 h-5 text-[#10A753]" />
                <h2 className="text-xl font-bold text-[#111827]">{t('verificationQueue')}</h2>
                <Badge className="bg-yellow-100 text-yellow-700 ml-2">{verifications.length} pending</Badge>
              </div>
              {verifications.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <CheckCircle className="w-12 h-12 mx-auto mb-2 text-green-300" />
                  <p>All caught up! No pending verifications.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {verifications.map((v) => (
                    <div key={v.id} className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-semibold text-[#111827]">{v.name}</h4>
                          <p className="text-sm text-gray-500">{v.service} • {v.city}</p>
                          <p className="text-xs text-gray-400 mt-1">Docs: {v.docs}</p>
                          <p className="text-xs text-gray-400">Submitted: {v.submitted}</p>
                        </div>
                      </div>
                      <div className="flex space-x-2 mt-3">
                        <Button size="sm" onClick={() => handleVerify(v.id, true)} className="bg-[#10A753] hover:bg-[#0d8642] text-white flex-1">
                          <CheckCircle className="w-3 h-3 mr-1" /> {t('approve')}
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleVerify(v.id, false)} className="border-red-200 text-red-500 flex-1">
                          <XCircle className="w-3 h-3 mr-1" /> {t('reject')}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* Dispute Management */}
            <Card className="p-6 border-0 shadow-sm">
              <div className="flex items-center space-x-2 mb-5">
                <AlertTriangle className="w-5 h-5 text-[#F38C00]" />
                <h2 className="text-xl font-bold text-[#111827]">{t('disputeManagement')}</h2>
                <Badge className="bg-orange-100 text-orange-700 ml-2">{disputeList.filter(d => d.status === 'open').length} open</Badge>
              </div>
              <div className="space-y-4">
                {disputeList.map((d) => (
                  <div key={d.id} className={`p-4 rounded-xl border ${d.status === 'escalated' ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-100'}`}>
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold text-[#111827] text-sm">{d.issue}</h4>
                        <p className="text-xs text-gray-500 mt-1">Customer: {d.customer} • Provider: {d.provider}</p>
                        <p className="text-xs text-gray-400">Amount: ₹{d.amount} • {d.date}</p>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[d.status]}`}>
                        {d.status}
                      </span>
                    </div>
                    {d.status === 'open' && (
                      <div className="flex space-x-2 mt-3">
                        <Button size="sm" onClick={() => handleDispute(d.id, 'resolve')} className="bg-[#10A753] text-white flex-1">
                          <CheckCircle className="w-3 h-3 mr-1" /> {t('resolve')}
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleDispute(d.id, 'escalate')} className="border-orange-200 text-orange-600 flex-1">
                          <ChevronUp className="w-3 h-3 mr-1" /> {t('escalate')}
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
