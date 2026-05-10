# Love Letters App - Setup Guide

## Real-Time Sync Setup

This app now uses Firebase Firestore for real-time synchronization across all devices!

### Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" (or select existing)
3. Enter your project name (e.g., "love-letters-app")
4. Enable Google Analytics if desired
5. Click "Create project"

### Step 2: Set up Firestore Database

1. In your Firebase project, go to "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select a location for your database
5. Click "Done"

### Step 3: Get Your Firebase Config

1. In your Firebase project, click the gear icon → "Project settings"
2. Scroll down to "Your apps" section
3. Click "Add app" → Web app (</>)
4. Enter an app nickname
5. **Copy the firebaseConfig object** - you'll need this next

### Step 4: Update the Code

1. Open `index.html` and `archive.html`
2. Replace the placeholder firebaseConfig with your actual config:

```javascript
const firebaseConfig = {
    apiKey: "your-actual-api-key",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-actual-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "123456789",
    appId: "your-actual-app-id"
};
```

### Step 5: Deploy and Test

1. Upload your files to a web server
2. Open the app on multiple devices/browsers
3. Write a letter on one device - it should appear instantly on all others!

## Features

- ✨ Real-time synchronization across all devices
- 💌 Address letters to specific people
- 📱 Mobile-friendly design
- 🗑️ Delete letters with confirmation
- 📅 Timestamped messages

## Security Note

The database is currently in "test mode" which allows anyone to read/write. For production, you'll want to set up proper security rules in Firebase.

Enjoy your synchronized love letters! 💕</content>
<parameter name="filePath">c:\Users\Jonit\OneDrive\Desktop\Keven\Web development\PROJECTS\MI AMOR 3\README.md