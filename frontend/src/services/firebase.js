import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// ⚠️ Replace these with your Firebase project config
// Go to: console.firebase.google.com → Project Settings → General → Your apps → Web app
const firebaseConfig = {
  apiKey: "AIzaSyBrXj-mhwN-RPtQuJterI9UI_Ef9mzTu2Y",
  authDomain: "ironiq-smart-gym-tracker.firebaseapp.com",
  projectId: "ironiq-smart-gym-tracker",
  storageBucket: "ironiq-smart-gym-tracker.firebasestorage.app",
  messagingSenderId: "289692402445",
  appId: "1:289692402445:web:c48841e23bfdf2c464e644",
  measurementId: "G-46LVHP579L",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;
