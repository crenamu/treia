'use client'
import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { X, Mail, Lock, User, Loader2, ArrowRight, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: "login" | "signup";
}

export default function AuthModal({ isOpen, onClose, initialMode = "login" }: AuthModalProps) {
  const { login, signUpEmail, signInEmail } = useAuth();
  const [mode, setMode] = useState<"login" | "signup">(initialMode);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    nickname: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (mode === "signup") {
        if (formData.password !== formData.confirmPassword) {
          throw new Error("비밀번호가 일치하지 않습니다.");
        }
        if (formData.password.length < 6) {
          throw new Error("비밀번호는 6자 이상이어야 합니다.");
        }
        await signUpEmail(formData.email, formData.password, formData.nickname || "트레이더");
      } else {
        await signInEmail(formData.email, formData.password);
      }
      onClose();
    } catch (err: unknown) {
      const error = err as { code?: string; message?: string };
      console.error(error);
      if (error.code === 'auth/username-exists') setError("이미 존재하는 닉네임입니다.");
      else if (error.code === 'auth/email-already-in-use') setError("이미 사용 중인 이메일입니다.");
      else if (error.code === 'auth/invalid-credential') setError("이메일 또는 비밀번호가 틀렸습니다.");
      else setError(error.message || "오류가 발생했습니다. 다시 시도해 주세요.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      await login();
      // 성공 시 state 업데이트를 위해 0.5초 정도 대기 후 닫기
      setTimeout(() => onClose(), 500);
    } catch (_err) {
      setError("구글 로그인 중 오류가 발생했습니다. 팝업이 차단되었는지 확인해 주세요.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
      />

      {/* Modal Container */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-[440px] bg-[#0a0a0c] border border-gray-800 rounded-[32px] overflow-hidden shadow-2xl"
      >
        {/* Glow Effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-orange-500/10 rounded-full blur-[60px] pointer-events-none" />
        
        <div className="p-8 flex flex-col gap-6">
          {/* Header */}
          <div className="flex flex-col items-center text-center gap-2 mb-2">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 flex items-center justify-center mb-2 shadow-inner">
               <ShieldCheck className="text-orange-500" size={32} />
            </div>
            <h2 className="text-2xl font-outfit font-black text-white tracking-tight uppercase">
              {mode === "login" ? "TREIA LOGIN" : "JOIN TREIA"}
            </h2>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-widest">
              {mode === "login" ? "전문 트레이더를 위한 공간" : "전략 공유 멤버십 시작하기"}
            </p>
          </div>

          <button onClick={onClose} className="absolute top-6 right-6 text-gray-600 hover:text-white transition-colors">
             <X size={20} />
          </button>

          {/* Social Login */}
          <button 
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-3.5 px-4 bg-white hover:bg-gray-100 text-black rounded-2xl font-bold text-sm transition-all shadow-lg active:scale-95"
          >
             <Image src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" width={18} height={18} />
             구글 계정으로 {mode === "login" ? "시작" : "가입"}하기
          </button>

          {/* Divider */}
          <div className="relative flex items-center">
            <div className="flex-grow border-t border-gray-800"></div>
            <span className="flex-shrink mx-4 text-[10px] text-gray-600 font-black uppercase tracking-widest leading-none">OR EMAIL</span>
            <div className="flex-grow border-t border-gray-800"></div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {mode === "signup" && (
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
                <input 
                  type="text"
                  required
                  placeholder="닉네임"
                  value={formData.nickname}
                  onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
                  className="w-full bg-gray-900/50 border border-gray-800 rounded-2xl pl-12 pr-4 py-3.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-orange-500/50 transition-all"
                />
              </div>
            )}
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
              <input 
                type="email"
                required
                placeholder="이메일 주소"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-gray-900/50 border border-gray-800 rounded-2xl pl-12 pr-4 py-3.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-orange-500/50 transition-all"
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
              <input 
                type="password"
                required
                placeholder="비밀번호"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full bg-gray-900/50 border border-gray-800 rounded-2xl pl-12 pr-4 py-3.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-orange-500/50 transition-all"
              />
            </div>
            {mode === "signup" && (
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
                <input 
                  type="password"
                  required
                  placeholder="비밀번호 확인"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="w-full bg-gray-900/50 border border-gray-800 rounded-2xl pl-12 pr-4 py-3.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-orange-500/50 transition-all"
                />
              </div>
            )}

            {error && (
              <p className="text-[10px] font-bold text-red-500 text-center uppercase tracking-tighter bg-red-500/10 py-2 rounded-lg">
                {error}
              </p>
            )}

            <button 
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-orange-500 hover:bg-orange-400 text-black rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-orange-500/10 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <>
                  {mode === "login" ? "로그인" : "회원가입 완료"}
                  <ArrowRight size={14} />
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="text-center">
            <button 
              onClick={() => setMode(mode === "login" ? "signup" : "login")}
              className="text-xs font-bold text-gray-500 hover:text-white transition-colors"
            >
              {mode === "login" ? "계정이 없으신가요? 5초 만에 가입하기" : "이미 회원이신가요? 로그인하기"}
            </button>
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="bg-gray-800/10 border-t border-gray-800 p-4 text-center">
           <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest underline decoration-orange-500/30">
              Trusted by 1,200+ Traders Global
           </p>
        </div>
      </motion.div>
    </div>
  );
}
