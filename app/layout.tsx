import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { CandlestickChart, Search, Bell, Menu } from "lucide-react";
import Ticker from "@/components/Ticker";
import UserProfile from "@/components/UserProfile";
import { AuthProvider } from "@/lib/auth-context";
import GlobalAuthModal from "@/components/GlobalAuthModal";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "FinTable | 금융상품 · 임대주택 · 자동매매 큐레이션",
  description:
    "예적금 금리 비교부터 임대주택 공고, 골드 자동매매 정보까지 한 곳에서 확인하세요.",
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
          {/* Ticker (Neutral - White/Light) */}
          <div className="bg-white border-b border-gray-100">
             <Ticker />
          </div>

          {/* FinTable Header */}
          <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-100">
            <div className="container mx-auto px-6 h-16 flex items-center justify-between">
              <div className="flex items-center gap-8">
                <Link
                  href="/"
                  className="flex items-center gap-2 group transition-all"
                >
                  <span className="text-xl font-outfit font-black text-gray-900 tracking-tighter uppercase">
                    FinTable
                  </span>
                </Link>

                <nav className="hidden md:flex items-center gap-6">
                  <NavLink href="/">예금</NavLink>
                  <NavLink href="/savings">적금</NavLink>
                  <NavLink href="/calculator">금융계산기</NavLink>
                  <NavLink href="/isa">ISA</NavLink>
                  <NavLink href="/etf">ETF</NavLink>
                </nav>
              </div>

              <div className="flex items-center gap-6">
                <nav className="hidden md:flex items-center gap-6 mr-4 border-r border-gray-200 pr-6">
                  <NavLink href="/saved">저장목록</NavLink>
                  <NavLink href="/treia" highlight>Treia</NavLink>
                  <NavLink href="/housing">임대주택</NavLink>
                </nav>
                
                <div className="flex items-center gap-4">
                  <button className="text-gray-400 hover:text-gray-900 transition-colors">
                    <Search size={20} />
                  </button>
                  <UserProfile />
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1">{children}</main>

          <footer className="border-t border-gray-100 bg-white py-16">
            <div className="container mx-auto px-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                <div className="col-span-1 md:col-span-2 flex flex-col gap-6">
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-outfit font-black text-gray-900 tracking-tighter uppercase">
                      FinTable
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 max-w-sm leading-relaxed font-medium">
                    공공데이터와 AI 기술을 결합하여 복잡한 금융 정보를 
                    테이블 위에 깔끔하게 정리해 드립니다.
                  </p>
                </div>
                <FooterLinks
                  title="금융상품"
                  links={[
                    { label: "예금 금리 비교", href: "/" },
                    { label: "적금 금리 비교", href: "#" },
                    { label: "ISA 정보", href: "#" },
                    { label: "ETF 큐레이션", href: "#" },
                  ]}
                />
                <FooterLinks
                  title="서비스"
                  links={[
                    { label: "Treia 자동매매", href: "/treia" },
                    { label: "임대주택 공고", href: "#" },
                    { label: "공지사항", href: "#" },
                    { label: "문의하기", href: "#" },
                  ]}
                />
              </div>
              
              <div className="pt-8 border-t border-gray-50 text-center">
                <p className="text-[10px] text-gray-400 mb-4 px-4 leading-relaxed font-medium uppercase tracking-widest">
                  ⚠️ 본 서비스는 정보 제공만을 목적으로 하며, 실제 투자
                  권유나 수익을 보장하지 않습니다. 금융 거래 시 해당 기관의 
                  원문 공고를 반드시 확인하시기 바랍니다.
                </p>
                <p className="text-[10px] text-gray-500 font-bold tracking-widest uppercase">
                  © 2026 FinTable. All rights reserved.
                </p>
              </div>
            </div>
          </footer>
          <GlobalAuthModal />
        </AuthProvider>
      </body>
    </html>
  );
}

function NavLink({
  href,
  children,
  disabled,
  highlight,
}: {
  href: string;
  children: React.ReactNode;
  disabled?: boolean;
  highlight?: boolean;
}) {
  if (disabled) {
    return (
      <span className="text-sm font-bold text-gray-300 cursor-not-allowed">
        {children}
      </span>
    );
  }

  return (
    <Link
      href={href}
      className={`text-sm font-bold transition-all relative group ${
        highlight ? 'text-green-600 hover:text-green-700' : 'text-gray-500 hover:text-gray-900'
      }`}
    >
      {children}
      <span className={`absolute -bottom-1 left-0 w-0 h-0.5 transition-all group-hover:w-full ${
        highlight ? 'bg-green-600' : 'bg-gray-900'
      }`}></span>
    </Link>
  );
}

function FooterLinks({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div className="flex flex-col gap-5">
      <h4 className="text-sm font-bold text-gray-900 uppercase tracking-widest">
        {title}
      </h4>
      <ul className="flex flex-col gap-3">
        {links.map((link, idx) => (
          <li key={idx}>
            <Link
              href={link.href}
              className="text-sm text-gray-500 hover:text-gray-900 transition-colors font-medium"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
