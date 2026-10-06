'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import RegionBanner from '@/components/RegionBanner';
import QuizBattle from '@/components/QuizBattle';
import MiniGame from '@/components/MiniGame';
import Leaderboard from '@/components/Leaderboard';
import CommunityFeed from '@/components/CommunityFeed';
import { Zap, FlaskConical, Trophy, MessageSquare, Sparkles, Terminal, Atom } from 'lucide-react';

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
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Seoul Region Banner */}
        <RegionBanner />

        {/* Hero Cyberpunk HUD Banner */}
        <div className="skeuo-panel p-6 sm:p-10 mb-8 relative overflow-hidden bg-gradient-to-br from-[#12162a]/90 via-[#181d36]/90 to-[#0e1122]/90 border-cyan-500/40 shadow-neon-cyan">
          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-400 font-mono text-xs">
              <Atom className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '8s' }} />
              <span>미래형 사이버 과학 탐구 아레나 SYSTEM V2.0</span>
            </div>
            
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-amber-300">
              과학을 정복하고,<br />명예의 전당 정상에 서라!
            </h1>
            
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-sans light:text-slate-600">
              물리, 화학, 생명과학, 지구과학 4대 과목의 인터랙티브 퀴즈 배틀과 원소기호 스피드 랩을 통해 실력을 점검하세요.
              실시간 과학 명예의 전당과 학생들이 자유롭게 탐구하고 토론하는 커뮤니티 피드가 제공됩니다.
            </p>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap gap-3 pt-2">
              <button
                onClick={() => setActiveTab('quiz')}
                className={`skeuo-btn px-5 py-3 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 ${
                  activeTab === 'quiz'
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-neon-cyan'
                    : 'bg-[#1b2138] text-slate-300 hover:text-white'
                }`}
              >
                <Zap className="w-4 h-4 text-cyan-400" />
                <span>과학 퀴즈 배틀 시작</span>
              </button>

              <button
                onClick={() => setActiveTab('game')}
                className={`skeuo-btn px-5 py-3 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 ${
                  activeTab === 'game'
                    ? 'bg-gradient-to-r from-fuchsia-500 to-pink-600 text-white shadow-neon-magenta'
                    : 'bg-[#1b2138] text-slate-300 hover:text-white'
                }`}
              >
                <FlaskConical className="w-4 h-4 text-fuchsia-400" />
                <span>원소 스피드 랩 (미니게임)</span>
              </button>

              <button
                onClick={() => setActiveTab('leaderboard')}
                className={`skeuo-btn px-5 py-3 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 ${
                  activeTab === 'leaderboard'
                    ? 'bg-gradient-to-r from-amber-500 to-yellow-600 text-white shadow-lg'
                    : 'bg-[#1b2138] text-slate-300 hover:text-white'
                }`}
              >
                <Trophy className="w-4 h-4 text-amber-400" />
                <span>과학 명예의 전당</span>
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
          {activeTab === 'leaderboard' && <Leaderboard refreshTrigger={refreshTrigger} />}
          {activeTab === 'community' && <CommunityFeed />}
        </div>

      </main>

      {/* Cyberpunk Footer */}
      <footer className="border-t border-[#1e2438] bg-[#07080e] py-8 text-xs font-mono text-slate-500 transition-colors light:bg-slate-200 light:border-slate-300 light:text-slate-600">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-cyan-400" />
            <span>SCIENCE ARENA · Powered by Next.js & Supabase</span>
          </div>
          <div>
            <span>Region: Seoul (icn1 / ap-northeast-2) · Latency Optimized &lt; 5ms</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
