# 🛠️ Fixoo - Complete Home Services Platform

## Overview

Fixoo is a comprehensive home services platform built with Next.js, Firebase, and Cloud Firestore. The platform connects customers with verified service providers for various home services including electrical work, plumbing, AC repair, cleaning, and carpentry.

---

## ✨ Features

### 🔐 Authentication & Authorization
- Google OAuth authentication via Firebase
- JWT token management with automatic refresh
- Role-based access control (Customer, Provider, Admin, Staff)
- Automatic role assignment based on email
- Protected routes and API endpoints

### 📱 Customer Features
- Browse available services
- Filter providers by service type
- Create and manage bookings
- Real-time booking status tracking
- Live location tracking
- In-app chat and audio assistant
- Payment processing
- Profile management
- Booking history

### 👷 Provider Features
- Provider dashboard with job requests
- Accept or reject bookings
- Update booking status in real-time
- View earnings and statistics
- Online/offline status toggle
- Performance metrics
- Job completion tracking

### 💳 Payment System
- Automatic payment trigger on service completion
- Demo payment processing
- Payment history tracking
- Provider earnings calculation
- Customer spending analytics
- Secure payment records

### 🔒 Security
- Comprehensive Firestore security rules
- Role-based data access
- Admin override functionality
- Payment data protection
- User data privacy

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- Firebase project created
- Google OAuth configured in Firebase

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd fixoo-platform
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**

Create `.env.local` file:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

4. **Deploy Firestore security rules**
```bash
firebase deploy --only firestore:rules
```

5. **Seed demo providers**
```bash
npm run seed:providers
```

6. **Start development server**
```bash
npm run dev
```

7. **Open browser**
```
http://localhost:3000
```

---

## 📚 Documentation

### Getting Started
- `START_HERE.md` - Complete getting started guide
- `QUICK_REFERENCE.md` - Quick command reference
- `PAYMENT_QUICK_START.md` - Payment flow quick start

### Implementation Guides
- `IMPLEMENTATION_STATUS.md` - Complete feature status
- `FIREBASE_AUTH_COMPLETE.md` - Authentication implementation
- `FIRESTORE_INTEGRATION_COMPLETE.md` - Database integration
- `PAYMENT_IMPLEMENTATION_COMPLETE.md` - Payment system
- `BACKEND_IMPLEMENTATION_COMPLETE.md` - Backend features
- `ROLE_ASSIGNMENT_COMPLETE.md` - Role management

### Security & Deployment
- `FIRESTORE_SECURITY_RULES.md` - Security rules guide
- `SECURITY_IMPLEMENTATION_COMPLETE.md` - Security overview
- `DEPLOYMENT_CHECKLIST.md` - Production deployment

---

## 🏗️ Tech Stack

### Frontend
- **Framework**: Next.js 13 (App Router)
- **UI Library**: React 18
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn UI
- **Icons**: Lucide React
- **Notifications**: Sonner

### Backend
- **Authentication**: Firebase Authentication
- **Database**: Cloud Firestore
- **Storage**: Firebase Storage
- **Hosting**: Netlify (configured)

### Development
- **Language**: JavaScript/TypeScript
- **Package Manager**: npm
- **Testing**: Jest
- **Linting**: ESLint

---

## 📁 Project Structure

```
fixoo-platform/
├── app/                      # Next.js app directory
│   ├── booking/             # Booking creation
│   ├── tracking/            # Booking tracking
│   ├── payment/             # Payment processing
│   ├── provider-dashboard/  # Provider interface
│   └── profile/             # User profile
├── components/              # React components
│   ├── ui/                  # Shadcn UI components
│   ├── BookingForm.jsx
│   ├── Navbar.jsx
│   └── Sidebar.jsx
├── contexts/                # React contexts
│   ├── AuthContext.jsx
│   └── LanguageContext.jsx
├── hooks/                   # Custom React hooks
│   ├── useAuth.js
│   ├── useBooking.js
│   ├── usePayment.js
│   └── useProviders.js
├── lib/                     # Utility libraries
│   ├── firebase.js
│   └── utils.ts
├── services/                # Service layer
│   ├── authService.js
│   ├── bookingService.js
│   ├── paymentService.js
│   └── providerService.js
├── scripts/                 # Utility scripts
│   └── seedProviders.js
└── firestore.rules          # Security rules
```

---

## 🔑 Test Accounts

### Customer Account
- **Email**: Any Google account (except provider email)
- **Role**: Customer
- **Access**: Booking, tracking, payment

### Provider Account
- **Email**: `echiesta-techsupport@eitfaridabad.co.in`
- **Role**: Provider
- **Access**: Provider dashboard, job management

---

## 🛠️ Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run build            # Build for production
npm run start            # Start production server

