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

// Backend API URL (ASP.NET'inizin çalıştığı adres)
const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5239";

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

// Firebase Console'dan aldığın config bilgilerini buraya yapıştır
const firebaseConfig = {
  apiKey: "AIzaSyCf3NLHahevXOlh75aiZvRhGAcQlsurUU4",
  authDomain: "yaver-ai.firebaseapp.com",
  projectId: "yaver-ai",
  storageBucket: "yaver-ai.firebasestorage.app",
  messagingSenderId: "102109979950",
  appId: "1:102109979950:web:04a4c4fc8886a2841bc6bf",
};

// Firebase'i başlat
const app: FirebaseApp = initializeApp(firebaseConfig);
const auth: Auth = getAuth(app);

// Providers
const googleProvider = new GoogleAuthProvider();
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
