# 🧪 Demo Provider System - Testing Guide

## Quick Test (5 Minutes)

### Prerequisites
- Firebase project configured
- App running: `npm run dev`
- Two browser windows or incognito mode

---

## Test Scenario: Complete Booking Flow

### Step 1: Provider Login (Window 1)

```bash
1. Open http://localhost:3000
2. Click "Login" or go to /login-selector
3. Login with Google using: echiesta-techsupport@eitfaridabad.co.in
4. Should redirect to /provider-dashboard
5. Should see "New Job Requests" section (empty initially)
```

**Expected Result**:
- ✅ Login successful
- ✅ Redirected to provider dashboard
- ✅ Role: provider
- ✅ Dashboard loads without errors

**Verify in Firestore Console**:
```
1. Go to Firebase Console → Firestore Database
2. Check "users" collection
   - Document with provider email exists
   - role: "provider"
3. Check "providers" collection
   - Document exists with:
     - email: "echiesta-techsupport@eitfaridabad.co.in"
     - serviceType: "electrician"
     - available: true
     - rating: 4.8
```

---

### Step 2: Customer Login (Window 2)

```bash
1. Open http://localhost:3000 in new window/incognito
2. Click "Login" or go to /login-selector
3. Login with Google using ANY other email
4. Should redirect to home page
```

**Expected Result**:
- ✅ Login successful
- ✅ Role: customer
- ✅ Can access booking page

---

### Step 3: Create Booking (Window 2 - Customer)

```bash
1. Go to /booking page
2. Fill the form:
   
   Service Type: Select "Electrician" ⚡
   Description: "Need to fix wiring in living room"
   Address: "123 Main Street, Faridabad"
   Date: Select tomorrow's date
   Time: "10:00 AM"
   
3. Click "Book Service"
4. Should redirect to tracking page
5. Note the booking ID in URL
```

**Expected Result**:
- ✅ Form submits successfully
- ✅ Redirected to /tracking?id={bookingId}
- ✅ Tracking page shows booking details
- ✅ Status: "Pending"

**Verify in Firestore Console**:
```
1. Go to Firestore Database → bookings collection
2. New document should exist with:
   - customerId: customer's UID
   - providerId: null
   - serviceType: "electrician"
   - status: "pending"
   - description: "Need to fix wiring in living room"
   - address: "123 Main Street, Faridabad"
```

---

### Step 4: Provider Sees Request (Window 1 - Provider)

```bash
1. Switch to provider dashboard window
2. Should see new booking appear INSTANTLY (no refresh needed!)
3. Booking card should show:
   - Service: electrician
   - Description: "Need to fix wiring in living room"
   - Address: "123 Main Street, Faridabad"
   - Date: Tomorrow
   - Time: "10:00 AM"
   - Buttons: "Reject Job" and "Accept Job"
```

**Expected Result**:
- ✅ Booking appears within 1 second
- ✅ All details are correct
- ✅ Buttons are clickable

**If booking doesn't appear**:
```
1. Check browser console for errors
2. Verify Firestore rules are deployed
3. Check booking was created in Firestore
4. Refresh provider dashboard
```

---

### Step 5: Accept Job (Window 1 - Provider)

```bash
1. Click "Accept Job" button
2. Should see success toast: "✅ Job accepted! Customer notified."
3. Booking should disappear from "New Job Requests"
4. Badge count should decrease
```

**Expected Result**:
- ✅ Success message appears
- ✅ Booking removed from pending list
- ✅ No errors in console

**Verify in Firestore Console**:
```
1. Go to bookings collection
2. Find the booking document
3. Should be updated:
   - providerId: provider's UID (not null anymore)
   - status: "accepted"
   - acceptedAt: timestamp
```

---

### Step 6: Customer Sees Update (Window 2 - Customer)

```bash
1. Switch to customer tracking page window
2. Should see status update INSTANTLY (no refresh needed!)
3. Status should change to: "Technician Assigned"
4. Provider details should appear:
   - Name
   - Rating: ⭐ 4.8
   - Experience: 5 years
   - Contact buttons: "Call Technician" and "Message"
```

**Expected Result**:
- ✅ Status updates within 1 second
- ✅ Provider details displayed
- ✅ Progress indicator shows "accepted" step

---

### Step 7: Complete Service (Window 1 - Provider)

```bash
1. In provider dashboard, find the accepted job
2. Update status through status buttons:
   - Click "On The Way"
   - Click "In Progress"
   - Click "Complete"
3. Each status change should update customer tracking page
```

**Expected Result**:
- ✅ Status updates successfully
- ✅ Customer sees real-time updates
- ✅ When "completed", payment button appears for customer

---

### Step 8: Payment (Window 2 - Customer)

```bash
1. On tracking page, should see green card:
   "Service Completed!"
   "Proceed to Payment" button
2. Click "Proceed to Payment"
3. Should redirect to /payment/{bookingId}
4. Review payment details
5. Click "Pay Now"
6. Wait 1.5 seconds (demo processing)
7. Should see success message
8. Auto-redirect to tracking page
```

**Expected Result**:
- ✅ Payment page loads
- ✅ Details are correct
- ✅ Payment processes successfully
- ✅ Booking updated with payment status

---

## Troubleshooting

### Issue 1: Provider Document Not Created

**Symptoms**:
- Provider dashboard shows errors
- Provider not found in Firestore

