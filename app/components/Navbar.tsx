'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Search, 
  Menu, 
  X, 
  Rocket, 
  Home as HomeIcon, 
  Landmark, 
  Calculator, 
  Star, 
  ShieldCheck, 
  Users, 
  Wallet,
  Coins,
  ChevronRight
} from 'lucide-react'
import UserProfile from '@/components/UserProfile'

const NAV_LINKS = [
  { href: '/calculator', label: '금융계산기', icon: <Calculator size={18} /> },
  { href: '/', label: '금융상품', icon: <Landmark size={18} /> },
  { href: '/housing', label: '임대주택', icon: <HomeIcon size={18} /> },
  { href: '/community', label: '커뮤니티', icon: <Users size={18} /> },
]

const PRODUCT_CATEGORIES = [
  { href: '/', label: '정기예금', icon: <Landmark size={16} /> },
  { href: '/savings', label: '정기적금', icon: <Rocket size={16} /> },
  { href: '/isa', label: 'ISA', icon: <ShieldCheck size={16} /> },
  { href: '/etf', label: 'ETF/주식', icon: <Coins size={16} /> },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  return (
    <>
      <header className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-sm py-2' : 'bg-white border-b border-gray-100 py-4'
      }`}>
        <div className="container mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-10">
            <Link href="/" className="flex items-center gap-2 group">
              <span className="text-xl md:text-2xl font-outfit font-black text-gray-900 tracking-tighter uppercase">
                FinTable
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              {NAV_LINKS.map(link => (
                <NavLink key={link.href} href={link.href} active={pathname === link.href || (link.href === '/' && pathname === '/')}>
                  {link.label}
                </NavLink>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            {/* Treia Link (Desktop) */}
            <nav className="hidden md:flex items-center gap-6 mr-4 border-r border-gray-200 pr-6">
               <NavLink href="/saved" active={pathname === '/saved'}>나의 저장목록</NavLink>
               <NavLink href="/treia" highlight active={pathname === '/treia'}>Treia</NavLink>
            </nav>

            <div className="flex items-center gap-3">
              <button className="p-2 text-gray-400 hover:text-gray-900 transition-colors">
                <Search size={20} />
              </button>
              <div className="hidden sm:block">
                <UserProfile />
              </div>
              
              {/* Mobile Menu Button */}
              <button 
                onClick={() => setIsOpen(true)}
                className="lg:hidden p-2 text-gray-900 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                aria-label="메뉴 열기"
              >
                <Menu size={20} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-[60] bg-gray-900/40 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Mobile Sidebar */}
      <div className={`fixed top-0 right-0 z-[70] h-full w-[85%] max-w-[320px] bg-white shadow-2xl lg:hidden transform transition-transform duration-300 ease-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="p-8 h-full flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <span className="text-xl font-outfit font-black text-gray-900 tracking-tighter uppercase">
              FinTable
            </span>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-2 text-gray-400 hover:text-gray-900"
            >
              <X size={24} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
             {/* Main Tabs Like Stitch */}
             <div className="grid grid-cols-2 gap-2 mb-8">
                {NAV_LINKS.map(link => (
                   <Link 
                      key={link.href}
                      href={link.href}
                      className={`flex flex-col gap-3 p-4 rounded-3xl transition-all border ${
                        pathname === link.href ? 'bg-blue-600 text-white border-blue-600' : 'bg-gray-50 text-gray-900 border-transparent hover:bg-gray-100'
                      }`}
                   >
                     <div className={`${pathname === link.href ? 'text-white' : 'text-blue-600'}`}>
                        {link.icon}
                     </div>
                     <span className="text-xs font-black">{link.label}</span>
                   </Link>
                ))}
             </div>

             <div className="space-y-8">
                <div>
                   <p className="px-2 text-[10px] font-black text-gray-400 uppercase tracking-[3px] mb-4">금융 상품 카테고리</p>
                   <div className="grid grid-cols-1 gap-1">
                      {PRODUCT_CATEGORIES.map(cat => (
                         <Link 
                            key={cat.href}
                            href={cat.href}
                            className={`flex items-center gap-3 p-4 rounded-2xl transition-all ${
                               pathname === cat.href ? 'bg-blue-50 text-blue-600 font-black' : 'text-gray-600 font-bold hover:bg-gray-50'
                            }`}
                         >
                            <div className="text-gray-400">{cat.icon}</div>
                            <span className="text-sm">{cat.label}</span>
                            <ChevronRight size={14} className="ml-auto opacity-30" />
                         </Link>
                      ))}
                   </div>
                </div>

                <div>
                   <p className="px-2 text-[10px] font-black text-gray-400 uppercase tracking-[3px] mb-4">내 서비스</p>
                   <div className="grid grid-cols-1 gap-1">
                      <SidebarLink href="/saved" label="나의 저장 목록" icon={<Star size={16} />} active={pathname === '/saved'} />
                      <SidebarLink href="/housing" label="내 청약 진단 전적" icon={<Wallet size={16} />} />
                      <SidebarLink href="/treia" label="Treia 서비스 바로가기" icon={<Rocket size={16} />} highlight />
                   </div>
                </div>
             </div>
          </div>

          <div className="pt-8 border-t border-gray-100 mt-8">
            <UserProfile />
          </div>
        </div>
      </div>
    </>
  )
}

function NavLink({ href, children, active, highlight }: { href: string; children: React.ReactNode; active?: boolean; highlight?: boolean }) {
  return (
    <Link
      href={href}
      className={`text-sm font-bold transition-all relative group ${
        active 
          ? (highlight ? 'text-green-700' : 'text-gray-900') 
          : (highlight ? 'text-green-600 hover:text-green-700' : 'text-gray-400 hover:text-gray-900')
      }`}
    >
      {children}
      <span className={`absolute -bottom-1 left-0 h-0.5 transition-all ${
        active ? 'w-full' : 'w-0 group-hover:w-full'
      } ${highlight ? 'bg-green-600' : 'bg-gray-900'}`}></span>
    </Link>
  )
}

function SidebarLink({ href, label, icon, active, highlight }: { href: string, label: string, icon: React.ReactNode, active?: boolean, highlight?: boolean }) {
   return (
      <Link 
         href={href}
         className={`flex items-center gap-3 p-4 rounded-2xl transition-all ${
            active 
               ? 'bg-gray-100 text-gray-900 font-black' 
               : (highlight ? 'bg-green-50 text-green-700 font-black shadow-sm' : 'text-gray-600 font-bold hover:bg-gray-50')
         }`}
      >
         <div className={`${active ? 'text-gray-900' : (highlight ? 'text-green-700' : 'text-gray-400')}`}>
            {icon}
         </div>
         <span className="text-sm">{label}</span>
         <ChevronRight size={14} className="ml-auto opacity-30" />
      </Link>
   )
}
