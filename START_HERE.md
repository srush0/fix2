# 🚀 START HERE - Firebase Authentication Setup

## Quick Start Guide for Fixoo

---

## ✅ What's Been Implemented

Your Firebase Authentication system is now **COMPLETE** with:

- ✅ Google OAuth login
- ✅ Role-based authentication (Customer, Provider, Admin, Staff)
- ✅ Firestore database integration
- ✅ JWT session management
- ✅ Automatic session restoration
- ✅ Security rules
- ✅ Protected routes

---

## 🎯 3-Step Setup

### Step 1: Enable Firestore (5 minutes)

1. Go to: https://console.firebase.google.com
2. Select project: **fixo-c4137**
3. Click **"Firestore Database"** in left sidebar
4. Click **"Create database"**
5. Choose **"Start in production mode"**
6. Select location: **us-central1** (or closest to you)
7. Click **"Enable"**

### Step 2: Deploy Security Rules (2 minutes)

1. In Firebase Console, go to **Firestore Database** → **Rules** tab
2. Open the `firestore.rules` file in your project
3. Copy all the content
4. Paste into Firebase Console rules editor
5. Click **"Publish"**

### Step 3: Test It! (1 minute)

1. Start your dev server:
   ```bash
   npm run dev
   ```

2. Open browser:
   ```
   http://localhost:3000/login-selector
   ```

3. Click any role card (e.g., **Customer**)

4. Sign in with Google

5. You'll be redirected to your dashboard!

---

## 🎉 That's It!

Your authentication system is now fully functional.

---

## 🧪 Verify It's Working

### Check 1: User Document Created

1. Go to Firebase Console → Firestore Database
2. Look for `users` collection
3. You should see a document with your user data:
   ```
   uid: "abc123..."
   name: "Your Name"
   email: "your@email.com"
   role: "customer"
   createdAt: timestamp
   ```

### Check 2: JWT Token Stored

1. Open browser DevTools (F12)
2. Go to **Application** → **Local Storage**
3. Look for key: `fixoo_token`
4. Value should be a long JWT token

### Check 3: Session Persists

1. Refresh the page
2. You should stay logged in
3. No redirect to login page

---

## 🎨 How to Use in Your Code

### Get Current User

```javascript
import { useAuth } from '@/contexts/AuthContext';

function MyComponent() {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Please login</div>;

  return (
    <div>
      <h1>Welcome {user.displayName}!</h1>
      <p>Role: {user.role}</p>
    </div>
  );
}
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
      router.push('/login-selector');
    }
  }, [user, loading, router]);

  if (loading || !user) return null;

  return <div>Protected Content</div>;
}
```

### Check User Role

```javascript
const { user, hasRole } = useAuth();

if (hasRole('admin')) {
  // Show admin features
}

if (hasRole('provider')) {
  // Show provider features
}
```

---

## 📊 Role-Based Routing

After login, users are automatically redirected based on their role:

| Role | Redirect To |
|------|-------------|
| Customer | `/` (home page) |
| Provider | `/provider-dashboard` |
| Admin | `/admin-dashboard` |
| Staff | `/staff-dashboard` |

---

## 🔐 Security

Your app is secure with:

- ✅ Firebase Authentication (industry standard)
- ✅ JWT tokens (cryptographically signed)
- ✅ Firestore security rules (role-based access)
- ✅ Automatic token refresh
- ✅ Protected routes

---

## 📚 Documentation

For more details, check these files:

- **FIREBASE_AUTH_COMPLETE.md** - Complete implementation guide
- **FIRESTORE_SETUP.md** - Detailed Firestore setup
- **QUICK_REFERENCE.md** - Code examples and cheat sheet
- **firestore.rules** - Security rules

---

## 🐛 Troubleshooting

### Problem: "Missing or insufficient permissions"

**Solution**: Make sure you deployed the security rules (Step 2 above)

### Problem: "User role is undefined"

**Solution**: 
1. Check Firestore console for user document
2. Try logging out and logging in again

### Problem: Can't login

**Solution**:
1. Check browser console for errors
2. Make sure popups are allowed
3. Verify Firebase project is active

---

## 🎯 What's Next?

Now that authentication is working, you can:

1. **Update existing pages** to use authentication
2. **Add logout buttons** to your dashboards
3. **Protect sensitive routes** with role checks
4. **Build your booking system** with Firestore
5. **Add user profile pages**

---

## 💡 Pro Tips

1. **Test all roles**: Try logging in as Customer, Provider, Admin, and Staff
2. **Check Firestore**: Watch documents being created in real-time
3. **Use DevTools**: Monitor localStorage and network requests
4. **Read the docs**: Check FIREBASE_AUTH_COMPLETE.md for advanced features

---

## ✅ Checklist

- [ ] Firestore enabled in Firebase Console
- [ ] Security rules deployed
- [ ] Tested login with at least one role
- [ ] Verified user document in Firestore
- [ ] Checked JWT token in localStorage
- [ ] Tested session persistence (refresh page)

---

## 🎉 You're All Set!

Your Firebase Authentication with role-based access is now fully functional and ready for production.

**Happy coding!** 🚀

---

**Need Help?**
- Check the documentation files
- Review Firebase Console logs
- Check browser console for errors
- Verify all setup steps completed

**Last Updated**: March 13, 2026
