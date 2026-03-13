'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard, Wrench, Clock, MapPin, Star, BarChart3,
  Users, Settings, ClipboardList, AlertTriangle, CheckSquare,
  Activity, Shield, LogOut, ChevronRight
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';

const NAV_CONFIG = {
  customer: [
    { icon: LayoutDashboard, label: 'dashboard', href: '/customer-dashboard' },
    { icon: Wrench, label: 'services', href: '/booking' },
    { icon: Clock, label: 'recentBookings', href: '/tracking' },
    { icon: Star, label: 'favourites', href: '/customer-dashboard' },
    { icon: Settings, label: 'Settings', href: '/customer-dashboard' },
  ],
  provider: [
    { icon: LayoutDashboard, label: 'dashboard', href: '/provider-dashboard' },
    { icon: ClipboardList, label: 'newJobRequests', href: '/provider-dashboard' },
    { icon: BarChart3, label: 'earningsReport', href: '/provider-dashboard' },
    { icon: Star, label: 'customerReviews', href: '/provider-dashboard' },
    { icon: Settings, label: 'Settings', href: '/provider-dashboard' },
  ],
  admin: [
    { icon: LayoutDashboard, label: 'dashboard', href: '/admin-dashboard' },
    { icon: Users, label: 'totalUsers', href: '/admin-dashboard' },
    { icon: Wrench, label: 'activeProviders', href: '/admin-dashboard' },
    { icon: BarChart3, label: 'overview', href: '/admin-dashboard' },
    { icon: Shield, label: 'pendingVerifications', href: '/admin-dashboard' },
    { icon: Settings, label: 'Settings', href: '/admin-dashboard' },
  ],
  staff: [
    { icon: LayoutDashboard, label: 'dashboard', href: '/staff-dashboard' },
    { icon: Activity, label: 'liveBookings', href: '/staff-dashboard' },
    { icon: CheckSquare, label: 'verificationQueue', href: '/staff-dashboard' },
    { icon: AlertTriangle, label: 'disputeManagement', href: '/staff-dashboard' },
    { icon: Settings, label: 'Settings', href: '/staff-dashboard' },
  ],
};

const ROLE_THEME = {
  customer: { bg: 'bg-blue-50', accent: 'bg-[#2D4FE0]', text: 'text-[#2D4FE0]', activeBg: 'bg-blue-100' },
  provider: { bg: 'bg-green-50', accent: 'bg-[#10A753]', text: 'text-[#10A753]', activeBg: 'bg-green-100' },
  admin: { bg: 'bg-purple-50', accent: 'bg-[#8C3CFF]', text: 'text-[#8C3CFF]', activeBg: 'bg-purple-100' },
  staff: { bg: 'bg-sky-50', accent: 'bg-[#0ea5e9]', text: 'text-[#0ea5e9]', activeBg: 'bg-sky-100' },
};

export default function Sidebar() {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const pathname = usePathname();
  const router = useRouter();

  if (!user) return null;

  const role = user.role || 'customer';
  const navItems = NAV_CONFIG[role] || NAV_CONFIG.customer;
  const theme = ROLE_THEME[role] || ROLE_THEME.customer;

  const handleLogout = () => {
    logout();
    toast.info('👋 Logged out successfully');
    router.push('/landing');
  };

  return (
    <aside className="hidden lg:flex flex-col w-64 min-h-screen bg-white border-r border-gray-200 sticky top-0">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-gray-100">
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-9 h-9 fixoo-gradient rounded-xl flex items-center justify-center">
            <Wrench className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-[#2D4FE0]">Fixoo</span>
        </Link>
      </div>

      {/* User Profile */}
      <div className={`mx-3 my-4 p-4 ${theme.bg} rounded-2xl`}>
        <div className="flex items-center space-x-3">
          <div className={`w-12 h-12 ${theme.accent} rounded-xl flex items-center justify-center text-white font-bold text-sm`}>
            {user.avatar}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-[#111827] text-sm truncate">{user.name}</p>
            <p className={`text-xs font-medium ${theme.text} capitalize`}>{t(role)}</p>
            {user.city && <p className="text-xs text-gray-500 flex items-center mt-0.5"><MapPin className="w-3 h-3 mr-1" />{user.city}</p>}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link key={item.href + item.label} href={item.href}>
              <div className={`flex items-center justify-between px-3 py-2.5 rounded-xl transition-all group cursor-pointer ${
                isActive ? `${theme.activeBg} ${theme.text}` : 'text-gray-600 hover:bg-gray-50 hover:text-[#111827]'
              }`}>
                <div className="flex items-center space-x-3">
                  <Icon className={`w-5 h-5 ${isActive ? theme.text : 'text-gray-400 group-hover:text-gray-600'}`} />
                  <span className={`text-sm font-medium ${isActive ? 'font-semibold' : ''}`}>
                    {t(item.label) || item.label}
                  </span>
                </div>
                {isActive && <ChevronRight className={`w-4 h-4 ${theme.text}`} />}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-gray-100 mt-auto">
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-3 py-2.5 text-red-500 hover:bg-red-50 rounded-xl transition"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm font-medium">{t('logout')}</span>
        </button>
      </div>
    </aside>
  );
}
