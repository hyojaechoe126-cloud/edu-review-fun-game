'use client';

import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Gamepad2, Play, RotateCcw, Zap, Target, Trophy, Send, CheckCircle2, Atom, Sparkles } from 'lucide-react';

interface ElementQuestion {
  prompt: string;
  options: string[];
  answer: number;
  hint: string;
}

const SCIENCE_MINI_QUESTIONS: ElementQuestion[] = [
  { prompt: '원자번호 1번 (우주에서 가장 가볍고 풍부한 원소)', options: ['H (수소)', 'He (헬륨)', 'O (산소)', 'C (탄소)'], answer: 0, hint: 'Hydrogen' },
  { prompt: '철의 원소기호는 무엇일까요?', options: ['Fe', 'Au', 'Ag', 'Cu'], answer: 0, hint: 'Ferrum' },
  { prompt: '순수한 물(H₂O)의 구성 원소는?', options: ['수소와 산소', '수소와 탄소', '산소와 질소', '나트륨과 염소'], answer: 0, hint: 'H와 O' },
  { prompt: '공기 중에서 약 78%를 차지하는 가장 많은 기체는?', options: ['질소 (N₂)', '산소 (O₂)', '이산화탄소 (CO₂)', '아르곤 (Ar)'], answer: 0, hint: 'Nitrogen' },
  { prompt: '식물의 잎에서 광합성이 일어나는 세포 소기관은?', options: ['엽록체', '미토콘드리아', '세포핵', '리보솜'], answer: 0, hint: '엽록소 함유' },
  { prompt: '소금의 화학식(염화 나트륨)으로 올바른 것은?', options: ['NaCl', 'HCl', 'NaOH', 'KCl'], answer: 0, hint: '나트륨 + 염소' },
  { prompt: '전압(V) = 전류(I) × 저항(R) 을 나타내는 물리 법칙은?', options: ['옴의 법칙', '보일 법칙', '뉴턴 제2법칙', '샤를 법칙'], answer: 0, hint: 'Ohm' },
  { prompt: '지구 내부 구조 중 가장 바깥쪽의 얇은 층은?', options: ['지각 (Crust)', '맨틀', '외핵', '내핵'], answer: 0, hint: '대륙지각/해양지각' },
];

interface MiniGameProps {
  onScoreSubmitted: () => void;
}

