# Firebase Setup Instructions

## 1. Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter project name: `memeverse`
4. Disable Google Analytics (optional)
5. Click "Create project"

## 2. Enable Authentication
1. In Firebase Console, go to "Authentication"
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Enable "Email/Password"
5. Click "Save"

## 3. Create Firestore Database
1. Go to "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode"
4. Select location (choose closest to your users)
5. Click "Done"

## 4. Get Firebase Configuration
1. Go to Project Settings (gear icon)
2. Scroll down to "Your apps"
3. Click "Web" icon (</>) 
4. Register app with nickname: `memeverse-web`
5. Copy the config object

## 5. Update Environment Variables
Replace the values in `.env.local`:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your_actual_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_actual_project_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_actual_app_id
```

## 6. Firestore Security Rules
Go to Firestore Database > Rules and replace with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Anyone can read rankings (for leaderboard)
    match /users/{userId} {
      allow read: if request.auth != null;
    }
  }
}
```

## 7. Test the Setup
1. Run `npm install`
2. Run `npm run dev`
3. Try registering a new user
4. Check Firestore to see if user document was created

## Collections Structure

### users
```
{
  uid: string,
  email: string,
  userName: string,
  createdAt: timestamp,
  gameScores: {
    memoryMatch: number,
    quickMath: number,
    wordPuzzle: number,
    reactionTime: number
  },
  totalRating: number,
  rank: number
}
```

The collections will be created automatically when you register your first user!