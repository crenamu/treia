"use client";
import {
	createUserWithEmailAndPassword,
	GoogleAuthProvider,
	onAuthStateChanged,
	signInWithEmailAndPassword,
	signInWithPopup,
	signOut,
	type User,
	updateProfile,
} from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "./firebase";

export type UserRole = "member" | "admin" | "guest";

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
	const [role, setRole] = useState<UserRole>("guest");
	const [tier, setTier] = useState<number>(0);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
			if (currentUser) {
				setUser(currentUser);
				// Treia 전용 DB(db)에 접속 정보 업데이트 (Prefix 정책 대응: treia_users)
				try {
					const userRef = doc(db, "treia_users", currentUser.uid);
					await setDoc(
						userRef,
						{
							email: currentUser.email,
							displayName: currentUser.displayName,
							photoURL: currentUser.photoURL,
							lastLogin: serverTimestamp(),
							app: "treia",
						},
						{ merge: true },
					);

					const userSnap = await getDoc(userRef);
					if (userSnap.exists()) {
						const userData = userSnap.data();
						setRole(userData.role || "member");
						setTier(userData.tier || 1);
					}
				} catch (err) {
					console.error("User metadata sync error:", err);
					setRole("member");
					setTier(1);
				}
			} else {
				setUser(null);
				setRole("guest");
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
			throw error; // 에러를 던져야 UI에서 인지합니다.
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
		<AuthContext.Provider
			value={{
				user,
				role,
				tier,
				loading,
				login,
				logout,
				signUpEmail,
				signInEmail,
				isAuthModalOpen,
				setAuthModalOpen,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
}

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};
