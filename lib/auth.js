// lib/auth.js — RBAC Auth Library for Fixoo

export const ROLES = {
  CUSTOMER: 'customer',
  PROVIDER: 'provider',
  ADMIN: 'admin',
  STAFF: 'staff',
};

export const DEMO_USERS = {
  customer: {
    id: 'u001',
    name: 'Priya Sharma',
    email: 'priya@fixoo.in',
    phone: '+91 98765 43210',
    role: 'customer',
    city: 'Mumbai',
    location: 'Andheri East, Mumbai',
    avatar: 'PS',
    joinedDate: '2024-01-15',
    totalBookings: 12,
    completedBookings: 10,
  },
  provider: {
    id: 'p001',
    name: 'Rajesh Kumar',
    email: 'rajesh@fixoo.in',
    phone: '+91 87654 32109',
    role: 'provider',
    city: 'Mumbai',
    service: 'Plumber',
    avatar: 'RK',
    rating: 4.8,
    trustScore: 98,
    verified: true,
    totalJobs: 342,
    earnings: 125000,
  },
  admin: {
    id: 'a001',
    name: 'Vikram Nair',
    email: 'admin@fixoo.in',
    phone: '+91 76543 21098',
    role: 'admin',
    department: 'Platform Operations',
    avatar: 'VN',
    accessLevel: 'super',
  },
  staff: {
    id: 's001',
    name: 'Anita Desai',
    email: 'staff@fixoo.in',
    phone: '+91 65432 10987',
    role: 'staff',
    department: 'Customer Support',
    avatar: 'AD',
    shift: 'Morning (6 AM – 2 PM)',
  },
};

const SESSION_KEY = 'fixoo_session';
const ONBOARDED_KEY = 'fixoo_onboarded';

export function loginUser(role) {
  if (typeof window === 'undefined') return null;
  const user = DEMO_USERS[role];
  if (!user) return null;
  const session = {
    ...user,
    loginTime: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(), // 8h
  };
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
}

export function logoutUser() {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem(SESSION_KEY);
}

export function getSessionUser() {
  if (typeof window === 'undefined') return null;
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw);
    if (new Date(session.expiresAt) < new Date()) {
      sessionStorage.removeItem(SESSION_KEY);
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

export function hasRole(role) {
  const user = getSessionUser();
  return user?.role === role;
}

export function getDashboardRoute(role) {
  const routes = {
    customer: '/customer-dashboard',
    provider: '/provider-dashboard',
    admin: '/admin-dashboard',
    staff: '/staff-dashboard',
  };
  return routes[role] || '/landing';
}

export function isOnboarded() {
  if (typeof window === 'undefined') return true;
  return sessionStorage.getItem(ONBOARDED_KEY) === 'true';
}

export function markOnboarded() {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem(ONBOARDED_KEY, 'true');
}
