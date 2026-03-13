/**
 * Firestore Security Rules Test Suite
 * 
 * Tests security rules for the Fixoo platform using Firebase Emulator Suite.
 * 
 * Prerequisites:
 * 1. Install Firebase CLI: npm install -g firebase-tools
 * 2. Install testing library: npm install --save-dev @firebase/testing
 * 3. Start emulators: firebase emulators:start
 * 4. Run tests: npm test
 */

const firebase = require('@firebase/testing');
const fs = require('fs');

// Test project ID
const PROJECT_ID = 'fixoo-test';

// Load security rules
const rules = fs.readFileSync('firestore.rules', 'utf8');

/**
 * Helper function to create authenticated app
 */
function getAuthedApp(auth) {
  return firebase.initializeTestApp({
    projectId: PROJECT_ID,
    auth: auth
  }).firestore();
}

/**
 * Helper function to create admin app (bypasses security rules)
 */
function getAdminApp() {
  return firebase.initializeAdminApp({
    projectId: PROJECT_ID
  }).firestore();
}

/**
 * Setup: Load security rules before tests
 */
beforeAll(async () => {
  await firebase.loadFirestoreRules({
    projectId: PROJECT_ID,
    rules: rules
  });
});

/**
 * Cleanup: Clear Firestore data after each test
 */
afterEach(async () => {
  await firebase.clearFirestoreData({ projectId: PROJECT_ID });
});

/**
 * Cleanup: Delete all apps after tests
 */
afterAll(async () => {
  await Promise.all(firebase.apps().map(app => app.delete()));
});

// ============================================================================
// USERS COLLECTION TESTS
// ============================================================================

describe('Users Collection Security Rules', () => {
  
  test('User can read their own document', async () => {
    const db = getAuthedApp({ uid: 'user123', email: 'user@test.com' });
    const adminDb = getAdminApp();
    
    // Create user document as admin
    await adminDb.collection('users').doc('user123').set({
      uid: 'user123',
      email: 'user@test.com',
      role: 'customer'
    });
    
    // User should be able to read their own document
    const doc = db.collection('users').doc('user123');
    await firebase.assertSucceeds(doc.get());
  });
  
  test('User cannot read another user document', async () => {
    const db = getAuthedApp({ uid: 'user123' });
    const adminDb = getAdminApp();
    
    // Create another user document as admin
    await adminDb.collection('users').doc('user456').set({
      uid: 'user456',
      email: 'other@test.com',
      role: 'customer'
    });
    
    // User should NOT be able to read another user's document
    const doc = db.collection('users').doc('user456');
    await firebase.assertFails(doc.get());
  });
  
  test('User can update their own document', async () => {
    const db = getAuthedApp({ uid: 'user123' });
    const adminDb = getAdminApp();
    
    // Create user document as admin
    await adminDb.collection('users').doc('user123').set({
      uid: 'user123',
      email: 'user@test.com',
      role: 'customer'
    });
    
    // User should be able to update their own document
    const doc = db.collection('users').doc('user123');
    await firebase.assertSucceeds(doc.update({ name: 'Updated Name' }));
  });
  
  test('Admin can read all user documents', async () => {
    const adminDb = getAdminApp();
    
    // Create admin user
    await adminDb.collection('users').doc('admin123').set({
      uid: 'admin123',
      email: 'admin@test.com',
      role: 'admin'
    });
    
    // Create another user
    await adminDb.collection('users').doc('user456').set({
      uid: 'user456',
      email: 'user@test.com',
      role: 'customer'
    });
    
    const db = getAuthedApp({ uid: 'admin123' });
    
    // Admin should be able to read other user documents
    const doc = db.collection('users').doc('user456');
    await firebase.assertSucceeds(doc.get());
  });
});

// ============================================================================
// SERVICES COLLECTION TESTS
// ============================================================================

describe('Services Collection Security Rules', () => {
  
  test('Anyone can read services (public catalog)', async () => {
    const adminDb = getAdminApp();
    
    // Create service as admin
    await adminDb.collection('services').doc('service123').set({
      name: 'Plumbing',
      description: 'Professional plumbing services'
    });
    
    // Authenticated user should be able to read
    const db = getAuthedApp({ uid: 'user123' });
    const doc = db.collection('services').doc('service123');
    await firebase.assertSucceeds(doc.get());
  });
  
  test('Non-admin cannot create services', async () => {
    const adminDb = getAdminApp();
    
    // Create customer user
    await adminDb.collection('users').doc('user123').set({
      uid: 'user123',
      email: 'user@test.com',
      role: 'customer'
    });
    
    const db = getAuthedApp({ uid: 'user123' });
    
    // Customer should NOT be able to create services
    const doc = db.collection('services').doc('service123');
    await firebase.assertFails(doc.set({
      name: 'Plumbing',
      description: 'Professional plumbing services'
    }));
  });
  
  test('Admin can create services', async () => {
    const adminDb = getAdminApp();
    
    // Create admin user
    await adminDb.collection('users').doc('admin123').set({
      uid: 'admin123',
      email: 'admin@test.com',
      role: 'admin'
    });
    
    const db = getAuthedApp({ uid: 'admin123' });
    
    // Admin should be able to create services
    const doc = db.collection('services').doc('service123');
    await firebase.assertSucceeds(doc.set({
      name: 'Plumbing',
      description: 'Professional plumbing services'
    }));
  });
});

