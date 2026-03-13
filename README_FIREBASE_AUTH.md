# Firebase Authentication with JWT - Fixoo

Complete implementation of Firebase Authentication with JWT session handling for the Fixoo Next.js application.

## 🚀 Features Implemented

- ✅ Firebase SDK integration
- ✅ Google OAuth authentication
- ✅ JWT token management (Firebase ID Token)
- ✅ Session persistence with localStorage
- ✅ Automatic token refresh
- ✅ Protected routes with authentication guard
- ✅ React authentication hook
- ✅ Modern login UI
- ✅ Production-ready architecture

## 📁 File Structure

```
fixoo/
├── lib/
│   └── firebase.js              # Firebase initialization & config
├── services/
│   └── authService.js           # Authentication service (login, logout, token management)
├── hooks/
│   └── useAuth.js               # React hook for auth state management
├── middleware/
│   └── authGuard.js             # Route protection middleware
├── contexts/
│   └── AuthContext.jsx          # Updated with Firebase integration
├── app/
│   ├── login/
│   │   └── page.jsx             # Login page with Google OAuth
│   └── home/
│       └── page.jsx             # Protected home page example
```

## 🔧 Installation

Firebase has been installed:
```bash
npm install firebase
```

## 🔐 Authentication Flow

### 1. User Login Flow
```
Landing Page → Login Page → Google OAuth Popup → Firebase Authentication
→ Receive Firebase ID Token (JWT) → Store in localStorage → Redirect to Home
```

### 2. Session Management
- Firebase ID Token is stored in `localStorage` as `fixoo_token`
- Token automatically refreshes when expired (1 hour expiry)
- `onAuthStateChanged` listener maintains session across page reloads

### 3. Protected Routes
```javascript
// Automatic protection with useAuth hook
const { user, loading } = useAuth();

useEffect(() => {
  if (!loading && !user) {
    router.push('/login');
  }
}, [user, loading, router]);
```

## 📝 Usage Examples

### Login with Google
```javascript
import { useAuth } from '@/contexts/AuthContext';

function LoginComponent() {
  const { login } = useAuth();
  
  const handleLogin = async () => {
    try {
      await login();
      // User is now authenticated
    } catch (error) {
      console.error('Login failed:', error);
    }
  };
}
```

### Logout
```javascript
const { logout } = useAuth();

const handleLogout = async () => {
  await logout();
  // User is logged out, token removed
};
```

### Access Current User
```javascript
const { user } = useAuth();

console.log(user.email);        // User email
console.log(user.displayName);  // User name
console.log(user.photoURL);     // Profile picture
console.log(user.token);        // Firebase JWT token
```

### Protect a Page
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

  return <div>Protected Content</div>;
}
```

## 🔑 Firebase Configuration

The Firebase project is configured with:
- **Project ID**: fixo-c4137
- **Auth Domain**: fixo-c4137.firebaseapp.com
- **Google OAuth**: Enabled

## 🛡️ Security Features

1. **JWT Token Management**
   - Firebase ID Tokens are cryptographically signed
   - Tokens expire after 1 hour
   - Automatic refresh handled by Firebase SDK

2. **Secure Storage**
   - Tokens stored in localStorage (client-side only)
   - No sensitive data in cookies or session storage

3. **Route Protection**
   - Authentication guard checks token presence
   - Redirects unauthenticated users to login

## 📱 Testing the Implementation

1. **Start the development server**:
   ```bash
   npm run dev
   ```

2. **Navigate to login page**:
   ```
   http://localhost:3000/login
   ```

3. **Click "Continue with Google"**

4. **After successful login**:
   - Check localStorage for `fixoo_token`
   - You'll be redirected to home page
   - User info will be displayed

5. **Test protected routes**:
   - Try accessing `/home` without logging in
   - Should redirect to `/login`

## 🔄 Token Refresh

Firebase automatically handles token refresh:
```javascript
// Manual token refresh (if needed)
import { refreshToken } from '@/services/authService';

const newToken = await refreshToken();
```

## 🎨 Customization

### Add More Auth Providers
```javascript
// In services/authService.js
import { FacebookAuthProvider, TwitterAuthProvider } from 'firebase/auth';

export const loginWithFacebook = async () => {
  const provider = new FacebookAuthProvider();
  const result = await signInWithPopup(auth, provider);
  // ... handle result
};
```

### Custom User Roles
```javascript
// Store role in Firestore or custom claims
const userWithRole = {
  ...userData,
  role: 'customer' // or 'provider', 'admin', 'staff'
};
```

## 🐛 Troubleshooting

### Issue: "Firebase not initialized"
- Ensure `lib/firebase.js` is imported before using auth
- Check that Firebase config is correct

### Issue: "Token not found"
- User may not be logged in
- Check localStorage for `fixoo_token`
- Try logging in again

### Issue: "Redirect loop"
- Check authentication logic in protected pages
- Ensure loading state is handled properly

## 📚 API Reference

### authService.js
- `loginWithGoogle()` - Authenticate with Google
- `logoutUser()` - Sign out user
- `getCurrentUser()` - Get current Firebase user
- `getStoredToken()` - Get JWT from localStorage
- `refreshToken()` - Force token refresh

### useAuth Hook
- `user` - Current user object
- `loading` - Loading state
- `error` - Error state
- `login()` - Login function
- `logout()` - Logout function
- `isAuthenticated()` - Check auth status

## 🚀 Next Steps

1. **Enable Firebase Console**:
   - Visit: https://console.firebase.google.com
   - Configure OAuth consent screen
   - Add authorized domains

2. **Add More Features**:
   - Email/password authentication
   - Phone authentication
   - Password reset
   - Email verification

3. **Backend Integration**:
   - Verify JWT tokens on your backend
   - Use Firebase Admin SDK for server-side verification

4. **Production Deployment**:
   - Add production domain to Firebase authorized domains
   - Enable Firebase Analytics
   - Set up Firebase Security Rules

## 📄 License

This implementation is part of the Fixoo project.
