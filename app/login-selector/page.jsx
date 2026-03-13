'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Wrench, UserIcon, ShieldIcon, WrenchIcon, ClipboardList } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useEffect } from 'react';
import { getDashboardRoute } from '@/lib/auth';

export default function LoginSelector() {
  const { t } = useLanguage();
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [hoveredRole, setHoveredRole] = useState(null);

  // Already logged in? Redirect to their dashboard
  useEffect(() => {
    if (isAuthenticated && user) {
      router.replace(getDashboardRoute(user.role));
    }
  }, [isAuthenticated, user, router]);

  const roles = [
    {
      key: 'customer',
      title: t('customer'),
      description: t('customerDesc'),
      icon: UserIcon,
      href: '/login-customer',
      color: 'from-[#2D4FE0] to-[#4f6ef7]',
      bg: 'bg-blue-50',
      border: 'border-blue-200',
    },
    {
      key: 'provider',
      title: t('provider'),
      description: t('providerDesc'),
      icon: WrenchIcon,
      href: '/login-provider',
      color: 'from-[#10A753] to-[#22c97a]',
      bg: 'bg-green-50',
      border: 'border-green-200',
    },
    {
      key: 'admin',
      title: t('admin'),
      description: t('adminDesc'),
      icon: ShieldIcon,
      href: '/login-admin',
      color: 'from-[#8C3CFF] to-[#a855f7]',
      bg: 'bg-purple-50',
      border: 'border-purple-200',
    },
    {
      key: 'staff',
      title: t('staff'),
      description: t('staffDesc'),
      icon: ClipboardList,
      href: '/login-staff',
      color: 'from-[#0ea5e9] to-[#38bdf8]',
      bg: 'bg-sky-50',
      border: 'border-sky-200',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-gradient-to-br from-[#2D4FE0] to-[#8C3CFF] rounded-3xl shadow-lg flex items-center justify-center mx-auto mb-6 animate-float">
            <Wrench className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-[#111827] mb-3">{t('welcomeTo')}</h1>
          <p className="text-xl text-gray-600">{t('selectRole')}</p>
        </div>

        {/* Role Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {roles.map((role) => {
            const Icon = role.icon;
            const isHovered = hoveredRole === role.key;
            return (
              <Link key={role.key} href={role.href}>
                <Card
                  className={`p-6 text-center cursor-pointer h-full transition-all duration-300 border-2 ${
                    isHovered ? `${role.bg} ${role.border} shadow-xl scale-105` : 'hover:shadow-lg'
                  }`}
                  onMouseEnter={() => setHoveredRole(role.key)}
                  onMouseLeave={() => setHoveredRole(null)}
                >
                  <div
                    className={`w-16 h-16 bg-gradient-to-br ${role.color} rounded-2xl shadow-md flex items-center justify-center mx-auto mb-4 transition-transform duration-300 ${
                      isHovered ? 'scale-110' : ''
                    }`}
                  >
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-[#111827] mb-2">{role.title}</h3>
                  <p className="text-gray-500 text-sm mb-5 leading-relaxed">{role.description}</p>
                  <Button
                    className={`w-full bg-gradient-to-r ${role.color} text-white border-0`}
                    size="sm"
                  >
                    {t('continueAs')} {role.title}
                  </Button>
                </Card>
              </Link>
            );
          })}
        </div>

        <div className="text-center mt-8">
          <Link href="/landing" className="text-[#2D4FE0] hover:underline text-sm">
            ← {t('backToHome')}
          </Link>
        </div>
      </div>
    </div>
  );
}
