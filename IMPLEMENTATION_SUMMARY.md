# Firebase Authentication Implementation Summary

This document provides an overview of the Firebase Authentication implementation for the Valvio application.

## Overview

The application now supports three authentication methods:
1. **Google Sign-in** - OAuth authentication via Google
2. **Email/Password** - Traditional email and password registration/login
3. **Anonymous/Guest Login** - Temporary anonymous access

## Architecture

### Frontend (React + Firebase SDK)

The frontend uses the Firebase JavaScript SDK to handle authentication on the client side. Firebase provides built-in UI components and methods for all authentication flows.

**Key Components:**

1. **Firebase Configuration** (`src/config/firebase.ts`)
   - Initializes Firebase with your project credentials
   - Exports the auth instance for use throughout the app

2. **Authentication Context** (`src/contexts/AuthContext.tsx`)
   - React Context that wraps the entire application
   - Manages authentication state globally
   - Provides authentication methods to all components
   - Automatically refreshes Firebase ID tokens every 50 minutes
   - Exposes: `currentUser`, `idToken`, `signInWithGoogle()`, `signInWithEmail()`, `signUpWithEmail()`, `signInAsGuest()`, `signOut()`

3. **Login Modal** (`src/components/LoginModal.tsx`)
   - Beautiful, modern UI for authentication
   - Supports all three authentication methods
   - Includes form validation and error handling
   - Toggle between sign-in and sign-up modes

4. **Protected Routes** (`src/components/ProtectedRoute.tsx`)
   - Wraps routes that require authentication
   - Shows loading state while checking authentication
   - Forces authentication before accessing protected content
   - Automatically shows login modal if user is not authenticated

5. **API Configuration** (`src/config/apiConfig.ts`)
   - Creates API configuration with Firebase ID token
   - Token is automatically included in all API requests as `Authorization: Bearer <token>`
   - Updated dynamically when token refreshes

6. **NavBar** (`src/components/NavBar.tsx`)
   - Shows user information when authenticated
   - Displays sign-in button for unauthenticated users
   - Provides sign-out functionality
   - Shows "Guest" for anonymous users

### Backend (Spring Boot + Firebase Admin SDK)

The backend uses Firebase Admin SDK to verify tokens and doesn't trust the client. All authentication verification happens server-side.

**Key Components:**

1. **Firebase Configuration** (`authentication/FirebaseConfig.java`)
   - Initializes Firebase Admin SDK
   - Loads service account credentials from environment variable or file
   - Supports both JSON string and file path for flexibility

2. **Firebase Authentication Filter** (`authentication/FirebaseAuthenticationFilter.java`)
   - Intercepts every HTTP request
   - Extracts Bearer token from Authorization header
   - Verifies token using Firebase Admin SDK
   - Creates or updates user in database
   - Sets Spring Security authentication context

3. **Security Configuration** (`authentication/SecurityConfig.java`)
   - Configures Spring Security
   - Requires authentication for all endpoints except Swagger docs
   - Disables CSRF (not needed for REST API with token auth)
   - Stateless session management (no server-side sessions)
   - Adds Firebase filter to the security filter chain

4. **User Model** (`model/User.java`)
   - JPA entity representing users
   - Fields: id, firebaseUid (unique), email, displayName, photoUrl, isAnonymous, createdAt, lastLoginAt
   - Links to quiz attempts via one-to-many relationship

5. **User Repository** (`repository/UserRepository.java`)
   - Spring Data JPA repository
   - Provides `findByFirebaseUid()` method for quick lookups

6. **User Service** (`service/UserService.java`)
   - Business logic for user management
   - `findOrCreateUser()` - Creates new user or updates existing user
   - Updates last login timestamp on every authentication
   - Extracts user info from Firebase token

7. **Quiz Service & Controller Updates**
   - `QuizService.startQuiz()` now accepts a User parameter
   - `QuizController.startQuiz()` extracts authenticated user from SecurityContext
   - Quiz attempts are now linked to users

8. **Database Migration** (`db/migration/V9__create_user_table.sql`)
   - Creates `users` table
   - Adds `user_id` foreign key to `quiz_attempt` table
   - Creates indexes for performance

## Authentication Flow

### Sign In Flow

```
User clicks "Sign In" → LoginModal opens
↓
User chooses auth method (Google/Email/Anonymous)
↓
Firebase SDK handles authentication client-side
↓
Firebase returns ID token
↓
AuthContext stores token and user info
↓
Token automatically added to all API requests
↓
Backend receives request with Bearer token
↓
FirebaseAuthenticationFilter verifies token
↓
User found/created in database
↓
Authentication set in SecurityContext
↓
Request proceeds to controller
↓
Controller accesses authenticated user
```

### How Spring Security Integration Works

