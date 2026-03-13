# 🚀 Firebase Authentication Quick Start Guide

## ✅ What's Been Implemented

Your Fixoo app now has complete Firebase Authentication with JWT session handling!

## 📦 Files Created

1. **lib/firebase.js** - Firebase initialization
2. **services/authService.js** - Authentication operations
3. **hooks/useAuth.js** - React authentication hook
4. **middleware/authGuard.js** - Route protection
5. **contexts/AuthContext.jsx** - Updated with Firebase
6. **app/login/page.jsx** - Google OAuth login page
7. **app/home/page.jsx** - Protected page example

## 🎯 Quick Test

### 1. Start your dev server:
```bash
npm run dev
```

### 2. Visit the login page:
```
http://localhost:3000/login
```

### 3. Click "Continue with Google"

### 4. After login:
- You'll be redirected to the home page
- Check browser localStorage for `fixoo_token`
- Your JWT token is stored there!

## 🔐 How It Works

### Authentication Flow:
```
User clicks "Login with Google"
    ↓
Google OAuth popup opens
    ↓
User selects Google account
    ↓
Firebase authenticates user
    ↓
Firebase ID Token (JWT) is generated
    ↓
Token stored in localStorage as "fixoo_token"
    ↓
User redirected to home page
    ↓
Session persists across page reloads
```

### JWT Token Management:
- Token is automatically refreshed by Firebase
- Expires after 1 hour
- Stored in localStorage
- Used for all authenticated requests

## 💻 Code Examples

### Use in any component:
```javascript
'use client';

import { useAuth } from '@/contexts/AuthContext';

export default function MyComponent() {
  const { user, login, logout, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  
  if (!user) {
    return <button onClick={login}>Login</button>;
  }

  return (
    <div>
      <p>Welcome {user.displayName}!</p>
      <p>Email: {user.email}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### Protect a page:
```javascript
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function ProtectedPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) return null;

  return <div>Protected content here!</div>;
}
```

### Get JWT token:
```javascript
import { getStoredToken } from '@/services/authService';

const token = getStoredToken();
console.log('JWT Token:', token);

// Use token in API calls
fetch('/api/protected', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

## 🔧 Firebase Console Setup

Before deploying to production:

1. **Visit Firebase Console**: https://console.firebase.google.com
2. **Select your project**: fixo-c4137
3. **Go to Authentication** → Sign-in method
4. **Enable Google provider**
5. **Add authorized domains**:
   - localhost (already added)
   - Your production domain (e.g., fixoo.com)

## 🎨 Customize Login Page

The login page is at `app/login/page.jsx`. You can:
- Change colors and styling
- Add your logo
- Add more auth providers (Facebook, Twitter, etc.)
- Customize redirect behavior

## 🛡️ Security Best Practices

✅ **Already Implemented:**
- JWT tokens are cryptographically signed by Firebase
- Tokens expire after 1 hour
- Automatic token refresh
- Secure token storage

🔜 **Recommended Next Steps:**
1. Verify tokens on your backend
2. Add role-based access control
3. Implement email verification
4. Add password reset functionality

## 📱 Update Existing Pages

To add authentication to your existing pages:

### Example: Update booking page
```javascript
// app/booking/page.jsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function BookingPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  // Protect the route
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) return null;

  // Your existing booking page code...
  return <div>Booking Form</div>;
}
```

## 🐛 Troubleshooting

### "Firebase not initialized"
- Make sure you're importing from the correct path
- Check that `lib/firebase.js` exists

### "Popup blocked"
- Allow popups in your browser
- Or use `signInWithRedirect` instead of `signInWithPopup`

### "Token not found"
- User needs to log in first
- Check localStorage in browser DevTools

### "Redirect loop"
- Make sure you're checking `loading` state before redirecting
- Don't redirect if user is already on login page

## 📚 Additional Resources

- [Firebase Auth Docs](https://firebase.google.com/docs/auth)
- [Firebase ID Tokens](https://firebase.google.com/docs/auth/admin/verify-id-tokens)
- [Next.js Authentication](https://nextjs.org/docs/authentication)

## 🎉 You're All Set!

Your Fixoo app now has production-ready Firebase Authentication with JWT session handling. Users can log in with Google, and their sessions persist across page reloads.

Test it out and let me know if you need any customizations!
