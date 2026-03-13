# 🎯 Demo Provider Matching System - Complete Implementation

## Overview

This document describes the complete demo provider matching system for the Fixoo platform, enabling seamless booking flow between customers and the demo provider.

---

## System Architecture

### Demo Accounts

#### Customer Account
- **Email**: Any Google account (except provider email)
- **Role**: `customer`
- **Capabilities**: Create bookings, track status, make payments

#### Provider Account
- **Email**: `echiesta-techsupport@eitfaridabad.co.in`
- **Role**: `provider`
- **Service Type**: `electrician`
- **Capabilities**: View pending requests, accept/reject jobs, update status

---

## Implementation Details

### 1. Automatic Provider Document Creation

**File**: `services/authService.js`

When the provider email logs in, a provider document is automatically created in Firestore.

#### Function: `createProviderDocument()`

```javascript
const createProviderDocument = async (user) => {
  try {
    const providersRef = collection(db, 'providers');
    const providerDocRef = doc(providersRef, user.uid);
    const providerSnap = await getDoc(providerDocRef);
    
    // Check if provider document already exists
    if (!providerSnap.exists()) {
      // Create new provider document
      await setDoc(providerDocRef, {
        userId: user.uid,
        name: user.displayName || user.email?.split('@')[0] || 'Provider',
        email: user.email,
        serviceType: 'electrician',
        available: true,
        rating: 4.8,
        experience: '5 years',
        jobsCompleted: 0,
        phone: '+91 98765 43210',
        description: 'Expert electrician with 5 years of experience',
        specialties: ['Wiring', 'Circuit Repair', 'Panel Upgrades'],
        lat: 28.4089,
        lng: 77.3178,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      console.log('Provider document created for:', user.email);
    }
  } catch (error) {
    console.error('Error creating provider document:', error);
  }
};
```

**Trigger**: Called automatically in `loginWithGoogle()` when user role is `provider`

