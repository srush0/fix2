/**
 * Authentication Service
 * 
 * Handles all authentication operations for Fixoo:
 * - Google OAuth login with role assignment
 * - User logout
 * - JWT token management (Firebase ID Token)
 * - Firestore user document creation
 * - Session persistence
 */

import { 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut 
} from "firebase/auth";
import { 
  doc, 
  setDoc, 
  getDoc, 
  serverTimestamp 
} from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

// Token storage key
const TOKEN_KEY = "fixoo_token";

/**
 * Login with Google OAuth and assign role
 * 
 * Flow:
 * 1. Opens Google sign-in popup
 * 2. Authenticates user with Firebase
 * 3. Retrieves Firebase ID Token (JWT)
 * 4. Creates/updates user in Firestore with role based on email
 * 5. Stores token in localStorage for session persistence
 * 6. Returns authenticated user data with role
 * 
 * @param {string} manualRole - Manual role override (optional, for backward compatibility)
 * @returns {Promise<Object>} User data with token and role
 * @throws {Error} Authentication error
 */
export const loginWithGoogle = async (manualRole = null) => {
  try {
    const provider = new GoogleAuthProvider();
    
    // Configure Google Auth Provider
    provider.setCustomParameters({
      prompt: 'select_account'
    });

    // Authenticate with Google popup
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Get Firebase ID Token (this is our JWT)
    // Firebase automatically handles token refresh
    const idToken = await user.getIdToken();

    // Store JWT token in localStorage for session persistence
    localStorage.setItem(TOKEN_KEY, idToken);

    // Create or update user in Firestore and get role
    // Role is determined automatically based on email
    const { createOrUpdateUser } = await import('./userService');
    const assignedRole = await createOrUpdateUser(user);

    // Use manual role if provided (for backward compatibility with role selector)
    // Otherwise use the automatically assigned role
    const finalRole = manualRole || assignedRole;

    // If manual role is provided and different from assigned role, update it
    if (manualRole && manualRole !== assignedRole) {
      const { updateDoc, doc, serverTimestamp } = await import('firebase/firestore');
      const { db } = await import('@/lib/firebase');
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        role: manualRole,
        updatedAt: serverTimestamp()
      });
    }

    // Return user data with role
    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      role: finalRole,
      token: idToken
    };
  } catch (error) {
    console.error("Google login error:", error);
    throw new Error(error.message || "Failed to login with Google");
  }
};

/**
 * Get user role from Firestore
 * 
 * @param {string} uid - User ID
 * @returns {Promise<string|null>} User role or null
 */
export const getUserRole = async (uid) => {
  try {
    const userDocRef = doc(db, "users", uid);
    const userDoc = await getDoc(userDocRef);
    
    if (userDoc.exists()) {
      return userDoc.data().role;
    }
    return null;
  } catch (error) {
    console.error("Error getting user role:", error);
    return null;
  }
};

/**
 * Get user data from Firestore
 * 
 * @param {string} uid - User ID
 * @returns {Promise<Object|null>} User data or null
 */
export const getUserData = async (uid) => {
  try {
    const userDocRef = doc(db, "users", uid);
    const userDoc = await getDoc(userDocRef);
    
    if (userDoc.exists()) {
      return userDoc.data();
    }
    return null;
  } catch (error) {
    console.error("Error getting user data:", error);
    return null;
  }
};

/**
 * Logout user
 * 
 * Flow:
 * 1. Signs out from Firebase
 * 2. Removes JWT token from localStorage
 * 3. Clears user session
 * 
 * @returns {Promise<void>}
 * @throws {Error} Logout error
 */
export const logoutUser = async () => {
  try {
    // Sign out from Firebase
    await signOut(auth);
    
    // Remove JWT token from localStorage
    localStorage.removeItem(TOKEN_KEY);
  } catch (error) {
    console.error("Logout error:", error);
    throw new Error(error.message || "Failed to logout");
  }
};

/**
 * Get current authenticated user
 * 
 * @returns {Object|null} Current user or null if not authenticated
 */
export const getCurrentUser = () => {
  return auth.currentUser;
};

/**
 * Get stored JWT token
 * 
 * @returns {string|null} Firebase ID Token (JWT) or null
 */
export const getStoredToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(TOKEN_KEY);
  }
  return null;
};

/**
 * Refresh Firebase ID Token
 * 
 * Firebase tokens expire after 1 hour.
 * This function gets a fresh token from Firebase.
 * 
 * @returns {Promise<string|null>} Fresh JWT token
 */
export const refreshToken = async () => {
  try {
    const user = getCurrentUser();
    if (user) {
      const newToken = await user.getIdToken(true); // Force refresh
      localStorage.setItem(TOKEN_KEY, newToken);
      return newToken;
    }
    return null;
  } catch (error) {
    console.error("Token refresh error:", error);
    return null;
  }
};
