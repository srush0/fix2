# Firestore Security Rules - Quick Reference

## 🚀 Quick Deploy

```bash
# Deploy rules to Firebase
firebase deploy --only firestore:rules

# Test before deploying
firebase deploy --only firestore:rules --dry-run
```

---

## 📋 Collection Access Summary

| Collection | Read | Create | Update | Delete |
|------------|------|--------|--------|--------|
| **users** | Own + Admin | Own | Own + Admin | Admin only |
| **providers** | Public | Admin | Own + Admin | Admin only |
| **services** | Public | Admin | Admin | Admin only |
| **bookings** | Own + Admin/Staff | Authenticated | Own + Admin/Staff | Admin only |

---

## 🔐 Role-Based Access

### Customer Role
- ✅ Create bookings
- ✅ Read own bookings
- ✅ Update own bookings (cancel)
- ✅ Read own profile
- ✅ Update own profile

### Provider Role
- ✅ Read assigned bookings
- ✅ Update assigned bookings (status)
- ✅ Update own provider profile
- ✅ Read own profile
- ✅ Update own profile

### Admin Role
- ✅ Full access to all collections
- ✅ Create/update/delete services
- ✅ Create/update/delete providers
- ✅ Manage all bookings
- ✅ Manage all users

### Staff Role
- ✅ Read all bookings
- ✅ Update all bookings
- ✅ Read own profile
- ✅ Update own profile

---

## 🧪 Testing Commands

### Start Emulators
```bash
firebase emulators:start
```

### Test Specific Rules
```bash
# Test users collection
firebase emulators:exec --only firestore "npm test -- users.test.js"

# Test bookings collection
firebase emulators:exec --only firestore "npm test -- bookings.test.js"
```

---

## 🔍 Common Patterns

### Check if User is Authenticated
```javascript
function isAuthenticated() {
  return request.auth != null;
}
```

### Check if User Owns Document
```javascript
function isOwner(userId) {
  return request.auth.uid == userId;
}
```

### Check User Role
```javascript
function hasRole(role) {
  return get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == role;
}
```

### Admin Override
```javascript
function isAdmin() {
  return hasRole('admin');
}
```

---

## ⚠️ Important Notes

1. **Role Lookup Performance**: The `hasRole()` function performs a Firestore read on every request. For high-traffic apps, use Custom Claims instead.

2. **Public Collections**: `services` and `providers` are publicly readable (including unauthenticated users) for browsing.

3. **Booking Security**: Bookings can only be read by the customer, assigned provider, or admin/staff.

4. **Customer ID Validation**: When creating bookings, `customerId` must match the authenticated user's UID.

---

## 🐛 Troubleshooting

### "Missing or insufficient permissions"
- ✅ Check if user is authenticated
- ✅ Verify user's role in Firestore users collection
- ✅ Ensure document IDs match (e.g., customerId == auth.uid)

### Rules not updating
- ✅ Wait 1-2 minutes for propagation
- ✅ Clear browser cache
- ✅ Verify deployment in Firebase Console

### Too many document reads
- ✅ Consider using Custom Claims for roles
- ✅ Implement caching strategy
- ✅ Monitor Firestore usage

---

## 📊 Security Rule Examples

### Example 1: Customer Creates Booking
```javascript
// ✅ ALLOWED
{
  customerId: "user123",  // matches auth.uid
  serviceType: "plumbing",
  status: "pending"
}

// ❌ DENIED
{
  customerId: "user456",  // doesn't match auth.uid
  serviceType: "plumbing",
  status: "pending"
}
```

### Example 2: Provider Updates Booking
```javascript
// ✅ ALLOWED (if providerId matches auth.uid)
{
  status: "accepted"  // provider accepting booking
}

// ❌ DENIED (if providerId doesn't match)
{
  status: "accepted"
}
```

### Example 3: Admin Creates Service
```javascript
// ✅ ALLOWED (if user role is "admin")
{
  name: "Plumbing",
  description: "Professional plumbing services",
  price: 500
}

// ❌ DENIED (if user role is not "admin")
```

---

## 🔗 Related Files

- `firestore.rules` - Main security rules file
- `FIRESTORE_SECURITY_RULES.md` - Comprehensive documentation
- `lib/firebase.js` - Firebase initialization
- `services/userService.js` - User role management

---

## 📞 Quick Links

- [Firebase Console](https://console.firebase.google.com/)
- [Firestore Rules Documentation](https://firebase.google.com/docs/firestore/security/get-started)
- [Security Rules Testing](https://firebase.google.com/docs/rules/unit-tests)

---

**Last Updated**: March 13, 2026
