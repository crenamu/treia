'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Search, 
  Menu, 
  X, 
  Rocket, 
  Landmark, 
  Star, 
  ShieldCheck, 
  ChevronRight
} from 'lucide-react'
import UserProfile from '@/components/UserProfile'
import { motion, AnimatePresence } from 'framer-motion'

const NAV_LINKS = [
  { href: '/', label: '정기예금', icon: <Landmark size={18} /> },
  { href: '/savings', label: '정기적금', icon: <Rocket size={18} /> },
  { href: '/loans', label: '대출상품', icon: <ShieldCheck size={18} /> },
  { href: '/cards', label: '신용카드', icon: <Star size={18} /> },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => setIsOpen(false), [pathname])

  return (
    <>
      <header 
        className={`sticky top-0 z-50 transition-all duration-500 ${
          scrolled ? 'bg-white/95 backdrop-blur-xl border-b border-gray-100 py-2 shadow-sm' : 'bg-[var(--bg-beige)] py-4'
        }`}
      >
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 md:gap-10">
              <Link href="/" className="flex items-center gap-1 group">
                <span className="text-xl md:text-2xl font-black text-gray-900 tracking-tighter uppercase whitespace-nowrap">
                  FinTable
                </span>
              </Link>

              {/* Spread Out Desktop Navigation */}
              <nav className="hidden lg:flex items-center gap-6">
                {NAV_LINKS.map(link => (
                  <NavLink key={link.href} href={link.href} active={pathname === link.href || (link.href === '/' && pathname.includes('/deposits'))}>
                    {link.label}
                  </NavLink>
                ))}
              </nav>

              {/* Spread Out Mobile Navigation (Scrollable) */}
              <nav className="flex lg:hidden items-center gap-4 overflow-x-auto scrollbar-hide no-scrollbar py-2 max-w-[200px] xs:max-w-none">
                {NAV_LINKS.map(link => (
                  <Link 
                    key={link.href}
                    href={link.href}
                    className={`text-[13px] font-black whitespace-nowrap transition-all px-1 ${
                      (pathname === link.href || (link.href === '/' && pathname.includes('/deposits'))) ? 'text-gray-900 border-b-2 border-gray-900' : 'text-gray-400'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>

            <div className="flex items-center gap-2 md:gap-4">
              <nav className="hidden xl:flex items-center gap-6 mr-4 border-r border-gray-200 pr-6 h-6">
                 <NavLink href="/saved" active={pathname === '/saved'}>저장목록</NavLink>
                 <Link 
                   href="/treia" 
                   className={`flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-[1px] transition-all shadow-sm ${
                     pathname === '/treia' ? 'bg-gray-900 text-white' : 'bg-white border border-gray-100 text-gray-900 hover:bg-gray-50'
                   }`}
                 >
                   Treia <Rocket size={12} className="text-blue-500" />
                 </Link>
              </nav>

              <div className="flex items-center gap-2">
                <button className="hidden sm:flex p-2.5 bg-white border border-gray-100 text-gray-400 hover:text-gray-900 rounded-xl shadow-sm transition-all">
                  <Search size={18} />
                </button>
                <div className="scale-90 md:scale-100">
                  <UserProfile />
                </div>
                <button 
                  onClick={() => setIsOpen(true)}
                  className="lg:hidden w-10 h-10 flex items-center justify-center text-gray-900 bg-white border border-gray-100 rounded-xl shadow-sm"
                >
                  <Menu size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar (Keep for extra links like Saved/Treia) */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] bg-gray-900/40 backdrop-blur-sm lg:hidden"
              onClick={() => setIsOpen(false)}
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 z-[70] h-full w-[85%] max-w-[300px] bg-[var(--bg-beige)] shadow-2xl lg:hidden flex flex-col"
            >
              <div className="p-6 pb-4 flex items-center justify-between border-b border-gray-100">
                <span className="text-xl font-black text-gray-900 tracking-tighter uppercase">
                  FinTable
                </span>
                <button onClick={() => setIsOpen(false)} className="p-2.5 bg-white border border-gray-100 text-gray-400 rounded-xl shadow-sm">
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-8">
                <div className="space-y-3">
                   <p className="px-2 text-[10px] font-black text-gray-400 uppercase tracking-widest opacity-60">Portfolio</p>
                   <SidebarLink href="/saved" label="나의 저장 목록" icon={<Star size={18} />} active={pathname === '/saved'} />
                   <SidebarLink href="/treia" label="Treia 서비스" icon={<Rocket size={18} />} highlight />
                </div>
              </div>

              <div className="p-6 border-t border-gray-100 bg-white">
                <UserProfile />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

function NavLink({ href, children, active }: { href: string; children: React.ReactNode; active?: boolean }) {
  return (
    <Link
      href={href}
      className={`text-sm md:text-[15px] font-black transition-all relative group whitespace-nowrap ${
        active ? 'text-gray-900' : 'text-gray-400 hover:text-gray-900'
      }`}
    >
      {children}
      <span className={`absolute -bottom-1 left-0 h-[2.5px] bg-gray-900 transition-all ${
        active ? 'w-full' : 'w-0 group-hover:w-full'
      }`}></span>
    </Link>
  )
}

function SidebarLink({ href, label, icon, active, highlight }: { href: string, label: string, icon: React.ReactNode, active?: boolean, highlight?: boolean }) {
   return (
      <Link 
         href={href}
         className={`flex items-center gap-4 p-4 rounded-[20px] transition-all border shadow-sm ${
            active 
               ? 'bg-blue-50 border-blue-100 text-blue-600 font-black' 
               : (highlight ? 'bg-gray-900 text-white font-black border-gray-900 shadow-xl shadow-gray-900/20' : 'bg-white border-gray-50 text-gray-600 font-bold hover:bg-gray-50')
         }`}
      >
         <div className={`${active ? 'text-blue-600' : (highlight ? 'text-white' : 'text-gray-400')}`}>
            {icon}
         </div>
         <span className="text-sm">{label}</span>
         <ChevronRight size={14} className="ml-auto opacity-30" />
      </Link>
   )
}
