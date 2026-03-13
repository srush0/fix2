# 🔐 Firebase Authentication Flow Diagram

## Complete Authentication Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                         USER JOURNEY                                 │
└─────────────────────────────────────────────────────────────────────┘

1. LANDING PAGE
   │
   ├─→ User clicks "Login" or tries to access protected page
   │
   ▼

2. LOGIN PAGE (/login)
   │
   ├─→ User sees "Continue with Google" button
   │
   ├─→ User clicks button
   │
   ▼

3. GOOGLE OAUTH POPUP
   │
   ├─→ Google sign-in popup opens
   │
   ├─→ User selects Google account
   │
   ├─→ User grants permissions
   │
   ▼

4. FIREBASE AUTHENTICATION
   │
   ├─→ Firebase validates Google credentials
   │
   ├─→ Firebase creates/retrieves user account
   │
   ├─→ Firebase generates ID Token (JWT)
   │
   ▼

5. TOKEN STORAGE
   │
   ├─→ JWT token stored in localStorage as "fixoo_token"
   │
   ├─→ User data stored in React state
   │
   ├─→ AuthContext updated with user info
   │
   ▼

6. REDIRECT TO HOME
   │
   ├─→ User redirected to /home or dashboard
   │
   ├─→ Protected content now accessible
   │
   ▼

7. SESSION ACTIVE
   │
   ├─→ User can access all protected pages
   │
   ├─→ Token automatically included in API calls
   │
   ├─→ Token auto-refreshes when expired
   │
   ▼

8. LOGOUT (when user clicks logout)
   │
   ├─→ Firebase signOut() called
   │
   ├─→ Token removed from localStorage
   │
   ├─→ User state cleared
   │
   └─→ Redirect to login page
```

---

## Technical Flow Diagram

```
┌──────────────────────────────────────────────────────────────────┐
│                    COMPONENT LAYER                                │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐                 │
│  │ Login Page │  │ Home Page  │  │ Dashboard  │                 │
│  └─────┬──────┘  └─────┬──────┘  └─────┬──────┘                 │
│        │               │               │                          │
│        └───────────────┴───────────────┘                          │
│                        │                                          │
└────────────────────────┼──────────────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────────────────┐
│                    CONTEXT LAYER                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              AuthContext (AuthProvider)                   │   │
│  │  - user state                                             │   │
│  │  - loading state                                          │   │
│  │  - login() function                                       │   │
│  │  - logout() function                                      │   │
│  │  - isAuthenticated                                        │   │
│  └────────────────────────┬─────────────────────────────────┘   │
└───────────────────────────┼──────────────────────────────────────┘
                            │
                            ▼
┌──────────────────────────────────────────────────────────────────┐
│                    SERVICE LAYER                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              authService.js                               │   │
│  │  ┌────────────────────────────────────────────────────┐  │   │
│  │  │ loginWithGoogle()                                   │  │   │
│  │  │  1. Create GoogleAuthProvider                       │  │   │
│  │  │  2. Call signInWithPopup()                          │  │   │
│  │  │  3. Get user.getIdToken()                           │  │   │
│  │  │  4. Store token in localStorage                     │  │   │
│  │  │  5. Return user data                                │  │   │
│  │  └────────────────────────────────────────────────────┘  │   │
│  │  ┌────────────────────────────────────────────────────┐  │   │
│  │  │ logoutUser()                                        │  │   │
│  │  │  1. Call signOut()                                  │  │   │
│  │  │  2. Remove token from localStorage                  │  │   │
│  │  └────────────────────────────────────────────────────┘  │   │
│  └────────────────────────┬─────────────────────────────────┘   │
└───────────────────────────┼──────────────────────────────────────┘
                            │
                            ▼
┌──────────────────────────────────────────────────────────────────┐
│                    FIREBASE SDK LAYER                             │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              lib/firebase.js                              │   │
│  │  - initializeApp(firebaseConfig)                         │   │
│  │  - getAuth(app)                                          │   │
│  │  - getAnalytics(app)                                     │   │
│  └────────────────────────┬─────────────────────────────────┘   │
└───────────────────────────┼──────────────────────────────────────┘
                            │
                            ▼
┌──────────────────────────────────────────────────────────────────┐
│                    FIREBASE BACKEND                               │
│  - User Authentication                                            │
│  - JWT Token Generation                                           │
│  - Token Validation                                               │
│  - Token Refresh                                                  │
│  - Security Rules                                                 │
└──────────────────────────────────────────────────────────────────┘
```

---

## JWT Token Lifecycle

```
┌─────────────────────────────────────────────────────────────────┐
│                    TOKEN LIFECYCLE                               │
└─────────────────────────────────────────────────────────────────┘

1. TOKEN GENERATION
   │
   ├─→ User logs in with Google
   │
   ├─→ Firebase authenticates user
   │
   ├─→ Firebase generates ID Token (JWT)
   │
   └─→ Token structure:
       {
         "iss": "https://securetoken.google.com/fixo-c4137",
         "aud": "fixo-c4137",
         "auth_time": 1234567890,
         "user_id": "abc123...",
         "sub": "abc123...",
         "iat": 1234567890,
         "exp": 1234571490,  // Expires in 1 hour
         "email": "user@example.com",
         "email_verified": true,
         "firebase": {
           "identities": {
             "google.com": ["123456789"]
           },
           "sign_in_provider": "google.com"
         }
       }

2. TOKEN STORAGE
   │
   ├─→ Stored in localStorage
   │
   ├─→ Key: "fixoo_token"
   │
   └─→ Accessible via getStoredToken()

3. TOKEN USAGE
   │
   ├─→ Included in API requests
   │
   ├─→ Header: "Authorization: Bearer <token>"
   │
   └─→ Verified on backend