// ============================================================================
// PROVIDERS COLLECTION TESTS
// ============================================================================

describe('Providers Collection Security Rules', () => {
  
  test('Anyone can read providers (public listings)', async () => {
    const adminDb = getAdminApp();
    
    // Create provider as admin
    await adminDb.collection('providers').doc('provider123').set({
      userId: 'user123',
      name: 'John Plumber',
      serviceType: 'plumbing'
    });
    
    // Authenticated user should be able to read
    const db = getAuthedApp({ uid: 'user456' });
    const doc = db.collection('providers').doc('provider123');
    await firebase.assertSucceeds(doc.get());
  });
  
  test('Provider can update their own profile', async () => {
    const adminDb = getAdminApp();
    
    // Create provider user
    await adminDb.collection('users').doc('provider123').set({
      uid: 'provider123',
      email: 'provider@test.com',
      role: 'provider'
    });
    
    // Create provider profile
    await adminDb.collection('providers').doc('provider123').set({
      userId: 'provider123',
      name: 'John Plumber',
      serviceType: 'plumbing'
    });
    
    const db = getAuthedApp({ uid: 'provider123' });
    
    // Provider should be able to update their own profile
    const doc = db.collection('providers').doc('provider123');
    await firebase.assertSucceeds(doc.update({ name: 'Updated Name' }));
  });
  
  test('Provider cannot update another provider profile', async () => {
    const adminDb = getAdminApp();
    
    // Create provider user
    await adminDb.collection('users').doc('provider123').set({
      uid: 'provider123',
      email: 'provider@test.com',
      role: 'provider'
    });
    
    // Create another provider profile
    await adminDb.collection('providers').doc('provider456').set({
      userId: 'provider456',
      name: 'Jane Electrician',
      serviceType: 'electrical'
    });
    
    const db = getAuthedApp({ uid: 'provider123' });
    
    // Provider should NOT be able to update another provider's profile
    const doc = db.collection('providers').doc('provider456');
    await firebase.assertFails(doc.update({ name: 'Hacked Name' }));
  });
});

// ============================================================================
// BOOKINGS COLLECTION TESTS
// ============================================================================

