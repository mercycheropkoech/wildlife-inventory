# Wildlife Management System

- A web-based Wildlife Management System built using React, Firebase, and modern web technologies. The system helps manage wildlife records, track animal data, and support conservation efforts through a simple dashboard interface


link: https://wildlife-management-62a6e.web.app

# Features
- User Authentication (Login / Sign Up)
- Add, edit, and delete wildlife records
- Dashboard for viewing animal data
- Search and filter wildlife entries
- Cloud storage using Firebase
- Responsive design for mobile and desktop
- Tech Stack

# Frontend:

- React (Vite)
- HTML
- CSS
- JavaScript

# Backend / Database:

- Firebase (Authentication + Firestore)

# Hosting:

- Firebase Hosting
## Project Structure
- wildlife-management/
- │
- ├── public/
- ├── src/
- │   ├── components/
- │   ├── pages/
- │   ├── firebase/
- │   ├── App.jsx
- │   └── main.jsx
- │
- ├── firebase.json
- ├── package.json
- └── README.md
# Installation & Setup
1. Clone the repository
git clone https://github.com/your-username/wildlife-management.git
cd wildlife-management
2. Install dependencies
npm install
3. Setup Firebase

Create a file:

src/firebase/firebaseConfig.js

Add your Firebase config:

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

export default firebaseConfig;
4. Run the project locally
npm run dev
Deployment
Build project
npm run build
Deploy to Firebase
firebase deploy
Common Issues
Firebase error: auth/configuration-not-found
Go to Firebase Console
Enable Authentication → Email/Password
Make sure your config values are correct
Project not showing in Firebase CLI
firebase login
firebase projects:list

Make sure you're using the correct Google account.

# Author

- Mercy Cherop

# License

This project is for educational purposes only.