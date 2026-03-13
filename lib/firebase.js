/**
 * Firebase Configuration and Initialization
 * 
 * This file initializes Firebase services for the Fixoo application:
 * - Firebase App
 * - Firebase Authentication
 * - Firestore Database
 * - Firebase Analytics (client-side only)
 */

import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyBQKKF_1Gvtu-7YuD_cjKm_fU0Utik6MoM",
  authDomain: "fixo-c4137.firebaseapp.com",
  projectId: "fixo-c4137",
  storageBucket: "fixo-c4137.firebasestorage.app",
  messagingSenderId: "1064173374459",
  appId: "1:1064173374459:web:03d94bf9d5c518e568595e",
  measurementId: "G-B734208CS3"
};

// Initialize Firebase app (prevent multiple initializations)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Firebase Authentication
export const auth = getAuth(app);

// Initialize Firestore Database
export const db = getFirestore(app);

// Initialize Firebase Analytics (only in browser environment)
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

export default app;