**Solution**:
```bash
1. Logout provider
2. Login again with: echiesta-techsupport@eitfaridabad.co.in
3. Check browser console for errors
4. Manually create provider document in Firestore if needed
```

**Manual Creation**:
```javascript
// In Firestore Console → providers collection → Add document
{
  userId: "provider_uid",
  email: "echiesta-techsupport@eitfaridabad.co.in",
  name: "Demo Provider",
  serviceType: "electrician",
  available: true,
  rating: 4.8,
  experience: "5 years",
  jobsCompleted: 0,
  phone: "+91 98765 43210",
  description: "Expert electrician",
  specialties: ["Wiring", "Circuit Repair"],
  lat: 28.4089,
  lng: 77.3178
}
```

---

### Issue 2: Booking Not Appearing in Provider Dashboard

**Symptoms**:
- Customer creates booking
- Provider dashboard doesn't show it

**Possible Causes**:
1. Firestore rules not deployed
2. Real-time listener not working
3. Booking created with wrong status

**Solutions**:

**Check 1: Firestore Rules**
```bash
firebase deploy --only firestore:rules
```

**Check 2: Booking Status**
```bash
1. Go to Firestore Console
2. Check bookings collection
3. Verify status: "pending"
4. Verify serviceType: "electrician"
```

**Check 3: Browser Console**
```bash
1. Open browser console (F12)
2. Look for errors
3. Check network tab for Firestore requests
```

**Check 4: Refresh Dashboard**
```bash
1. Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
2. Clear browser cache
3. Try in incognito mode
```

---

### Issue 3: Real-Time Updates Not Working

**Symptoms**:
- Need to refresh page to see updates
- Status changes don't appear automatically

**Solutions**:

**Check 1: Network Connection**
```bash
1. Check internet connection
2. Check Firestore status: https://status.firebase.google.com/
```

**Check 2: Browser Console**
```bash
1. Look for WebSocket errors
2. Check for Firestore connection errors
```

**Check 3: Firestore Indexes**
```bash
1. Go to Firebase Console → Firestore → Indexes
2. Check if indexes are being created
3. Wait for indexes to complete
```

---

### Issue 4: "Missing or insufficient permissions"

**Symptoms**:
- Error when creating booking
- Error when accepting job
- Error when reading bookings

**Solutions**:

**Check 1: User Authentication**
```bash
1. Verify user is logged in
2. Check Firebase Console → Authentication
3. Verify user exists
```

**Check 2: Firestore Rules**
```bash
1. Deploy rules: firebase deploy --only firestore:rules
2. Check rules in Firebase Console
3. Verify rules allow the operation
```

**Check 3: Document Structure**
```bash
1. Check booking has customerId field
2. Check user has correct role
3. Verify document exists
```

---

## Performance Testing

### Test 1: Real-Time Update Speed

```bash
1. Open provider dashboard
2. Open customer booking page in another window
3. Create booking
4. Measure time until it appears in provider dashboard
5. Should be < 1 second
```

### Test 2: Multiple Bookings

```bash
1. Create 5 bookings as customer
2. All should appear in provider dashboard
3. Accept one booking
4. Should disappear from pending list
5. Other 4 should remain
```

### Test 3: Concurrent Users

```bash
1. Open 3 browser windows
2. Login as provider in window 1
3. Login as customer in windows 2 and 3
4. Create bookings from both customer windows
5. Both should appear in provider dashboard
```

---

## Success Criteria

### ✅ Provider Setup
- [x] Provider can login
- [x] Provider document created automatically
- [x] Provider dashboard loads
- [x] No errors in console

### ✅ Booking Creation
- [x] Customer can create booking
- [x] Booking document created in Firestore
- [x] Booking has correct fields
- [x] Status is "pending"

### ✅ Real-Time Updates
- [x] Booking appears in provider dashboard instantly
- [x] No page refresh needed
- [x] Updates within 1 second

### ✅ Job Acceptance
- [x] Provider can accept job
- [x] Booking updated in Firestore
- [x] Booking removed from pending list
- [x] Customer sees update instantly

### ✅ Status Updates
- [x] Provider can update status
- [x] Customer sees updates in real-time
- [x] Progress indicator updates

### ✅ Payment Flow
- [x] Payment button appears when completed
- [x] Payment page loads
- [x] Payment processes successfully
- [x] Booking updated with payment status

---

## Quick Commands

```bash
# Start app
npm run dev

# Deploy Firestore rules
firebase deploy --only firestore:rules

# Check TypeScript
npm run typecheck

# View Firestore data
# Go to: https://console.firebase.google.com/
```

---

## Test Accounts

### Provider
- **Email**: echiesta-techsupport@eitfaridabad.co.in
- **Password**: Use Google OAuth
- **Role**: provider
- **Service**: electrician

### Customer
- **Email**: Any Google account (except provider email)
- **Password**: Use Google OAuth
- **Role**: customer

---

## Expected Timeline

- Provider login: 5 seconds
- Customer login: 5 seconds
- Create booking: 10 seconds
- Booking appears in dashboard: < 1 second
- Accept job: 2 seconds
- Customer sees update: < 1 second
- Complete service: 30 seconds
- Payment: 10 seconds

**Total**: ~2 minutes for complete flow

---

## Next Steps After Testing

1. ✅ Verify all features work
2. ✅ Check Firestore data is correct
3. ✅ Monitor for errors
4. ✅ Test edge cases
5. ✅ Document any issues
6. 🚀 Ready for demo!

---

**Happy Testing! 🎉**
