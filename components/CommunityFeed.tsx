'use client';

import React, { useState, useEffect } from 'react';
import { MessageSquare, Heart, Plus, Send, Clock, User, Sparkles, X, ChevronRight, Eye, MessageCircle, Share2, Atom, FlaskConical, Dna, Globe2 } from 'lucide-react';
import { Post, Comment, INITIAL_POSTS } from '@/lib/supabase';

const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  '물리': { bg: 'bg-cyan-500/20', text: 'text-cyan-300', border: 'border-cyan-500/40' },
  '화학': { bg: 'bg-fuchsia-500/20', text: 'text-fuchsia-300', border: 'border-fuchsia-500/40' },
  '생명과학': { bg: 'bg-emerald-500/20', text: 'text-emerald-300', border: 'border-emerald-500/40' },
  '지구과학': { bg: 'bg-amber-500/20', text: 'text-amber-300', border: 'border-amber-500/40' },
};

export default function CommunityFeed() {
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isWriteModalOpen, setIsWriteModalOpen] = useState<boolean>(false);
  const [filterCategory, setFilterCategory] = useState<string>('전체');

  // Form State
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [author, setAuthor] = useState<string>('');
  const [category, setCategory] = useState<string>('물리');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Comment State for Detail View
  const [newCommentAuthor, setNewCommentAuthor] = useState<string>('');
  const [newCommentContent, setNewCommentContent] = useState<string>('');

  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/posts');
      const data = await res.json();
      if (data && data.data && data.data.length > 0) {
        // Merge with initial rich comments if needed
        const merged = data.data.map((p: Post) => {
          const init = INITIAL_POSTS.find((i) => i.id === p.id);
          return {
            ...p,
            category: p.category || init?.category || '과학',
            views: p.views || init?.views || Math.floor(Math.random() * 150) + 50,
            comments: p.comments || init?.comments || [],
          };
        });
        setPosts(merged);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleLike = async (e: React.MouseEvent, id: string | number) => {
    e.stopPropagation(); // prevent modal opening when clicking like on card

    setPosts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, likes: p.likes + 1 } : p))
    );

    if (selectedPost && selectedPost.id === id) {
      setSelectedPost((prev) => (prev ? { ...prev, likes: prev.likes + 1 } : null));
    }

    try {
      await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'like', id }),
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || !author.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: `[${category}] ${title.trim()}`,
          content: content.trim(),
          author: author.trim(),
        }),
      });
      const data = await res.json();
      const newPostObj: Post = {
        id: data?.data?.id || Date.now(),
        title: `[${category}] ${title.trim()}`,
        content: content.trim(),
        author: author.trim(),
        created_at: new Date().toISOString(),
        likes: 0,
        category,
        views: 1,
        comments: [],
      };

      setPosts((prev) => [newPostObj, ...prev]);
      setIsWriteModalOpen(false);
      setTitle('');
      setContent('');
      setAuthor('');
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPost || !newCommentAuthor.trim() || !newCommentContent.trim()) return;

    const newComment: Comment = {
      id: Date.now(),
      author: newCommentAuthor.trim(),
      content: newCommentContent.trim(),
      created_at: '방금 전',
    };

    const updatedPost = {
      ...selectedPost,
      comments: [...(selectedPost.comments || []), newComment],
    };

    setSelectedPost(updatedPost);
    setPosts((prev) =>
      prev.map((p) => (p.id === selectedPost.id ? updatedPost : p))
    );

    setNewCommentContent('');
  };

  const filteredPosts = filterCategory === '전체'
    ? posts
    : posts.filter((p) => p.category === filterCategory || p.title.includes(filterCategory));

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="skeuo-panel p-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/40 text-cyan-400">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-slate-400">SCIENCE FORUM</span>
            <h2 className="text-xl font-black text-cyan-300 light:text-cyan-800">
              과학 탐구 질문 & 꿀팁 피드
            </h2>
          </div>
        </div>

        <button
          onClick={() => setIsWriteModalOpen(true)}
          className="skeuo-btn px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-xs flex items-center gap-2 shadow-neon-cyan hover:scale-105"
        >
          <Plus className="w-4 h-4" />
          <span>새 과학 질문 / 꿀팁 작성</span>
        </button>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {['전체', '물리', '화학', '생명과학', '지구과학'].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border ${
              filterCategory === cat
                ? 'bg-cyan-500 text-white border-cyan-400 shadow-neon-cyan'
                : 'bg-[#151928] text-slate-400 border-[#283045] hover:text-white light:bg-white light:text-slate-600'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Post List */}
      <div className="space-y-4">
        {filteredPosts.map((post) => {
          const cat = post.category || '과학';
          const catStyle = CATEGORY_COLORS[cat] || { bg: 'bg-cyan-500/20', text: 'text-cyan-300', border: 'border-cyan-500/40' };

          return (
            <div
              key={post.id}
              onClick={() => setSelectedPost(post)}
              className="skeuo-panel p-6 cursor-pointer hover:border-cyan-400/60 transition-all hover:shadow-[0_4px_25px_rgba(0,243,255,0.2)] hover:-translate-y-0.5 group"
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-md border ${catStyle.bg} ${catStyle.text} ${catStyle.border}`}>
                      {cat}
                    </span>
                    <span className="text-xs text-slate-500 font-mono">
                      조회 {post.views || 120}회
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-cyan-300 transition-colors light:text-slate-900 leading-snug">
                    {post.title}
                  </h3>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={(e) => handleLike(e, post.id)}
                    className="skeuo-btn px-3 py-1.5 rounded-xl flex items-center gap-1.5 text-xs font-mono text-rose-400 hover:text-rose-300"
                    title="좋아요 누르기"
                  >
                    <Heart className="w-4 h-4 fill-rose-500/30" />
                    <span>{post.likes}</span>
                  </button>
                </div>
              </div>

              {/* Snippet */}
              <p className="text-sm text-slate-300 leading-relaxed mb-4 light:text-slate-700 line-clamp-2">
                {post.content}
              </p>

              {/* Footer Info */}
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono pt-3 border-t border-[#20273d] light:border-slate-200">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="font-bold text-slate-300 light:text-slate-700">{post.author}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{post.created_at ? new Date(post.created_at).toLocaleDateString('ko-KR') : '방금 전'}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-cyan-400 text-xs font-bold group-hover:translate-x-1 transition-transform">
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>댓글 {post.comments?.length || 0}개</span>
                  <ChevronRight className="w-3.5 h-3.5 ml-1" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ======================================================== */}
      {/* 🔍 POST DETAIL VIEW MODAL (자세히 보기 모달) */}
      {/* ======================================================== */}
      {selectedPost && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
          onClick={() => setSelectedPost(null)}
        >
          <div
            className="skeuo-panel w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 bg-[#121626] border-cyan-400/50 shadow-[0_0_50px_rgba(0,243,255,0.25)] space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 border-b border-[#28324a] pb-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                    {selectedPost.category || '과학 탐구'}
                  </span>
                  <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5" /> 조회 {selectedPost.views || 120}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white light:text-slate-900 leading-snug">
                  {selectedPost.title}
                </h2>
              </div>
              <button
                onClick={() => setSelectedPost(null)}
                className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Author & Meta Bar */}
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 bg-[#0e1220] p-3 rounded-xl border border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-cyan-300 font-bold">
                  {selectedPost.author.slice(0, 1)}
                </div>
                <div>
                  <div className="font-bold text-slate-200">{selectedPost.author}</div>
                  <div className="text-[10px] text-slate-500">과학 연구원 레벨</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span>{selectedPost.created_at ? new Date(selectedPost.created_at).toLocaleString('ko-KR') : '방금 전'}</span>
                <button
                  onClick={(e) => handleLike(e, selectedPost.id)}
                  className="skeuo-btn px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-xs text-rose-400 font-bold"
                >
                  <Heart className="w-4 h-4 fill-rose-500/40" />
                  <span>{selectedPost.likes}</span>
                </button>
              </div>
            </div>

            {/* Full Post Content */}
            <div className="p-5 rounded-2xl bg-[#0c0f1c] border border-[#232b42] text-sm text-slate-200 leading-relaxed font-sans whitespace-pre-wrap light:text-slate-800">
              {selectedPost.content}
            </div>

            {/* Comments Section */}
            <div className="space-y-4 pt-2 border-t border-[#252e46]">
              <div className="flex items-center gap-2 text-sm font-bold text-cyan-300">
                <MessageCircle className="w-4 h-4" />
                <span>댓글 및 토론 ({selectedPost.comments?.length || 0})</span>
              </div>

              {/* Comment List */}
              <div className="space-y-3">
                {selectedPost.comments && selectedPost.comments.length > 0 ? (
                  selectedPost.comments.map((cmt) => (
                    <div key={cmt.id} className="p-3.5 rounded-xl bg-[#161b2e] border border-slate-800 space-y-1">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="font-bold text-cyan-400">{cmt.author}</span>
                        <span className="text-[10px] text-slate-500">{cmt.created_at}</span>
                      </div>
                      <p className="text-xs text-slate-300 font-sans leading-normal">
                        {cmt.content}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="text-xs font-mono text-slate-500 text-center py-4 bg-[#141828] rounded-xl">
                    첫 번째 탐구 댓글을 남겨보세요!
                  </div>
                )}
              </div>

              {/* Add Comment Form */}
              <form onSubmit={handleAddComment} className="space-y-2 pt-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    placeholder="닉네임"
                    value={newCommentAuthor}
                    onChange={(e) => setNewCommentAuthor(e.target.value)}
                    className="w-32 px-3 py-2 rounded-xl bg-[#0b0e1a] border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                  <input
                    type="text"
                    required
                    placeholder="과학 퀴즈 의견이나 피드백을 작성하세요"
                    value={newCommentContent}
                    onChange={(e) => setNewCommentContent(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl bg-[#0b0e1a] border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                  <button
                    type="submit"
                    className="skeuo-btn px-4 py-2 rounded-xl bg-cyan-500 text-white text-xs font-bold flex items-center gap-1 shadow-neon-cyan"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>등록</span>
                  </button>
                </div>
              </form>
            </div>

          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* ✍️ WRITE NEW POST MODAL */}
      {/* ======================================================== */}
      {isWriteModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn"
          onClick={() => setIsWriteModalOpen(false)}
        >
          <div
            className="skeuo-panel w-full max-w-lg p-6 bg-[#131726] border-cyan-500/50 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#2a3045] pb-3">
              <h3 className="text-lg font-bold text-cyan-300 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-cyan-400" />
                새 과학 질문 / 탐구 꿀팁 작성
              </h3>
              <button
                onClick={() => setIsWriteModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">분야 (과목)</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#0b0e1a] border border-slate-700 text-sm text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option value="물리">물리 (Physics)</option>
                    <option value="화학">화학 (Chemistry)</option>
                    <option value="생명과학">생명과학 (Biology)</option>
                    <option value="지구과학">지구과학 (Earth Science)</option>
                    <option value="융합과학">융합과학 (Integrated)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">작성자 닉네임</label>
                  <input
                    type="text"
                    required
                    placeholder="예: 닐스보어"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#0b0e1a] border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">질문 또는 팁 제목</label>
                <input
                  type="text"
                  required
                  placeholder="예: 슈뢰딩거 고양이 사고실험 쉽게 설명해 주세요!"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0b0e1a] border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">내용</label>
                <textarea
                  required
                  rows={4}
                  placeholder="공유하고 싶은 과학 지식이나 풀리지 않는 과학 퀴즈 질문을 자유롭게 적어주세요."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0b0e1a] border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsWriteModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="skeuo-btn px-6 py-2.5 rounded-xl bg-cyan-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-neon-cyan disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? '등록 중...' : '등록하기'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
