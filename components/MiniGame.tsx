'use client';

import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Gamepad2, Play, RotateCcw, Zap, Target, Trophy, Send, CheckCircle2 } from 'lucide-react';

interface MiniGameProps {
  onScoreSubmitted: () => void;
}

export default function MiniGame({ onScoreSubmitted }: MiniGameProps) {
  const [gameState, setGameState] = useState<'idle' | 'waiting' | 'ready' | 'clicked' | 'result'>('idle');
  const [reactionTime, setReactionTime] = useState<number>(0);
  const [startTime, setStartTime] = useState<number>(0);
  const [timerId, setTimerId] = useState<any>(null);
  const [nickname, setNickname] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);

  const startTest = () => {
    setGameState('waiting');
    setReactionTime(0);
    setHasSubmitted(false);

    // Random delay between 1.5s and 4.5s
    const randomDelay = Math.floor(Math.random() * 3000) + 1500;
    const timeout = setTimeout(() => {
      setGameState('ready');
      setStartTime(Date.now());
    }, randomDelay);

    setTimerId(timeout);
  };

  const handleClickZone = () => {
    if (gameState === 'waiting') {
      // Clicked too early
      clearTimeout(timerId);
      setGameState('idle');
      alert('⚠️ 너무 일찍 클릭했습니다! 초록색 네온 신호가 켜졌을 때 클릭하세요.');
    } else if (gameState === 'ready') {
      const diff = Date.now() - startTime;
      setReactionTime(diff);
      setGameState('result');

      if (diff < 250) {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.7 },
        });
      }
    }
  };

  const calculateScore = (timeMs: number) => {
    // 150ms -> 10,000 pts, 350ms -> 5,000 pts
    const calculated = Math.max(1000, 10000 - (timeMs - 150) * 25);
    return Math.round(calculated);
  };

  const finalScore = calculateScore(reactionTime);

  const submitScore = async () => {
    if (!nickname.trim() || isSubmitting) return;
    setIsSubmitting(true);

    try {
      await fetch('/api/rankings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nickname: nickname.trim(),
          score: finalScore,
        }),
      });
      setHasSubmitted(true);
      onScoreSubmitted();
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      
      {/* HUD Header */}
      <div className="skeuo-panel p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-fuchsia-500/10 border border-fuchsia-500/40 text-fuchsia-400">
            <Gamepad2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-slate-400">CYBER REFLEX TEST</span>
            <h2 className="text-xl font-black text-fuchsia-300 light:text-fuchsia-800">
              사이버 펄스 반응속도 미니게임
            </h2>
          </div>
        </div>
        <div className="text-xs font-mono text-slate-400">
          초인적 반사신경 (ms) 측정
        </div>
      </div>

      {/* Interactive Arena */}
      <div className="skeuo-panel p-8 text-center">
        {gameState === 'idle' && (
          <div className="py-12 space-y-6">
            <div className="w-20 h-20 mx-auto rounded-2xl bg-cyan-500/10 border-2 border-cyan-400 flex items-center justify-center text-cyan-400 shadow-neon-cyan">
              <Zap className="w-10 h-10 animate-pulse" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white mb-2 light:text-slate-900">
                초록색 네온이 번쩍이면 즉시 클릭하세요!
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                당신의 뇌 신경 반사속도를 측정하여 점수로 환산합니다. (200ms 이하 = 마스터 게이머 등급)
              </p>
            </div>
            <button
              onClick={startTest}
              className="skeuo-btn px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-white font-black text-base flex items-center gap-2 mx-auto shadow-neon-cyan hover:scale-105"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>테스트 시작</span>
            </button>
          </div>
        )}

        {gameState === 'waiting' && (
          <div
            onClick={handleClickZone}
            className="py-20 rounded-2xl bg-rose-950/40 border-2 border-rose-500/50 cursor-pointer select-none transition-all flex flex-col items-center justify-center space-y-3 shadow-[0_0_30px_rgba(244,63,94,0.3)]"
          >
            <div className="w-4 h-4 rounded-full bg-rose-500 animate-ping"></div>
            <h3 className="text-2xl font-black text-rose-300">신호 대기 중... 준비하세요!</h3>
            <p className="text-xs font-mono text-rose-400">초록색으로 바뀌기 전에 클릭하면 실격됩니다.</p>
          </div>
        )}

        {gameState === 'ready' && (
          <div
            onClick={handleClickZone}
            className="py-20 rounded-2xl bg-emerald-500/30 border-4 border-emerald-400 cursor-pointer select-none transition-all flex flex-col items-center justify-center space-y-3 shadow-[0_0_50px_rgba(16,185,129,0.8)] animate-pulse"
          >
            <Zap className="w-16 h-16 text-emerald-300 animate-bounce" />
            <h2 className="text-4xl font-black text-emerald-200">⚡ 지금 클릭하세요!! ⚡</h2>
          </div>
        )}

        {gameState === 'result' && (
          <div className="py-8 space-y-6">
            <div className="inline-flex p-4 rounded-full bg-cyan-500/10 border-2 border-cyan-400 text-cyan-400 shadow-neon-cyan">
              <Target className="w-12 h-12" />
            </div>

            <div>
              <div className="text-xs font-mono uppercase text-slate-400">MEASUREMENT RESULT</div>
              <div className="text-5xl font-black text-cyan-300 font-mono tracking-tight my-2">
                {reactionTime} <span className="text-xl">ms</span>
              </div>
              <div className="text-sm font-bold text-slate-300">
                {reactionTime < 220 ? '🔥 프로게이머급 신의 반응속도!' : reactionTime < 280 ? '⚡ 상위 10% 빛의 반사신경!' : '👍 준수한 반응속도!'}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#14192b] border border-cyan-500/30 max-w-xs mx-auto">
              <span className="text-xs text-slate-400 font-mono">환산 랭킹 점수</span>
              <div className="text-2xl font-black text-amber-400 font-mono">{finalScore.toLocaleString()} P</div>
            </div>

            {/* Score submission */}
            {!hasSubmitted ? (
              <div className="max-w-md mx-auto p-4 rounded-xl bg-[#161c30] border border-slate-700 space-y-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="닉네임 입력 (랭킹 등록)"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    className="flex-1 px-4 py-2 rounded-xl bg-[#0e1220] border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                    maxLength={15}
                  />
                  <button
                    disabled={!nickname.trim() || isSubmitting}
                    onClick={submitScore}
                    className="skeuo-btn px-4 py-2 rounded-xl bg-cyan-500 text-white text-xs font-bold flex items-center gap-1 shadow-neon-cyan disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                    <span>{isSubmitting ? '...' : '등록'}</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-3 max-w-md mx-auto rounded-xl bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 text-xs font-semibold flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>명예의 전당 등록 완료!</span>
              </div>
            )}

            <button
              onClick={startTest}
              className="skeuo-btn px-6 py-3 rounded-xl bg-[#1f253b] text-slate-200 font-bold text-sm flex items-center gap-2 mx-auto hover:text-white"
            >
              <RotateCcw className="w-4 h-4" />
              <span>다시 측정하기</span>
            </button>
          </div>
        )}
      </div>

    </div>
  );
}