export default function MiniGame({ onScoreSubmitted }: MiniGameProps) {
  const [mode, setMode] = useState<'speed' | 'reflex'>('speed');

  // --- Speed Quiz State ---
  const [speedScore, setSpeedScore] = useState<number>(0);
  const [speedStreak, setSpeedStreak] = useState<number>(0);
  const [speedTimeLeft, setSpeedTimeLeft] = useState<number>(30);
  const [speedActive, setSpeedActive] = useState<boolean>(false);
  const [speedGameOver, setSpeedGameOver] = useState<boolean>(false);
  const [qIndex, setQIndex] = useState<number>(0);
  const [feedback, setFeedback] = useState<string | null>(null);

  // --- Reflex State ---
  const [reflexState, setReflexState] = useState<'idle' | 'waiting' | 'ready' | 'result'>('idle');
  const [reactionTime, setReactionTime] = useState<number>(0);
  const [startTime, setStartTime] = useState<number>(0);
  const [timerId, setTimerId] = useState<any>(null);

  // Submission State
  const [nickname, setNickname] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);

  // Timer
  useEffect(() => {
    if (!speedActive || speedGameOver) return;

    if (speedTimeLeft <= 0) {
      setSpeedActive(false);
      setSpeedGameOver(true);
      confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
      return;
    }

    const timer = setInterval(() => {
      setSpeedTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [speedActive, speedTimeLeft, speedGameOver]);

  const startSpeedQuiz = () => {
    setSpeedScore(0);
    setSpeedStreak(0);
    setSpeedTimeLeft(30);
    setSpeedActive(true);
    setSpeedGameOver(false);
    setQIndex(0);
    setFeedback(null);
    setHasSubmitted(false);
  };

  const handleSpeedAnswer = (idx: number) => {
    const currentQ = SCIENCE_MINI_QUESTIONS[qIndex % SCIENCE_MINI_QUESTIONS.length];
    if (idx === currentQ.answer) {
      const newStreak = speedStreak + 1;
      setSpeedStreak(newStreak);
      const points = 200 + newStreak * 50;
      setSpeedScore((prev) => prev + points);
      setFeedback('정답! + ' + points);
    } else {
      setSpeedStreak(0);
      setFeedback('오답!');
    }

    setTimeout(() => {
      setFeedback(null);
      setQIndex((prev) => prev + 1);
    }, 250);
  };

  // Reflex Handlers
  const startReflex = () => {
    setReflexState('waiting');
    setReactionTime(0);
    setHasSubmitted(false);

    const delay = Math.floor(Math.random() * 2500) + 1500;
    const timeout = setTimeout(() => {
      setReflexState('ready');
      setStartTime(Date.now());
    }, delay);

    setTimerId(timeout);
  };

  const clickReflexZone = () => {
    if (reflexState === 'waiting') {
      clearTimeout(timerId);
      setReflexState('idle');
      alert('⚠️ 너무 일찍 클릭했습니다! 초록색 네온이 켜졌을 때 클릭하세요.');
    } else if (reflexState === 'ready') {
      const diff = Date.now() - startTime;
      setReactionTime(diff);
      setReflexState('result');

      if (diff < 250) {
        confetti({ particleCount: 80, spread: 60, origin: { y: 0.7 } });
      }
    }
  };

  const reflexFinalScore = Math.max(1000, Math.round(10000 - (reactionTime - 150) * 25));

  const submitScore = async (finalScore: number) => {
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

  const currentQ = SCIENCE_MINI_QUESTIONS[qIndex % SCIENCE_MINI_QUESTIONS.length];

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      
      {/* HUD Header (Single Line Flex) */}
      <div className="skeuo-panel p-5 sm:p-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-fuchsia-500/10 border border-fuchsia-500/40 text-fuchsia-400 shrink-0">
            <Gamepad2 className="w-6 h-6 animate-bounce" />
          </div>
          <div>
            <span className="text-[11px] font-mono uppercase tracking-widest text-slate-400 whitespace-nowrap">
              SCIENCE MINI GAME
            </span>
            <h2 className="text-lg sm:text-xl font-black text-fuchsia-300 light:text-fuchsia-800 whitespace-nowrap">
              과학 미니게임
            </h2>
          </div>
        </div>

        {/* Mode Selector (Single Line) */}
        <div className="flex items-center gap-2 bg-[#151928] p-1.5 rounded-xl border border-slate-700 light:bg-slate-200 shrink-0">
          <button
            onClick={() => setMode('speed')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
              mode === 'speed'
                ? 'bg-fuchsia-500 text-white shadow-neon-magenta'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            스피드 퀴즈 (30초)
          </button>
          <button
            onClick={() => setMode('reflex')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
              mode === 'reflex'
                ? 'bg-cyan-500 text-white shadow-neon-cyan'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            반응속도 테스트
          </button>
        </div>
      </div>

      {/* Mode 1: Speed Quiz Mini Game */}
      {mode === 'speed' && (
        <div className="skeuo-panel p-6 sm:p-8 text-center space-y-6">
          {!speedActive && !speedGameOver ? (
            <div className="py-10 space-y-6">
              <div className="w-18 h-18 mx-auto rounded-2xl bg-fuchsia-500/10 border-2 border-fuchsia-400 flex items-center justify-center text-fuchsia-400 shadow-neon-magenta">
                <Atom className="w-10 h-10 animate-spin" style={{ animationDuration: '10s' }} />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl sm:text-2xl font-bold text-white light:text-slate-900">
                  30초 스피드 과학 미니게임
                </h3>
                <p className="text-xs text-slate-400 font-mono max-w-md mx-auto">
                  30초 동안 중학 과학 핵심 개념 퀴즈를 가장 빠르게 맞추어 연타 콤보 점수를 획득하세요!
                </p>
              </div>
              <button
                onClick={startSpeedQuiz}
                className="skeuo-btn px-8 py-3.5 rounded-xl bg-gradient-to-r from-fuchsia-500 to-cyan-500 text-white font-black text-sm flex items-center gap-2 mx-auto shadow-neon-magenta hover:scale-105 whitespace-nowrap"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>미니게임 시작</span>
              </button>
            </div>
          ) : speedActive ? (
            <div className="space-y-6">
              {/* Top Stats (Single Line) */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#141829] border border-cyan-500/30 font-mono text-xs whitespace-nowrap">
                  <span className="text-slate-400">남은 시간:</span>
                  <span className="font-bold text-cyan-300 text-sm sm:text-base">{speedTimeLeft}초</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#141829] border border-amber-500/30 font-mono text-xs whitespace-nowrap">
                  <span className="text-slate-400">스트릭:</span>
                  <span className="font-bold text-amber-400 text-sm sm:text-base">{speedStreak}연타 🔥</span>
                </div>
                <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#141829] border border-fuchsia-500/30 font-mono text-xs whitespace-nowrap">
                  <span className="text-slate-400">점수:</span>
                  <span className="font-black text-fuchsia-300 text-sm sm:text-base">{speedScore.toLocaleString()} P</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-fuchsia-500 transition-all duration-1000 shadow-neon-magenta"
                  style={{ width: `${(speedTimeLeft / 30) * 100}%` }}
                />
              </div>

              {/* Question Box */}
              <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-[#161a2e] to-[#101322] border-2 border-fuchsia-500/40 shadow-inner relative">
                {feedback && (
                  <div className={`absolute top-2 right-4 text-xs font-mono font-bold animate-bounce ${
                    feedback.includes('정답') ? 'text-emerald-400' : 'text-rose-400'
                  }`}>
                    {feedback}
                  </div>
                )}
                <span className="text-xs font-mono uppercase tracking-widest text-fuchsia-400">
                  TARGET #{qIndex + 1}
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-white mt-2 mb-1 light:text-slate-900">
                  {currentQ.prompt}
                </h2>
                <span className="text-xs text-slate-400 font-mono">힌트: {currentQ.hint}</span>
              </div>

              {/* 4 Choices */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {currentQ.options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSpeedAnswer(idx)}
                    className="skeuo-btn p-4 rounded-xl font-bold text-sm sm:text-base text-slate-200 hover:text-white hover:border-fuchsia-400 active:scale-95 light:text-slate-800 transition-all whitespace-nowrap"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* Game Over Screen */
            <div className="py-6 space-y-6">
              <div className="inline-flex p-4 rounded-full bg-fuchsia-500/10 border-2 border-fuchsia-400 text-fuchsia-400 shadow-neon-magenta">
                <Trophy className="w-10 h-10" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl sm:text-2xl font-black text-white light:text-slate-900">
                  미니게임 종료!
                </h3>
                <p className="text-xs text-slate-400 font-mono">
                  30초 동안 획득한 미니게임 최종 랭킹 점수입니다.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#14192b] border border-fuchsia-500/40 max-w-xs mx-auto">
                <span className="text-xs text-slate-400 font-mono">최종 점수</span>
                <div className="text-2xl sm:text-3xl font-black text-fuchsia-300 font-mono">{speedScore.toLocaleString()} P</div>
              </div>

              {!hasSubmitted ? (
                <div className="max-w-md mx-auto p-4 rounded-xl bg-[#161c30] border border-slate-700 space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="닉네임 입력 (랭킹 등록)"
                      value={nickname}
                      onChange={(e) => setNickname(e.target.value)}
                      className="flex-1 px-4 py-2 rounded-xl bg-[#0e1220] border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-fuchsia-400"
                      maxLength={15}
                    />
                    <button
                      disabled={!nickname.trim() || isSubmitting}
                      onClick={() => submitScore(speedScore)}
                      className="skeuo-btn px-4 py-2 rounded-xl bg-fuchsia-500 text-white text-xs font-bold flex items-center gap-1 shadow-neon-magenta disabled:opacity-50 whitespace-nowrap"
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
                onClick={startSpeedQuiz}
                className="skeuo-btn px-6 py-3 rounded-xl bg-[#1f253b] text-slate-200 font-bold text-sm flex items-center gap-2 mx-auto hover:text-white whitespace-nowrap"
              >
                <RotateCcw className="w-4 h-4" />
                <span>다시 도전하기</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Mode 2: Reflex Test */}
      {mode === 'reflex' && (
        <div className="skeuo-panel p-6 sm:p-8 text-center">
          {reflexState === 'idle' && (
            <div className="py-10 space-y-6">
              <div className="w-18 h-18 mx-auto rounded-2xl bg-cyan-500/10 border-2 border-cyan-400 flex items-center justify-center text-cyan-400 shadow-neon-cyan">
                <Zap className="w-10 h-10 animate-pulse" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl sm:text-2xl font-bold text-white light:text-slate-900">
                  초록색 네온이 켜지면 즉시 클릭하세요!
                </h3>
                <p className="text-xs text-slate-400 font-mono">
                  뇌 신경 시각 자극 반응속도를 밀리초(ms) 단위로 측정합니다.
                </p>
              </div>
              <button
                onClick={startReflex}
                className="skeuo-btn px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-black text-sm flex items-center gap-2 mx-auto shadow-neon-cyan hover:scale-105 whitespace-nowrap"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>반응속도 테스트 시작</span>
              </button>
            </div>
          )}

          {reflexState === 'waiting' && (
            <div
              onClick={clickReflexZone}
              className="py-16 rounded-2xl bg-rose-950/40 border-2 border-rose-500/50 cursor-pointer select-none transition-all flex flex-col items-center justify-center space-y-3 shadow-[0_0_30px_rgba(244,63,94,0.3)]"
            >
              <div className="w-3.5 h-3.5 rounded-full bg-rose-500 animate-ping"></div>
              <h3 className="text-xl sm:text-2xl font-black text-rose-300">신호 대기 중... 준비하세요!</h3>
              <p className="text-xs font-mono text-rose-400">초록색으로 바뀌기 전에 클릭하면 실격됩니다.</p>
            </div>
          )}

          {reflexState === 'ready' && (
            <div
              onClick={clickReflexZone}
              className="py-16 rounded-2xl bg-emerald-500/30 border-4 border-emerald-400 cursor-pointer select-none transition-all flex flex-col items-center justify-center space-y-3 shadow-[0_0_50px_rgba(16,185,129,0.8)] animate-pulse"
            >
              <Zap className="w-14 h-14 text-emerald-300 animate-bounce" />
              <h2 className="text-3xl sm:text-4xl font-black text-emerald-200">⚡ 지금 클릭하세요!! ⚡</h2>
            </div>
          )}

          {reflexState === 'result' && (
            <div className="py-6 space-y-6">
              <div className="inline-flex p-4 rounded-full bg-cyan-500/10 border-2 border-cyan-400 text-cyan-400 shadow-neon-cyan">
                <Target className="w-10 h-10" />
              </div>

              <div>
                <div className="text-xs font-mono uppercase text-slate-400">측정 결과</div>
                <div className="text-4xl font-black text-cyan-300 font-mono tracking-tight my-2">
                  {reactionTime} <span className="text-lg">ms</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#14192b] border border-cyan-500/30 max-w-xs mx-auto">
                <span className="text-xs text-slate-400 font-mono">환산 랭킹 점수</span>
                <div className="text-2xl font-black text-amber-400 font-mono">{reflexFinalScore.toLocaleString()} P</div>
              </div>

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
                      onClick={() => submitScore(reflexFinalScore)}
                      className="skeuo-btn px-4 py-2 rounded-xl bg-cyan-500 text-white text-xs font-bold flex items-center gap-1 shadow-neon-cyan disabled:opacity-50 whitespace-nowrap"
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
                onClick={startReflex}
                className="skeuo-btn px-6 py-3 rounded-xl bg-[#1f253b] text-slate-200 font-bold text-sm flex items-center gap-2 mx-auto hover:text-white whitespace-nowrap"
              >
                <RotateCcw className="w-4 h-4" />
                <span>다시 측정하기</span>
              </button>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
