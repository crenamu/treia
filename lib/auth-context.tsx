'use client'
import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  onAuthStateChanged, 
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile
} from 'firebase/auth';
import { auth } from './firebase';

export type UserRole = 'member' | 'admin' | 'guest';

interface AuthContextType {
  user: User | null;
  role: UserRole;
  tier: number;
  loading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  signUpEmail: (email: string, pass: string, name: string) => Promise<void>;
  signInEmail: (email: string, pass: string) => Promise<void>;
  isAuthModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole>('guest');
  const [tier, setTier] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setRole('member'); // 현재는 모두 동일 등급으로 통합
        setTier(1);        // 현재는 모두 동일 티어로 통합
      } else {
        setUser(null);
        setRole('guest');
        setTier(0);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const login = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login Error:", error);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  const signUpEmail = async (email: string, pass: string, name: string) => {
    try {
      const res = await createUserWithEmailAndPassword(auth, email, pass);
      if (res.user) {
        await updateProfile(res.user, { displayName: name });
      }
    } catch (error) {
      console.error("Sign Up Error:", error);
      throw error;
    }
  };

  const signInEmail = async (email: string, pass: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, pass);
    } catch (error) {
      console.error("Sign In Error:", error);
      throw error;
    }
  };

  const [isAuthModalOpen, setAuthModalOpen] = useState(false);

  return (
    <AuthContext.Provider value={{ user, role, tier, loading, login, logout, signUpEmail, signInEmail, isAuthModalOpen, setAuthModalOpen }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
