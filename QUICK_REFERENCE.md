# 🚀 Quick Reference - Firebase Auth

## 📋 Cheat Sheet

### Import Statements

```javascript
// Auth Context
import { useAuth } from '@/contexts/AuthContext';

// Auth Service
import { 
  loginWithGoogle, 
  logoutUser, 
  getStoredToken 
} from '@/services/authService';

// API Client
import { apiGet, apiPost } from '@/lib/apiClient';

// Auth Guard
import { withAuthGuard, requireAuth } from '@/middleware/authGuard';
```

---

## 🔐 Common Use Cases

### 1. Get Current User

```javascript
const { user, loading } = useAuth();

if (loading) return <div>Loading...</div>;
if (!user) return <div>Not logged in</div>;

return <div>Hello {user.displayName}!</div>;
```

### 2. Login Button

```javascript
const { login } = useAuth();

<button onClick={login}>
  Login with Google
</button>
```

### 3. Logout Button

```javascript
const { logout } = useAuth();

<button onClick={logout}>
  Logout
</button>
```

### 4. Protect a Page

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

### 5. Make API Call

```javascript
import { apiGet, apiPost } from '@/lib/apiClient';

// GET
const data = await apiGet('/api/bookings');

// POST
const result = await apiPost('/api/bookings', {
  service: 'Electrician',
  date: '2024-03-15'
});
```

### 6. Get JWT Token

```javascript
import { getStoredToken } from '@/services/authService';

const token = getStoredToken();
console.log('Token:', token);
```

### 7. Check Authentication Status

```javascript
const { isAuthenticated } = useAuth();

if (isAuthenticated) {
  // User is logged in
} else {
  // User is not logged in
}
```

### 8. Display User Info

```javascript
const { user } = useAuth();

return (
  <div>
    <img src={user.photoURL} alt={user.displayName} />
    <h2>{user.displayName}</h2>
    <p>{user.email}</p>
    <p>ID: {user.uid}</p>
  </div>
);
```

### 9. Conditional Rendering

```javascript
const { user } = useAuth();

return (
  <div>
    {user ? (
      <div>Welcome back, {user.displayName}!</div>
    ) : (
      <div>Please log in</div>
    )}
  </div>
);
```

### 10. Protected API Route

```javascript
// app/api/my-route/route.js
import { NextResponse } from 'next/server';
import { extractToken, verifyToken } from '@/lib/verifyToken';

export async function GET(request) {
  const token = extractToken(request);
  
  if (!token || !verifyToken(token)) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  
  return NextResponse.json({ data: 'Protected data' });
}
```

---

## 📁 File Locations

| Purpose | File Path |
|---------|-----------|
| Firebase Config | `lib/firebase.js` |
| Auth Service | `services/authService.js` |
| Auth Hook | `hooks/useAuth.js` |
| Auth Context | `contexts/AuthContext.jsx` |
| Auth Guard | `middleware/authGuard.js` |
| API Client | `lib/apiClient.js` |
| Token Verification | `lib/verifyToken.js` |
| Login Page | `app/login/page.jsx` |
| Protected Example | `app/home/page.jsx` |

---

## 🎯 Key Functions

### AuthContext

```javascript
const {
  user,              // User object or null
  loading,           // Boolean
  login,             // () => Promise<User>
  logout,            // () => Promise<void>
  isAuthenticated,   // Boolean
  hasRole,           // (role: string) => Boolean
  dashboardRoute     // String
} = useAuth();
```

### User Object

```javascript
user = {
  uid: "abc123...",
  email: "user@example.com",
  displayName: "John Doe",
  photoURL: "https://...",
  token: "eyJhbGciOiJSUzI1NiIs...",
  role: "customer"
}
```

### authService Functions

```javascript
// Login
const userData = await loginWithGoogle();

// Logout
await logoutUser();

// Get current user
const user = getCurrentUser();

// Get token
const token = getStoredToken();

// Refresh token
const newToken = await refreshToken();
```

### API Client Functions

