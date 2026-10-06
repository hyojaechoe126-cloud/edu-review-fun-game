'use client';

import React, { useState, useEffect } from 'react';
import { Zap, Moon, Sun, Atom, Trophy, Gamepad2, MessageSquare, Bot } from 'lucide-react';

interface NavbarProps {
  theme: 'dark' | 'light';
  setTheme: (theme: 'dark' | 'light') => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Navbar({ theme, setTheme, activeTab, setActiveTab }: NavbarProps) {
  const [latency, setLatency] = useState<number>(3);

  useEffect(() => {
    fetch('/api/region')
      .then((res) => res.json())
      .then((data) => {
        if (data.dbLatencyMs > 0) {
          setLatency(data.dbLatencyMs);
        }
      })
      .catch(() => {});
  }, []);

  const navItems = [
    { id: 'quiz', label: '과학 퀴즈 배틀', icon: Zap },
    { id: 'game', label: '미니게임', icon: Gamepad2 },
    { id: 'ai-tutor', label: 'AI 과학 튜터', icon: Bot },
    { id: 'leaderboard', label: '명예의 전당', icon: Trophy },
    { id: 'community', label: '탐구 피드', icon: MessageSquare },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#2a3045] bg-[#0c0e18]/95 backdrop-blur-md transition-colors light:bg-white/95 light:border-slate-300">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-18 py-2.5 flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Brand Logo & Title (Single Line) */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-fuchsia-500/20 border border-cyan-400/50 shadow-neon-cyan shrink-0">
            <Atom className="w-6 h-6 text-cyan-400 animate-spin" style={{ animationDuration: '12s' }} />
            <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-cyan-400 ring-2 ring-cyan-950 animate-ping" />
          </div>
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-1.5 whitespace-nowrap">
              <span className="text-lg sm:text-xl font-black tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-pink-400 to-yellow-300">
                ScienceEDU_with 효재T
              </span>
              <span className="px-1.5 py-0.5 text-[10px] font-mono font-bold tracking-wider rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                과학 1·2·3
              </span>
            </div>
          </div>
        </div>

        {/* Desktop Single-Line Navigation Tabs */}
        <nav className="hidden lg:flex items-center gap-1.5 bg-[#141829] p-1.5 rounded-2xl border border-[#2a324b] shadow-inner light:bg-slate-100 light:border-slate-300 shrink-0">
          {navItems.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-150 ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-neon-cyan scale-[1.02]'
                    : 'text-slate-300 hover:text-white hover:bg-[#1f263e] light:text-slate-700 light:hover:bg-slate-200'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-cyan-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Region Badge & Theme Toggle */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Seoul Region Badge */}
          <div className="hidden sm:flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-[#141828] border border-cyan-500/30 text-xs font-mono shadow-sm light:bg-slate-100 light:border-slate-300 whitespace-nowrap">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            <span className="text-cyan-300 font-bold light:text-cyan-700">icn1 · Seoul</span>
            <span className="text-slate-500">|</span>
            <span className="text-emerald-400 font-semibold">{latency}ms</span>
          </div>

          {/* Theme Switcher */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            title="테마 전환 (사이버 네온 다크 / 메탈릭 라이트)"
            className="skeuo-btn p-2 rounded-xl flex items-center justify-center text-slate-300 hover:text-cyan-300 transition-colors shrink-0"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-yellow-400 transition-transform hover:rotate-45" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-600 transition-transform hover:-rotate-12" />
            )}
          </button>
        </div>

      </div>

      {/* Mobile & Tablet Horizontal Scrolling Tab Bar (Single Line) */}
      <div className="flex lg:hidden border-t border-[#23293d] bg-[#101322] px-2 py-2 overflow-x-auto no-scrollbar light:bg-slate-50 light:border-slate-200">
        <div className="flex items-center gap-1.5 mx-auto w-full justify-between sm:justify-center">
          {navItems.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap shrink-0 transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-neon-cyan'
                    : 'text-slate-400 hover:text-slate-200 light:text-slate-600'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-cyan-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
