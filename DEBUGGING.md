# Data Not Saving? Here's How to Fix It

## The Most Common Issue: Firestore Security Rules

By default, Firestore denies ALL reads and writes. **You MUST deploy security rules** for the app to save data.

---

## ⚡ Quick Fix (5 minutes)

### Step 1: Install Firebase Tools
```bash
npm install -g firebase-tools
```

### Step 2: Login to Firebase
```bash
firebase login
```

### Step 3: Deploy Rules
```bash
firebase deploy --only firestore:rules
```

Done! Your app should now save data. ✅

---

## If That Doesn't Work - Manual Setup

### Through Firebase Console:
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project: **wildlife-management-62a6e**
3. Go to **Firestore Database** → **Rules** tab
4. Copy and paste the rules from `firestore.rules` file
5. Click **Publish**

### Update Storage Rules Too:
1. In Firebase Console, go to **Storage** → **Rules** tab
2. Replace with this:
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
3. Click **Publish**

---

## Testing It Works

1. **Start the app**:
   ```bash
   npm run dev
   ```

2. **Sign up** with email/password

3. **Add an animal** with all fields filled

4. **Check the console** (F12):
   - Should see: `Animal saved with ID: xxx`
   - Should NOT see red errors

5. **Go to Dashboard**:
   - The animal should appear instantly

6. **Verify in Firebase Console**:
   - Go to Firestore Database → Collections
   - You should see an "animals" collection with your data

---

## Debugging Checklist

✅ **Have you deployed Firestore rules?**
- Run: `firebase deploy --only firestore:rules`

✅ **Are you logged in?**
- Should see your email in login page after sign-up
- Check browser console (F12) for auth errors

✅ **Firebase environment variables correct?**
- Check `.env.local` has these:
  ```
  VITE_API_KEY=...
  VITE_AUTH_DOMAIN=...
  VITE_PROJECT_ID=wildlife-management-62a6e
  VITE_STORAGE_BUCKET=...
  ```

✅ **Check browser console for errors**
- Open F12 → Console tab
- Look for red error messages
- Take a screenshot and share if needed

---

## Common Error Messages & Fixes

### "Missing or insufficient permissions"
→ **Deploy Firestore rules** (see Quick Fix above)

### "Auth error" or "Not authenticated"
→ Sign up first, make sure you're logged in

### "Storage permission denied"
→ **Deploy Storage rules** (see Manual Setup above)

### "Firebase is not configured"
→ Restart dev server: `npm run dev`

---

## Still Not Working?

1. **Check the .env.local file is saved** (no typos)
2. **Restart the dev server**: `npm run dev`
3. **Clear browser cache**: Ctrl+Shift+Delete
4. **Check console errors**: F12 → Console → look for red text
5. **Verify Firestore rules were published** in Firebase Console

If issues persist, share the browser console error (F12 → Console tab) for more specific help.
