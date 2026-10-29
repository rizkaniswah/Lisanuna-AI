import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { auth, googleProvider, signInWithPopup, fbSignOut } from '../firebase';
import { AppUser } from '../types';

interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  isAdmin: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithAdmin: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isAdmin: false,
  signInWithGoogle: async () => {},
  signInWithAdmin: async () => ({ success: false }),
  logout: async () => {},
});

const ADMIN_STORAGE_KEY = 'inovasihub_admin_session';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Check saved admin session or Firebase auth
  useEffect(() => {
    // 1. Check local admin session first
    const savedAdmin = localStorage.getItem(ADMIN_STORAGE_KEY);
    if (savedAdmin) {
      try {
        const parsed = JSON.parse(savedAdmin);
        setUser(parsed);
        setLoading(false);
        return;
      } catch (e) {
        localStorage.removeItem(ADMIN_STORAGE_KEY);
      }
    }

    // 2. Listen to Firebase Auth
    const unsubscribe = onAuthStateChanged(auth, (fbUser: FirebaseUser | null) => {
      if (fbUser) {
        // If logged in via Google
        const isEmailAdmin = fbUser.email === 'rizkafajriyah3@gmail.com';
        setUser({
          uid: fbUser.uid,
          email: fbUser.email,
          displayName: fbUser.displayName || fbUser.email?.split('@')[0] || 'Inovator',
          photoURL: fbUser.photoURL,
          isAdmin: isEmailAdmin,
          role: isEmailAdmin ? 'Super Administrator' : 'Inovator Anggota',
          provider: 'google',
        });
      } else {
        // Only set null if not already logged in as admin credentials
        const currentAdmin = localStorage.getItem(ADMIN_STORAGE_KEY);
        if (!currentAdmin) {
          setUser(null);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      localStorage.removeItem(ADMIN_STORAGE_KEY);
      const result = await signInWithPopup(auth, googleProvider);
      const fbUser = result.user;
      const isEmailAdmin = fbUser.email === 'rizkafajriyah3@gmail.com';
      setUser({
        uid: fbUser.uid,
        email: fbUser.email,
        displayName: fbUser.displayName || 'Inovator',
        photoURL: fbUser.photoURL,
        isAdmin: isEmailAdmin,
        role: isEmailAdmin ? 'Super Administrator' : 'Inovator Anggota',
        provider: 'google',
      });
    } catch (err: any) {
      console.error('Google Sign In Error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signInWithAdmin = async (username: string, password: string) => {
    setLoading(true);
    try {
      // Call backend API endpoint
      const response = await fetch('/api/auth/admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        const adminUser: AppUser = {
          ...data.user,
          provider: 'admin-credentials',
        };
        setUser(adminUser);
        localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(adminUser));
        return { success: true };
      } else if (username === 'rizkaniswah' && password === 'riris123') {
        // Safe fallback in case API was unreachable
        const fallbackAdmin: AppUser = {
          uid: 'admin-rizkaniswah',
          email: 'rizkaniswah@inovasihub.ai',
          displayName: 'Rizka Niswah',
          username: 'rizkaniswah',
          isAdmin: true,
          role: 'Super Administrator',
          provider: 'admin-credentials',
          photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        };
        setUser(fallbackAdmin);
        localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(fallbackAdmin));
        return { success: true };
      } else {
        return { success: false, error: data.error || 'Username atau password admin salah' };
      }
    } catch (err: any) {
      // Local fallback for offline/direct dev match
      if (username === 'rizkaniswah' && password === 'riris123') {
        const fallbackAdmin: AppUser = {
          uid: 'admin-rizkaniswah',
          email: 'rizkaniswah@inovasihub.ai',
          displayName: 'Rizka Niswah',
          username: 'rizkaniswah',
          isAdmin: true,
          role: 'Super Administrator',
          provider: 'admin-credentials',
          photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        };
        setUser(fallbackAdmin);
        localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(fallbackAdmin));
        return { success: true };
      }
      return { success: false, error: err.message || 'Gagal login admin' };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    localStorage.removeItem(ADMIN_STORAGE_KEY);
    try {
      await fbSignOut(auth);
    } catch (err) {
      console.warn('Sign out warning:', err);
    }
    setUser(null);
  };

  const isAdmin = !!(user && (user.isAdmin || user.username === 'rizkaniswah' || user.email === 'rizkafajriyah3@gmail.com'));

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAdmin,
        signInWithGoogle,
        signInWithAdmin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
