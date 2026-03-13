'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Menu, X, Wrench, Bell, LogOut, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import LanguageSwitcher from './LanguageSwitcher';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';
import { speak } from '@/lib/tts';
import { getDashboardRoute } from '@/lib/auth';

const ROLE_COLORS = {
  customer: 'bg-blue-100 text-[#2D4FE0]',
  provider: 'bg-green-100 text-[#10A753]',
  admin: 'bg-purple-100 text-[#8C3CFF]',
  staff: 'bg-sky-100 text-[#0ea5e9]',
};

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout, dashboardRoute } = useAuth();
  const { t, lang } = useLanguage();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    speak('Logged out. See you again!', lang);
    toast.info('👋 Logged out successfully');
    router.push('/landing');
  };

  const navLinks = [
    { label: t('home'), href: '/landing' },
    { label: t('services'), href: '/booking' },
    { label: t('tracking'), href: '/tracking' },
  ];

  const authenticatedLinks = isAuthenticated ? [
    { label: t('dashboard'), href: dashboardRoute },
    { label: 'Profile', href: '/profile' },
  ] : [];

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 fixoo-shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-8">
            <Link href={isAuthenticated ? dashboardRoute : '/landing'} className="flex items-center space-x-2">
              <div className="w-9 h-9 rounded-xl fixoo-gradient flex items-center justify-center">
                <Wrench className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-[#2D4FE0]">Fixoo</span>
            </Link>

            <div className="hidden md:flex items-center space-x-6">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href}
                  className="text-gray-600 hover:text-[#2D4FE0] font-medium transition text-sm">
                  {link.label}
                </Link>
              ))}
              {authenticatedLinks.map((link) => (
                <Link key={link.href} href={link.href}
                  className="text-gray-600 hover:text-[#2D4FE0] font-medium transition text-sm">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Right actions */}
          <div className="hidden md:flex items-center space-x-3">
            <LanguageSwitcher />

            {isAuthenticated && user ? (
              <>
                <Link href="/notifications">
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-[#F38C00] rounded-full animate-pulse" />
                  </Button>
                </Link>

                <Link href={dashboardRoute}>
                  <div className="flex items-center space-x-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 cursor-pointer hover:bg-gray-100 transition">
                    <div className="w-8 h-8 fixoo-gradient rounded-lg flex items-center justify-center text-white text-xs font-bold">
                      {user.avatar}
                    </div>
                    <div className="hidden lg:block">
                      <p className="text-sm font-semibold text-[#111827] leading-tight">{user.name}</p>
                      <span className={`text-xs font-medium px-1.5 py-0.5 rounded-md ${ROLE_COLORS[user.role] || 'bg-gray-100 text-gray-600'}`}>
                        {t(user.role)}
                      </span>
                    </div>
                    <ChevronDown className="w-3 h-3 text-gray-400" />
                  </div>
                </Link>

                <Button variant="ghost" size="icon" onClick={handleLogout} className="text-red-500 hover:bg-red-50">
                  <LogOut className="w-4 h-4" />
                </Button>
              </>
            ) : (
              <>
                <Link href="/login-selector">
                  <Button variant="outline" size="sm" className="border-[#2D4FE0] text-[#2D4FE0]">
                    {t('login')}
                  </Button>
                </Link>
                <Link href="/booking">
                  <Button size="sm" className="bg-[#2D4FE0] hover:bg-[#1e3bc4]">
                    {t('bookService')}
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 px-4 py-4 space-y-3">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="block py-2 text-gray-700 font-medium" onClick={() => setMobileMenuOpen(false)}>
              {link.label}
            </Link>
          ))}
          {authenticatedLinks.map((link) => (
            <Link key={link.href} href={link.href} className="block py-2 text-gray-700 font-medium" onClick={() => setMobileMenuOpen(false)}>
              {link.label}
            </Link>
          ))}
          <div className="pt-3 border-t border-gray-100 space-y-2">
            <LanguageSwitcher />
            {isAuthenticated ? (
              <div className="space-y-2">
                <Link href={dashboardRoute} onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full justify-start">
                    <div className="w-6 h-6 fixoo-gradient rounded-md flex items-center justify-center text-white text-xs font-bold mr-2">
                      {user?.avatar}
                    </div>
                    {user?.name}
                  </Button>
                </Link>
                <Button variant="outline" className="w-full border-red-200 text-red-500" onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-2" /> {t('logout')}
                </Button>
              </div>
            ) : (
              <>
                <Link href="/login-selector" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full">{t('login')}</Button>
                </Link>
                <Link href="/booking" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full bg-[#2D4FE0]">{t('bookService')}</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
