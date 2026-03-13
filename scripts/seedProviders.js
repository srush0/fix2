/**
 * Seed Demo Providers Script
 * 
 * This script populates the Firestore 'providers' collection with demo data.
 * 
 * Usage:
 * 1. Ensure Firebase is configured in lib/firebase.js
 * 2. Run: node scripts/seedProviders.js
 * 
 * Note: This is for development/demo purposes only
 */

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, serverTimestamp } = require('firebase/firestore');

// Firebase configuration (replace with your config)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Demo providers data
const demoProviders = [
  // Electricians
  {
    name: "Rajesh Kumar",
    serviceType: "electrician",
    rating: 4.8,
    experience: "6 years",
    jobsCompleted: 342,
    lat: 28.4089,
    lng: 77.3178,
    available: true,
    phone: "+91 98765 43210",
    description: "Expert in residential and commercial electrical work",
    specialties: ["Wiring", "Circuit Repair", "Panel Upgrades"]
  },
  {
    name: "Amit Sharma",
    serviceType: "electrician",
    rating: 4.6,
    experience: "4 years",
    jobsCompleted: 215,
    lat: 28.4195,
    lng: 77.3250,
    available: true,
    phone: "+91 98765 43211",
    description: "Specialized in smart home installations",
    specialties: ["Smart Home", "LED Installation", "Fault Diagnosis"]
  },
  {
    name: "Vikram Singh",
    serviceType: "electrician",
    rating: 4.9,
    experience: "8 years",
    jobsCompleted: 456,
    lat: 28.4050,
    lng: 77.3100,
    available: true,
    phone: "+91 98765 43212",
    description: "Industrial and residential electrical expert",
    specialties: ["Industrial Wiring", "Generator Installation", "Emergency Repairs"]
  },

  // Plumbers
  {
    name: "Suresh Yadav",
    serviceType: "plumber",
    rating: 4.7,
    experience: "5 years",
    jobsCompleted: 289,
    lat: 28.4120,
    lng: 77.3200,
    available: true,
    phone: "+91 98765 43213",
    description: "Expert in pipe fitting and leak repairs",
    specialties: ["Leak Repair", "Pipe Installation", "Bathroom Fitting"]
  },
  {
    name: "Ramesh Patel",
    serviceType: "plumber",
    rating: 4.5,
    experience: "7 years",
    jobsCompleted: 378,
    lat: 28.4080,
    lng: 77.3150,
    available: true,
    phone: "+91 98765 43214",
    description: "Specialized in drainage and sewage systems",
    specialties: ["Drainage", "Sewage", "Water Heater Installation"]
  },
  {
    name: "Dinesh Kumar",
    serviceType: "plumber",
    rating: 4.8,
    experience: "6 years",
    jobsCompleted: 312,
    lat: 28.4150,
    lng: 77.3280,
    available: true,
    phone: "+91 98765 43215",
    description: "Expert in modern plumbing solutions",
    specialties: ["Modern Fixtures", "Water Purifier", "Tap Repair"]
  },

  // AC Repair
  {
    name: "Manoj Verma",
    serviceType: "ac_repair",
    rating: 4.9,
    experience: "9 years",
    jobsCompleted: 521,
    lat: 28.4100,
    lng: 77.3220,
    available: true,
    phone: "+91 98765 43216",
    description: "Certified AC technician for all brands",
    specialties: ["Split AC", "Window AC", "Central AC"]
  },
  {
    name: "Anil Gupta",
    serviceType: "ac_repair",
    rating: 4.7,
    experience: "5 years",
    jobsCompleted: 267,
    lat: 28.4070,
    lng: 77.3190,
    available: true,
    phone: "+91 98765 43217",
    description: "Quick AC repair and maintenance",
    specialties: ["Gas Refilling", "Compressor Repair", "Installation"]
  },
  {
    name: "Sanjay Mehta",
    serviceType: "ac_repair",
    rating: 4.6,
    experience: "4 years",
    jobsCompleted: 198,
    lat: 28.4130,
    lng: 77.3240,
    available: true,
    phone: "+91 98765 43218",
    description: "Affordable AC services",
    specialties: ["Maintenance", "Cleaning", "Repair"]
  },

  // Cleaning
  {
    name: "Priya Devi",
    serviceType: "cleaning",
    rating: 4.8,
    experience: "3 years",
    jobsCompleted: 445,
    lat: 28.4110,
    lng: 77.3210,
    available: true,
    phone: "+91 98765 43219",
    description: "Professional home cleaning services",
    specialties: ["Deep Cleaning", "Kitchen Cleaning", "Bathroom Cleaning"]
  },
  {
    name: "Sunita Sharma",
    serviceType: "cleaning",
    rating: 4.7,
    experience: "4 years",
    jobsCompleted: 389,
    lat: 28.4090,
    lng: 77.3170,
    available: true,
    phone: "+91 98765 43220",
    description: "Eco-friendly cleaning solutions",
    specialties: ["Eco-Friendly", "Carpet Cleaning", "Sofa Cleaning"]
  },
  {
    name: "Rekha Singh",
    serviceType: "cleaning",
    rating: 4.9,
    experience: "5 years",
    jobsCompleted: 512,
    lat: 28.4140,
    lng: 77.3260,
    available: true,
    phone: "+91 98765 43221",
    description: "Complete home sanitization",
    specialties: ["Sanitization", "Pest Control", "Move-in Cleaning"]
  },

  // Carpenter
  {
    name: "Ravi Tiwari",
    serviceType: "carpenter",
    rating: 4.7,
    experience: "10 years",
    jobsCompleted: 623,
    lat: 28.4060,
    lng: 77.3140,
    available: true,
    phone: "+91 98765 43222",
    description: "Expert furniture maker and repair",
    specialties: ["Furniture Making", "Door Repair", "Cabinet Installation"]
  },
  {
    name: "Mohan Lal",
    serviceType: "carpenter",
    rating: 4.6,
    experience: "8 years",
    jobsCompleted: 478,
    lat: 28.4160,
    lng: 77.3290,
    available: true,
    phone: "+91 98765 43223",
    description: "Custom woodwork specialist",
    specialties: ["Custom Furniture", "Modular Kitchen", "Wardrobe"]
  },
  {
    name: "Prakash Rao",
    serviceType: "carpenter",
    rating: 4.8,
    experience: "7 years",
    jobsCompleted: 401,
    lat: 28.4075,
    lng: 77.3160,
    available: true,
    phone: "+91 98765 43224",
    description: "Quality carpentry at affordable rates",
    specialties: ["Repair", "Polishing", "Installation"]
  }
];

/**
 * Seed providers to Firestore
 */
async function seedProviders() {
  console.log('🌱 Starting to seed demo providers...\n');

  try {
    const providersRef = collection(db, 'providers');
    let successCount = 0;
    let errorCount = 0;

    for (const provider of demoProviders) {
      try {
        const docRef = await addDoc(providersRef, {
          ...provider,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
        
        console.log(`✅ Added: ${provider.name} (${provider.serviceType}) - ID: ${docRef.id}`);
        successCount++;
      } catch (error) {
        console.error(`❌ Failed to add ${provider.name}:`, error.message);
        errorCount++;
      }
    }

    console.log('\n📊 Seeding Summary:');
    console.log(`   ✅ Successfully added: ${successCount} providers`);
    console.log(`   ❌ Failed: ${errorCount} providers`);
    console.log(`   📦 Total: ${demoProviders.length} providers`);
    console.log('\n✨ Seeding complete!');

  } catch (error) {
    console.error('❌ Error seeding providers:', error);
    process.exit(1);
  }

  process.exit(0);
}

// Run the seeding function
seedProviders();
