# 📊 Sample Data for Firestore

Use this data to populate your Firestore database for testing.

---

## 🛠️ Services Collection

Create collection: `services`

### Document ID: `electrician`
```json
{
  "name": "Electrician",
  "icon": "⚡",
  "active": true,
  "description": "Electrical repairs and installations",
  "priceRange": {
    "min": 299,
    "max": 999
  }
}
```

### Document ID: `plumber`
```json
{
  "name": "Plumber",
  "icon": "🔧",
  "active": true,
  "description": "Plumbing repairs and installations",
  "priceRange": {
    "min": 299,
    "max": 799
  }
}
```

### Document ID: `cleaning`
```json
{
  "name": "Cleaning",
  "icon": "🧹",
  "active": true,
  "description": "Home and office cleaning services",
  "priceRange": {
    "min": 199,
    "max": 599
  }
}
```

### Document ID: `ac-repair`
```json
{
  "name": "AC Repair",
  "icon": "❄️",
  "active": true,
  "description": "AC repair and maintenance",
  "priceRange": {
    "min": 399,
    "max": 1299
  }
}
```

### Document ID: `appliance`
```json
{
  "name": "Appliance Repair",
  "icon": "🔌",
  "active": true,
  "description": "Home appliance repairs",
  "priceRange": {
    "min": 299,
    "max": 999
  }
}
```

### Document ID: `delivery`
```json
{
  "name": "Delivery Helper",
  "icon": "📦",
  "active": true,
  "description": "Delivery and moving assistance",
  "priceRange": {
    "min": 199,
    "max": 499
  }
}
```

---

## 👷 Providers Collection

Create collection: `providers`

### Document ID: Auto-generate

```json
{
  "userId": "provider_user_1",
  "name": "Rajesh Kumar",
  "serviceType": "electrician",
  "rating": 4.8,
  "experience": "6 years",
  "completedJobs": 342,
  "available": true,
  "avatar": "https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=200",
  "phone": "+91 98765 43210",
  "distance": "2.5 km"
}
```

```json
{
  "userId": "provider_user_2",
  "name": "Amit Sharma",
  "serviceType": "plumber",
  "rating": 4.9,
  "experience": "8 years",
  "completedJobs": 456,
  "available": true,
  "avatar": "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=200",
  "phone": "+91 98765 43211",
  "distance": "1.8 km"
}
```

```json
{
  "userId": "provider_user_3",
  "name": "Priya Patel",
  "serviceType": "cleaning",
  "rating": 4.7,
  "experience": "4 years",
  "completedJobs": 289,
  "available": true,
  "avatar": "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=200",
  "phone": "+91 98765 43212",
  "distance": "3.2 km"
}
```

```json
{
  "userId": "provider_user_4",
  "name": "Vikram Singh",
  "serviceType": "ac-repair",
  "rating": 4.6,
  "experience": "5 years",
  "completedJobs": 198,
  "available": true,
  "avatar": "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=200",
  "phone": "+91 98765 43213",
  "distance": "4.1 km"
}
```

```json
{
  "userId": "provider_user_5",
  "name": "Sunita Reddy",
  "serviceType": "appliance",
  "rating": 4.9,
  "experience": "7 years",
  "completedJobs": 523,
  "available": true,
  "avatar": "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=200",
  "phone": "+91 98765 43214",
  "distance": "2.9 km"
}
```

```json
{
  "userId": "provider_user_6",
  "name": "Mohammed Ali",
  "serviceType": "delivery",
  "rating": 4.5,
  "experience": "3 years",
  "completedJobs": 167,
  "available": true,
  "avatar": "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=200",
  "phone": "+91 98765 43215",
  "distance": "1.5 km"
}
```

```json
{
  "userId": "provider_user_7",
  "name": "Deepak Verma",
  "serviceType": "electrician",
  "rating": 4.7,
  "experience": "9 years",
  "completedJobs": 612,
  "available": true,
  "avatar": "https://images.pexels.com/photos/1212984/pexels-photo-1212984.jpeg?auto=compress&cs=tinysrgb&w=200",
  "phone": "+91 98765 43216",
  "distance": "3.7 km"
}
```

```json
{
  "userId": "provider_user_8",
  "name": "Kavita Desai",
  "serviceType": "plumber",
  "rating": 4.8,
  "experience": "6 years",
  "completedJobs": 389,
  "available": true,
  "avatar": "https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=200",
  "phone": "+91 98765 43217",
  "distance": "2.2 km"
}
```

