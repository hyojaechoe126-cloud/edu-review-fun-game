'use client';

import React, { useState, useEffect } from 'react';
import { MessageSquare, Heart, Plus, Send, Clock, User, Sparkles, X, CheckCircle2 } from 'lucide-react';
import { Post, INITIAL_POSTS } from '@/lib/supabase';

export default function CommunityFeed() {
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [author, setAuthor] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/posts');
      const data = await res.json();
      if (data && data.data) {
        setPosts(data.data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleLike = async (id: string | number) => {
    // Optimistic UI update
    setPosts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, likes: p.likes + 1 } : p))
    );

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
          title: title.trim(),
          content: content.trim(),
          author: author.trim(),
        }),
      });
      const data = await res.json();
      if (data && data.data) {
        setPosts((prev) => [data.data, ...prev]);
        setIsModalOpen(false);
        setTitle('');
        setContent('');
        setAuthor('');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="skeuo-panel p-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/40 text-cyan-400">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-slate-400">COMMUNITY FORUM</span>
            <h2 className="text-xl font-black text-cyan-300 light:text-cyan-800">
              학습 질문 & 꿀팁 피드
            </h2>
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="skeuo-btn px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-xs flex items-center gap-2 shadow-neon-cyan hover:scale-105"
        >
          <Plus className="w-4 h-4" />
          <span>새 글 / 퀴즈 질문 작성</span>
        </button>
      </div>

      {/* Post List */}
      <div className="space-y-4">
        {posts.map((post) => (
          <div
            key={post.id}
            className="skeuo-panel p-6 hover:border-cyan-500/40 transition-all hover:shadow-[0_4px_20px_rgba(0,243,255,0.15)]"
          >
            <div className="flex items-start justify-between gap-4 mb-3">
              <h3 className="text-base sm:text-lg font-bold text-white light:text-slate-900 leading-snug">
                {post.title}
              </h3>
              <button
                onClick={() => handleLike(post.id)}
                className="skeuo-btn px-3 py-1.5 rounded-xl flex items-center gap-1.5 text-xs font-mono text-rose-400 hover:text-rose-300 shrink-0"
              >
                <Heart className="w-4 h-4 fill-rose-500/30" />
                <span>{post.likes}</span>
              </button>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed mb-4 light:text-slate-700 whitespace-pre-wrap">
              {post.content}
            </p>

            <div className="flex items-center justify-between text-xs text-slate-400 font-mono pt-3 border-t border-[#20273d] light:border-slate-200">
              <div className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-cyan-400" />
                <span className="font-bold text-slate-300 light:text-slate-700">{post.author}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>{post.created_at ? new Date(post.created_at).toLocaleDateString('ko-KR') : '방금 전'}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Write Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="skeuo-panel w-full max-w-lg p-6 bg-[#131726] border-cyan-500/50 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#2a3045] pb-3">
              <h3 className="text-lg font-bold text-cyan-300 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-cyan-400" />
                새 질문 / 학습 토론 작성
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">작성자 닉네임</label>
                <input
                  type="text"
                  required
                  placeholder="예: 과탐만점러_준"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0b0e1a] border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">제목</label>
                <input
                  type="text"
                  required
                  placeholder="예: [물리] 작용 반작용과 힘의 평형 질문입니다!"
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
                  placeholder="공유하고 싶은 퀴즈 팁이나 모르는 문제 내용을 적어주세요."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0b0e1a] border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
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