# Testing
npm run typecheck        # Run TypeScript checks
npm test                 # Run tests
npm run test:security    # Run security tests

# Firebase
npm run emulators        # Start Firebase emulators
npm run seed:providers   # Seed demo providers

# Linting
npm run lint             # Run ESLint
```

---

## 🎯 User Flows

### Customer Booking Flow
```
1. Login with Google
2. Navigate to /booking
3. Select service type (e.g., "electrician")
4. View filtered providers
5. Select provider (optional)
6. Fill booking form
7. Submit booking
8. Track booking on /tracking page
9. Wait for service completion
10. Proceed to payment
11. Complete payment
```

### Provider Job Flow
```
1. Login with provider email
2. View pending jobs on dashboard
3. Accept job
4. Update status: "On The Way"
5. Update status: "In Progress"
6. Update status: "Completed"
7. Customer pays
8. View earnings
```

---

## 💾 Database Collections

### users
```javascript
{
  uid: string,
  name: string,
  email: string,
  role: "customer" | "provider" | "admin" | "staff",
  photoURL: string,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### providers
```javascript
{
  name: string,
  serviceType: string,
  rating: number,
  experience: string,
  jobsCompleted: number,
  lat: number,
  lng: number,
  available: boolean,
  phone: string,
  description: string,
  specialties: array,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### bookings
```javascript
{
  customerId: string,
  providerId: string,
  serviceType: string,
  description: string,
  address: string,
  preferredDate: string,
  preferredTime: string,
  status: "pending" | "accepted" | "on_the_way" | "in_progress" | "completed" | "cancelled",
  paymentRequired: boolean,
  paymentStatus: "pending" | "paid",
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### payments
```javascript
{
  bookingId: string,
  customerId: string,
  providerId: string,
  amount: number,
  status: "paid",
  paymentMethod: "demo",
  paidAt: timestamp,
  createdAt: timestamp
}
```

---

## 🔒 Security

### Authentication
- Firebase Authentication with Google OAuth
- JWT token management
- Automatic token refresh
- Session persistence

### Authorization
- Role-based access control
- Firestore security rules
- Protected routes
- API authentication

### Data Protection
- User data privacy
- Payment data security
- Provider information protection
- Admin-only operations

---

## 🌐 Deployment

### Netlify (Configured)
```bash
# Build command
npm run build

# Publish directory
.next

# Environment variables
Set in Netlify dashboard
```

### Firebase
```bash
# Deploy security rules
firebase deploy --only firestore:rules

# Deploy functions (if any)
firebase deploy --only functions
```

---

## 📊 Features Status

| Feature | Status | Notes |
|---------|--------|-------|
| Authentication | ✅ Complete | Google OAuth |
| Role Management | ✅ Complete | Auto-assignment |
| Booking System | ✅ Complete | Full lifecycle |
| Provider Dashboard | ✅ Complete | Real-time updates |
| Payment Flow | ✅ Complete | Demo mode |
| Security Rules | ✅ Complete | Comprehensive |
| Profile Management | ✅ Complete | Full CRUD |
| Real-time Updates | ✅ Complete | Firestore sync |

---

## 🚨 Important Notes

### Demo Payment
- Current payment system is in demo mode
- No real payment gateway integration
- Suitable for development and testing
- For production: Integrate Razorpay/Stripe/PayPal

### Provider Seeding
- Run `npm run seed:providers` once after setup
- Creates 15 demo providers across 5 service types
- Required for provider filtering to work

### Security Rules
- Deploy rules before testing
- Test with Firebase Emulator Suite
- Monitor Firebase Console for violations

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 📝 License

This project is licensed under the MIT License.

---

## 📞 Support

For issues or questions:
- Check documentation in `/docs` folder
- Review `IMPLEMENTATION_STATUS.md` for feature details
- Check Firebase Console for errors
- Run `npm run typecheck` for code issues

---

## 🎉 Acknowledgments

- Next.js team for the amazing framework
- Firebase team for backend services
- Shadcn for beautiful UI components
- Lucide for icon library

---

## 📈 Roadmap

### Phase 1 (Current) ✅
- [x] Authentication system
- [x] Booking system
- [x] Provider dashboard
- [x] Payment flow (demo)
- [x] Security rules

### Phase 2 (Planned)
- [ ] Real payment gateway integration
- [ ] Email notifications
- [ ] SMS notifications
- [ ] Push notifications
- [ ] Advanced analytics

### Phase 3 (Future)
- [ ] Mobile app (React Native)
- [ ] Provider mobile app
- [ ] Admin panel enhancements
- [ ] AI-powered provider matching
- [ ] Automated scheduling

---

**Built with ❤️ using Next.js and Firebase**

**Version**: 1.0.0  
**Last Updated**: March 13, 2026  
**Status**: Production Ready (Demo Payment) ✅
