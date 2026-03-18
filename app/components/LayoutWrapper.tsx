'use client'

import { usePathname } from 'next/navigation'
import Navbar from './Navbar'
import Link from 'next/link'

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isTreia = pathname?.startsWith('/treia');

  if (isTreia) {
    return (
      <div className="min-h-screen bg-[#080808] text-[#f5f0e8] flex flex-col font-sans selection:bg-[#10B981] selection:text-[#0a0a0a] overflow-x-hidden">
        {/* Simple Treia Header */}
        <header className="fixed top-0 w-full z-50 bg-[#080808]/80 backdrop-blur-md border-b border-[#1e1e1e] py-4 px-6 md:px-12 flex justify-between items-center transition-all">
           <Link href="/treia" className="flex items-center gap-1 group">
             <span className="text-xl md:text-2xl font-black tracking-widest uppercase text-white hover:text-[#10B981] transition-colors">
               Treia
             </span>
           </Link>
           <a href="#offer" className="text-xs font-bold bg-[#1e2230] text-[#a1a1aa] hover:bg-[#10B981] hover:text-white px-4 py-2 rounded-full transition-all">
             무료 관전방 
           </a>
        </header>

        {/* Mian Content without max-w-5xl padding */}
        <main className="flex-1 w-full m-0 p-0 relative">
          {children}
        </main>
        
        {/* Simple Treia Footer */}
        <footer className="border-t border-[#1e1e1e] bg-[#0a0a0a] py-8 text-center text-xs text-[#52525b] font-mono tracking-widest">
           © 2026 TREIA INTELLIGENCE. ALL RIGHTS RESERVED.
        </footer>
      </div>
    );
  }

  // FinTable Layout
  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden font-sans antialiased text-gray-900 bg-[var(--bg-beige)]">
      <Navbar />
      <main className="flex-1 w-full">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}

function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-white py-16">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2 flex flex-col gap-6">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black text-gray-900 tracking-tighter uppercase">
                FinTable
              </span>
            </div>
            <p className="text-base text-gray-500 max-w-sm leading-relaxed font-medium">
              공공데이터와 AI 기술을 결합하여 복잡한 금융 정보를 
              테이블 위에 가장 쉽고 명확하게 정리해 드립니다.
            </p>
          </div>
          <FooterLinks
            title="금융상품"
            links={[
              { label: "예금 금리 비교", href: "/" },
              { label: "적금 금리 비교", href: "/savings" },
              { label: "대출 상품 비교", href: "/loans" },
              { label: "신용카드 혜택", href: "/cards" },
            ]}
          />
          <FooterLinks
            title="서비스"
            links={[
              { label: "Treia 자동매매", href: "/treia" },
              { label: "임대주택 공고", href: "/housing" },
              { label: "공지사항", href: "#" },
              { label: "문의하기", href: "#" },
            ]}
          />
        </div>
        
        <div className="pt-8 border-t border-gray-50 text-center">
          <p className="text-xs text-gray-400 mb-4 px-4 leading-relaxed font-medium uppercase tracking-widest">
            ⚠️ 본 서비스는 정보 제공만을 목적으로 하며, 실제 투자
            권유나 수익을 보장하지 않습니다. 금융 거래 시 해당 기관의 
            원문 공고를 반드시 확인하시기 바랍니다.
          </p>
          <p className="text-xs text-gray-500 font-bold tracking-widest uppercase">
            © 2026 FinTable. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

function FooterLinks({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div className="flex flex-col gap-6">
      <h4 className="text-sm font-bold text-gray-900 uppercase tracking-widest">
        {title}
      </h4>
      <ul className="flex flex-col gap-4">
        {links.map((link, idx) => (
          <li key={idx}>
            <Link
              href={link.href}
              className="text-base text-gray-400 hover:text-gray-900 transition-colors font-medium"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
