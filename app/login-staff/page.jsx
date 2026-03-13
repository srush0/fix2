'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Phone, Lock, ClipboardList, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { speak } from '@/lib/tts';
import { toast } from 'sonner';

export default function LoginStaff() {
  const [phone, setPhone] = useState('65432 10987');
  const [password, setPassword] = useState('staff123');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { t, lang } = useLanguage();
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    const session = login('staff');
    toast.success(`${t('loginSuccess')} ${session.name}! 📋`);
    speak(`${t('ttsLoggedIn')} ${t('staff')}`, lang);
    router.push('/staff-dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-cyan-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-[#0ea5e9] to-[#38bdf8] rounded-2xl shadow-lg flex items-center justify-center mx-auto mb-4">
            <ClipboardList className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-[#111827]">Fixoo</h1>
          <p className="text-gray-500 mt-1">{t('staff')} Portal</p>
        </div>

        <Card className="p-8 shadow-xl border-0 rounded-2xl">
          <div className="flex items-center space-x-3 mb-6 p-3 bg-sky-50 rounded-xl">
            <div className="w-10 h-10 bg-[#0ea5e9] rounded-xl flex items-center justify-center">
              <ClipboardList className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-semibold text-[#111827] text-sm">{t('staff')}</p>
              <p className="text-xs text-gray-500">{t('staffDesc')}</p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t('phoneNumber')}</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0ea5e9] focus:border-transparent outline-none transition"
                  placeholder={t('enterPhone')} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t('password')}</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0ea5e9] focus:border-transparent outline-none transition"
                  placeholder={t('enterPassword')} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
              <p className="text-xs text-amber-700 font-medium">🔑 Demo: Any phone + password works!</p>
            </div>

            <Button type="submit" disabled={loading}
              className="w-full bg-gradient-to-r from-[#0ea5e9] to-[#38bdf8] text-white py-6 rounded-xl text-base font-semibold shadow-lg hover:shadow-xl transition-all">
              {loading ? (
                <span className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>{t('loggingIn')}</span>
                </span>
              ) : (
                <span className="flex items-center justify-center space-x-2">
                  <span>{t('demoLogin')}</span>
                  <ArrowRight className="w-4 h-4" />
                </span>
              )}
            </Button>
          </form>
        </Card>

        <div className="text-center mt-6">
          <Link href="/login-selector" className="text-[#0ea5e9] hover:underline text-sm">← {t('backToHome')}</Link>
        </div>
      </div>
    </div>
  );
}