1. **Request arrives** at backend with `Authorization: Bearer <firebase-token>`
2. **FirebaseAuthenticationFilter** intercepts the request before it reaches controllers
3. **Token verification** happens using Firebase Admin SDK (cryptographically secure)
4. **User sync** - User is created in PostgreSQL if first time, or last_login_at is updated
5. **Security Context** - User object is placed in Spring Security's SecurityContextHolder
6. **Controller access** - Controllers can access the authenticated user via `SecurityContextHolder.getContext().getAuthentication().getPrincipal()`

### Token Management

- Firebase ID tokens expire after 1 hour
- Frontend automatically refreshes tokens every 50 minutes
- Tokens are cryptographically signed by Firebase
- Backend verifies signature using Firebase public keys
- No need for database lookups to verify tokens (unless you want to check for banned users)

## Benefits of This Architecture

1. **Security**
   - Tokens are cryptographically verified
   - Firebase handles password security best practices
   - No passwords stored in your database
   - Tokens are short-lived (1 hour)

2. **Scalability**
   - Stateless authentication (no server-side sessions)
   - Firebase handles the heavy lifting
   - Can easily add more authentication providers

3. **User Experience**
   - Single sign-on with Google
   - "Remember me" functionality built-in
   - Guest access for trying the app
   - Seamless authentication across devices

4. **Developer Experience**
   - Firebase provides production-ready auth UI
   - Built-in security features (rate limiting, bot protection)
   - Easy to test and debug
   - Well-documented SDKs

## Data Flow

### Frontend → Backend

Every API request from frontend includes:
```
Authorization: Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IjI3Mjg5...
```

### Backend → Database

When a user authenticates:
1. Token is verified with Firebase
2. User info extracted from token:
   - `uid` (Firebase unique ID)
   - `email`
   - `name`
   - `picture` (profile photo URL)
   - `firebase.sign_in_provider` (google.com, password, anonymous)
3. Database query: `SELECT * FROM users WHERE firebase_uid = ?`
4. If user exists: Update `last_login_at`
5. If user doesn't exist: `INSERT INTO users ...`

## Anonymous Users

Anonymous authentication provides a temporary identity:
- Users can use the app without registering
- Each anonymous user gets a unique Firebase UID
- Data (quiz attempts) are linked to this UID
- Users can later "upgrade" to a permanent account (email/Google)
- When upgrading, Firebase can link the accounts (preserving data)

## Security Considerations

### What's Protected

✅ All API endpoints require valid Firebase token (except Swagger docs)
✅ Tokens are verified server-side (can't be forged)
✅ User data is synced to database
✅ Quiz attempts are linked to users
✅ CORS is configured to only allow specific origins

### What's Not (Yet) Protected

⚠️ No role-based access control (all authenticated users have same permissions)
⚠️ No user banning/blocking mechanism
⚠️ No rate limiting per user
⚠️ No email verification requirement
⚠️ No two-factor authentication

## Future Enhancements

### Near-term
- Email verification requirement
- Password reset functionality
- User profile editing
- Account linking (merge anonymous → permanent)

### Medium-term
- Role-based access control (admin, teacher, student)
- Custom annotation for fine-grained security (`@RequireAuth`, `@AllowAnonymous`)
- User dashboard with quiz history
- Social features (leaderboards, sharing)

### Long-term
- Two-factor authentication
- OAuth with more providers (Facebook, Twitter)
- Firebase App Check for bot protection
- Custom claims for permissions
- Audit logging for security events

## Testing the Implementation

### Manual Testing Checklist

- [ ] Google Sign-in works
- [ ] Email sign-up creates new account
- [ ] Email sign-in works with existing account
- [ ] Anonymous login works
- [ ] Sign out clears authentication
- [ ] Protected routes redirect to login
- [ ] API requests include token
- [ ] Backend verifies token correctly
- [ ] Users are created in database
- [ ] Quiz attempts are linked to users
- [ ] Token refresh happens automatically
- [ ] NavBar shows correct user info

### API Testing

You can test the API directly using tools like Postman or curl:

```bash
# Get a token from Firebase (from browser dev tools after logging in)
TOKEN="eyJhbGciOiJSUzI1NiIsImtpZCI..."

# Test authenticated endpoint
curl -H "Authorization: Bearer $TOKEN" http://localhost:8080/quiz
```

## Troubleshooting Common Issues

### "401 Unauthorized" on API calls
- Check that token is being sent in Authorization header
- Verify token hasn't expired
- Check backend logs for token verification errors

### "User not found" errors
- Ensure database migration V9 has run
- Check database connection
- Verify user was created during authentication

### Firebase initialization errors
- Check service account key is valid JSON
- Verify environment variable is set correctly
- Ensure Firebase Admin SDK is in classpath

## Code Quality

The implementation follows these principles:
- **Separation of concerns** - Auth logic separated from business logic
- **DRY** - Authentication code centralized in filter and context
- **Security first** - Token verification on every request
- **User experience** - Seamless auth with multiple options
- **Maintainability** - Well-structured, documented code

## Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Admin SDK for Java](https://firebase.google.com/docs/admin/setup)
- [Spring Security Documentation](https://docs.spring.io/spring-security/reference/index.html)
- [React Context API](https://react.dev/reference/react/useContext)

