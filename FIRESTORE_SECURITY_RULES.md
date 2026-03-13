# Firestore Security Rules - Fixoo Platform

## Overview

This document explains the Cloud Firestore security rules implemented for the Fixoo platform and provides instructions for deployment and testing.

## Security Model

The Fixoo platform uses a role-based access control (RBAC) system with the following roles:
- `customer` - End users who book services
- `provider` - Service providers who fulfill bookings
- `admin` - Platform administrators with full access
- `staff` - Support staff with read/write access to bookings

## Collections and Access Rules

### 1. Users Collection (`/users/{userId}`)

**Purpose**: Store user profiles and authentication data

**Fields**:
- `uid` - User ID (matches Firebase Auth UID)
- `name` - User display name
- `email` - User email address
- `role` - User role (customer, provider, admin, staff)
- `photoURL` - Profile picture URL
- `createdAt` - Account creation timestamp
- `updatedAt` - Last update timestamp

**Access Rules**:
- **Read**: Users can read their own document; Admins can read all
- **Create**: Users can create their own document
- **Update**: Users can update their own document; Admins can update any
- **Delete**: Only admins can delete user documents

**Security Logic**:
```javascript
// Users can access their own data
allow read: if request.auth.uid == userId || isAdmin();
allow update: if request.auth.uid == userId || isAdmin();
```

---

### 2. Providers Collection (`/providers/{providerId}`)

**Purpose**: Store service provider information and profiles

**Fields**:
- `userId` - Reference to user document
- `name` - Provider name
- `serviceType` - Type of service offered
- `rating` - Average rating
- `availability` - Current availability status
- `location` - Provider location data

**Access Rules**:
- **Read**: Public (anyone can read, including unauthenticated users)
- **Create**: Only admins can create provider documents
- **Update**: Provider can update their own document; Admins can update any
- **Delete**: Only admins can delete provider documents

**Security Logic**:
```javascript
// Anyone can browse providers
allow read: if true;

// Provider can update their own profile
allow update: if resource.data.userId == request.auth.uid || isAdmin();
```

---

### 3. Services Collection (`/services/{serviceId}`)

**Purpose**: Store available service types and catalog

**Fields**:
- `name` - Service name
- `description` - Service description
- `icon` - Service icon/image
- `price` - Base price
- `category` - Service category

**Access Rules**:
- **Read**: Public (anyone can read, including unauthenticated users)
- **Create**: Only admins
- **Update**: Only admins
- **Delete**: Only admins

**Security Logic**:
```javascript
// Public service catalog
allow read: if true;

// Only admins manage services
allow write: if isAdmin();
```

---

### 4. Bookings Collection (`/bookings/{bookingId}`)

**Purpose**: Store customer booking requests and status

**Fields**:
- `customerId` - Customer user ID
- `providerId` - Assigned provider user ID
- `serviceType` - Type of service requested
- `description` - Booking description
- `address` - Service location
- `preferredDate` - Preferred service date
- `preferredTime` - Preferred service time
- `status` - Booking status (pending, accepted, on_the_way, in_progress, completed, cancelled)
- `createdAt` - Booking creation timestamp

**Access Rules**:
- **Read**: 
  - Customer can read their own bookings
  - Provider can read bookings assigned to them
  - Admins and staff can read all bookings
  
- **Create**: 
  - Any authenticated user can create a booking
  - The `customerId` must match the authenticated user's UID
  
- **Update**: 
  - Customer can update their own bookings (e.g., cancel)
  - Provider can update bookings assigned to them (e.g., status changes)
  - Admins and staff can update any booking
  
- **Delete**: Only admins can delete bookings

**Security Logic**:
```javascript
// Customer or provider can read their bookings
allow read: if resource.data.customerId == request.auth.uid ||
               resource.data.providerId == request.auth.uid ||
               isAdmin() || isStaff();

// Customer creates booking with their own ID
allow create: if request.resource.data.customerId == request.auth.uid;

// Customer or provider can update their bookings
allow update: if resource.data.customerId == request.auth.uid ||
                 resource.data.providerId == request.auth.uid ||
                 isAdmin() || isStaff();
```

---

## Helper Functions

The security rules use several helper functions for cleaner code:

### `isAuthenticated()`
Checks if the user is logged in via Firebase Authentication.

### `isOwner(userId)`
Checks if the authenticated user is the owner of the document.

### `hasRole(role)`
Checks if the authenticated user has a specific role by fetching their user document from Firestore.

### `isAdmin()`, `isProvider()`, `isCustomer()`, `isStaff()`
Convenience functions to check specific roles.

---

## Admin Override

Users with the `admin` role have full access to all collections. This is implemented using:

```javascript
function isAdmin() {
  return get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
}
```

**Important**: This performs a document read for every request, which counts toward your Firestore quota. For high-traffic applications, consider using Custom Claims instead.

---

## Deployment Instructions

### Option 1: Deploy via Firebase Console (Recommended for Testing)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your Fixoo project
3. Navigate to **Firestore Database** → **Rules**
4. Copy the contents of `firestore.rules` file
5. Paste into the rules editor
6. Click **Publish**

### Option 2: Deploy via Firebase CLI (Recommended for Production)

#### Prerequisites
- Install Firebase CLI: `npm install -g firebase-tools`
- Login to Firebase: `firebase login`

#### Initialize Firebase (if not already done)
```bash
firebase init firestore
```

Select:
- Use an existing project
- Choose your Fixoo project
- Accept default file names (firestore.rules, firestore.indexes.json)

#### Deploy Rules
```bash
firebase deploy --only firestore:rules
```

#### Deploy Rules and Indexes Together
```bash
firebase deploy --only firestore
```

#### Check Deployment Status
```bash
firebase deploy --only firestore:rules --dry-run
```

