# 🚀 Firestore Security Rules - Deployment Guide

## Overview

The Fixoo platform has complete Firestore security rules configured in `firestore.rules`. This guide explains how to deploy them.

---

## Current Rules Status

✅ **COMPLETE** - All security rules are properly configured for:
- users collection
- providers collection
- services collection
- bookings collection
- payments collection

---

## Deployment Methods

### Method 1: Firebase Console (Easiest)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your Fixoo project
3. Navigate to **Firestore Database** → **Rules**
4. Copy the contents of `firestore.rules` file
5. Paste into the rules editor
6. Click **Publish**
7. Wait for confirmation message

**Time**: ~2 minutes

---

### Method 2: Firebase CLI (Recommended)

#### Prerequisites
```bash
# Install Firebase CLI globally
npm install -g firebase-tools

# Login to Firebase
firebase login
```

#### Initialize Firebase (if not done)
```bash
firebase init firestore
```

Select:
- Use an existing project
- Choose your Fixoo project
- Accept default file names

#### Deploy Rules
```bash
# Deploy only Firestore rules
firebase deploy --only firestore:rules
```

#### Verify Deployment
```bash
# Check deployment status
firebase deploy --only firestore:rules --dry-run
```

**Time**: ~1 minute

---

## Access Control Summary

### Users Collection (`/users/{userId}`)
- ✅ Users read/write their own document
- ✅ Admins read/write all users

### Providers Collection (`/providers/{providerId}`)
- ✅ Anyone can read (public listings)
- ✅ Providers update their own profile
- ✅ Admins full access

### Services Collection (`/services/{serviceId}`)
- ✅ Anyone can read (service catalog)
- ✅ Only admins can create/update/delete

### Bookings Collection (`/bookings/{bookingId}`)
- ✅ Customers create bookings
- ✅ Customers read their own bookings
- ✅ Providers read pending bookings
- ✅ Providers read assigned bookings
- ✅ Providers update booking status
- ✅ Admins full access

### Payments Collection (`/payments/{paymentId}`)
- ✅ Users create payment documents
- ✅ Users read their own payments
- ✅ Providers read related payments
- ✅ Admins full access

---

## Helper Functions

The rules include these helper functions:

```javascript
isAuthenticated()  // Check if user is logged in
isAdmin()         // Check if user is admin
isProvider()      // Check if user is provider
isCustomer()      // Check if user is customer
isStaff()         // Check if user is staff
isOwner(userId)   // Check if user owns document
hasRole(role)     // Check user's role
```

---

## Verification

After deployment, verify rules work:

1. **Test Customer Booking**
   - Login as customer
   - Create booking
   - Should succeed ✅

2. **Test Provider Dashboard**
   - Login as provider
   - View pending bookings
   - Should see bookings ✅

3. **Test Job Acceptance**
   - Provider accepts job
   - Should update booking ✅

4. **Test Payment**
   - Customer completes payment
   - Should create payment record ✅

---

## Troubleshooting

### "Missing or insufficient permissions"

**Solution**:
```bash
1. Redeploy rules: firebase deploy --only firestore:rules
2. Wait 1-2 minutes for propagation
3. Clear browser cache
4. Try again
```

### Rules not updating

**Solution**:
```bash
1. Check Firebase Console → Firestore → Rules
2. Verify "Last published" timestamp
3. Hard refresh browser (Ctrl+Shift+R)
```

---

## Quick Commands

```bash
# Deploy rules
firebase deploy --only firestore:rules

# Test deployment
firebase deploy --only firestore:rules --dry-run

# View current rules
firebase firestore:rules:get

# Backup current rules
firebase firestore:rules:get > firestore.rules.backup
```

---

## Status

✅ Rules file: `firestore.rules` (COMPLETE)  
✅ Documentation: Multiple guides available  
✅ Ready for deployment

**Deploy now**: `firebase deploy --only firestore:rules`