```javascript
// GET
const data = await apiGet('/api/endpoint');

// POST
const result = await apiPost('/api/endpoint', { data });

// PUT
const updated = await apiPut('/api/endpoint', { data });

// DELETE
const deleted = await apiDelete('/api/endpoint');

// Custom
const response = await authenticatedFetch('/api/endpoint', {
  method: 'PATCH',
  body: JSON.stringify({ data })
});
```

---

## 🔑 localStorage Keys

| Key | Value | Purpose |
|-----|-------|---------|
| `fixoo_token` | Firebase JWT | Authentication token |

---

## 🚨 Common Errors & Solutions

### Error: "No authentication token found"
**Solution**: User needs to log in first
```javascript
const { login } = useAuth();
await login();
```

### Error: "Popup blocked"
**Solution**: Allow popups in browser settings

### Error: "Authentication expired"
**Solution**: Token expired, user needs to log in again
```javascript
// Token is automatically refreshed by Firebase
// If this error occurs, redirect to login
router.push('/login');
```

### Error: "Unauthorized" (401)
**Solution**: Check if token exists and is valid
```javascript
const token = getStoredToken();
if (!token) {
  // Redirect to login
  router.push('/login');
}
```

---

## 🎨 UI Components

### Login Button

```javascript
<Button onClick={login} disabled={loading}>
  {loading ? 'Signing in...' : 'Continue with Google'}
</Button>
```

### User Avatar

```javascript
{user && (
  <img 
    src={user.photoURL} 
    alt={user.displayName}
    className="w-10 h-10 rounded-full"
  />
)}
```

### Auth Status Badge

```javascript
{isAuthenticated ? (
  <span className="text-green-600">✓ Authenticated</span>
) : (
  <span className="text-gray-600">Not logged in</span>
)}
```

---

## 🧪 Testing Commands

```bash
# Start dev server
npm run dev

# Type check
npm run typecheck

# Lint
npm run lint

# Build
npm run build
```

---

## 🔗 URLs

| Page | URL |
|------|-----|
| Login | `http://localhost:3000/login` |
| Home | `http://localhost:3000/home` |
| Protected API | `http://localhost:3000/api/protected` |

---

## 📊 Token Info

- **Type**: Firebase ID Token (JWT)
- **Storage**: localStorage
- **Key**: `fixoo_token`
- **Expiry**: 1 hour
- **Refresh**: Automatic
- **Format**: `Bearer <token>`

---

## 🎯 Best Practices

1. **Always check loading state**
   ```javascript
   if (loading) return <Loading />;
   ```

2. **Handle errors gracefully**
   ```javascript
   try {
     await login();
   } catch (error) {
     toast.error(error.message);
   }
   ```

3. **Protect sensitive routes**
   ```javascript
   useEffect(() => {
     if (!loading && !user) {
       router.push('/login');
     }
   }, [user, loading, router]);
   ```

4. **Use API client for authenticated requests**
   ```javascript
   // Good
   const data = await apiGet('/api/bookings');
   
   // Avoid
   const response = await fetch('/api/bookings');
   ```

5. **Clear token on logout**
   ```javascript
   // Handled automatically by logoutUser()
   await logout();
   ```

---

## 🚀 Quick Start

1. **Install dependencies**
   ```bash
   npm install firebase
   ```

2. **Start dev server**
   ```bash
   npm run dev
   ```

3. **Test login**
   - Go to `http://localhost:3000/login`
   - Click "Continue with Google"
   - Check localStorage for token

4. **Use in your components**
   ```javascript
   import { useAuth } from '@/contexts/AuthContext';
   
   const { user, login, logout } = useAuth();
   ```

---

## 📞 Need Help?

- Check `README_FIREBASE_AUTH.md` for detailed docs
- Check `FIREBASE_QUICKSTART.md` for setup guide
- Check `AUTHENTICATION_FLOW.md` for flow diagrams
- Check browser console for errors
- Check Firebase Console for auth logs

---

**Last Updated**: March 13, 2026
**Version**: 1.0.0
**Status**: Production Ready ✅
