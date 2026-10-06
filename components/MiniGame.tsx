'use client';

import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Gamepad2, Play, RotateCcw, Zap, Target, Trophy, Send, CheckCircle2, FlaskConical, Atom, Sparkles } from 'lucide-react';

interface ElementQuestion {
  prompt: string;
  options: string[];
  answer: number;
  hint: string;
}

const ELEMENT_QUESTIONS: ElementQuestion[] = [
  { prompt: '원자번호 1번 (우주에서 가장 풍부한 원소)', options: ['H (수소)', 'He (헬륨)', 'O (산소)', 'C (탄소)'], answer: 0, hint: 'Hydrogen' },
  { prompt: '원소기호 Fe 는 어떤 금속일까요?', options: ['철 (Iron)', '금 (Gold)', '은 (Silver)', '구리 (Copper)'], answer: 0, hint: 'Ferrum' },
  { prompt: '원소기호 Au 는 어떤 귀금속일까요?', options: ['금 (Gold)', '은 (Silver)', '알루미늄 (Al)', '백금 (Pt)'], answer: 0, hint: 'Aurum' },
  { prompt: '공기 중의 약 78%를 차지하는 원소는?', options: ['N (질소)', 'O (산소)', 'Ar (아르곤)', 'CO₂ (이산화탄소)'], answer: 0, hint: 'Nitrogen' },
  { prompt: '원자번호 6번 (다이아몬드와 흑연을 이루는 원소)', options: ['C (탄소)', 'Si (규소)', 'Pb (납)', 'B (붕소)'], answer: 0, hint: 'Carbon' },
  { prompt: '뼈와 치아의 주성분이 되는 2족 알칼리 토금속은?', options: ['Ca (칼슘)', 'K (칼륨)', 'Na (나트륨)', 'Mg (마그네슘)'], answer: 0, hint: 'Calcium' },
  { prompt: '원자번호 8번 (호흡에 필수적인 기체 원소)', options: ['O (산소)', 'H (수소)', 'N (질소)', 'F (플루오린)'], answer: 0, hint: 'Oxygen' },
  { prompt: '소금(NaCl)에서 양이온을 형성하는 1족 알칼리 금속은?', options: ['Na (나트륨)', 'Cl (염소)', 'Mg (마그네슘)', 'Li (리튬)'], answer: 0, hint: 'Sodium' },
  { prompt: '반도체의 핵심 재료로 쓰이는 원자번호 14번 원소는?', options: ['Si (규소/실리콘)', 'Ge (게르마늄)', 'Al (알루미늄)', 'P (인)'], answer: 0, hint: 'Silicon' },
  { prompt: '원소기호 Ag 는 어떤 금속일까요?', options: ['은 (Silver)', '금 (Gold)', '수은 (Hg)', '주석 (Sn)'], answer: 0, hint: 'Argentum' },
];

interface MiniGameProps {
  onScoreSubmitted: () => void;
}

