// src/firebase/config.js
// ============================================================
// ⚠️  غيّر القيم دي بقيمك الحقيقية من Firebase Console
//     Project Settings → General → Your apps → firebaseConfig
// ============================================================

import { initializeApp, getApps } from "firebase/app";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCjRvJSuFoWSZd6jcKNG4NiM19mde4q_Z0",
  authDomain: "dactra-3f8aa.firebaseapp.com",
  projectId: "dactra-3f8aa",
  storageBucket: "dactra-3f8aa.firebasestorage.app",
  messagingSenderId: "1074038639427",
  appId: "1:1074038639427:web:b18b09921090ec143c3df6",
  measurementId: "G-W7R64Z6RNZ",
};
// منع تهيئة Firebase أكتر من مرة (مهم في React StrictMode)
const app =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export default app;
