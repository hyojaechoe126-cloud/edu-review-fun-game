'use client';

import React, { useState, useEffect } from 'react';
import { Trophy, Medal, RefreshCw, Zap, Shield, Crown } from 'lucide-react';
import { Ranking, INITIAL_RANKINGS } from '@/lib/supabase';

interface LeaderboardProps {
  refreshTrigger: number;
}

export default function Leaderboard({ refreshTrigger }: LeaderboardProps) {
  const [rankings, setRankings] = useState<Ranking[]>(INITIAL_RANKINGS);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [source, setSource] = useState<string>('초기 데이터');

  const fetchRankings = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/rankings');
      const data = await res.json();
      if (data && data.data) {
        setRankings(data.data);
        setSource(data.source === 'supabase' ? 'Supabase DB (Seoul)' : 'Local Storage');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRankings();
  }, [refreshTrigger]);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="skeuo-panel p-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/40 text-amber-400">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-slate-400">HALL OF FAME</span>
            <h2 className="text-xl font-black text-amber-300 light:text-amber-700">
              실시간 명예의 전당 (리더보드)
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono px-2.5 py-1 rounded-lg bg-[#141828] border border-slate-700 text-slate-400">
            데이터 소스: <strong className="text-cyan-400">{source}</strong>
          </span>
          <button
            onClick={fetchRankings}
            disabled={isLoading}
            className="skeuo-btn p-2 rounded-xl text-slate-300 hover:text-cyan-300 transition-transform active:rotate-180"
            title="새로고침"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Top 3 Podium */}
      {rankings.length >= 3 && (
        <div className="grid grid-cols-3 gap-3 sm:gap-4 items-end pt-6">
          
          {/* 2nd Place */}
          <div className="skeuo-panel p-4 text-center order-1 sm:order-1 border-slate-400/40 bg-gradient-to-t from-slate-900/60 to-slate-800/20">
            <div className="w-10 h-10 mx-auto rounded-full bg-slate-400/20 border border-slate-300 flex items-center justify-center text-slate-300 mb-2 font-black font-mono">
              2
            </div>
            <div className="text-xs font-mono text-slate-400">SILVER</div>
            <div className="text-sm sm:text-base font-bold text-white truncate my-1 light:text-slate-900">
              {rankings[1]?.nickname}
            </div>
            <div className="text-base sm:text-lg font-black text-slate-300 font-mono">
              {rankings[1]?.score.toLocaleString()} <span className="text-xs">P</span>
            </div>
          </div>

          {/* 1st Place */}
          <div className="skeuo-panel p-5 text-center order-2 sm:order-2 border-amber-400/60 bg-gradient-to-t from-amber-950/40 to-yellow-900/20 transform -translate-y-2 shadow-[0_0_30px_rgba(251,191,36,0.2)]">
            <div className="w-12 h-12 mx-auto rounded-full bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center text-amber-400 mb-2 font-black font-mono shadow-lg shadow-amber-500/20">
              <Crown className="w-6 h-6 fill-current animate-bounce" />
            </div>
            <div className="text-xs font-mono font-bold text-amber-400">CHAMPION</div>
            <div className="text-base sm:text-lg font-black text-white truncate my-1 light:text-slate-900">
              {rankings[0]?.nickname}
            </div>
            <div className="text-xl sm:text-2xl font-black text-amber-300 font-mono">
              {rankings[0]?.score.toLocaleString()} <span className="text-xs">P</span>
            </div>
          </div>

          {/* 3rd Place */}
          <div className="skeuo-panel p-4 text-center order-3 sm:order-3 border-amber-700/40 bg-gradient-to-t from-amber-950/30 to-amber-900/10">
            <div className="w-10 h-10 mx-auto rounded-full bg-amber-700/20 border border-amber-600 flex items-center justify-center text-amber-600 mb-2 font-black font-mono">
              3
            </div>
            <div className="text-xs font-mono text-amber-600">BRONZE</div>
            <div className="text-sm sm:text-base font-bold text-white truncate my-1 light:text-slate-900">
              {rankings[2]?.nickname}
            </div>
            <div className="text-base sm:text-lg font-black text-amber-500 font-mono">
              {rankings[2]?.score.toLocaleString()} <span className="text-xs">P</span>
            </div>
          </div>

        </div>
      )}

      {/* Full Leaderboard Table */}
      <div className="skeuo-panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#121625] text-slate-400 font-mono text-xs uppercase border-b border-[#2a3045] light:bg-slate-100">
              <tr>
                <th className="py-3.5 px-4 text-center w-16">순위</th>
                <th className="py-3.5 px-4">플레이어 닉네임</th>
                <th className="py-3.5 px-4 text-right">점수</th>
                <th className="py-3.5 px-4 text-right hidden sm:table-cell">기록 일시</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e2338] font-mono light:divide-slate-200">
              {rankings.map((r, idx) => (
                <tr
                  key={r.id}
                  className={`hover:bg-[#181d30] transition-colors ${
                    idx === 0
                      ? 'bg-amber-500/5 text-amber-300'
                      : idx === 1
                      ? 'bg-slate-400/5 text-slate-200'
                      : idx === 2
                      ? 'bg-amber-700/5 text-amber-400'
                      : 'text-slate-300 light:text-slate-700'
                  }`}
                >
                  <td className="py-3.5 px-4 text-center font-bold">
                    {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`}
                  </td>
                  <td className="py-3.5 px-4 font-bold font-sans flex items-center gap-2">
                    <span>{r.nickname}</span>
                    {idx < 3 && (
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-mono">
                        TOP
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right font-black text-cyan-300 light:text-cyan-700">
                    {r.score.toLocaleString()} P
                  </td>
                  <td className="py-3.5 px-4 text-right text-xs text-slate-500 hidden sm:table-cell">
                    {r.played_at}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
