'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import RegionBanner from '@/components/RegionBanner';
import QuizBattle from '@/components/QuizBattle';
import MiniGame from '@/components/MiniGame';
import Leaderboard from '@/components/Leaderboard';
import CommunityFeed from '@/components/CommunityFeed';
import ScienceChatbot from '@/components/ScienceChatbot';
import { Zap, Gamepad2, Trophy, MessageSquare, Terminal, Atom, Bot } from 'lucide-react';

export default function Home() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [activeTab, setActiveTab] = useState<string>('quiz');
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

  // Apply dark/light class to root html
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
  }, [theme]);

  const handleScoreSubmitted = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#080911] text-slate-100 transition-colors duration-300 light:bg-[#f1f3f9] light:text-slate-800">
      
      {/* HUD Navigation */}
      <Navbar
        theme={theme}
        setTheme={setTheme}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {/* Seoul Region Banner */}
        <RegionBanner />

        {/* Hero Cyberpunk HUD Banner */}
        <div className="skeuo-panel p-6 sm:p-8 mb-8 relative overflow-hidden bg-gradient-to-br from-[#12162a]/90 via-[#181d36]/90 to-[#0e1122]/90 border-cyan-500/40 shadow-neon-cyan">
          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-400 font-mono text-xs whitespace-nowrap">
              <Atom className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '8s' }} />
              <span>중학교 과학(과학1 · 과학2 · 과학3) 인터랙티브 배틀 &amp; AI 탐구 랩</span>
            </div>
            
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans light:text-slate-600">
              중학교 과학 1학년, 2학년, 3학년 핵심 개념 퀴즈 배틀, 스피드 미니게임, 실시간 명예의 전당과 AI 과학 탐구를 즐겨보세요.
            </p>

            {/* Quick Action Single-Line Row Buttons */}
            <div className="flex items-center gap-2.5 pt-2 overflow-x-auto pb-1">
              <button
                onClick={() => setActiveTab('quiz')}
                className={`skeuo-btn px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                  activeTab === 'quiz'
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-neon-cyan'
                    : 'bg-[#1b2138] text-slate-300 hover:text-white'
                }`}
              >
                <Zap className="w-4 h-4 text-cyan-400" />
                <span>과학 퀴즈 배틀</span>
              </button>

              <button
                onClick={() => setActiveTab('game')}
                className={`skeuo-btn px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                  activeTab === 'game'
                    ? 'bg-gradient-to-r from-fuchsia-500 to-pink-600 text-white shadow-neon-magenta'
                    : 'bg-[#1b2138] text-slate-300 hover:text-white'
                }`}
              >
                <Gamepad2 className="w-4 h-4 text-fuchsia-400" />
                <span>미니게임</span>
              </button>

              <button
                onClick={() => setActiveTab('ai-tutor')}
                className={`skeuo-btn px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                  activeTab === 'ai-tutor'
                    ? 'bg-gradient-to-r from-cyan-400 to-indigo-600 text-white shadow-neon-cyan'
                    : 'bg-[#1b2138] text-slate-300 hover:text-white'
                }`}
              >
                <Bot className="w-4 h-4 text-cyan-400" />
                <span>AI 과학 튜터</span>
              </button>

              <button
                onClick={() => setActiveTab('leaderboard')}
                className={`skeuo-btn px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                  activeTab === 'leaderboard'
                    ? 'bg-gradient-to-r from-amber-500 to-yellow-600 text-white shadow-lg'
                    : 'bg-[#1b2138] text-slate-300 hover:text-white'
                }`}
              >
                <Trophy className="w-4 h-4 text-amber-400" />
                <span>명예의 전당</span>
              </button>

              <button
                onClick={() => setActiveTab('community')}
                className={`skeuo-btn px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                  activeTab === 'community'
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg'
                    : 'bg-[#1b2138] text-slate-300 hover:text-white'
                }`}
              >
                <MessageSquare className="w-4 h-4 text-emerald-400" />
                <span>탐구 피드</span>
              </button>
            </div>
          </div>

          {/* Decorative Cyber Background Geometry */}
          <div className="absolute right-0 bottom-0 opacity-15 pointer-events-none hidden lg:block transform translate-x-12 translate-y-12">
            <div className="w-96 h-96 rounded-full border-8 border-dashed border-cyan-400 animate-spin" style={{ animationDuration: '60s' }}></div>
          </div>
        </div>

        {/* Tab Content View */}
        <div className="transition-all duration-300">
          {activeTab === 'quiz' && <QuizBattle onScoreSubmitted={handleScoreSubmitted} />}
          {activeTab === 'game' && <MiniGame onScoreSubmitted={handleScoreSubmitted} />}
          {activeTab === 'ai-tutor' && <ScienceChatbot />}
          {activeTab === 'leaderboard' && <Leaderboard refreshTrigger={refreshTrigger} />}
          {activeTab === 'community' && <CommunityFeed />}
        </div>

      </main>

      {/* Floating HUD AI Science Tutor Launcher */}
      <button
        onClick={() => {
          setActiveTab('ai-tutor');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        title="AI 과학 튜터에게 질문하기"
        className="fixed bottom-6 right-6 z-40 skeuo-btn px-4 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 via-sky-500 to-indigo-600 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-neon-cyan hover:scale-105 active:scale-95 transition-all group"
      >
        <div className="relative">
          <Bot className="w-5 h-5 text-white animate-bounce" />
          <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-cyan-950 animate-ping" />
        </div>
        <span className="whitespace-nowrap font-black tracking-wide">AI 과학 질문</span>
      </button>

      {/* Cyberpunk Footer */}
      <footer className="border-t border-[#1e2438] bg-[#07080e] py-6 text-xs font-mono text-slate-500 transition-colors light:bg-slate-200 light:border-slate-300 light:text-slate-600">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 whitespace-nowrap">
            <Terminal className="w-4 h-4 text-cyan-400" />
            <span>ScienceEDU_with 효재T (과학1·2·3) · Powered by Next.js & Supabase</span>
          </div>
          <div className="whitespace-nowrap">
            <span>Region: Seoul (icn1 / ap-northeast-2)</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
