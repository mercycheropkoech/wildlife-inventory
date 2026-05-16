# Wildlife Management - Setup Guide

## Firebase Configuration

### 1. Firestore Security Rules

The app uses Firestore to store animal data. **You must deploy the security rules** to allow the app to save data.

#### Option A: Deploy Using Firebase CLI (Recommended)

1. **Install Firebase CLI** (if not already installed):
   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase**:
   ```bash
   firebase login
   ```

3. **Initialize Firebase** (if needed):
   ```bash
   firebase init
   ```
   - Select "Firestore" and "Hosting"
   - Use project ID: `wildlife-management-62a6e`

4. **Deploy Firestore Rules**:
   ```bash
   firebase deploy --only firestore:rules
   ```

#### Option B: Deploy via Firebase Console (Manual)

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select project: `wildlife-management-62a6e`
3. Go to **Firestore Database** → **Rules** tab
4. Replace the rules with the content from `firestore.rules`
5. Click **Publish**

### 2. Firestore Rules Explanation

The rules allow:
- ✅ **Anyone** can **read** animal records
- ✅ **Authenticated users** can **create** new animal records
- ✅ **Only the creator** can **update/delete** their own records

### 3. Storage Rules

If you haven't already, also update your **Firebase Storage Rules**:

1. Go to **Storage** → **Rules** tab
2. Replace with:
   ```
   rules_version = '2';
   service firebase.storage {
     match /b/{bucket}/o {
       match /animals/{allPaths=**} {
         allow read: if true;
         allow write: if request.auth != null;
       }
     }
   }
   ```

## Testing the App

1. **Start the dev server**:
   ```bash
   npm run dev
   ```

2. **Test the flow**:
   - Sign up with email/password or Google
   - Add an animal with a photo
   - Check the Dashboard - animal should appear
   - Check the Animals page - animal should be searchable

## Troubleshooting

### Data not saving?
- Check browser console (F12) for errors
- Verify you're logged in
- Make sure Firestore rules are deployed
- Check that your `.env.local` has correct Firebase credentials

### Images not uploading?
- Verify Firebase Storage rules are set (see above)
- Check file size (limit: ~5MB recommended)
- Check image format (JPG, PNG, GIF, WebP supported)

### Still having issues?
Check the browser console (F12) for detailed error messages that can help debug the problem.