---

## Testing Security Rules

### Option 1: Firebase Console Rules Playground

1. Go to Firebase Console → Firestore Database → Rules
2. Click on **Rules Playground** tab
3. Test different scenarios:

**Example Test: Customer Reading Own Booking**
```
Location: /bookings/booking123
Authenticated: Yes
Auth UID: user123
Simulate: get
```

**Example Test: Provider Updating Booking Status**
```
Location: /bookings/booking123
Authenticated: Yes
Auth UID: provider456
Simulate: update
```

### Option 2: Firebase Emulator Suite (Recommended)

#### Install Emulators
```bash
firebase init emulators
```

Select:
- Firestore Emulator
- Authentication Emulator

#### Start Emulators
```bash
firebase emulators:start
```

#### Run Tests
Create test file `firestore.test.js`:

```javascript
const firebase = require('@firebase/testing');

describe('Firestore Security Rules', () => {
  it('allows user to read their own document', async () => {
    const db = firebase.initializeTestApp({
      projectId: 'fixoo-test',
      auth: { uid: 'user123', email: 'test@example.com' }
    }).firestore();
    
    const doc = db.collection('users').doc('user123');
    await firebase.assertSucceeds(doc.get());
  });
  
  it('denies user from reading another user document', async () => {
    const db = firebase.initializeTestApp({
      projectId: 'fixoo-test',
      auth: { uid: 'user123' }
    }).firestore();
    
    const doc = db.collection('users').doc('user456');
    await firebase.assertFails(doc.get());
  });
});
```

Run tests:
```bash
npm test
```

---

## Common Security Scenarios

### Scenario 1: Customer Creates a Booking
✅ **Allowed** if:
- User is authenticated
- `customerId` in booking data matches authenticated user's UID

❌ **Denied** if:
- User is not authenticated
- `customerId` doesn't match authenticated user's UID

### Scenario 2: Provider Updates Booking Status
✅ **Allowed** if:
- User is authenticated
- `providerId` in booking matches authenticated user's UID
- Typically updating `status` field

❌ **Denied** if:
- Provider tries to update a booking not assigned to them

### Scenario 3: Customer Cancels Booking
✅ **Allowed** if:
- User is authenticated
- `customerId` in booking matches authenticated user's UID
- Typically setting `status` to "cancelled"

### Scenario 4: Admin Manages Services
✅ **Allowed** if:
- User is authenticated
- User's role in Firestore is "admin"

❌ **Denied** if:
- User is not an admin

---

## Security Best Practices

### 1. Always Validate User Input
Even with security rules, validate data on the client side and use Firestore validation rules.

### 2. Use Custom Claims for High-Traffic Apps
For better performance, consider using Firebase Custom Claims instead of fetching role from Firestore:

```javascript
function isAdmin() {
  return request.auth.token.admin == true;
}
```

Set custom claims via Admin SDK:
```javascript
admin.auth().setCustomUserClaims(uid, { admin: true });
```

### 3. Limit Document Reads
The `hasRole()` function performs a document read. For high-traffic scenarios, cache role in Custom Claims.

### 4. Test Thoroughly
Always test security rules before deploying to production using the Firebase Emulator Suite.

### 5. Monitor Access Patterns
Use Firebase Console to monitor:
- Failed security rule evaluations
- Unusual access patterns
- Quota usage

### 6. Regular Audits
Periodically review and audit security rules to ensure they match your application's requirements.

---

## Troubleshooting

### Issue: "Missing or insufficient permissions"

**Cause**: User doesn't have required access based on security rules

**Solution**: 
1. Check if user is authenticated
2. Verify user's role in Firestore
3. Ensure document IDs match (e.g., customerId == auth.uid)
4. Check Firebase Console → Firestore → Rules for detailed error logs

### Issue: Rules not updating after deployment

**Cause**: Rules cache or deployment delay

**Solution**:
1. Wait 1-2 minutes for rules to propagate
2. Clear browser cache
3. Verify deployment: `firebase deploy --only firestore:rules`
4. Check Firebase Console to confirm rules are published

### Issue: "get() function causing too many reads"

**Cause**: `hasRole()` function fetches user document on every request

**Solution**:
1. Use Custom Claims instead of Firestore role lookup
2. Implement caching strategy
3. Monitor Firestore usage in Firebase Console

---

## Migration from Development to Production

### Step 1: Test Rules in Development
```bash
# Use emulators for testing
firebase emulators:start

# Run test suite
npm test
```

### Step 2: Deploy to Staging
```bash
# Deploy to staging project
firebase use staging
firebase deploy --only firestore:rules
```

### Step 3: Verify in Staging
- Test all user flows
- Check Firebase Console for errors
- Monitor for 1-2 days

### Step 4: Deploy to Production
```bash
# Deploy to production project
firebase use production
firebase deploy --only firestore:rules
```

### Step 5: Monitor Production
- Watch Firebase Console for security rule violations
- Monitor error logs
- Set up alerts for unusual patterns

---

## Additional Resources

- [Firebase Security Rules Documentation](https://firebase.google.com/docs/firestore/security/get-started)
- [Security Rules Testing Guide](https://firebase.google.com/docs/rules/unit-tests)
- [Firebase Emulator Suite](https://firebase.google.com/docs/emulator-suite)
- [Custom Claims Documentation](https://firebase.google.com/docs/auth/admin/custom-claims)

---

## Support

For issues or questions about Firestore security rules:
1. Check Firebase Console → Firestore → Rules for error logs
2. Review this documentation
3. Test using Firebase Emulator Suite
4. Contact your development team

---

**Last Updated**: March 13, 2026  
**Version**: 1.0.0  
**Status**: Production Ready ✅
