'use client';

import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { Flame, Play, RotateCcw, Zap, Target, Trophy, Send, CheckCircle2, Thermometer, Atom, ArrowRight, Sparkles, AlertCircle, Info } from 'lucide-react';

// --- Particle Simulation Canvas ---
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseX: number;
  baseY: number;
}

interface LabQuestion {
  title: string;
  situation: string;
  conceptType: '융해' | '기화' | '승화(고→기)' | '온도변화그래프' | '입자모형';
  question: string;
  options: string[];
  answer: number;
  explanation: string;
  particleState: 'solid' | 'melting' | 'liquid' | 'boiling' | 'gas';
}

const THERMAL_LAB_QUESTIONS: LabQuestion[] = [
  {
    title: '미션 1: 얼음이 녹을 때 (융해)',
    situation: '더운 여름날 컵에 든 얼음이 녹아 물이 되고 있습니다.',
    conceptType: '융해',
    question: '얼음이 물로 변하는 상태 변화(융해)가 일어날 때, 입자 운동과 입자 사이의 거리는 어떻게 변할까요?',
    options: [
      '열에너지를 흡수하여 입자 운동이 활발해지고, 입자 사이 거리가 멀어진다.',
      '열에너지를 방출하여 입자 운동이 둔해지고, 입자 사이 거리가 가까워진다.',
      '열에너지를 흡수하지만 입자 운동과 거리는 변하지 않는다.',
      '열에너지를 방출하여 입자 배열이 규칙적으로 변한다.',
    ],
    answer: 0,
    explanation: '얼음이 녹는 융해는 열에너지를 흡수하는 상태 변화입니다. 열에너지를 흡수하면 입자 운동이 제자리 진동에서 비교적 자유로운 운동으로 활발해지며, 입자 사이 거리가 멀어지고 배열이 불규칙해집니다.',
    particleState: 'melting',
  },
  {
    title: '미션 2: 가열 곡선의 수평 구간 (녹는점과 끓는점)',
    situation: '얼음을 계속 가열해도 녹는 동안(0℃)과 물이 끓는 동안(100℃) 온도가 일정하게 유지됩니다.',
    conceptType: '온도변화그래프',
    question: '상태 변화가 일어나는 동안 열에너지를 계속 공급하는데도 온도가 높아지지 않는 이유는 무엇일까요?',
    options: [
      '흡수한 열에너지가 입자 사이의 인력을 끊고 배열을 바꾸는 데 쓰이기 때문에',
      '열에너지가 공기 중으로 모두 날아가 버리기 때문에',
      '얼음과 물의 질량이 계속 감소하기 때문에',
      '입자의 크기가 작아지면서 에너지를 소모하기 때문에',
    ],
    answer: 0,
    explanation: '상태 변화가 일어나는 동안 가해준 열에너지는 온도를 올리는 대신 입자 사이의 결합(인력)을 끊어 상태를 바꾸는 데 모두 사용되므로 온도가 일정하게 유지됩니다.',
    particleState: 'boiling',
  },
  {
    title: '미션 3: 드라이아이스의 신비 (승화: 고체→기체)',
    situation: '아이스크림 포장에 든 드라이아이스(고체 이산화탄소)가 액체를 거치지 않고 직접 기체로 사라집니다.',
    conceptType: '승화(고→기)',
    question: '드라이아이스가 기체로 변하는 승화(고체→기체) 과정에 대한 설명으로 옳은 것은?',
    options: [
      '주변에서 열에너지를 흡수하므로 주변 온도가 낮아지고, 입자 배열이 매우 불규칙해진다.',
      '열에너지를 방출하므로 주변 온도가 따뜻해지고, 입자 운동이 둔해진다.',
      '부피가 급격히 줄어들고 입자 사이의 거리가 매우 좁아진다.',
      '입자의 종류가 다른 물질로 바뀌는 화학 변화이다.',
    ],
    answer: 0,
    explanation: '고체에서 기체로의 승화는 막대한 열에너지를 흡수하는 상태 변화입니다. 주변의 열을 빼앗아가므로 주위가 차가워지며, 입자 운동이 매우 활발해지고 입자 사이 거리가 극단적으로 멀어집니다.',
    particleState: 'gas',
  },
  {
    title: '미션 4: 땀이 식을 때 시원한 이유 (기화)',
    situation: '운동 후 땀을 흘렸을 때 바람이 불면 몸이 시원해집니다.',
    conceptType: '기화',
    question: '피부 표면의 땀(액체)이 수증기(기체)로 기화할 때 나타나는 열에너지의 이동은?',
    options: [
      '땀이 기화하면서 피부로부터 기화열(열에너지)을 흡수하여 체온을 낮춘다.',
      '땀이 기화하면서 피부에 열에너지를 방출하여 체온을 높인다.',
      '공기 중의 수증기가 땀으로 액화하면서 열을 흡수한다.',
      '땀이 피부로 흡수되면서 냉각 반응을 일으킨다.',
    ],
    answer: 0,
    explanation: '액체가 기체로 기화할 때 주변에서 열에너지를 흡수(기화열 흡수)합니다. 이로 인해 우리 몸의 열을 빼앗아가 체온이 내려가게 됩니다 (마당에 물 뿌리기, 주사 맞을 때 알코올 바르기도 동일한 원리).',
    particleState: 'liquid',
  },
  {
    title: '미션 5: 시간에 따른 온도 변화 그래프 분석',
    situation: '-10℃ 얼음을 가열하여 110℃ 수증기가 될 때까지의 그래프를 관찰합니다.',
    conceptType: '온도변화그래프',
    question: '얼음이 녹아 물이 공존하는 구간(A)과 물이 끓어 수증기와 공존하는 구간(B)에 대한 설명으로 옳은 것은?',
    options: [
      'A구간은 융해열을 흡수하고, B구간은 기화열을 흡수하며 두 구간 모두 온도가 일정하다.',
      'A구간에서는 온도가 올라가고, B구간에서는 온도가 내려간다.',
      'A구간에서는 열에너지를 방출하고, B구간에서는 열에너지를 흡수한다.',
      'A구간과 B구간 모두 입자 사이의 거리가 점점 가까워진다.',
    ],
    answer: 0,
    explanation: '고체가 액체로 변하는 융해 구간(녹는점 0℃)과 액체가 기체로 변하는 기화 구간(끓는점 100℃)은 모두 열에너지를 흡수하는 구간이며 상태 변화 동안 온도가 일정합니다.',
    particleState: 'melting',
  },
  {
    title: '미션 6: 입자 모형의 비교 (고체 vs 액체 vs 기체)',
    situation: '물(H₂O)이 얼음, 물, 수증기로 상태가 변할 때의 입자 모형을 현미경으로 관찰합니다.',
    conceptType: '입자모형',
    question: '얼음이 수증기로 변했을 때 변하지 않고 \'일정하게 유지되는 것\'은 무엇일까요?',
    options: [
      '입자의 종류, 입자의 개수, 총 질량',
      '입자 사이의 거리, 물질의 부피',
      '입자의 운동 속도, 입자 배열의 규칙성',
      '물질의 밀도, 물질의 형태',
    ],
    answer: 0,
    explanation: '상태 변화가 일어나도 물질을 이루는 입자의 종류와 개수 자체는 변하지 않으므로 물질의 성질과 총 질량은 변하지 않습니다! 변하는 것은 오직 입자의 배열, 거리, 운동 상태와 부피입니다.',
    particleState: 'gas',
  },
];

