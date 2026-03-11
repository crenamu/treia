import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { CandlestickChart, Search, Bell } from "lucide-react";
import Ticker from "@/components/Ticker";
import UserProfile from "@/components/UserProfile";
import { AuthProvider } from "@/lib/auth-context";
import GlobalAuthModal from "@/components/GlobalAuthModal";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "Treia | AI-Powered Trading Intelligence",
  description: "Experience the future of trading with AI-driven insights and tick data analysis.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className={`${inter.variable} ${outfit.variable}`}>
      <body className="min-h-screen flex flex-col overflow-x-hidden">
        <AuthProvider>
          {/* Real-time Ticker from Stitch Screen 1 */}
          <Ticker />
        
        {/* Premium Header from Stitch Screen 2 */}
        <header className="sticky top-0 z-40 bg-[var(--bg-card)]/80 backdrop-blur-xl border-b border-[var(--border-color)]">
          <div className="container mx-auto px-6 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 group transition-all">
               <div className="text-[var(--accent-gold)] group-hover:gold-glow transition-all">
                 <CandlestickChart size={28} strokeWidth={2.5} />
               </div>
               <span className="text-2xl font-outfit font-black text-white tracking-tighter">Treia</span>
            </Link>

            <nav className="hidden md:flex items-center gap-10">
               <NavLink href="/#tier">카피트레이딩</NavLink>
               <NavLink href="/#insights">인사이트</NavLink>
               <NavLink href="/#indicators">경제지표</NavLink>
               <NavLink href="/#ea-review">EA 리뷰</NavLink>
               <NavLink href="/guide">입문 가이드</NavLink>
            </nav>

            <div className="flex items-center gap-5">
               <button className="text-[var(--text-secondary)] hover:text-white transition-colors">
                  <Search size={20} />
               </button>
               <button className="text-[var(--text-secondary)] hover:text-white transition-colors relative">
                  <Bell size={20} />
                  <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-[var(--bg-card)]"></span>
               </button>
               <UserProfile />
            </div>
          </div>
        </header>

        <main className="flex-1">
          {children}
        </main>

          <footer className="border-t border-[var(--border-color)] bg-[#0F1115] py-16">
             <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
                <div className="col-span-1 md:col-span-2 flex flex-col gap-6">
                   <div className="flex items-center gap-2">
                      <CandlestickChart size={24} className="text-[var(--accent-gold)]" />
                      <span className="text-xl font-outfit font-black text-white tracking-tighter uppercase italic">Treia</span>
                   </div>
                   <p className="text-sm text-[var(--text-secondary)] max-w-sm leading-relaxed font-medium">
                                             데이터 기반 분석과 AI 기술이 결합된 교육용 트레이딩 인사이트 플랫폼입니다.
                   </p>
                </div>
                <FooterLinks title="서비스" links={["AI 큐레이션", "시장 분석", "EA / 인디케이터", "입문 가이드"]} />
                <FooterLinks title="고객지원" links={["공지사항", "이용약관", "개인정보처리방침", "문의하기"]} />
             </div>
             <div className="container mx-auto px-6 mt-16 pt-8 border-t border-gray-900 text-center">
                <p className="text-[10px] text-gray-600 mb-4 px-4 leading-relaxed font-medium uppercase tracking-widest">
                   ⚠️ 본 서비스는 교육 및 정보 제공만을 목적으로 하며, 실제 투자 권유나 금전적 수익을 보장하지 않습니다. 모든 투자의 판단과 책임은 투자자 본인에게 있습니다.
                </p>
                <p className="text-[10px] text-gray-700 font-bold tracking-widest uppercase">© 2026 Treia. All rights reserved.</p>
             </div>
          </footer>
          <GlobalAuthModal />
        </AuthProvider>
      </body>
    </html>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link 
      href={href} 
      className="text-sm font-bold text-[var(--text-secondary)] hover:text-white transition-all relative group"
    >
      {children}
      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[var(--accent-gold)] transition-all group-hover:w-full"></span>
    </Link>
  );
}

function FooterLinks({ title, links }: { title: string; links: string[] }) {
  return (
    <div className="flex flex-col gap-5">
       <h4 className="text-sm font-bold text-white uppercase tracking-widest italic">{title}</h4>
       <ul className="flex flex-col gap-3">
          {links.map((link, idx) => (
             <li key={idx}>
                <a href="#" className="text-sm text-[var(--text-secondary)] hover:text-[var(--accent-gold)] transition-colors font-medium">{link}</a>
             </li>
          ))}
       </ul>
    </div>
  );
}