export default function MiniGame({ onScoreSubmitted }: MiniGameProps) {
  const [mode, setMode] = useState<'elements' | 'reflex'>('elements');

  // --- Element Speed Lab State ---
  const [elemScore, setElemScore] = useState<number>(0);
  const [elemStreak, setElemStreak] = useState<number>(0);
  const [elemTimeLeft, setElemTimeLeft] = useState<number>(30);
  const [elemActive, setElemActive] = useState<boolean>(false);
  const [elemGameOver, setElemGameOver] = useState<boolean>(false);
  const [qIndex, setQIndex] = useState<number>(0);
  const [feedback, setFeedback] = useState<string | null>(null);

  // --- Reflex Test State ---
  const [reflexState, setReflexState] = useState<'idle' | 'waiting' | 'ready' | 'result'>('idle');
  const [reactionTime, setReactionTime] = useState<number>(0);
  const [startTime, setStartTime] = useState<number>(0);
  const [timerId, setTimerId] = useState<any>(null);

  // Submission State
  const [nickname, setNickname] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);

  // Element Speed Timer
  useEffect(() => {
    if (!elemActive || elemGameOver) return;

    if (elemTimeLeft <= 0) {
      setElemActive(false);
      setElemGameOver(true);
      confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
      return;
    }

    const timer = setInterval(() => {
      setElemTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [elemActive, elemTimeLeft, elemGameOver]);

  const startElementLab = () => {
    setElemScore(0);
    setElemStreak(0);
    setElemTimeLeft(30);
    setElemActive(true);
    setElemGameOver(false);
    setQIndex(0);
    setFeedback(null);
    setHasSubmitted(false);
  };

  const handleElementAnswer = (idx: number) => {
    const currentQ = ELEMENT_QUESTIONS[qIndex % ELEMENT_QUESTIONS.length];
    if (idx === currentQ.answer) {
      const newStreak = elemStreak + 1;
      setElemStreak(newStreak);
      const points = 200 + newStreak * 50;
      setElemScore((prev) => prev + points);
      setFeedback('정답! + ' + points);
    } else {
      setElemStreak(0);
      setFeedback('오답!');
    }

    setTimeout(() => {
      setFeedback(null);
      setQIndex((prev) => prev + 1);
    }, 250);
  };

  // Reflex Lab Handlers
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

  const currentQ = ELEMENT_QUESTIONS[qIndex % ELEMENT_QUESTIONS.length];

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      
      {/* HUD Header */}
      <div className="skeuo-panel p-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-fuchsia-500/10 border border-fuchsia-500/40 text-fuchsia-400">
            <FlaskConical className="w-6 h-6 animate-bounce" />
          </div>
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-slate-400">SCIENCE MINI LAB</span>
            <h2 className="text-xl font-black text-fuchsia-300 light:text-fuchsia-800">
              사이언스 스피드 미니게임
            </h2>
          </div>
        </div>

        {/* Mode Selector */}
        <div className="flex items-center gap-2 bg-[#151928] p-1.5 rounded-xl border border-slate-700 light:bg-slate-200">
          <button
            onClick={() => setMode('elements')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              mode === 'elements'
                ? 'bg-fuchsia-500 text-white shadow-neon-magenta'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            🧪 원소기호 스피드 랩 (30초)
          </button>
          <button
            onClick={() => setMode('reflex')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              mode === 'reflex'
                ? 'bg-cyan-500 text-white shadow-neon-cyan'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            ⚡ 신경 반응속도 랩
          </button>
        </div>
      </div>

      {/* Mode 1: Element Speed Lab */}
      {mode === 'elements' && (
        <div className="skeuo-panel p-8 text-center space-y-6">
          {!elemActive && !elemGameOver ? (
            <div className="py-12 space-y-6">
              <div className="w-20 h-20 mx-auto rounded-2xl bg-fuchsia-500/10 border-2 border-fuchsia-400 flex items-center justify-center text-fuchsia-400 shadow-neon-magenta">
                <Atom className="w-10 h-10 animate-spin" style={{ animationDuration: '10s' }} />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-2 light:text-slate-900">
                  주기율표 & 원소기호 스피드 매칭 랩!
                </h3>
                <p className="text-xs text-slate-400 font-mono max-w-md mx-auto">
                  제한시간 30초 동안 제시되는 원소의 기호와 이름을 가장 빠르게 매칭하세요!
                  연속 정답(Streak) 시 보너스 점수가 급증합니다.
                </p>
              </div>
              <button
                onClick={startElementLab}
                className="skeuo-btn px-8 py-4 rounded-xl bg-gradient-to-r from-fuchsia-500 to-cyan-500 text-white font-black text-base flex items-center gap-2 mx-auto shadow-neon-magenta hover:scale-105"
              >
                <Play className="w-5 h-5 fill-current" />
                <span>스피드 랩 시작 (30초)</span>
              </button>
            </div>
          ) : elemActive ? (
            <div className="space-y-6">
              {/* Top Stats */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#141829] border border-cyan-500/30 font-mono text-xs">
                  <span className="text-slate-400">남은 시간:</span>
                  <span className="font-bold text-cyan-300 text-base">{elemTimeLeft}s</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#141829] border border-amber-500/30 font-mono text-xs">
                  <span className="text-slate-400">연속 스트릭:</span>
                  <span className="font-bold text-amber-400 text-base">{elemStreak}연타 🔥</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-1.5 rounded-xl bg-[#141829] border border-fuchsia-500/30 font-mono text-xs">
                  <span className="text-slate-400">점수:</span>
                  <span className="font-black text-fuchsia-300 text-base">{elemScore.toLocaleString()} P</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-fuchsia-500 transition-all duration-1000 shadow-neon-magenta"
                  style={{ width: `${(elemTimeLeft / 30) * 100}%` }}
                />
              </div>

              {/* Question Box */}
              <div className="p-8 rounded-2xl bg-gradient-to-b from-[#161a2e] to-[#101322] border-2 border-fuchsia-500/40 shadow-inner relative">
                {feedback && (
                  <div className={`absolute top-2 right-4 text-xs font-mono font-bold animate-bounce ${
                    feedback.includes('정답') ? 'text-emerald-400' : 'text-rose-400'
                  }`}>
                    {feedback}
                  </div>
                )}
                <span className="text-xs font-mono uppercase tracking-widest text-fuchsia-400">
                  ELEMENT TARGET #{qIndex + 1}
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-white mt-2 mb-1 light:text-slate-900">
                  {currentQ.prompt}
                </h2>
                <span className="text-xs text-slate-400 font-mono">힌트: {currentQ.hint}</span>
              </div>

              {/* 4 Choices */}
              <div className="grid grid-cols-2 gap-4">
                {currentQ.options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleElementAnswer(idx)}
                    className="skeuo-btn p-5 rounded-xl font-bold text-base text-slate-200 hover:text-white hover:border-fuchsia-400 active:scale-95 light:text-slate-800 transition-all"
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
                <Trophy className="w-12 h-12" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-white mb-1 light:text-slate-900">
                  타임 오버! 원소 랩 결과
                </h3>
                <p className="text-xs text-slate-400 font-mono">
                  30초 동안 획득한 과학 미니게임 최종 랭킹 점수입니다.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#14192b] border border-fuchsia-500/40 max-w-xs mx-auto">
                <span className="text-xs text-slate-400 font-mono">최종 점수</span>
                <div className="text-3xl font-black text-fuchsia-300 font-mono">{elemScore.toLocaleString()} P</div>
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
                      onClick={() => submitScore(elemScore)}
                      className="skeuo-btn px-4 py-2 rounded-xl bg-fuchsia-500 text-white text-xs font-bold flex items-center gap-1 shadow-neon-magenta disabled:opacity-50"
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
                onClick={startElementLab}
                className="skeuo-btn px-6 py-3 rounded-xl bg-[#1f253b] text-slate-200 font-bold text-sm flex items-center gap-2 mx-auto hover:text-white"
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
        <div className="skeuo-panel p-8 text-center">
          {reflexState === 'idle' && (
            <div className="py-12 space-y-6">
              <div className="w-20 h-20 mx-auto rounded-2xl bg-cyan-500/10 border-2 border-cyan-400 flex items-center justify-center text-cyan-400 shadow-neon-cyan">
                <Zap className="w-10 h-10 animate-pulse" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-2 light:text-slate-900">
                  초록색 네온이 켜지면 즉시 클릭하세요!
                </h3>
                <p className="text-xs text-slate-400 font-mono">
                  뇌 신경 시각 자극 반응속도를 밀리초(ms) 단위로 측정합니다. (200ms 이하: 상위 1%)
                </p>
              </div>
              <button
                onClick={startReflex}
                className="skeuo-btn px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-black text-base flex items-center gap-2 mx-auto shadow-neon-cyan hover:scale-105"
              >
                <Play className="w-5 h-5 fill-current" />
                <span>반사신경 측정 시작</span>
              </button>
            </div>
          )}

          {reflexState === 'waiting' && (
            <div
              onClick={clickReflexZone}
              className="py-20 rounded-2xl bg-rose-950/40 border-2 border-rose-500/50 cursor-pointer select-none transition-all flex flex-col items-center justify-center space-y-3 shadow-[0_0_30px_rgba(244,63,94,0.3)]"
            >
              <div className="w-4 h-4 rounded-full bg-rose-500 animate-ping"></div>
              <h3 className="text-2xl font-black text-rose-300">신호 대기 중... 준비하세요!</h3>
              <p className="text-xs font-mono text-rose-400">초록색으로 바뀌기 전에 클릭하면 실격됩니다.</p>
            </div>
          )}

          {reflexState === 'ready' && (
            <div
              onClick={clickReflexZone}
              className="py-20 rounded-2xl bg-emerald-500/30 border-4 border-emerald-400 cursor-pointer select-none transition-all flex flex-col items-center justify-center space-y-3 shadow-[0_0_50px_rgba(16,185,129,0.8)] animate-pulse"
            >
              <Zap className="w-16 h-16 text-emerald-300 animate-bounce" />
              <h2 className="text-4xl font-black text-emerald-200">⚡ 지금 클릭하세요!! ⚡</h2>
            </div>
          )}

          {reflexState === 'result' && (
            <div className="py-8 space-y-6">
              <div className="inline-flex p-4 rounded-full bg-cyan-500/10 border-2 border-cyan-400 text-cyan-400 shadow-neon-cyan">
                <Target className="w-12 h-12" />
              </div>

              <div>
                <div className="text-xs font-mono uppercase text-slate-400">MEASUREMENT RESULT</div>
                <div className="text-5xl font-black text-cyan-300 font-mono tracking-tight my-2">
                  {reactionTime} <span className="text-xl">ms</span>
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
                onClick={startReflex}
                className="skeuo-btn px-6 py-3 rounded-xl bg-[#1f253b] text-slate-200 font-bold text-sm flex items-center gap-2 mx-auto hover:text-white"
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
