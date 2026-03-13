'use client'

import { useState, useEffect } from 'react'
import { 
  Star, 
  Trash2, 
  ArrowRight, 
  Landmark, 
  Home as HomeIcon,
  ChevronRight,
  ShieldCheck,
  TrendingUp
} from 'lucide-react'
import Link from 'next/link'
import { db, auth } from '@/lib/firebase'
import { collection, query, where, onSnapshot, doc, deleteDoc } from 'firebase/firestore'
import { onAuthStateChanged, User } from 'firebase/auth'

interface Bookmark {
  id: string
  itemId: string
  title: string
  type: string
  timestamp: any
}

export default function SavedPage() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)
  const [activeTab, setActiveTab] = useState('전체')

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (u) => {
      setUser(u)
      if (!u) {
        setLoading(false)
        setBookmarks([])
      }
    })

    return () => unsubscribeAuth()
  }, [])

  useEffect(() => {
    if (!user) return

    const q = query(
      collection(db, 'fintable_bookmarks'),
      where('userId', '==', user.uid)
    )

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Bookmark[]
      setBookmarks(docs.sort((a, b) => b.timestamp?.seconds - a.timestamp?.seconds))
      setLoading(false)
    }, (error) => {
      console.error("Firestore error:", error)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [user])

  const removeBookmark = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'fintable_bookmarks', id))
    } catch (e) {
      console.error("Delete error:", e)
    }
  }

  const filteredBookmarks = bookmarks.filter(b => {
    if (activeTab === '전체') return true
    if (activeTab === '금융') return b.type === 'product'
    if (activeTab === '주거') return b.type === 'housing'
    return true
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg-beige)] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[var(--bg-beige)] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg mb-8">
          <ShieldCheck size={40} className="text-gray-300" />
        </div>
        <h1 className="text-2xl font-black text-gray-900 mb-4">로그인이 필요한 서비스입니다</h1>
        <p className="text-gray-500 font-medium max-w-sm mb-10 leading-relaxed">
          저장한 상품을 확인하고 나만의 포트폴리오를 관리하려면 로그인을 진행해 주세요.
        </p>
        <button className="px-10 py-5 bg-gray-900 text-white font-black text-sm uppercase tracking-widest rounded-2xl shadow-xl hover:scale-105 transition-all">
          로그인하러 가기
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--bg-beige)] py-12 md:py-20">
      <main className="container mx-auto max-w-4xl px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-900 text-white rounded-full mb-6">
              <Star size={12} className="fill-yellow-400 text-yellow-400" />
              <span className="text-[10px] font-black uppercase tracking-wider">나만의 관심 목록</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-outfit font-black text-gray-900 tracking-tighter leading-tight">
              내가 찜한 상품들
            </h1>
          </div>
          <div className="flex gap-2 p-1 bg-white rounded-2xl border border-gray-100 shadow-sm">
            {['전체', '금융', '주거'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 rounded-xl text-sm font-bold transition-all ${
                  activeTab === tab ? 'bg-gray-900 text-white' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {filteredBookmarks.length === 0 ? (
          <div className="bg-white rounded-[40px] p-16 md:p-24 text-center border border-gray-100 shadow-sm">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-8">
              <Star size={32} className="text-gray-200" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">저장된 상품이 없습니다</h3>
            <p className="text-gray-400 font-medium mb-10">관심 있는 상품의 하트 버튼을 눌러보세요.</p>
            <Link 
              href="/"
              className="inline-flex items-center gap-3 px-8 py-4 bg-gray-50 text-gray-900 font-bold rounded-2xl hover:bg-gray-100 transition-all"
            >
              상품 둘러보기 <ArrowRight size={18} />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredBookmarks.map(item => (
              <div 
                key={item.id}
                className="group bg-white rounded-[32px] p-6 border border-gray-100 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all flex flex-col md:flex-row md:items-center gap-6"
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${
                  item.type === 'housing' ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'
                }`}>
                  {item.type === 'housing' ? <HomeIcon size={24} /> : <Landmark size={24} />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                      {item.type === 'housing' ? '임대주택 공고' : '금융상품'}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-gray-200"></span>
                    <span className="text-[10px] text-gray-400 font-medium">Recently added</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                    {item.title}
                  </h3>
                </div>

                <div className="flex items-center gap-3 ml-auto md:ml-0">
                  <Link 
                    href={item.type === 'housing' ? `/housing` : `/deposits/${item.itemId}`}
                    className="px-6 py-3 bg-gray-50 text-gray-900 text-xs font-black uppercase tracking-widest rounded-xl hover:bg-gray-900 hover:text-white transition-all"
                  >
                    상세보기
                  </Link>
                  <button 
                    onClick={() => removeBookmark(item.id)}
                    className="p-3 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                    title="제거"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Suggestion Section */}
        <div className="mt-20">
          <h2 className="text-xl font-bold text-gray-900 mb-8 flex items-center gap-3">
             <TrendingUp size={20} className="text-blue-500" />
             AI 추천 맞춤형 상품
          </h2>
          <div className="bg-gray-900 rounded-[40px] p-8 md:p-12 text-white relative overflow-hidden">
             <div className="relative z-10 max-w-lg">
                <h3 className="text-2xl font-bold mb-4">당신에게 꼭 필요한 금리 혜택</h3>
                <p className="text-gray-400 font-medium mb-8 leading-relaxed">
                   나의 자산 목표와 지난 검색 기록을 분석하여<br/>
                   최적의 예적금 상품을 선별했습니다.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                   <Link href="/" className="px-8 py-4 bg-white text-gray-900 font-black text-xs uppercase tracking-widest rounded-2xl hover:scale-105 transition-all flex items-center justify-center gap-2">
                      금융상품 추천받기 <ChevronRight size={16} />
                   </Link>
                   <Link href="/housing" className="px-8 py-4 bg-white/10 text-white font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-white/20 transition-all flex items-center justify-center gap-2">
                      주거 공고 추천받기 <ChevronRight size={16} />
                   </Link>
                </div>
             </div>
             
             {/* Decor */}
             <div className="absolute top-[-20%] right-[-10%] w-[300px] h-[300px] bg-blue-500/20 rounded-full blur-[100px]"></div>
          </div>
        </div>
      </main>
    </div>
  )
}