---

## 📝 Quick Setup Script

You can also use this JavaScript to add data programmatically:

```javascript
// Run this in Firebase Console → Firestore → Add data

// Services
const services = [
  { id: 'electrician', name: 'Electrician', icon: '⚡', active: true, description: 'Electrical repairs and installations', priceRange: { min: 299, max: 999 } },
  { id: 'plumber', name: 'Plumber', icon: '🔧', active: true, description: 'Plumbing repairs and installations', priceRange: { min: 299, max: 799 } },
  { id: 'cleaning', name: 'Cleaning', icon: '🧹', active: true, description: 'Home and office cleaning services', priceRange: { min: 199, max: 599 } },
  { id: 'ac-repair', name: 'AC Repair', icon: '❄️', active: true, description: 'AC repair and maintenance', priceRange: { min: 399, max: 1299 } },
  { id: 'appliance', name: 'Appliance Repair', icon: '🔌', active: true, description: 'Home appliance repairs', priceRange: { min: 299, max: 999 } },
  { id: 'delivery', name: 'Delivery Helper', icon: '📦', active: true, description: 'Delivery and moving assistance', priceRange: { min: 199, max: 499 } }
];

// Providers
const providers = [
  { userId: 'provider_user_1', name: 'Rajesh Kumar', serviceType: 'electrician', rating: 4.8, experience: '6 years', completedJobs: 342, available: true, avatar: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=200', phone: '+91 98765 43210', distance: '2.5 km' },
  { userId: 'provider_user_2', name: 'Amit Sharma', serviceType: 'plumber', rating: 4.9, experience: '8 years', completedJobs: 456, available: true, avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=200', phone: '+91 98765 43211', distance: '1.8 km' },
  { userId: 'provider_user_3', name: 'Priya Patel', serviceType: 'cleaning', rating: 4.7, experience: '4 years', completedJobs: 289, available: true, avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=200', phone: '+91 98765 43212', distance: '3.2 km' },
  { userId: 'provider_user_4', name: 'Vikram Singh', serviceType: 'ac-repair', rating: 4.6, experience: '5 years', completedJobs: 198, available: true, avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=200', phone: '+91 98765 43213', distance: '4.1 km' },
  { userId: 'provider_user_5', name: 'Sunita Reddy', serviceType: 'appliance', rating: 4.9, experience: '7 years', completedJobs: 523, available: true, avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=200', phone: '+91 98765 43214', distance: '2.9 km' },
  { userId: 'provider_user_6', name: 'Mohammed Ali', serviceType: 'delivery', rating: 4.5, experience: '3 years', completedJobs: 167, available: true, avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=200', phone: '+91 98765 43215', distance: '1.5 km' },
  { userId: 'provider_user_7', name: 'Deepak Verma', serviceType: 'electrician', rating: 4.7, experience: '9 years', completedJobs: 612, available: true, avatar: 'https://images.pexels.com/photos/1212984/pexels-photo-1212984.jpeg?auto=compress&cs=tinysrgb&w=200', phone: '+91 98765 43216', distance: '3.7 km' },
  { userId: 'provider_user_8', name: 'Kavita Desai', serviceType: 'plumber', rating: 4.8, experience: '6 years', completedJobs: 389, available: true, avatar: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=200', phone: '+91 98765 43217', distance: '2.2 km' }
];
```

---

## 🚀 How to Add Data

### Method 1: Firebase Console (Recommended)

1. Go to Firebase Console → Firestore Database
2. Click "Start collection"
3. Collection ID: `services`
4. Add documents with IDs and data from above
5. Repeat for `providers` collection

### Method 2: Using Firebase Admin SDK

Create a script to import data:

```javascript
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Add services
services.forEach(async (service) => {
  await db.collection('services').doc(service.id).set(service);
});

// Add providers
providers.forEach(async (provider) => {
  await db.collection('providers').add(provider);
});
```

---

## ✅ Verification

After adding data, verify:

1. **Services**: Go to http://localhost:3000/booking
   - Service dropdown should show all services with icons

2. **Providers**: Select a service type
   - Providers should appear in the right panel

3. **Create Booking**: Fill form and submit
   - Should create booking in Firestore
   - Should redirect to tracking page

---

**Note**: This is sample data for testing. In production, you would have real provider data with actual user accounts.
