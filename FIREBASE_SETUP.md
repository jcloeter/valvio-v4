# Firebase Authentication Setup Guide

This guide will walk you through setting up Firebase Authentication for the Valvio application.

## Prerequisites

- A Google account
- Node.js and npm installed
- Java 17+ and Maven installed
- PostgreSQL database running

## Step 1: Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter a project name (e.g., "Valvio")
4. Follow the setup wizard (you can disable Google Analytics if you don't need it)

## Step 2: Enable Authentication Methods

1. In your Firebase project, navigate to **Build** > **Authentication**
2. Click "Get started"
3. Go to the **Sign-in method** tab
4. Enable the following providers:
   - **Email/Password**: Click on it and toggle "Enable"
   - **Google**: Click on it, toggle "Enable", and provide a project support email
   - **Anonymous**: Click on it and toggle "Enable"

## Step 3: Register Your Web App

1. In the Firebase Console, go to **Project settings** (gear icon)
2. Scroll down to "Your apps" section
3. Click the web icon (`</>`) to add a web app
4. Give your app a nickname (e.g., "Valvio Web")
5. Click "Register app"
6. Copy the Firebase configuration object - you'll need these values

## Step 4: Configure Frontend Environment Variables

Create a `.env` file in the `frontend` directory:

```bash
cd frontend
touch .env
```

Add the following content (replace with your actual Firebase config values):

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# API Configuration
VITE_API_BASE_URL=http://localhost:8080
```

## Step 5: Generate Firebase Service Account Key (for Backend)

1. In Firebase Console, go to **Project settings** > **Service accounts**
2. Click "Generate new private key"
3. Click "Generate key" - this will download a JSON file
4. Save this file securely (DO NOT commit it to version control)

### Option A: Use File Path (Development)

Save the downloaded JSON file somewhere secure and set the environment variable:

```bash
export FIREBASE_SERVICE_ACCOUNT_KEY=/path/to/your/serviceAccountKey.json
```

### Option B: Use JSON String (Production)

For production environments (like Heroku, AWS, etc.), you can set the entire JSON as an environment variable:

```bash
export FIREBASE_SERVICE_ACCOUNT_KEY='{"type":"service_account","project_id":"your-project-id",...}'
```

## Step 6: Update CORS Settings

Make sure your backend CORS configuration allows requests from your frontend domain. The current setup already allows:
- `http://localhost:*` (any port)
- `https://jcloeter.github.io`
- `https://*.trycloudflare.com`

If you need to add more domains, update `backend/src/main/java/com/valviomusic/valvio/authentication/CorsConfig.java`

## Step 7: Set Up Database

Make sure your PostgreSQL database is running and configured in `application-local.properties` or `application-prod.properties`.

The migration will automatically create the `users` table when you start the application.

## Step 8: Run the Application

### Backend

```bash
cd backend
./mvnw spring-boot:run
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Testing Authentication

1. Open your browser to `http://localhost:5173` (or whatever port Vite is using)
2. You should see a "Sign In" button in the navigation bar
3. Click it and try:
   - **Google Sign-in**: Click "Continue with Google" and sign in with your Google account
   - **Email/Password**: 
     - Click "Sign up" at the bottom
     - Enter an email and password
     - Click "Sign Up"
     - You can now sign in with those credentials
   - **Guest Login**: Click "Continue as Guest" for anonymous access

## Troubleshooting

### Frontend Issues

**"Firebase: Error (auth/invalid-api-key)"**
- Check that your `.env` file has the correct Firebase config values
- Make sure the file is named exactly `.env` (not `.env.local` or `.env.example`)
- Restart the Vite dev server after creating/modifying `.env`

**CORS Errors**
- Make sure your backend is running
- Check that `VITE_API_BASE_URL` in `.env` matches your backend URL
- Verify CORS is properly configured in the backend

### Backend Issues

**"Cannot find symbol: GoogleCredentials"**
- Run `./mvnw clean install` to download Firebase dependencies
- Restart your IDE to refresh the classpath

**"Error initializing Firebase"**
- Check that `FIREBASE_SERVICE_ACCOUNT_KEY` environment variable is set
- Verify the JSON file path is correct or the JSON string is valid
- Make sure the service account has the necessary permissions

**Database Migration Errors**
- Ensure PostgreSQL is running
- Check database connection settings in `application.properties`
- Verify Flyway migrations are in correct order

## Security Notes

1. **Never commit your Firebase service account key** to version control
2. Add `.env` to `.gitignore` (already done)
3. Add your service account JSON file to `.gitignore`
4. In production, use environment variables instead of files
5. Keep your Firebase API keys secret (especially the service account key)
6. Regularly rotate your service account keys
7. Set up Firebase App Check for additional security (optional but recommended)

## Firebase Console Tips

- **Monitor authentication**: Go to Authentication > Users to see all registered users
- **Set up security rules**: If you add Firebase Storage or Firestore later
- **Enable App Check**: For additional security against abuse
- **Set up password requirements**: In Authentication > Settings > Password policy

## Next Steps

- Implement password reset functionality
- Add email verification
- Set up OAuth providers (Facebook, Twitter, etc.)
- Implement custom claims for role-based access control
- Add user profile management