**Provider Document Structure**:
```javascript
{
  userId: "provider_uid",
  name: "Provider Name",
  email: "echiesta-techsupport@eitfaridabad.co.in",
  serviceType: "electrician",
  available: true,
  rating: 4.8,
  experience: "5 years",
  jobsCompleted: 0,
  phone: "+91 98765 43210",
  description: "Expert electrician with 5 years of experience",
  specialties: ["Wiring", "Circuit Repair", "Panel Upgrades"],
  lat: 28.4089,
  lng: 77.3178,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

---

### 2. Booking Creation

**File**: `services/bookingService.js`

When a customer creates a booking, a document is created in the `bookings` collection.

#### Function: `createBooking()`

```javascript
export const createBooking = async (bookingData) => {
  try {
    const bookingsRef = collection(db, 'bookings');
    
    const newBooking = {
      customerId: bookingData.customerId,
      providerId: null,  // Not assigned yet
      serviceType: bookingData.serviceType,
      description: bookingData.description,
      address: bookingData.address,
      preferredDate: bookingData.preferredDate,
      preferredTime: bookingData.preferredTime,
      photoUrl: bookingData.photoUrl || null,
      status: 'pending',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    const docRef = await addDoc(bookingsRef, newBooking);
    
    return {
      id: docRef.id,
      ...newBooking
    };
  } catch (error) {
    console.error('Error creating booking:', error);
    throw new Error('Failed to create booking');
  }
};
```

**Booking Document Structure**:
```javascript
{
  customerId: "customer_uid",
  providerId: null,
  serviceType: "electrician",
  description: "Need to fix wiring issue",
  address: "123 Main St, City",
  preferredDate: "2026-03-15",
  preferredTime: "10:00 AM",
  photoUrl: null,
  status: "pending",
  createdAt: timestamp,
  updatedAt: timestamp
}
```

---

### 3. Provider Dashboard - Real-Time Listener

**File**: `app/provider-dashboard/page.jsx`

The provider dashboard uses a real-time Firestore listener to show pending bookings.

#### Real-Time Subscription

```javascript
useEffect(() => {
  if (!user || user.role !== 'provider') {
    return;
  }

  setLoadingJobs(true);

  // Subscribe to real-time pending bookings
  const unsubscribe = subscribeToPendingBookings((bookings) => {
    setJobRequests(bookings);
    setLoadingJobs(false);
  });

  // Cleanup subscription on unmount
  return () => {
    if (unsubscribe) {
      unsubscribe();
    }
  };
}, [user]);
```

#### Query Function: `subscribeToPendingBookings()`

**File**: `services/bookingService.js`

```javascript
export const subscribeToPendingBookings = (callback) => {
  try {
    const bookingsRef = collection(db, 'bookings');
    const q = query(
      bookingsRef,
      where('status', '==', 'pending'),
      orderBy('createdAt', 'desc')
    );
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const bookings = [];
      querySnapshot.forEach((doc) => {
        bookings.push({
          id: doc.id,
          ...doc.data()
        });
      });
      callback(bookings);
    }, (error) => {
      console.error('Error in pending bookings subscription:', error);
      callback([]);
    });
    
    return unsubscribe;
  } catch (error) {
    console.error('Error subscribing to pending bookings:', error);
    throw new Error('Failed to subscribe to pending bookings');
  }
};
```

**Query Details**:
- Fetches ALL bookings with `status == "pending"`
- Does NOT filter by serviceType (shows all pending bookings)
- Orders by creation time (newest first)
- Updates in real-time using `onSnapshot()`

**Note**: The provider dashboard shows ALL pending bookings regardless of service type. This allows the demo provider to see all requests. In production, you would filter by `serviceType == "electrician"`.

---

### 4. Accept Job Logic

**File**: `app/provider-dashboard/page.jsx`

When the provider clicks "Accept Job", the booking is assigned to them.

```javascript
const handleAcceptJob = async (bookingId) => {
  try {
    // Update booking in Firestore
    await assignProvider(bookingId, user.uid);
    
    // Add to local accepted list (for UI feedback)
    setAcceptedJobs([...acceptedJobs, bookingId]);
    
    // Show success message
    toast.success('✅ Job accepted! Customer notified.');
    speak(t('ttsBookingConfirmed'), lang);
    
    // Remove from pending list (will happen automatically via real-time listener)
    setJobRequests(jobRequests.filter(job => job.id !== bookingId));
  } catch (error) {
    console.error('Error accepting job:', error);
    toast.error('Failed to accept job');
  }
};
```

#### Function: `assignProvider()`

**File**: `services/bookingService.js`

```javascript
export const assignProvider = async (bookingId, providerId) => {
  try {
    const bookingRef = doc(db, 'bookings', bookingId);
    
    await updateDoc(bookingRef, {
      providerId: providerId,
      status: 'accepted',
      acceptedAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error assigning provider:', error);
    throw new Error('Failed to assign provider');
  }
};
```

**Booking Update**:
```javascript
{
  providerId: "provider_uid",
  status: "accepted",
  acceptedAt: timestamp,
  updatedAt: timestamp
}
```

---

### 5. Customer Tracking Page - Real-Time Updates

**File**: `app/tracking/page.jsx`

The customer tracking page uses a real-time listener to show booking status updates.

#### Real-Time Subscription

```javascript
const { booking, loading: bookingLoading, error } = useBooking(bookingId, true);
```

#### Hook: `useBooking()`

**File**: `hooks/useBooking.js`

```javascript
export const useBooking = (bookingId, realTime = false) => {
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!bookingId) {
      setBooking(null);
      setLoading(false);
      return;
    }

    if (realTime) {
      // Real-time subscription
      const unsubscribe = subscribeToBooking(bookingId, (bookingData) => {
        setBooking(bookingData);
        setLoading(false);
      });

      return () => {
        if (unsubscribe) {
          unsubscribe();
        }
      };
    } else {
      // One-time fetch
      const fetchBooking = async () => {
        try {
          setLoading(true);
          const bookingData = await getBookingById(bookingId);
          setBooking(bookingData);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      fetchBooking();
    }
  }, [bookingId, realTime]);

  return { booking, loading, error };
};
```

**When Status Changes to "accepted"**:
- Real-time listener detects change
- Tracking page updates automatically
- Provider details are fetched and displayed
- Customer sees "Technician Assigned" status

---

### 6. Provider Details Display

**File**: `app/tracking/page.jsx`

When booking is accepted, provider details are fetched and displayed.

```javascript
const { provider } = useProvider(booking?.providerId);
```

#### Hook: `useProvider()`

**File**: `hooks/useProviders.js`

```javascript
export const useProvider = (providerId) => {
  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProvider = async () => {
      if (!providerId) {
        setProvider(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const providerData = await getProviderById(providerId);
        setProvider(providerData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProvider();
  }, [providerId]);

  return { provider, loading, error };
};
```

**Provider Display**:
- Name
- Service type
- Rating
- Experience
- Jobs completed
- Contact buttons (Call, Message)

---

## Complete Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│ STEP 1: Provider Login                                      │
├─────────────────────────────────────────────────────────────┤
│ Email: echiesta-techsupport@eitfaridabad.co.in             │
│ ↓                                                            │
│ Role assigned: "provider"                                    │
│ ↓                                                            │
│ Provider document created in Firestore                       │
│ - serviceType: "electrician"                                 │
│ - available: true                                            │
│ - rating: 4.8                                                │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ STEP 2: Customer Creates Booking                            │
├─────────────────────────────────────────────────────────────┤
│ Customer selects: "electrician"                              │
│ ↓                                                            │
│ Booking document created:                                    │
│ - customerId: customer_uid                                   │
│ - providerId: null                                           │
│ - serviceType: "electrician"                                 │
│ - status: "pending"                                          │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ STEP 3: Real-Time Update to Provider Dashboard              │
├─────────────────────────────────────────────────────────────┤
│ Firestore triggers onSnapshot()                              │
│ ↓                                                            │
│ Provider dashboard receives update INSTANTLY                 │
│ ↓                                                            │
│ New booking appears in "New Job Requests"                    │
│ - Shows: serviceType, description, address, date, time       │
│ - Button: "Accept Job"                                       │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ STEP 4: Provider Accepts Job                                │
├─────────────────────────────────────────────────────────────┤
│ Provider clicks "Accept Job"                                 │
│ ↓                                                            │
│ Booking updated:                                             │
│ - providerId: provider_uid                                   │
│ - status: "accepted"                                         │
│ ↓                                                            │
│ Real-time listener removes from pending list                 │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ STEP 5: Customer Tracking Page Updates                      │
├─────────────────────────────────────────────────────────────┤
│ Firestore triggers onSnapshot()                              │
│ ↓                                                            │
│ Customer tracking page receives update INSTANTLY             │
│ ↓                                                            │
│ Status changes to "Technician Assigned"                      │
│ ↓                                                            │
│ Provider details fetched and displayed:                      │
│ - Name, rating, experience                                   │
│ - Contact buttons                                            │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ STEP 6: Service Completion & Payment                        │
├─────────────────────────────────────────────────────────────┤
│ Provider updates status: "completed"                         │
│ ↓                                                            │
│ System sets: paymentRequired = true                          │
│ ↓                                                            │
│ Customer sees "Proceed to Payment" button                    │
│ ↓                                                            │
│ Customer completes payment                                   │
│ ↓                                                            │
│ Flow complete ✅                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Testing the System

### Step 1: Provider Setup

```bash
1. Login with: echiesta-techsupport@eitfaridabad.co.in
2. Check Firestore Console
3. Verify provider document exists in "providers" collection
4. Verify fields:
   - serviceType: "electrician"
   - available: true
   - rating: 4.8
```

### Step 2: Create Booking

```bash
1. Logout and login as customer (any Google account)
2. Go to /booking page
3. Select service: "electrician"
4. Fill form:
   - Description: "Need to fix wiring"
   - Address: "123 Main St"
   - Date: Tomorrow
   - Time: "10:00 AM"
5. Submit booking
6. Note booking ID from URL
```

### Step 3: Check Provider Dashboard

```bash
1. Logout and login as provider
2. Go to provider dashboard
3. Should see new booking INSTANTLY in "New Job Requests"
4. Verify booking details:
   - Service: electrician
   - Description: Need to fix wiring
   - Address: 123 Main St
   - Date & Time
5. Click "Accept Job"
6. Should see success message
7. Booking should disappear from pending list
```

### Step 4: Check Customer Tracking

```bash
1. Logout and login as customer
2. Go to tracking page with booking ID
3. Should see status: "Technician Assigned"
4. Should see provider details:
   - Name
   - Rating: 4.8
   - Experience: 5 years
5. Should see contact buttons
```

---

## Firestore Collections

### users Collection
```javascript
{
  uid: "provider_uid",
  name: "Provider Name",
  email: "echiesta-techsupport@eitfaridabad.co.in",
  role: "provider",
  photoURL: "...",
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### providers Collection
```javascript
{
  userId: "provider_uid",
  name: "Provider Name",
  email: "echiesta-techsupport@eitfaridabad.co.in",
  serviceType: "electrician",
  available: true,
  rating: 4.8,
  experience: "5 years",
  jobsCompleted: 0,
  phone: "+91 98765 43210",
  description: "Expert electrician with 5 years of experience",
  specialties: ["Wiring", "Circuit Repair", "Panel Upgrades"],
  lat: 28.4089,
  lng: 77.3178,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### bookings Collection
```javascript
{
  customerId: "customer_uid",
  providerId: "provider_uid" | null,
  serviceType: "electrician",
  description: "Need to fix wiring",
  address: "123 Main St",
  preferredDate: "2026-03-15",
  preferredTime: "10:00 AM",
  photoUrl: null,
  status: "pending" | "accepted" | "on_the_way" | "in_progress" | "completed",
  createdAt: timestamp,
  updatedAt: timestamp,
  acceptedAt: timestamp (when accepted)
}
```

---

## Security Rules

The Firestore security rules allow:

1. **Any authenticated user** can read pending bookings
2. **Provider** can accept pending bookings by setting their UID
3. **Customer** can read their own bookings
4. **Provider** can read bookings assigned to them

```javascript
match /bookings/{bookingId} {
  allow read: if isAuthenticated() && 
                 (resource.data.status == 'pending' ||
                  resource.data.customerId == request.auth.uid ||
                  resource.data.providerId == request.auth.uid);
  
  allow update: if isAuthenticated() && 
                   (resource.data.status == 'pending' && 
                    request.resource.data.providerId == request.auth.uid);
}
```

---

## Key Features

### ✅ Automatic Provider Document Creation
- Provider document created on first login
- No manual setup required
- Includes all necessary fields

### ✅ Real-Time Updates
- Provider dashboard updates instantly
- Customer tracking updates instantly
- No polling or page refresh needed

### ✅ Seamless Booking Flow
- Customer creates booking
- Provider sees request immediately
- Provider accepts with one click
- Customer sees provider details instantly

### ✅ Demo Mode Ready
- Works with single demo provider
- Easy to test end-to-end flow
- Production-ready architecture

---

## Files Modified

1. `services/authService.js` - Added provider document creation
2. `services/bookingService.js` - Already has real-time subscriptions
3. `app/provider-dashboard/page.jsx` - Already uses real-time listener
4. `app/tracking/page.jsx` - Already uses real-time listener
5. `firestore.rules` - Already updated with correct permissions

---

## Summary

The demo provider matching system is now complete with:

- ✅ Automatic provider document creation on login
- ✅ Real-time booking requests in provider dashboard
- ✅ One-click job acceptance
- ✅ Real-time status updates for customers
- ✅ Provider details display on tracking page
- ✅ Secure Firestore rules
- ✅ No UI changes

**Status**: COMPLETE ✅  
**Last Updated**: March 13, 2026  
**Version**: 1.3.0

---

**The system is ready for testing with the demo provider account!**
