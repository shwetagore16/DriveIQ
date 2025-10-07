# Firebase Setup Instructions

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add Project"
3. Enter project name: `DriveIQ` (or your preferred name)
4. Disable Google Analytics (optional)
5. Click "Create Project"

## Step 2: Enable Firestore Database

1. In Firebase Console, click "Firestore Database" in left menu
2. Click "Create Database"
3. Choose "Start in production mode"
4. Select your preferred location (e.g., `us-central1`)
5. Click "Enable"

## Step 3: Create Service Account Credentials

1. Click the gear icon (⚙️) next to "Project Overview"
2. Select "Project Settings"
3. Go to "Service Accounts" tab
4. Click "Generate New Private Key"
5. Click "Generate Key" - this will download a JSON file
6. Rename the downloaded file to `firebase-credentials.json`
7. Move it to the `backend` folder of DriveIQ project

**⚠️ IMPORTANT:** Never commit this file to Git! It's already in .gitignore

## Step 4: Configure Firestore Rules (Optional for Production)

In Firestore Database > Rules, paste:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /vehicle_data/{document=**} {
      allow read, write: if true;  // Change for production security
    }
  }
}
```

## Step 5: Test Connection

1. Make sure `firebase-credentials.json` is in the `backend` folder
2. Run the backend: `python app.py`
3. You should see: `✓ Firebase initialized successfully!`

## Alternative: Using In-Memory Storage

If you don't want to use Firebase:
- Simply don't create the credentials file
- The backend will automatically use in-memory storage
- Data will be lost when the server restarts