describe('Bookings Collection Security Rules', () => {
  
  test('Customer can create booking with their own customerId', async () => {
    const adminDb = getAdminApp();
    
    // Create customer user
    await adminDb.collection('users').doc('customer123').set({
      uid: 'customer123',
      email: 'customer@test.com',
      role: 'customer'
    });
    
    const db = getAuthedApp({ uid: 'customer123' });
    
    // Customer should be able to create booking
    const doc = db.collection('bookings').doc('booking123');
    await firebase.assertSucceeds(doc.set({
      customerId: 'customer123',
      serviceType: 'plumbing',
      status: 'pending'
    }));
  });
  
  test('Customer cannot create booking with different customerId', async () => {
    const adminDb = getAdminApp();
    
    // Create customer user
    await adminDb.collection('users').doc('customer123').set({
      uid: 'customer123',
      email: 'customer@test.com',
      role: 'customer'
    });
    
    const db = getAuthedApp({ uid: 'customer123' });
    
    // Customer should NOT be able to create booking with different customerId
    const doc = db.collection('bookings').doc('booking123');
    await firebase.assertFails(doc.set({
      customerId: 'customer456',  // Different customer ID
      serviceType: 'plumbing',
      status: 'pending'
    }));
  });
  
  test('Customer can read their own bookings', async () => {
    const adminDb = getAdminApp();
    
    // Create customer user
    await adminDb.collection('users').doc('customer123').set({
      uid: 'customer123',
      email: 'customer@test.com',
      role: 'customer'
    });
    
    // Create booking as admin
    await adminDb.collection('bookings').doc('booking123').set({
      customerId: 'customer123',
      serviceType: 'plumbing',
      status: 'pending'
    });
    
    const db = getAuthedApp({ uid: 'customer123' });
    
    // Customer should be able to read their own booking
    const doc = db.collection('bookings').doc('booking123');
    await firebase.assertSucceeds(doc.get());
  });
  
  test('Customer cannot read another customer bookings', async () => {
    const adminDb = getAdminApp();
    
    // Create customer user
    await adminDb.collection('users').doc('customer123').set({
      uid: 'customer123',
      email: 'customer@test.com',
      role: 'customer'
    });
    
    // Create booking for another customer
    await adminDb.collection('bookings').doc('booking456').set({
      customerId: 'customer456',
      serviceType: 'plumbing',
      status: 'pending'
    });
    
    const db = getAuthedApp({ uid: 'customer123' });
    
    // Customer should NOT be able to read another customer's booking
    const doc = db.collection('bookings').doc('booking456');
    await firebase.assertFails(doc.get());
  });
  
  test('Provider can read bookings assigned to them', async () => {
    const adminDb = getAdminApp();
    
    // Create provider user
    await adminDb.collection('users').doc('provider123').set({
      uid: 'provider123',
      email: 'provider@test.com',
      role: 'provider'
    });
    
    // Create booking assigned to provider
    await adminDb.collection('bookings').doc('booking123').set({
      customerId: 'customer123',
      providerId: 'provider123',
      serviceType: 'plumbing',
      status: 'accepted'
    });
    
    const db = getAuthedApp({ uid: 'provider123' });
    
    // Provider should be able to read their assigned booking
    const doc = db.collection('bookings').doc('booking123');
    await firebase.assertSucceeds(doc.get());
  });
  
  test('Provider can update bookings assigned to them', async () => {
    const adminDb = getAdminApp();
    
    // Create provider user
    await adminDb.collection('users').doc('provider123').set({
      uid: 'provider123',
      email: 'provider@test.com',
      role: 'provider'
    });
    
    // Create booking assigned to provider
    await adminDb.collection('bookings').doc('booking123').set({
      customerId: 'customer123',
      providerId: 'provider123',
      serviceType: 'plumbing',
      status: 'accepted'
    });
    
    const db = getAuthedApp({ uid: 'provider123' });
    
    // Provider should be able to update booking status
    const doc = db.collection('bookings').doc('booking123');
    await firebase.assertSucceeds(doc.update({ status: 'on_the_way' }));
  });
  
  test('Customer can update their own bookings', async () => {
    const adminDb = getAdminApp();
    
    // Create customer user
    await adminDb.collection('users').doc('customer123').set({
      uid: 'customer123',
      email: 'customer@test.com',
      role: 'customer'
    });
    
    // Create booking
    await adminDb.collection('bookings').doc('booking123').set({
      customerId: 'customer123',
      serviceType: 'plumbing',
      status: 'pending'
    });
    
    const db = getAuthedApp({ uid: 'customer123' });
    
    // Customer should be able to cancel their booking
    const doc = db.collection('bookings').doc('booking123');
    await firebase.assertSucceeds(doc.update({ status: 'cancelled' }));
  });
});

// ============================================================================
// ADMIN ROLE TESTS
// ============================================================================

describe('Admin Role Security Rules', () => {
  
  test('Admin can read all bookings', async () => {
    const adminDb = getAdminApp();
    
    // Create admin user
    await adminDb.collection('users').doc('admin123').set({
      uid: 'admin123',
      email: 'admin@test.com',
      role: 'admin'
    });
    
    // Create booking for another customer
    await adminDb.collection('bookings').doc('booking123').set({
      customerId: 'customer456',
      serviceType: 'plumbing',
      status: 'pending'
    });
    
    const db = getAuthedApp({ uid: 'admin123' });
    
    // Admin should be able to read any booking
    const doc = db.collection('bookings').doc('booking123');
    await firebase.assertSucceeds(doc.get());
  });
  
  test('Admin can update any booking', async () => {
    const adminDb = getAdminApp();
    
    // Create admin user
    await adminDb.collection('users').doc('admin123').set({
      uid: 'admin123',
      email: 'admin@test.com',
      role: 'admin'
    });
    
    // Create booking
    await adminDb.collection('bookings').doc('booking123').set({
      customerId: 'customer456',
      serviceType: 'plumbing',
      status: 'pending'
    });
    
    const db = getAuthedApp({ uid: 'admin123' });
    
    // Admin should be able to update any booking
    const doc = db.collection('bookings').doc('booking123');
    await firebase.assertSucceeds(doc.update({ status: 'completed' }));
  });
  
  test('Admin can delete bookings', async () => {
    const adminDb = getAdminApp();
    
    // Create admin user
    await adminDb.collection('users').doc('admin123').set({
      uid: 'admin123',
      email: 'admin@test.com',
      role: 'admin'
    });
    
    // Create booking
    await adminDb.collection('bookings').doc('booking123').set({
      customerId: 'customer456',
      serviceType: 'plumbing',
      status: 'pending'
    });
    
    const db = getAuthedApp({ uid: 'admin123' });
    
    // Admin should be able to delete bookings
    const doc = db.collection('bookings').doc('booking123');
    await firebase.assertSucceeds(doc.delete());
  });
});

console.log('✅ All security rule tests completed!');
