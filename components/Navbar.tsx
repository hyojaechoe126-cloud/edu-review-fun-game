'use client';

import React, { useState, useEffect } from 'react';
import { Zap, Moon, Sun, Server, Database, Volume2, VolumeX, ShieldCheck } from 'lucide-react';

interface NavbarProps {
  theme: 'dark' | 'light';
  setTheme: (theme: 'dark' | 'light') => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Navbar({ theme, setTheme, activeTab, setActiveTab }: NavbarProps) {
  const [latency, setLatency] = useState<number>(3);
  const [isDbOnline, setIsDbOnline] = useState<boolean>(true);

  useEffect(() => {
    // Check region API
    fetch('/api/region')
      .then((res) => res.json())
      .then((data) => {
        if (data.dbLatencyMs > 0) {
          setLatency(data.dbLatencyMs);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#2a3045] bg-[#0c0e18]/90 backdrop-blur-md transition-colors light:bg-white/90 light:border-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo & HUD Title */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-fuchsia-500/20 border border-cyan-400/50 shadow-neon-cyan">
            <Zap className="w-7 h-7 text-cyan-400 animate-pulse" />
            <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-cyan-400 ring-4 ring-cyan-950 animate-ping" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl font-black tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-pink-400 to-yellow-300">
                EDU REVIEW
              </span>
              <span className="px-2 py-0.5 text-xs font-mono font-bold tracking-widest uppercase rounded bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/40">
                FUN GAME
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono flex items-center gap-1.5 light:text-slate-500">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              인터랙티브 퀴즈 배틀 & 리더보드 v1.0
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-2 bg-[#151928] p-1.5 rounded-2xl border border-[#2a324b] shadow-inner light:bg-slate-100 light:border-slate-300">
          {[
            { id: 'quiz', label: '⚡ 퀴즈 배틀' },
            { id: 'game', label: '🎮 사이버 펄스 미니게임' },
            { id: 'leaderboard', label: '🏆 명예의 전당 (랭킹)' },
            { id: 'community', label: '💬 커뮤니티 & 질문 피드' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-neon-cyan scale-[1.02]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#1f253d] light:text-slate-600 light:hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Region Badge & Theme Toggle */}
        <div className="flex items-center gap-3">
          {/* Seoul Region Badge */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#141828] border border-cyan-500/30 text-xs font-mono shadow-sm light:bg-slate-100 light:border-slate-300">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            <span className="text-cyan-300 font-bold light:text-cyan-700">icn1 · Seoul</span>
            <span className="text-slate-500">|</span>
            <span className="text-emerald-400 font-semibold">{latency}ms</span>
          </div>

          {/* Theme Switcher (Skeuomorphic Toggle) */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            title="테마 전환 (사이버 네온 다크 / 메탈릭 라이트)"
            className="skeuo-btn p-2.5 rounded-xl flex items-center justify-center text-slate-300 hover:text-cyan-300 transition-colors"
          >
            {theme === 'dark' ? (
              <Sun className="w-5 h-5 text-yellow-400 transition-transform rotate-0 hover:rotate-45" />
            ) : (
              <Moon className="w-5 h-5 text-indigo-600 transition-transform hover:-rotate-12" />
            )}
          </button>
        </div>

      </div>

      {/* Mobile Tabs */}
      <div className="flex md:hidden border-t border-[#252c42] bg-[#111422] p-2 gap-1 overflow-x-auto light:bg-slate-50 light:border-slate-200">
        {[
          { id: 'quiz', label: '⚡ 퀴즈' },
          { id: 'game', label: '🎮 미니게임' },
          { id: 'leaderboard', label: '🏆 랭킹' },
          { id: 'community', label: '💬 피드' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-1.5 px-2 text-center rounded-lg text-xs font-bold whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-cyan-500 text-white shadow-neon-cyan'
                : 'text-slate-400 light:text-slate-600'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </header>
  );
}
