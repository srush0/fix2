# 🔥 Firestore Setup Guide

## Overview

This guide will help you set up Firestore database and security rules for your Fixoo application.

---

## 📋 Step 1: Enable Firestore in Firebase Console

1. **Go to Firebase Console**
   - Visit: https://console.firebase.google.com
   - Select your project: `fixo-c4137`

2. **Navigate to Firestore Database**
   - Click on "Firestore Database" in the left sidebar
   - Click "Create database"

3. **Choose Starting Mode**
   - Select "Start in production mode" (we'll add custom rules)
   - Click "Next"

4. **Choose Location**
   - Select a location close to your users (e.g., `us-central1` for US)
   - Click "Enable"

5. **Wait for Setup**
   - Firestore will take a few moments to initialize
   - Once ready, you'll see the Firestore console

---

## 🔐 Step 2: Deploy Security Rules

### Option A: Using Firebase Console (Recommended for Quick Setup)

1. **Go to Firestore Rules Tab**
   - In Firebase Console, go to Firestore Database
   - Click on the "Rules" tab

2. **Copy and Paste Rules**
   - Open the `firestore.rules` file in your project
   - Copy all the content
   - Paste it into the Firebase Console rules editor

3. **Publish Rules**
   - Click "Publish" button
   - Rules will be deployed immediately

### Option B: Using Firebase CLI (Recommended for Production)

1. **Install Firebase CLI**
   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase**
   ```bash
   firebase login
   ```

3. **Initialize Firebase in Your Project**
   ```bash
   firebase init firestore
   ```
   - Select your project: `fixo-c4137`
   - Accept default file names (firestore.rules, firestore.indexes.json)

4. **Deploy Rules**
   ```bash
   firebase deploy --only firestore:rules
   ```

---

## 📊 Step 3: Create Initial Collections

Firestore will automatically create collections when you first write data, but you can also create them manually:

### Users Collection

1. **Go to Firestore Data Tab**
2. **Click "Start collection"**
3. **Collection ID**: `users`
4. **Add first document** (optional - will be created automatically on first login):
   - Document ID: Auto-ID
   - Fields:
     ```
     uid: string
     name: string
     email: string
     photoURL: string
     role: string (customer/provider/admin/staff)
     createdAt: timestamp
     updatedAt: timestamp
     ```

### Other Collections (Optional)

You can create these collections as needed:
- `bookings` - For service bookings
- `services` - For service listings
- `reviews` - For customer reviews
- `notifications` - For user notifications

---

## 🔒 Security Rules Explanation

### Users Collection Rules

```javascript
match /users/{userId} {
  // Users can read and write their own document
  allow read: if isOwner(userId);
  allow write: if isOwner(userId);
  
  // Admins can read all user documents
  allow read: if hasRole('admin');
}
```

**What this means:**
- Users can only access their own user document
- Admins can read all user documents
- This prevents users from seeing other users' data

### Role-Based Access

The rules use a helper function to check user roles:

```javascript
function hasRole(role) {
  return isAuthenticated() && 
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == role;
}
```

**Supported roles:**
- `customer` - Regular users booking services
- `provider` - Service providers
- `admin` - Administrators with full access
- `staff` - Staff members with limited admin access

---

## 🧪 Step 4: Test Your Setup

### Test Authentication and Firestore

1. **Start your dev server**
   ```bash
   npm run dev
   ```

2. **Go to login selector**
   ```
   http://localhost:3000/login-selector
   ```

3. **Click on any role** (e.g., Customer)
   - Google sign-in popup will open
   - Select your Google account
   - You'll be redirected to the dashboard

4. **Check Firestore Console**
   - Go to Firebase Console → Firestore Database
   - You should see a new document in the `users` collection
   - Document ID will be your user's UID
   - Document will contain your user data and role

### Verify Security Rules

1. **Try to access another user's data**
   - In your app, try to read another user's document
   - Should be denied by security rules

2. **Check Firebase Console Logs**
   - Go to Firebase Console → Firestore Database → Rules
   - Click on "Rules playground" to test rules

---

## 📝 Data Structure

### User Document Structure

```javascript
{
  uid: "abc123...",              // Firebase User ID
  name: "John Doe",              // User's display name
  email: "john@example.com",     // User's email
  photoURL: "https://...",       // Profile picture URL
  role: "customer",              // User role
  createdAt: Timestamp,          // Account creation time
  updatedAt: Timestamp           // Last update time
}
```

### Booking Document Structure (Example)

```javascript
{
  bookingId: "booking123",
  customerId: "user123",
  providerId: "provider456",
  serviceType: "Electrician",
  status: "pending",
  scheduledDate: Timestamp,
  createdAt: Timestamp
}
```

---

## 🔧 Firestore Operations in Code

### Read User Data

```javascript
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const userRef = doc(db, 'users', userId);
const userSnap = await getDoc(userRef);

if (userSnap.exists()) {
  const userData = userSnap.data();
  console.log(userData);
}
```

### Write User Data

```javascript
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

await setDoc(doc(db, 'users', userId), {
  uid: userId,
  name: 'John Doe',
  email: 'john@example.com',
  role: 'customer',
  createdAt: serverTimestamp()
});
```

### Update User Data

```javascript
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

await updateDoc(doc(db, 'users', userId), {
  name: 'New Name',
  updatedAt: serverTimestamp()
});
```

### Query Collection

```javascript
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const q = query(
  collection(db, 'users'),
  where('role', '==', 'provider')
);

const querySnapshot = await getDocs(q);
querySnapshot.forEach((doc) => {
  console.log(doc.id, doc.data());
});
```

---

## 🚨 Common Issues & Solutions

### Issue: "Missing or insufficient permissions"

**Cause**: Security rules are blocking the operation

**Solution**:
1. Check your security rules in Firebase Console
2. Verify user is authenticated
3. Verify user has correct role
4. Check document ownership

### Issue: "Firestore not initialized"

**Cause**: Firestore not properly imported

**Solution**:
```javascript
import { db } from '@/lib/firebase';
```

### Issue: "Document doesn't exist"

**Cause**: User document not created on login

**Solution**:
- Check `authService.js` - `loginWithGoogle()` function
- Verify Firestore write permissions
- Check Firebase Console for errors

---

## 📊 Firestore Indexes

For complex queries, you may need to create indexes:

1. **Automatic Index Creation**
   - Firebase will prompt you to create indexes when needed
   - Click the link in the error message
   - Index will be created automatically

2. **Manual Index Creation**
   - Go to Firebase Console → Firestore Database → Indexes
   - Click "Create Index"
   - Configure your index fields

---

## 💰 Firestore Pricing

### Free Tier (Spark Plan)
- 1 GB storage
- 50,000 reads/day
- 20,000 writes/day
- 20,000 deletes/day

### Paid Tier (Blaze Plan)
- Pay as you go
- $0.18 per GB storage
- $0.06 per 100,000 reads
- $0.18 per 100,000 writes

**Tip**: The free tier is sufficient for development and small apps.

---

## 🔐 Best Practices

1. **Always use security rules**
   - Never allow unrestricted access
   - Test rules thoroughly

2. **Minimize data reads**
   - Cache data when possible
   - Use real-time listeners sparingly

3. **Structure data efficiently**
   - Denormalize when needed
   - Avoid deep nesting

4. **Use subcollections for related data**
   - Example: `users/{userId}/bookings/{bookingId}`

5. **Enable offline persistence**
   ```javascript
   import { enableIndexedDbPersistence } from 'firebase/firestore';
   enableIndexedDbPersistence(db);
   ```

---

## 📚 Additional Resources

- [Firestore Documentation](https://firebase.google.com/docs/firestore)
- [Security Rules Guide](https://firebase.google.com/docs/firestore/security/get-started)
- [Data Modeling](https://firebase.google.com/docs/firestore/data-model)
- [Best Practices](https://firebase.google.com/docs/firestore/best-practices)

---

## ✅ Checklist

- [ ] Firestore enabled in Firebase Console
- [ ] Security rules deployed
- [ ] Users collection created (automatically on first login)
- [ ] Test login with role selection
- [ ] Verify user document created in Firestore
- [ ] Test security rules
- [ ] Review Firestore pricing and limits

---

**Setup Complete!** 🎉

Your Firestore database is now ready to use with role-based authentication.
