# 🚀 Payment Flow - Quick Start Guide

## Getting Started in 5 Minutes

### Step 1: Seed Demo Providers (One-time setup)

```bash
npm run seed:providers
```

Expected output:
```
✅ Successfully added: 15 providers
```

---

### Step 2: Test Provider Filtering

1. Start the app: `npm run dev`
2. Login as customer
3. Go to `/booking` page
4. Select service type from dropdown
5. Watch providers appear automatically!

**Service Types Available:**
- electrician (3 providers)
- plumber (3 providers)
- ac_repair (3 providers)
- cleaning (3 providers)
- carpenter (3 providers)

---

### Step 3: Create a Test Booking

1. On booking page, select "electrician"
2. Click on a provider (e.g., "Rajesh Kumar")
3. Fill the form:
   - Description: "Need to fix wiring"
   - Address: "123 Main St"
   - Date: Tomorrow
   - Time: "10:00 AM"
4. Click "Book Service"
5. Note the booking ID from URL

---

### Step 4: Accept Booking (As Provider)

1. Logout and login as provider
   - Email: `echiesta-techsupport@eitfaridabad.co.in`
2. Go to provider dashboard
3. See your pending booking
4. Click "Accept Job"

---

### Step 5: Complete the Service

Update booking status through provider dashboard:
1. `pending` → Click "Accept"
2. `accepted` → Update to "On The Way"
3. `on_the_way` → Update to "In Progress"
4. `in_progress` → Update to "Completed"

**Note:** When status becomes "completed", payment is automatically triggered!

---

### Step 6: Process Payment

1. Logout and login as customer
2. Go to tracking page (or click notification)
3. See green "Proceed to Payment" button
4. Click button → redirects to `/payment/{bookingId}`
5. Review details:
   - Service: electrician
   - Provider: Rajesh Kumar
   - Amount: ₹471 (₹399 + ₹72 GST)
6. Click "Pay Now"
7. Wait 1.5 seconds (demo processing)
8. See success message
9. Auto-redirect to tracking page

**Done!** 🎉

---

## Quick Commands

```bash
# Seed providers
npm run seed:providers

# Start dev server
npm run dev

# Check for errors
npm run typecheck

# Run tests
npm test
```

---

## Quick URLs

- Booking Page: `http://localhost:3000/booking`
- Tracking Page: `http://localhost:3000/tracking?id={bookingId}`
- Payment Page: `http://localhost:3000/payment/{bookingId}`
- Provider Dashboard: `http://localhost:3000/provider-dashboard`

---

## Test Accounts

### Customer (Default)
- Any Google account except the provider email below

### Provider
- Email: `echiesta-techsupport@eitfaridabad.co.in`
- Login via Google OAuth

---

## Demo Providers

### Electricians
1. Rajesh Kumar - ⭐ 4.8 - 6 years - 342 jobs
2. Amit Sharma - ⭐ 4.6 - 4 years - 215 jobs
3. Vikram Singh - ⭐ 4.9 - 8 years - 456 jobs

### Plumbers
1. Suresh Yadav - ⭐ 4.7 - 5 years - 289 jobs
2. Ramesh Patel - ⭐ 4.5 - 7 years - 378 jobs
3. Dinesh Kumar - ⭐ 4.8 - 6 years - 312 jobs

### AC Repair
1. Manoj Verma - ⭐ 4.9 - 9 years - 521 jobs
2. Anil Gupta - ⭐ 4.7 - 5 years - 267 jobs
3. Sanjay Mehta - ⭐ 4.6 - 4 years - 198 jobs

### Cleaning
1. Priya Devi - ⭐ 4.8 - 3 years - 445 jobs
2. Sunita Sharma - ⭐ 4.7 - 4 years - 389 jobs
3. Rekha Singh - ⭐ 4.9 - 5 years - 512 jobs

### Carpenter
1. Ravi Tiwari - ⭐ 4.7 - 10 years - 623 jobs
2. Mohan Lal - ⭐ 4.6 - 8 years - 478 jobs
3. Prakash Rao - ⭐ 4.8 - 7 years - 401 jobs

---

## Payment Details

### Demo Payment
- **Base Amount**: ₹399
- **GST (18%)**: ₹72
- **Total**: ₹471
- **Processing Time**: 1.5 seconds
- **Success Rate**: 100% (demo mode)

### Payment Flow
```
Booking Completed
    ↓
paymentRequired = true
    ↓
"Proceed to Payment" button appears
    ↓
Customer clicks button
    ↓
Payment page loads
    ↓
Customer clicks "Pay Now"
    ↓
Demo payment processes (1.5s)
    ↓
Payment record created
    ↓
Booking updated
    ↓
Success! ✅
```

---

## Troubleshooting

### Providers not appearing?
1. Check if you ran `npm run seed:providers`
2. Check Firebase Console → Firestore → providers collection
3. Verify 15 documents exist

### Payment button not showing?
1. Check booking status is "completed"
2. Check `paymentRequired` field is `true`
3. Refresh the tracking page

### Payment fails?
1. Check user is authenticated
2. Check booking exists
3. Check Firebase Console for errors
4. Verify security rules are deployed

### Seed script fails?
1. Check `.env.local` has Firebase config
2. Verify Firebase project is active
3. Check internet connection
4. Check Firestore security rules allow writes

---

## Firebase Console Checks

### After Seeding:
1. Go to Firebase Console
2. Navigate to Firestore Database
3. Check `providers` collection
4. Should see 15 documents

### After Payment:
1. Go to Firebase Console
2. Navigate to Firestore Database
3. Check `payments` collection
4. Should see payment document
5. Check `bookings` collection
6. Verify booking has `paymentStatus: "paid"`

---

## Next Steps

1. ✅ Seed providers
2. ✅ Test provider filtering
3. ✅ Create test booking
4. ✅ Accept as provider
5. ✅ Complete service
6. ✅ Process payment
7. 🎉 Celebrate!

---

## Support

Need help?
- Check `PAYMENT_IMPLEMENTATION_COMPLETE.md` for detailed docs
- Check Firebase Console logs
- Verify all environment variables are set
- Run `npm run typecheck` to check for errors

---

**Happy Testing! 🚀**