4. TOKEN REFRESH
   │
   ├─→ Token expires after 1 hour
   │
   ├─→ Firebase SDK automatically refreshes
   │
   ├─→ onAuthStateChanged triggers update
   │
   └─→ New token stored in localStorage

5. TOKEN INVALIDATION
   │
   ├─→ User logs out
   │
   ├─→ Token removed from localStorage
   │
   └─→ Firebase session terminated
```

---

## Protected Route Flow

```
┌─────────────────────────────────────────────────────────────────┐
│              PROTECTED ROUTE ACCESS FLOW                         │
└─────────────────────────────────────────────────────────────────┘

User tries to access protected page (e.g., /home)
   │
   ▼
┌─────────────────────────────────────┐
│ Check: Is user authenticated?       │
│ (useAuth hook checks user state)    │
└─────────────┬───────────────────────┘
              │
              ├─→ YES: User is authenticated
              │   │
              │   ├─→ Check: Is token valid?
              │   │   │
              │   │   ├─→ YES: Token exists in localStorage
              │   │   │   │
              │   │   │   └─→ ✅ ALLOW ACCESS
              │   │   │       │
              │   │   │       └─→ Render protected content
              │   │   │
              │   │   └─→ NO: Token missing or expired
              │   │       │
              │   │       └─→ ❌ REDIRECT to /login
              │   │
              │   └─→ Continue monitoring auth state
              │
              └─→ NO: User is not authenticated
                  │
                  └─→ ❌ REDIRECT to /login
```

---

## API Request Flow

```
┌─────────────────────────────────────────────────────────────────┐
│              AUTHENTICATED API REQUEST FLOW                      │
└─────────────────────────────────────────────────────────────────┘

Component makes API call
   │
   ├─→ Uses apiGet() or apiPost() from lib/apiClient.js
   │
   ▼
┌─────────────────────────────────────┐
│ authenticatedFetch()                │
│ 1. Get token from localStorage      │
│ 2. Add Authorization header         │
│ 3. Make fetch request               │
└─────────────┬───────────────────────┘
              │
              ▼
┌─────────────────────────────────────┐
│ API Route (e.g., /api/protected)    │
│ 1. Extract token from header        │
│ 2. Verify token                     │
│ 3. Process request                  │
└─────────────┬───────────────────────┘
              │
              ├─→ Token Valid
              │   │
              │   └─→ ✅ Return data
              │       │
              │       └─→ Status 200
              │
              └─→ Token Invalid
                  │
                  └─→ ❌ Return error
                      │
                      └─→ Status 401 Unauthorized
```

---

## State Management Flow

```
┌─────────────────────────────────────────────────────────────────┐
│              AUTH STATE MANAGEMENT                               │
└─────────────────────────────────────────────────────────────────┘

App Initialization
   │
   ▼
┌─────────────────────────────────────┐
│ AuthProvider mounts                 │
│ - Sets loading = true               │
│ - Sets user = null                  │
└─────────────┬───────────────────────┘
              │
              ▼
┌─────────────────────────────────────┐
│ onAuthStateChanged listener starts  │
│ (Firebase SDK)                      │
└─────────────┬───────────────────────┘
              │
              ├─→ User is logged in
              │   │
              │   ├─→ Get fresh token
              │   │
              │   ├─→ Update localStorage
              │   │
              │   ├─→ Set user state
              │   │
              │   └─→ Set loading = false
              │
              └─→ User is not logged in
                  │
                  ├─→ Set user = null
                  │
                  ├─→ Clear localStorage
                  │
                  └─→ Set loading = false

User Login Event
   │
   ├─→ loginWithGoogle() called
   │
   ├─→ Firebase authenticates
   │
   ├─→ onAuthStateChanged fires
   │
   └─→ State updated automatically

User Logout Event
   │
   ├─→ logoutUser() called
   │
   ├─→ Firebase signs out
   │
   ├─→ onAuthStateChanged fires
   │
   └─→ State cleared automatically

Page Reload
   │
   ├─→ AuthProvider re-mounts
   │
   ├─→ onAuthStateChanged checks session
   │
   ├─→ If token exists: restore session
   │
   └─→ If no token: remain logged out
```

---

## Error Handling Flow

```
┌─────────────────────────────────────────────────────────────────┐
│              ERROR HANDLING                                      │
└─────────────────────────────────────────────────────────────────┘

Login Error
   │
   ├─→ Popup blocked
   │   └─→ Show error: "Please allow popups"
   │
   ├─→ Network error
   │   └─→ Show error: "Network connection failed"
   │
   ├─→ User cancelled
   │   └─→ Show error: "Login cancelled"
   │
   └─→ Firebase error
       └─→ Show error: Firebase error message

API Request Error
   │
   ├─→ 401 Unauthorized
   │   ├─→ Clear invalid token
   │   ├─→ Show error: "Session expired"
   │   └─→ Redirect to login
   │
   ├─→ 403 Forbidden
   │   └─→ Show error: "Access denied"
   │
   ├─→ 500 Server Error
   │   └─→ Show error: "Server error"
   │
   └─→ Network Error
       └─→ Show error: "Connection failed"

Token Refresh Error
   │
   ├─→ Token expired and refresh failed
   │   ├─→ Clear token
   │   ├─→ Set user = null
   │   └─→ Redirect to login
   │
   └─→ Firebase error
       └─→ Log error and retry
```

---

## Summary

This authentication system provides:

✅ **Secure**: JWT tokens, automatic refresh, Firebase security
✅ **Seamless**: Auto-login on page reload, persistent sessions
✅ **User-friendly**: One-click Google login, clear error messages
✅ **Developer-friendly**: Simple API, comprehensive documentation
✅ **Production-ready**: Error handling, loading states, TypeScript support

All flows are implemented and tested! 🚀
