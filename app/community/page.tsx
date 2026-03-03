'use client'
import { useState, useEffect, useCallback } from "react";
import { Users, MessageSquare, TrendingUp, Award, PenLine, Filter, Flame, Trophy, X, Loader2, Image as ImageIcon, Paperclip, FileText, Trash2, Maximize2, Lock, ShieldCheck } from "lucide-react";
import { getPosts, createPost, PostData, uploadFile, deletePost, addComment, getComments, requestVerification, CommentData } from "@/lib/community";
import { useAuth } from "@/lib/auth-context";
import Image from "next/image";
import UserProfile from "@/components/UserProfile";

interface Post extends PostData {
  id: string;
}

interface Ranker {
  rank: number;
  name: string;
  returns: string;
  prize: string;
}

export default function CommunityPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("전체");
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rankers, setRankers] = useState<Ranker[]>([]);
  
  // Lightbox State
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // New Post Form State
  const [newPost, setNewPost] = useState({
    title: "",
    category: "EA전략",
    content: "",
    author: user?.displayName || "트레이더"
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setNewPost(prev => ({ ...prev, author: user.displayName || "트레이더" }));
    }
  }, [user]);

  const fetchCommunityPosts = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const fetchedPosts = await getPosts(activeTab);
      setPosts(fetchedPosts as Post[]);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    } finally {
      setLoading(false);
    }
  }, [activeTab, user]);

  const fetchRankings = useCallback(async () => {
    setRankers([
      { rank: 1, name: "SniperK", returns: "+125.4%", prize: "1,000 TRE" },
      { rank: 2, name: "QuantMaster", returns: "+98.2%", prize: "500 TRE" },
      { rank: 3, name: "GoldDigger", returns: "+82.7%", prize: "300 TRE" }
    ]);
  }, []);

  useEffect(() => {
    fetchCommunityPosts();
    fetchRankings();
  }, [fetchCommunityPosts, fetchRankings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.title || !newPost.content || isSubmitting || !user) return;

    try {
      setIsSubmitting(true);
      let imageUrl = "";
      let fileUrl = "";
      let fileName = "";

      if (imageFile) {
        const uploadRes = await uploadFile(imageFile, 'post_images');
        if (uploadRes) imageUrl = uploadRes.url;
      }

      if (attachedFile) {
        const uploadRes = await uploadFile(attachedFile, 'post_files');
        if (uploadRes) {
          fileUrl = uploadRes.url;
          fileName = uploadRes.name;
        }
      }

      const res = await createPost({
        ...newPost,
        userId: user.uid,
        imageUrl,
        fileUrl,
        fileName
      });

      if (res) {
        setIsModalOpen(false);
        setNewPost({ ...newPost, title: "", content: "" });
        setImageFile(null);
        setAttachedFile(null);
        fetchCommunityPosts();
      }
    } catch (err) {
      console.error("Submit error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (postId: string) => {
    if (!confirm("이 게시물을 정말 삭제하시겠습니까?")) return;
    const res = await deletePost(postId);
    if (res) {
      fetchCommunityPosts();
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 flex flex-col gap-12 max-w-7xl">
      {/* Header Section */}
      <header className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-500 flex items-center justify-center">
               <Users size={20} />
             </div>
             <h1 className="text-3xl font-outfit font-extrabold text-white tracking-tight">트레이더 광장</h1>
          </div>
          <button 
            onClick={() => user ? setIsModalOpen(true) : alert("포스팅을 하려면 로그인이 필요합니다.")}
            className="flex items-center gap-2 px-6 py-3 bg-[var(--accent-gold)] text-black rounded-xl font-black text-xs uppercase tracking-widest hover:shadow-[0_4px_20px_rgba(255,193,7,0.3)] transition-all"
          >
             <PenLine size={16} /> 신규 전략 공유
          </button>
        </div>
        <p className="text-gray-400 text-sm max-w-2xl leading-relaxed">
           CFD 트레이더들과 실시간으로 소통하고, 검증된 EA 전략과 수익 인증을 통해 함께 성장하세요.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Feed Section */}
        <section className="lg:col-span-8 flex flex-col gap-6">
           {/* Tab Navigation */}
           <div className="flex items-center justify-between p-2 rounded-2xl bg-gray-900/50 border border-gray-800">
              <div className="flex gap-1 overflow-x-auto no-scrollbar">
                 {["전체", "EA전략", "질문/답변", "수익인증", "자유게시판"].map((tab) => (
                   <button 
                     key={tab}
                     onClick={() => setActiveTab(tab)}
                     className={`px-4 py-2 rounded-xl text-[11px] font-bold transition-all whitespace-nowrap ${activeTab === tab ? 'bg-gray-800 text-white border border-gray-700' : 'text-gray-500 hover:text-gray-300'}`}
                   >
                     {tab}
                   </button>
                 ))}
              </div>
              <div className="px-4 text-gray-600 hidden sm:block">
                 <Filter size={14} />
              </div>
           </div>

           {/* Post List / Auth Guard */}
           {loading ? (
             <div className="flex flex-col items-center justify-center py-20 gap-4">
               <Loader2 size={32} className="text-orange-500 animate-spin" />
               <p className="text-[10px] text-gray-600 font-bold uppercase tracking-[0.2em]">데이터 불러오는 중...</p>
             </div>
           ) : !user ? (
             /* Members Only UI */
             <div className="relative p-12 lg:p-20 rounded-[40px] bg-gradient-to-b from-gray-900 to-black border border-gray-800 flex flex-col items-center text-center gap-8 overflow-hidden min-h-[400px] justify-center shadow-2xl">
                {/* Background Decorative Element */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent"></div>
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-orange-500/10 rounded-full blur-[80px]"></div>
                <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px]"></div>

                <div className="relative">
                   <div className="w-24 h-24 rounded-[32px] bg-gray-800 border border-gray-700 flex items-center justify-center text-white shadow-inner mb-2 animate-bounce-subtle">
                      <Lock size={40} className="text-orange-500" />
                   </div>
                   <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center border-4 border-black text-black">
                      <Users size={14} />
                   </div>
                </div>

                <div className="flex flex-col gap-3">
                   <h2 className="text-3xl font-outfit font-black text-white tracking-tight uppercase">Members Only</h2>
                   <p className="text-gray-400 text-sm max-w-sm leading-relaxed">
                      트레이아 커뮤니티의 실시간 전술과 수익 보고서는<br />
                      검증된 정회원에게만 투명하게 공개됩니다.
                   </p>
                </div>

                <div className="flex flex-col gap-4 w-full max-w-[240px]">
                   <UserProfile />
                   <div className="px-2 py-0.5 rounded-full bg-orange-500/5 border border-orange-500/20 text-[9px] font-bold text-orange-500/60 uppercase tracking-widest text-center">
                      Join 1,200+ Active Traders
                   </div>
                </div>
             </div>
           ) : (
             <div className="flex flex-col gap-4">
                {posts.length > 0 ? posts.map((post) => (
                  <article key={post.id} className="p-6 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-orange-500/20 transition-all group relative">
                     <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                           <span className="px-2 py-0.5 rounded bg-gray-800 text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{post.category}</span>
                           {post.isHot && <span className="flex items-center gap-1 text-[9px] font-bold text-orange-500 uppercase tracking-widest"><Flame size={10} /> HOT</span>}
                        </div>
                        <div className="flex items-center gap-4">
                           {post.verificationStatus && post.verificationStatus !== 'none' && (
                             <div className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 ${
                               post.verificationStatus === 'verified' ? 'bg-green-500/10 text-green-500 border border-green-500/20' :
                               post.verificationStatus === 'pending' ? 'bg-orange-500/10 text-orange-500 border border-orange-500/20' :
                               'bg-blue-500/10 text-blue-400 border border-blue-500/30'
                             }`}>
                               <ShieldCheck size={10} />
                               {post.verificationStatus === 'verified' ? '검증 완료' : 
                                post.verificationStatus === 'pending' ? '연구 중' : '커뮤니티 검증'}
                             </div>
                           )}
                           <span className="text-[10px] text-gray-600 font-bold uppercase">
                            {typeof post.timestamp?.toDate === 'function' ? post.timestamp.toDate().toLocaleDateString() : '방금 전'}
                           </span>
                           {user && user.uid === post.userId && (
                             <div className="flex items-center gap-2">
                               {(!post.verificationStatus || post.verificationStatus === 'none') && (
                                 <button 
                                   onClick={(e) => { 
                                     e.stopPropagation(); 
                                     if(confirm("이 전략에 대해 운영진 검증을 요청하시겠습니까? (연구/검정 중으로 표시됩니다)")) {
                                       requestVerification(post.id).then(() => fetchCommunityPosts());
                                     }
                                   }}
                                   className="text-[9px] font-black text-orange-500/60 hover:text-orange-500 uppercase tracking-tighter"
                                 >
                                   검증 요청
                                 </button>
                               )}
                               <button 
                                 onClick={(e) => { e.stopPropagation(); handleDelete(post.id); }}
                                 className="text-gray-600 hover:text-red-500 transition-colors p-1"
                                 title="삭제"
                               >
                                  <Trash2 size={14} />
                               </button>
                             </div>
                           )}
                        </div>
                     </div>
                     
                     <h3 className="text-lg font-bold text-white group-hover:text-[var(--accent-gold)] transition-colors mb-2 leading-tight">
                        {post.title}
                     </h3>
                     <p className="text-sm text-gray-500 mb-4 font-medium leading-relaxed">
                        {post.content}
                     </p>

                     {/* Image Display with Lightbox Trigger */}
                     {post.imageUrl && (
                       <div 
                        onClick={(e) => { e.stopPropagation(); setSelectedImage(post.imageUrl || null); }}
                        className="mb-4 relative rounded-2xl overflow-hidden border border-gray-800 aspect-video group/img cursor-zoom-in"
                       >
                          <Image src={post.imageUrl} alt="Post Image" fill className="object-cover transition-transform group-hover/img:scale-105" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                             <Maximize2 size={24} className="text-white" />
                          </div>
                       </div>
                     )}

                     {/* File Display */}
                     {post.fileUrl && (
                       <a 
                        href={post.fileUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="mb-4 flex items-center gap-3 p-4 rounded-xl bg-gray-900 border border-gray-800 hover:border-blue-500/50 transition-all group/file"
                       >
                          <FileText size={20} className="text-blue-500" />
                          <div className="flex flex-col">
                            <span className="text-xs font-bold text-gray-300 group-hover/file:text-white">{post.fileName}</span>
                            <span className="text-[10px] text-gray-600 font-bold uppercase">전략 파일 다운로드</span>
                          </div>
                       </a>
                     )}

                     <div className="flex items-center justify-between border-t border-gray-800 pt-5">
                        <div className="flex items-center gap-3">
                           <div className="w-6 h-6 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center text-[10px] text-white font-bold">
                              {post.author[0]}
                           </div>
                           <span className="text-xs font-bold text-gray-400">{post.author}</span>
                        </div>
                        <div className="flex items-center gap-4 text-xs font-bold text-gray-600">
                           <span className="flex items-center gap-1.5 hover:text-blue-400 transition-colors cursor-pointer">
                              <TrendingUp size={14} /> {post.likes}
                           </span>
                           <span className="flex items-center gap-1.5 hover:text-orange-400 transition-colors cursor-pointer">
                              <MessageSquare size={14} /> {post.comments}
                           </span>
                        </div>
                     </div>


                     {/* Real-time Comment Section */}
                     <CommentSection postId={post.id} />
                  </article>
                )) : (
                  <div className="p-12 rounded-3xl border border-dashed border-gray-800 text-center text-gray-600">
                    등록된 게시물이 없습니다. 첫 번째 전략을 공유해보세요!
                  </div>
                )}
             </div>
           )}
        </section>

        {/* Right: Ranking Section */}
        <aside className="lg:col-span-4 flex flex-col gap-8">
           <div className="p-8 rounded-3xl bg-gradient-to-br from-gray-900 to-black border border-gray-800 flex flex-col gap-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-10">
                 <Trophy size={80} className="text-amber-500" />
              </div>
              <div className="flex items-center gap-3">
                 <Award className="text-amber-500" size={20} />
                 <h2 className="text-xl font-outfit font-black text-white uppercase tracking-tight italic">수익률 랭킹 (2월)</h2>
              </div>
              <div className="flex flex-col gap-4">
                 {rankers.map((rj) => (
                   <RankingItem 
                     key={rj.rank}
                     rank={rj.rank} 
                     name={rj.name} 
                     returns={rj.returns} 
                     prize={rj.prize} 
                   />
                 ))}
              </div>
           </div>
        </aside>
      </div>

      {/* Write Post Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
           <div className="bg-[#12141a] border border-gray-800 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
              <div className="flex items-center justify-between p-6 border-b border-gray-800">
                 <h3 className="text-xl font-bold text-white tracking-tight">신규 전략 공유하기</h3>
                 <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-white transition-colors">
                    <X size={24} />
                 </button>
              </div>
              <form onSubmit={handleSubmit} className="p-8 flex flex-col gap-6 max-h-[80vh] overflow-y-auto custom-scrollbar">
                 <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">카테고리 선택</label>
                    <select 
                      value={newPost.category}
                      onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
                      className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500/50 transition-all appearance-none"
                    >
                       <option value="EA전략">EA 전략 공유</option>
                       <option value="질문/답변">질문 / 답변</option>
                       <option value="수익인증">수익 인증</option>
                       <option value="자유게시판">자유 게시판</option>
                    </select>
                 </div>
                 <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">제목</label>
                    <input 
                      type="text"
                      placeholder="제목을 입력하세요"
                      value={newPost.title}
                      onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                      className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500/50 transition-all"
                    />
                 </div>
                 <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">내용</label>
                    <textarea 
                      rows={6}
                      placeholder="전략 설명이나 본문의 내용을 작성하세요..."
                      value={newPost.content}
                      onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                      className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500/50 transition-all resize-none"
                    />
                 </div>

                 {/* File Upload Section */}
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">이미지 첨부 (차트/수익)</label>
                        <div className="relative group">
                          <input 
                            type="file"
                            accept="image/*"
                            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                          />
                          <div className="p-4 rounded-xl bg-gray-900 border border-dashed border-gray-700 group-hover:border-amber-500/50 transition-all flex flex-col items-center gap-2">
                             <ImageIcon size={20} className="text-gray-500" />
                             <span className="text-[10px] font-bold text-gray-600 uppercase tracking-tighter truncate w-full text-center">
                               {imageFile ? imageFile.name : "이미지 선택"}
                             </span>
                          </div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">전략/세팅 파일 (MQ5/ZIP)</label>
                        <div className="relative group">
                          <input 
                            type="file"
                            onChange={(e) => setAttachedFile(e.target.files?.[0] || null)}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                          />
                          <div className="p-4 rounded-xl bg-gray-900 border border-dashed border-gray-700 group-hover:border-blue-500/50 transition-all flex flex-col items-center gap-2">
                             <Paperclip size={20} className="text-gray-500" />
                             <span className="text-[10px] font-bold text-gray-600 uppercase tracking-tighter truncate w-full text-center">
                               {attachedFile ? attachedFile.name : "파일 선택"}
                             </span>
                          </div>
                        </div>
                    </div>
                 </div>

                 <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full py-4 bg-[var(--accent-gold)] disabled:bg-gray-700 disabled:cursor-not-allowed text-black rounded-xl font-black text-xs uppercase tracking-widest hover:bg-white transition-all shadow-xl mt-4 flex items-center justify-center gap-2"
                 >
                    {isSubmitting ? (
                      <><Loader2 size={16} className="animate-spin" /> 처리 중...</>
                    ) : "게시하기"}
                 </button>
              </form>
           </div>
        </div>
      )}

      {/* Image Lightbox */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 backdrop-blur-xl animate-in fade-in duration-200 cursor-zoom-out"
          onClick={() => setSelectedImage(null)}
        >
           <button className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors">
              <X size={32} />
           </button>
           <div className="relative w-[90vw] h-[80vh]">
              <Image 
                src={selectedImage} 
                alt="Full Image" 
                fill 
                className="object-contain"
                priority
              />
           </div>
        </div>
      )}
    </div>
  );
}

function RankingItem({ rank, name, returns, prize }: { rank: number; name: string; returns: string; prize: string }) {
  return (
    <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-amber-500/20 transition-all group">
       <div className="flex items-center gap-4">
          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black ${rank === 1 ? 'bg-amber-500 text-black' : 'bg-gray-800 text-gray-500'}`}>
             {rank}
          </span>
          <div className="flex flex-col">
             <span className="text-sm font-bold text-gray-200 group-hover:text-amber-500 transition-colors">{name}</span>
             <span className="text-[10px] text-gray-600 font-bold">{prize}</span>
          </div>
       </div>
       <span className="text-sm font-outfit font-bold text-green-500">{returns}</span>
    </div>
  );
}

function CommentSection({ postId }: { postId: string }) {
  const { user } = useAuth();
  const [comments, setComments] = useState<CommentData[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    getComments(postId).then(data => {
      if (isMounted) setComments(data as CommentData[]);
    });
    return () => { isMounted = false; };
  }, [postId]);

  const handleSend = async () => {
    if (!newComment.trim() || !user) return;
    setLoading(true);
    const res = await addComment(postId, user.uid, user.displayName || "트레이더", newComment);
    if (res) {
      setNewComment("");
      const updated = await getComments(postId);
      setComments(updated as CommentData[]);
    }
    setLoading(false);
  };

  return (
    <div className="mt-5 pt-5 border-t border-gray-800/50 flex flex-col gap-4">
      {/* Comment List */}
      <div className="flex flex-col gap-3">
        {comments.map((c: CommentData) => (
          <div key={c.id} className="flex gap-3">
            <div className="w-6 h-6 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center text-[8px] text-gray-400 font-bold">
              {c.author[0]}
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-gray-400">{c.author}</span>
                <span className="text-[8px] text-gray-600 uppercase">
                  {c.timestamp?.toDate ? c.timestamp.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "방금 전"}
                </span>
              </div>
              <p className="text-[11px] text-gray-400 leading-relaxed">{c.content}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Input Field */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-gray-900 border border-gray-800 flex items-center justify-center text-[10px] text-gray-500 font-bold">
          {user?.displayName?.[0] || 'T'}
        </div>
        <div className="flex-1 relative">
           <input 
             type="text" 
             value={newComment}
             onChange={(e) => setNewComment(e.target.value)}
             onKeyPress={(e) => e.key === 'Enter' && handleSend()}
             placeholder="전략에 대한 의견이나 검증 결과를 공유하세요..." 
             className="w-full bg-gray-900/50 border border-gray-800 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-orange-500/30 transition-all"
           />
           <button 
             onClick={handleSend}
             disabled={loading}
             className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-black text-orange-500 uppercase tracking-widest hover:text-white transition-colors disabled:opacity-50"
           >
              {loading ? "..." : "전송"}
           </button>
        </div>
      </div>
    </div>
  );
}
