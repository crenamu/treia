'use client'
import { useAuth } from "@/lib/auth-context";
import AuthModal from "./AuthModal";

export default function GlobalAuthModal() {
  const { isAuthModalOpen, setAuthModalOpen } = useAuth();
  
  if (!isAuthModalOpen) return null;

  return (
    <AuthModal 
      isOpen={isAuthModalOpen} 
      onClose={() => setAuthModalOpen(false)} 
    />
  );
}
