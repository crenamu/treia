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
  ChevronRight,
  ChevronDown
} from 'lucide-react'
import UserProfile from '@/components/UserProfile'
import { motion, AnimatePresence } from 'framer-motion'

const NAV_LINKS = [
  { 
    href: '/', 
    label: '금융상품', 
    icon: <Landmark size={18} />,
    submenu: [
      { href: '/', label: '정기예금', icon: <Landmark size={14} /> },
      { href: '/savings', label: '정기적금', icon: <Rocket size={14} /> },
      { href: '/isa', label: 'ISA (준비중)', icon: <ShieldCheck size={14} /> },
    ]
  },
  { href: '/housing', label: '임대주택', icon: <HomeIcon size={18} /> },
  { href: '/calculator', label: '금융계산기', icon: <Calculator size={18} /> },
  { href: '/community', label: '커뮤니티', icon: <Users size={18} /> },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [hoveredMenu, setHoveredMenu] = useState<string | null>(null)
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
          scrolled ? 'bg-white/90 backdrop-blur-xl border-b border-gray-100 py-3 shadow-sm' : 'bg-[var(--bg-beige)] py-5'
        }`}
        onMouseLeave={() => setHoveredMenu(null)}
      >
        <div className="container mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-12">
            <Link href="/" className="flex items-center gap-1 group">
              <span className="text-2xl font-black text-gray-900 tracking-tighter uppercase">
                FinTable
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-10">
              {NAV_LINKS.map(link => (
                <div 
                  key={link.href} 
                  className="relative h-10 flex items-center"
                  onMouseEnter={() => setHoveredMenu(link.label)}
                >
                  <NavLink href={link.href} active={link.label === '금융상품' ? (pathname === '/' || pathname === '/savings' || pathname.includes('/deposits')) : (pathname === link.href)}>
                    <span className="flex items-center gap-2">
                       {link.label}
                       {link.submenu && <ChevronDown size={14} className={`transition-transform duration-300 ${hoveredMenu === link.label ? 'rotate-180' : ''}`} />}
                    </span>
                  </NavLink>

                  <AnimatePresence>
                    {link.submenu && hoveredMenu === link.label && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute top-10 left-[-20%] w-56 bg-white rounded-[32px] shadow-2xl shadow-gray-200/50 border border-gray-100 overflow-hidden p-3"
                      >
                         {link.submenu.map(sub => (
                           <Link 
                             key={sub.href} 
                             href={sub.href}
                             className="flex items-center gap-4 px-5 py-4 rounded-[20px] text-sm font-bold text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-all group"
                           >
                             <div className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-white group-hover:text-green-600 group-hover:shadow-sm border border-transparent group-hover:border-gray-100 transition-all">{sub.icon}</div>
                             {sub.label}
                           </Link>
                         ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <nav className="hidden xl:flex items-center gap-8 mr-6 border-r border-gray-200 pr-8 h-6">
               <NavLink href="/saved" active={pathname === '/saved'}>나의 저장목록</NavLink>
               <Link 
                 href="/treia" 
                 className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs font-black uppercase tracking-[1px] transition-all shadow-sm ${
                   pathname === '/treia' ? 'bg-gray-900 text-white' : 'bg-white border border-gray-100 text-gray-900 hover:bg-gray-50'
                 }`}
               >
                 Treia <Rocket size={14} className="text-blue-500" />
               </Link>
            </nav>

            <div className="flex items-center gap-3">
              <button className="p-3 bg-white border border-gray-100 text-gray-400 hover:text-gray-900 rounded-2xl shadow-sm transition-all focus:ring-2 focus:ring-gray-100">
                <Search size={20} />
              </button>
              <div className="hidden sm:block scale-110">
                <UserProfile />
              </div>
              <button 
                onClick={() => setIsOpen(true)}
                className="lg:hidden w-12 h-12 flex items-center justify-center text-gray-900 bg-white border border-gray-100 rounded-2xl shadow-sm hover:bg-gray-50 transition-colors"
              >
                <Menu size={22} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar */}
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
              className="fixed top-0 right-0 z-[70] h-full w-[85%] max-w-[320px] bg-[var(--bg-beige)] shadow-2xl lg:hidden flex flex-col"
            >
              <div className="p-8 pb-4 flex items-center justify-between">
                <span className="text-xl font-black text-gray-900 tracking-tighter uppercase">
                  FinTable
                </span>
                <button onClick={() => setIsOpen(false)} className="p-3 bg-white border border-gray-100 text-gray-400 rounded-xl shadow-sm">
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 pt-2 custom-scrollbar space-y-10">
                <div className="grid grid-cols-2 gap-4">
                   {NAV_LINKS.map(link => (
                      <Link 
                        key={link.href}
                        href={link.href}
                        className={`flex flex-col gap-6 p-6 rounded-[32px] transition-all border shadow-sm ${
                          pathname === link.href ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-900 border-gray-100'
                        }`}
                      >
                        <div className={`${pathname === link.href ? 'text-green-400' : 'text-blue-600'}`}>
                           {link.icon}
                        </div>
                        <span className="text-[11px] font-black uppercase tracking-widest">{link.label}</span>
                      </Link>
                   ))}
                </div>

                <div className="space-y-8">
                   <div className="space-y-3">
                      <p className="px-2 text-[10px] font-black text-gray-400 uppercase tracking-widest opacity-60">Quick Access</p>
                      <SidebarLink href="/" label="정기예금" icon={<Landmark size={18} />} active={pathname === '/' || pathname.includes('/deposits')} />
                      <SidebarLink href="/savings" label="정기적금" icon={<Rocket size={18} />} active={pathname === '/savings' || pathname.includes('/savings/')} />
                   </div>
                   <div className="space-y-3">
                      <p className="px-2 text-[10px] font-black text-gray-400 uppercase tracking-widest opacity-60">Portfolio</p>
                      <SidebarLink href="/saved" label="나의 저장 목록" icon={<Star size={18} />} active={pathname === '/saved'} />
                      <SidebarLink href="/treia" label="Treia 서비스 바로가기" icon={<Rocket size={18} />} highlight />
                   </div>
                </div>
              </div>

              <div className="p-8 border-t border-gray-100 bg-white">
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
      className={`text-base font-bold transition-all relative group ${
        active ? 'text-gray-900' : 'text-gray-400 hover:text-gray-900'
      }`}
    >
      {children}
      <span className={`absolute -bottom-1 left-0 h-[2px] bg-gray-900 transition-all ${
        active ? 'w-full' : 'w-0 group-hover:w-full'
      }`}></span>
    </Link>
  )
}

function SidebarLink({ href, label, icon, active, highlight }: { href: string, label: string, icon: React.ReactNode, active?: boolean, highlight?: boolean }) {
   return (
      <Link 
         href={href}
         className={`flex items-center gap-4 p-5 rounded-[24px] transition-all border shadow-sm ${
            active 
               ? 'bg-blue-50 border-blue-100 text-blue-600 font-black' 
               : (highlight ? 'bg-gray-900 text-white font-black border-gray-900 shadow-xl shadow-gray-900/20' : 'bg-white border-gray-50 text-gray-600 font-bold hover:bg-gray-50')
         }`}
      >
         <div className={`${active ? 'text-blue-600' : (highlight ? 'text-white' : 'text-gray-400')}`}>
            {icon}
         </div>
         <span className="text-base">{label}</span>
         <ChevronRight size={14} className="ml-auto opacity-30" />
      </Link>
   )
}