interface MiniGameProps {
  onScoreSubmitted: () => void;
}

export default function MiniGame({ onScoreSubmitted }: MiniGameProps) {
  const [mode, setMode] = useState<'thermal_lab' | 'speed' | 'reflex'>('thermal_lab');

  // --- Thermal Lab State ---
  const [labIndex, setLabIndex] = useState<number>(0);
  const [labScore, setLabScore] = useState<number>(0);
  const [labStreak, setLabStreak] = useState<number>(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [labCompleted, setLabCompleted] = useState<boolean>(false);
  const [burnerActive, setBurnerActive] = useState<boolean>(true);

  // --- Speed Quiz State ---
  const [speedScore, setSpeedScore] = useState<number>(0);
  const [speedStreak, setSpeedStreak] = useState<number>(0);
  const [speedTimeLeft, setSpeedTimeLeft] = useState<number>(30);
  const [speedActive, setSpeedActive] = useState<boolean>(false);
  const [speedGameOver, setSpeedGameOver] = useState<boolean>(false);
  const [speedQIndex, setSpeedQIndex] = useState<number>(0);

  // --- Reflex State ---
  const [reflexState, setReflexState] = useState<'idle' | 'waiting' | 'ready' | 'result'>('idle');
  const [reactionTime, setReactionTime] = useState<number>(0);
  const [startTime, setStartTime] = useState<number>(0);
  const [timerId, setTimerId] = useState<any>(null);

  // Submission State
  const [nickname, setNickname] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);

  // Canvas Ref
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const currentMission = THERMAL_LAB_QUESTIONS[labIndex];

  // Particle Canvas Animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const count = 36;
    const particles: Particle[] = [];
    const width = canvas.width;
    const height = canvas.height;

    // Initialize particles based on state
    for (let i = 0; i < count; i++) {
      const col = i % 6;
      const row = Math.floor(i / 6);
      const baseX = width * 0.28 + col * 18;
      const baseY = height * 0.35 + row * 18;

      particles.push({
        x: baseX,
        y: baseY,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
        baseX,
        baseY,
      });
    }

    let tick = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      tick++;

      const pState = currentMission?.particleState || 'solid';

      // Draw Container Box
      ctx.strokeStyle = 'rgba(0, 243, 255, 0.4)';
      ctx.lineWidth = 2;
      ctx.strokeRect(20, 20, width - 40, height - 40);

      particles.forEach((p, idx) => {
        if (pState === 'solid') {
          // Tight lattice with slight vibration
          const jitterX = Math.sin(tick * 0.3 + idx) * 1.2;
          const jitterY = Math.cos(tick * 0.3 + idx) * 1.2;
          p.x = p.baseX + jitterX;
          p.y = p.baseY + jitterY;
          ctx.fillStyle = '#00f3ff';
        } else if (pState === 'melting' || pState === 'liquid') {
          // Semi-loose sliding motion
          p.x += p.vx * 1.5;
          p.y += p.vy * 1.5;
          if (p.x < 30 || p.x > width - 30) p.vx *= -1;
          if (p.y < 30 || p.y > height - 30) p.vy *= -1;
          ctx.fillStyle = '#00ffaa';
        } else {
          // Gas state: highly energetic, bouncing everywhere
          p.x += p.vx * 3.5;
          p.y += p.vy * 3.5;
          if (p.x < 25 || p.x > width - 25) p.vx *= -1;
          if (p.y < 25 || p.y > height - 25) p.vy *= -1;
          ctx.fillStyle = '#ff007f';
        }

        // Draw particle sphere
        ctx.beginPath();
        ctx.arc(p.x, p.y, pState === 'gas' ? 4 : 5.5, 0, Math.PI * 2);
        ctx.fill();

        // Connect nearby particles in solid/liquid
        if (pState !== 'gas') {
          particles.forEach((p2, idx2) => {
            if (idx2 > idx) {
              const dx = p.x - p2.x;
              const dy = p.y - p2.y;
              const dist = Math.sqrt(dx * dx + dy * dy);
              if (dist < (pState === 'solid' ? 24 : 18)) {
                ctx.strokeStyle = pState === 'solid' ? 'rgba(0, 243, 255, 0.25)' : 'rgba(0, 255, 170, 0.15)';
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.stroke();
              }
            }
          });
        }
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animId);
  }, [currentMission?.particleState]);

  // Thermal Lab Answer Handler
  const handleAnswerLab = (idx: number) => {
    if (isAnswered || labCompleted) return;
    setSelectedOpt(idx);
    setIsAnswered(true);

    if (idx === currentMission.answer) {
      const newStreak = labStreak + 1;
      setLabStreak(newStreak);
      const points = 250 + newStreak * 50;
      setLabScore((prev) => prev + points);
    } else {
      setLabStreak(0);
    }
  };

  const handleNextLab = () => {
    if (labIndex + 1 < THERMAL_LAB_QUESTIONS.length) {
      setLabIndex((prev) => prev + 1);
      setSelectedOpt(null);
      setIsAnswered(false);
    } else {
      setLabCompleted(true);
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
    }
  };

  const restartLab = () => {
    setLabIndex(0);
    setLabScore(0);
    setLabStreak(0);
    setSelectedOpt(null);
    setIsAnswered(false);
    setLabCompleted(false);
    setHasSubmitted(false);
  };

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

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      
      {/* Header (Single Line Flex) */}
      <div className="skeuo-panel p-5 sm:p-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/40 text-cyan-400 shrink-0">
            <Thermometer className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <span className="text-[11px] font-mono uppercase tracking-widest text-slate-400 whitespace-nowrap">
              중1 과학1 특화 시뮬레이션
            </span>
            <h2 className="text-lg sm:text-xl font-black text-cyan-300 light:text-cyan-800 whitespace-nowrap">
              열에너지 흡수 & 상태 변화 미니게임
            </h2>
          </div>
        </div>

        {/* Mode Selector (Single Line) */}
        <div className="flex items-center gap-1.5 bg-[#151928] p-1.5 rounded-xl border border-slate-700 light:bg-slate-200 shrink-0">
          <button
            onClick={() => setMode('thermal_lab')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
              mode === 'thermal_lab'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-neon-cyan'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            🔥 열에너지 흡수 랩 (추천)
          </button>
          <button
            onClick={() => setMode('speed')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
              mode === 'speed'
                ? 'bg-fuchsia-500 text-white shadow-neon-magenta'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            스피드 퀴즈
          </button>
          <button
            onClick={() => setMode('reflex')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
              mode === 'reflex'
                ? 'bg-amber-500 text-white shadow-lg'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            반응속도 테스트
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 🧪 FEATURED: THERMAL LAB (열에너지 흡수 상태 변화 랩) */}
      {/* ======================================================== */}
      {mode === 'thermal_lab' && (
        <div className="space-y-6">
          
          {/* Top Visualizer: Heating Curve & Particle Simulation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Visual 1: 시간에 따른 온도 변화 그래프 (가열 곡선) */}
            <div className="skeuo-panel p-5 space-y-3 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-cyan-300 flex items-center gap-1.5 whitespace-nowrap">
                  <Thermometer className="w-4 h-4 text-cyan-400" />
                  시간-온도 가열 곡선 그래프
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800 whitespace-nowrap">
                  상태 변화 중 온도 일정!
                </span>
              </div>

              {/* SVG Heating Curve Graph */}
              <div className="w-full h-44 bg-[#0a0d18] rounded-xl border border-slate-800 p-2 relative flex flex-col justify-between">
                <svg viewBox="0 0 300 130" className="w-full h-full">
                  {/* Grid Lines */}
                  <line x1="30" y1="20" x2="290" y2="20" stroke="#1f293d" strokeDasharray="2 2" />
                  <line x1="30" y1="70" x2="290" y2="70" stroke="#1f293d" strokeDasharray="2 2" />
                  <line x1="30" y1="110" x2="290" y2="110" stroke="#1f293d" strokeDasharray="2 2" />

                  {/* Y-Axis (Temperature) */}
                  <line x1="30" y1="10" x2="30" y2="120" stroke="#475569" strokeWidth="1.5" />
                  <text x="5" y="24" fill="#94a3b8" fontSize="8" fontFamily="monospace">100℃</text>
                  <text x="12" y="74" fill="#94a3b8" fontSize="8" fontFamily="monospace">0℃</text>
                  <text x="5" y="114" fill="#94a3b8" fontSize="8" fontFamily="monospace">-10℃</text>

                  {/* X-Axis (Heating Time) */}
                  <line x1="30" y1="120" x2="290" y2="120" stroke="#475569" strokeWidth="1.5" />
                  <text x="250" y="128" fill="#94a3b8" fontSize="8" fontFamily="monospace">가열 시간→</text>

                  {/* Heating Line Segments */}
                  {/* 1. Ice warming */}
                  <line x1="30" y1="110" x2="70" y2="70" stroke="#38bdf8" strokeWidth="2.5" />
                  {/* 2. Melting (0℃ plateau - 융해열 흡수) */}
                  <line x1="70" y1="70" x2="130" y2="70" stroke="#22c55e" strokeWidth="3.5" className={currentMission?.particleState === 'melting' ? 'animate-pulse' : ''} />
                  {/* 3. Water warming */}
                  <line x1="130" y1="70" x2="190" y2="20" stroke="#38bdf8" strokeWidth="2.5" />
                  {/* 4. Boiling (100℃ plateau - 기화열 흡수) */}
                  <line x1="190" y1="20" x2="250" y2="20" stroke="#ec4899" strokeWidth="3.5" className={currentMission?.particleState === 'boiling' ? 'animate-pulse' : ''} />
                  {/* 5. Vapor warming */}
                  <line x1="250" y1="20" x2="285" y2="8" stroke="#f59e0b" strokeWidth="2.5" />

                  {/* Segment Annotations */}
                  <text x="75" y="63" fill="#4ade80" fontSize="8" fontWeight="bold">융해 (0℃ 일정)</text>
                  <text x="195" y="15" fill="#f472b6" fontSize="8" fontWeight="bold">기화 (100℃ 일정)</text>
                </svg>
              </div>

              {/* Status Explanation Bar */}
              <div className="grid grid-cols-3 gap-2 text-[11px] font-mono text-center">
                <div className="p-1.5 rounded-lg bg-[#141829] border border-cyan-500/30">
                  <div className="text-slate-400">융해 (고→액)</div>
                  <div className="font-bold text-emerald-400">융해열 흡수</div>
                </div>
                <div className="p-1.5 rounded-lg bg-[#141829] border border-fuchsia-500/30">
                  <div className="text-slate-400">기화 (액→기)</div>
                  <div className="font-bold text-fuchsia-400">기화열 흡수</div>
                </div>
                <div className="p-1.5 rounded-lg bg-[#141829] border border-amber-500/30">
                  <div className="text-slate-400">승화 (고→기)</div>
                  <div className="font-bold text-amber-400">승화열 흡수</div>
                </div>
              </div>
            </div>

            {/* Visual 2: 입자 시뮬레이터 (Particle Motion & Distance Canvas) */}
            <div className="skeuo-panel p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-cyan-300 flex items-center gap-1.5 whitespace-nowrap">
                  <Atom className="w-4 h-4 text-cyan-400 animate-spin" style={{ animationDuration: '6s' }} />
                  실시간 입자 운동 & 입자 사이 거리 모형
                </span>
                <span className="text-[10px] font-mono text-slate-400 whitespace-nowrap">
                  열에너지 흡수 시 운동 활발!
                </span>
              </div>

              {/* HTML5 Canvas */}
              <div className="w-full h-44 bg-[#070913] rounded-xl border border-slate-800 relative overflow-hidden flex items-center justify-center">
                <canvas ref={canvasRef} width={280} height={170} className="w-full h-full" />
              </div>

              {/* Particle Indicators */}
              <div className="grid grid-cols-3 gap-2 text-[11px] font-mono text-center">
                <div className="p-1.5 rounded-lg bg-[#141829] border border-slate-800">
                  <div className="text-slate-400">입자 배열</div>
                  <div className="font-bold text-cyan-300">
                    {currentMission?.particleState === 'solid' ? '매우 규칙적' : currentMission?.particleState === 'gas' ? '매우 불규칙' : '비교적 불규칙'}
                  </div>
                </div>
                <div className="p-1.5 rounded-lg bg-[#141829] border border-slate-800">
                  <div className="text-slate-400">입자 운동</div>
                  <div className="font-bold text-cyan-300">
                    {currentMission?.particleState === 'solid' ? '제자리 진동' : currentMission?.particleState === 'gas' ? '매우 활발' : '비교적 자유로움'}
                  </div>
                </div>
                <div className="p-1.5 rounded-lg bg-[#141829] border border-slate-800">
                  <div className="text-slate-400">입자 간 거리</div>
                  <div className="font-bold text-cyan-300">
                    {currentMission?.particleState === 'solid' ? '매우 가까움' : currentMission?.particleState === 'gas' ? '매우 멂' : '비교적 가까움'}
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Interactive Challenge Section */}
          {!labCompleted ? (
            <div className="skeuo-panel p-6 sm:p-8 space-y-6">
              
              {/* Mission Header */}
              <div className="flex items-center justify-between border-b border-[#252e46] pb-4">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-md bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs font-mono font-bold whitespace-nowrap">
                    {currentMission.conceptType}
                  </span>
                  <span className="text-sm sm:text-base font-bold text-white light:text-slate-900">
                    {currentMission.title}
                  </span>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-xs font-mono text-amber-400 font-bold whitespace-nowrap">
                    {labStreak}연타 COMBO 🔥
                  </div>
                  <div className="text-xs font-mono text-cyan-300 font-black px-2.5 py-1 rounded-lg bg-[#141828] border border-cyan-500/40 whitespace-nowrap">
                    {labScore} P
                  </div>
                </div>
              </div>

              {/* Scenario Box */}
              <div className="p-4 rounded-xl bg-[#0f1322] border border-[#232b40] flex items-start gap-3">
                <Info className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="text-xs font-mono text-cyan-400 font-bold">실생활 탐구 상황</div>
                  <p className="text-sm text-slate-200 light:text-slate-800 leading-relaxed">
                    {currentMission.situation}
                  </p>
                </div>
              </div>

              {/* Question */}
              <h3 className="text-base sm:text-lg font-bold text-white light:text-slate-900 leading-snug">
                {currentMission.question}
              </h3>

              {/* Options */}
              <div className="space-y-3">
                {currentMission.options.map((opt, idx) => {
                  let btnStyle = 'skeuo-btn p-4 text-left font-medium text-sm text-slate-200 light:text-slate-800';
                  if (isAnswered) {
                    if (idx === currentMission.answer) {
                      btnStyle = 'p-4 rounded-xl text-left font-bold bg-emerald-500/20 border-2 border-emerald-400 text-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.4)]';
                    } else if (idx === selectedOpt) {
                      btnStyle = 'p-4 rounded-xl text-left font-bold bg-rose-500/20 border-2 border-rose-500 text-rose-300 shadow-[0_0_20px_rgba(244,63,94,0.4)]';
                    } else {
                      btnStyle = 'p-4 rounded-xl text-left text-slate-500 opacity-50 bg-[#121624] border border-slate-800';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      disabled={isAnswered}
                      onClick={() => handleAnswerLab(idx)}
                      className={`w-full flex items-center justify-between gap-3 ${btnStyle}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-lg bg-[#141829] border border-slate-700 flex items-center justify-center font-mono text-xs font-bold text-cyan-400 shrink-0">
                          {idx + 1}
                        </span>
                        <span>{opt}</span>
                      </div>
                      {isAnswered && idx === currentMission.answer && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Feedback Explanation */}
              {isAnswered && (
                <div className="p-4 rounded-xl bg-[#14192b] border border-[#2d3652] space-y-2 animate-fadeIn">
                  <div className="flex items-center gap-2 font-bold text-sm">
                    {selectedOpt === currentMission.answer ? (
                      <span className="text-emerald-400 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" /> 정답입니다! 열에너지 흡수 원리 마스터 (+{250 + labStreak * 50}P)
                      </span>
                    ) : (
                      <span className="text-rose-400 flex items-center gap-1.5">
                        <AlertCircle className="w-4 h-4" /> 오답입니다. 개념을 다시 확인해 보세요!
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-300 font-mono leading-relaxed light:text-slate-600">
                    💡 핵심 과학 개념: {currentMission.explanation}
                  </p>
                </div>
              )}

              {/* Next Button */}
              {isAnswered && (
                <div className="flex justify-end pt-2">
                  <button
                    onClick={handleNextLab}
                    className="skeuo-btn px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-neon-cyan hover:scale-105 whitespace-nowrap"
                  >
                    <span>{labIndex + 1 < THERMAL_LAB_QUESTIONS.length ? '다음 미션 풀기' : '미니게임 완료'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}

            </div>
          ) : (
            /* Lab Completion & Leaderboard Registration */
            <div className="skeuo-panel p-8 text-center space-y-6">
              <div className="inline-flex p-4 rounded-full bg-cyan-500/10 border-2 border-cyan-400 text-cyan-400 shadow-neon-cyan">
                <Trophy className="w-12 h-12" />
              </div>
              <div className="space-y-1">
                <h3 className="text-2xl font-black text-white light:text-slate-900">
                  열에너지 & 상태 변화 랩 마스터 완료! 🎉
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 font-mono">
                  중1 과학 열에너지 흡수 상태 변화(융해, 기화, 승화) 전 과정을 성공적으로 정복했습니다.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#14192b] border border-cyan-500/40 max-w-xs mx-auto">
                <span className="text-xs text-slate-400 font-mono">최종 획득 점수</span>
                <div className="text-3xl font-black text-cyan-300 font-mono">{labScore.toLocaleString()} P</div>
              </div>

              {!hasSubmitted ? (
                <div className="max-w-md mx-auto p-4 rounded-xl bg-[#161c30] border border-slate-700 space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="닉네임 입력 (명예의 전당 등록)"
                      value={nickname}
                      onChange={(e) => setNickname(e.target.value)}
                      className="flex-1 px-4 py-2 rounded-xl bg-[#0e1220] border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                      maxLength={15}
                    />
                    <button
                      disabled={!nickname.trim() || isSubmitting}
                      onClick={() => submitScore(labScore)}
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
                  <span>명예의 전당에 성공적으로 등록되었습니다!</span>
                </div>
              )}

              <button
                onClick={restartLab}
                className="skeuo-btn px-6 py-3 rounded-xl bg-[#1f253b] text-slate-200 font-bold text-sm flex items-center gap-2 mx-auto hover:text-white whitespace-nowrap"
              >
                <RotateCcw className="w-4 h-4" />
                <span>처음부터 다시 도전</span>
              </button>
            </div>
          )}

        </div>
      )}

      {/* ======================================================== */}
      {/* ⚡ MODE 2: SPEED QUIZ MINI GAME */}
      {/* ======================================================== */}
      {mode === 'speed' && (
        <div className="skeuo-panel p-6 sm:p-8 text-center space-y-6">
          <div className="py-8 space-y-4">
            <h3 className="text-xl sm:text-2xl font-bold text-white light:text-slate-900">
              30초 스피드 과학 미니게임
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              제한시간 30초 동안 중등 과학 상식을 빠르게 맞추어 연타 점수를 획득하세요.
            </p>
            <button
              onClick={() => {
                setSpeedActive(true);
                setSpeedTimeLeft(30);
                setSpeedScore(0);
              }}
              className="skeuo-btn px-8 py-3.5 rounded-xl bg-gradient-to-r from-fuchsia-500 to-cyan-500 text-white font-black text-sm flex items-center gap-2 mx-auto shadow-neon-magenta hover:scale-105 whitespace-nowrap"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>스피드 퀴즈 시작</span>
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 🎯 MODE 3: REFLEX TEST */}
      {mode === 'reflex' && (
        <div className="skeuo-panel p-6 sm:p-8 text-center space-y-6">
          <div className="py-8 space-y-4">
            <h3 className="text-xl sm:text-2xl font-bold text-white light:text-slate-900">
              신경 반사속도 측정 미니게임
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              초록색 신호가 켜지는 순간 클릭하여 반응속도(ms)를 측정합니다.
            </p>
            <button
              onClick={() => {
                setReflexState('waiting');
                const timeout = setTimeout(() => {
                  setReflexState('ready');
                  setStartTime(Date.now());
                }, 2000);
                setTimerId(timeout);
              }}
              className="skeuo-btn px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-black text-sm flex items-center gap-2 mx-auto shadow-lg hover:scale-105 whitespace-nowrap"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>반응속도 테스트 시작</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
