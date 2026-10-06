'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import RegionBanner from '@/components/RegionBanner';
import QuizBattle from '@/components/QuizBattle';
import MiniGame from '@/components/MiniGame';
import Leaderboard from '@/components/Leaderboard';
import CommunityFeed from '@/components/CommunityFeed';
import { Zap, Gamepad2, Trophy, MessageSquare, Sparkles, Terminal } from 'lucide-react';

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
              <Sparkles className="w-3.5 h-3.5" />
              <span>미래형 인터랙티브 학습 아레나 SYSTEM V1.0</span>
            </div>
            
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-amber-300">
              배우고, 대결하고,<br />랭킹의 정점에 도달하라!
            </h1>
            
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-sans light:text-slate-600">
              중·고등학교 핵심 과목(수학, 과학, 코딩, 역사) 퀴즈 배틀과 사이버 펄스 미니게임을 통해 즐겁게 실력을 점검하세요.
              실시간 명예의 전당과 학생 커뮤니티 피드가 함께 제공됩니다.
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
                <span>퀴즈 배틀 시작</span>
              </button>

              <button
                onClick={() => setActiveTab('game')}
                className={`skeuo-btn px-5 py-3 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 ${
                  activeTab === 'game'
                    ? 'bg-gradient-to-r from-fuchsia-500 to-pink-600 text-white shadow-neon-magenta'
                    : 'bg-[#1b2138] text-slate-300 hover:text-white'
                }`}
              >
                <Gamepad2 className="w-4 h-4 text-fuchsia-400" />
                <span>반응속도 미니게임</span>
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
                <span>명예의 전당 (랭킹)</span>
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
            <span>EDU REVIEW FUN GAME · Powered by Next.js & Supabase</span>
          </div>
          <div>
            <span>Region: Seoul (icn1 / ap-northeast-2) · Latency Optimized &lt; 5ms</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
