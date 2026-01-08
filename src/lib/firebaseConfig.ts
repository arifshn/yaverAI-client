// src/lib/firebaseConfig.ts

import { initializeApp, type FirebaseApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  OAuthProvider,
  signInWithPopup,
  signOut,
  type Auth,
  type UserCredential,
} from "firebase/auth";

// Backend API URL
const API_URL = import.meta.env.VITE_API_URL?.replace(/\/api\/?$/, '') || "http://localhost:5000";

// Firebase Config Type


// Kullanıcı Bilgileri Type
export interface UserInfo {
  firebaseToken: string;
  email: string;
  name: string | null;
  photo: string | null;
  uid: string;
}

// Backend Response Type
export interface BackendAuthResponse {
  message: string;
  token: string;
  user: {
    id: string;
    email: string;
    userName: string;
    firstName: string | null;
    lastName: string | null;
    avatarUrl: string | null;
    isPremium: boolean;
  };
}

// Firebase Console'dan aldığın config bilgilerini .env dosyasına koy
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "",
};

// Firebase'i başlat
const app: FirebaseApp = initializeApp(firebaseConfig);
const auth: Auth = getAuth(app);

// Providers
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});
const appleProvider = new OAuthProvider("apple.com");

// Google ile giriş fonksiyonu
export async function loginWithGoogle(): Promise<BackendAuthResponse> {
  try {
    // 1. Google popup açılır
    const result: UserCredential = await signInWithPopup(auth, googleProvider);

    // 2. Firebase'den ID Token al
    const idToken: string = await result.user.getIdToken();

    // Fotoğrafı garantile (Provider data'dan bulmaya çalış)
    const photoUrl = result.user.photoURL || result.user.providerData.find(p => p.photoURL)?.photoURL || null;

    // 3. Backend'e gönder
    const response = await fetch(`${API_URL}/api/auth/firebase-login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firebaseToken: idToken,
        email: result.user.email,
        name: result.user.displayName,
        photo: photoUrl,
        provider: "google",
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Backend authentication failed");
    }

    const data: BackendAuthResponse = await response.json();

    // 4. JWT Token'ı localStorage'a kaydet (AYNI KEY'LERI KULLAN)
    localStorage.setItem("token", data.token); // "yaverAI_token" yerine "token"
    localStorage.setItem("user", JSON.stringify(data.user)); // "yaverAI_user" yerine "user"

    return data;
  } catch (error: any) {
    throw new Error(error.message || "Giriş sırasında hata oluştu");
  }
}

// Çıkış fonksiyonu
export async function logout(): Promise<void> {
  try {
    await signOut(auth);
    localStorage.removeItem("token"); // Aynı key
    localStorage.removeItem("user"); // Aynı key
  } catch (error: any) {
    throw new Error(error.message || "Çıkış sırasında hata oluştu");
  }
}

// Apple ile giriş fonksiyonu
export async function loginWithApple(): Promise<BackendAuthResponse> {
  try {
    // 1. Apple popup açılır
    const result: UserCredential = await signInWithPopup(auth, appleProvider);

    // 2. Firebase'den ID Token al
    const idToken: string = await result.user.getIdToken();

    // 3. Backend'e gönder
    const response = await fetch(`${API_URL}/api/auth/firebase-login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firebaseToken: idToken,
        email: result.user.email || `${result.user.uid}@appleid.private`,
        name: result.user.displayName,
        photo: result.user.photoURL,
        provider: "apple",
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Backend authentication failed");
    }

    const data: BackendAuthResponse = await response.json();

    // 4. JWT Token'ı localStorage'a kaydet (AYNI KEY'LERI KULLAN)
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    return data;
  } catch (error: any) {
    throw new Error(error.message || "Apple ile giriş sırasında hata oluştu");
  }
}

// Token kontrol fonksiyonu
export function getToken(): string | null {
  return localStorage.getItem("token"); // Aynı key
}

// User bilgisi al
export function getCurrentUser(): BackendAuthResponse["user"] | null {
  const userStr = localStorage.getItem("user"); // Aynı key
  return userStr ? JSON.parse(userStr) : null;
}

// Login durumu kontrol et
export function isLoggedIn(): boolean {
  return !!getToken();
}

export { auth };
