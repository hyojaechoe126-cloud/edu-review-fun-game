'use client';

import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Flame, Clock, Award, CheckCircle2, XCircle, ArrowRight, RotateCcw, Send, Sparkles, Atom, FlaskConical, Dna, Globe2, Lightbulb } from 'lucide-react';

interface Question {
  question: string;
  options: string[];
  answer: number;
  explanation: string;
  category: string;
}

const SCIENCE_QUIZ_DATA: Record<string, Question[]> = {
  '물리': [
    {
      category: '물리',
      question: '진공 상태에서 질량이 다른 쇠구슬과 깃털을 동시에 떨어뜨리면 어떻게 될까요?',
      options: [
        '동시에 바닥에 떨어진다',
        '쇠구슬이 먼저 떨어진다',
        '깃털이 먼저 떨어진다',
        '질량 차이에 비례하여 시간 차이가 난다',
      ],
      answer: 0,
      explanation: '진공에서는 공기 저항이 없으므로 중력 가속도(g ≈ 9.8m/s²)가 질량과 무관하게 동일하게 작용하여 동시에 떨어집니다 (갈릴레이의 낙하 법칙).',
    },
    {
      category: '물리',
      question: '뉴턴의 운동 제3법칙인 \'작용·반작용의 법칙\'의 올바른 예시는?',
      options: [
        '로켓이 가스를 분사하며 앞으로 나아간다',
        '차가 급정거할 때 몸이 앞으로 쏠린다',
        '힘을 세게 줄수록 가속도가 커진다',
        '높은 곳에서 떨어진 공이 속도가 점점 빨라진다',
      ],
      answer: 0,
      explanation: '로켓이 가스를 뒤로 밀어내는 힘(작용)에 의해, 가스가 로켓을 앞으로 밀어내는 힘(반작용)을 받아 전진합니다. 급정거 시 쏠림은 관성의 법칙(제1법칙)입니다.',
    },
    {
      category: '물리',
      question: '빛의 성질 중 물속에 든 젓가락이 꺾여 보이는 현상의 원인은?',
      options: ['빛의 굴절', '빛의 반사', '빛의 회절', '빛의 간섭'],
      answer: 0,
      explanation: '빛이 공기에서 물로 진행할 때 두 매질의 밀도 차이로 인해 진행 속도가 달라지면서 경로가 꺾이는 굴절(Refraction) 현상 때문입니다.',
    },
    {
      category: '물리',
      question: '아인슈타인의 특수 상대성 이론을 나타내는 유명한 질량-에너지 등가 공식은?',
      options: ['E = mc²', 'F = ma', 'P = IV', 'v = fλ'],
      answer: 0,
      explanation: 'E = mc²은 질량(m)이 에너지(E)로 변환될 수 있음을 증명한 공식으로, 원자력 발전과 태양 핵융합 에너지의 기본 원리입니다.',
    },
  ],
  '화학': [
    {
      category: '화학',
      question: '주기율표에서 원자번호 1번과 원자번호 8번에 해당하는 원소 기호는?',
      options: ['H, O', 'He, N', 'H, C', 'Li, F'],
      answer: 0,
      explanation: '원자번호 1번은 수소(H, Hydrogen)이고, 8번은 산소(O, Oxygen)입니다. 둘이 결합하면 물(H₂O)이 됩니다.',
    },
    {
      category: '화학',
      question: '순수한 물(25℃ 기준)의 pH 값과 액성으로 올바른 것은?',
      options: ['pH 7, 중성', 'pH 1, 강산성', 'pH 14, 강염기성', 'pH 4, 약산성'],
      answer: 0,
      explanation: '순수한 물은 수소 이온 농도와 수산화 이온 농도가 같아 pH 7인 중성을 띱니다.',
    },
    {
      category: '화학',
      question: '원자들이 옥텟 규칙(가장 바깥 전자 8개)을 만족하기 위해 전자를 서로 공유하는 화학 결합은?',
      options: ['공유 결합', '이온 결합', '금속 결합', '수소 결합'],
      answer: 0,
      explanation: '비금속 원소들이 전자를 서로 주고받지 않고 쌍을 이루어 공유함으로써 안정해지는 결합을 공유 결합(Covalent bond)이라고 합니다.',
    },
    {
      category: '화학',
      question: '다음 중 기체가 액체로 상태가 변할 때를 가리키는 용어는?',
      options: ['액화 (Liquefaction)', '기화 (Vaporization)', '응고 (Solidification)', '승화 (Sublimation)'],
      answer: 0,
      explanation: '기체가 액체로 변하는 현상은 액화(예: 새벽에 맺히는 이슬)이며, 열에너지를 방출합니다.',
    },
  ],
  '생명과학': [
    {
      category: '생명과학',
      question: '식물 세포에는 존재하지만 동물 세포에는 존재하지 않는 세포 소기관은?',
      options: ['엽록체와 세포벽', '미토콘드리아와 핵', '리보솜과 골지체', '세포막과 세포질'],
      answer: 0,
      explanation: '광합성을 담당하는 엽록체와 형태를 유지해 주는 세포벽은 식물 세포에만 있는 대표적 구조입니다.',
    },
    {
      category: '생명과학',
      question: '생명체의 유전 정보를 저장하는 이중 나선 구조의 핵산 분자는?',
      options: ['DNA (디옥시리보핵산)', 'RNA (리보핵산)', 'ATP (아데노신삼인산)', '헤모글로빈'],
      answer: 0,
      explanation: 'DNA는 왓슨과 크릭이 밝혀낸 이중 나선 구조를 이루며, 부모로부터 자손에게 전달되는 유전 암호를 저장합니다.',
    },
    {
      category: '생명과학',
      question: '인간의 혈액 순환에서 온몸으로 산소가 풍부한 동맥혈을 뿜어내는 심장 부위는?',
      options: ['좌심실', '우심실', '좌심방', '우심방'],
      answer: 0,
      explanation: '좌심실은 가장 두꺼운 근육벽을 가지고 대동맥을 통해 온몸으로 혈액을 강력하게 뿜어냅니다.',
    },
    {
      category: '생명과학',
      question: '생태계에서 유기물을 무기물로 분해하여 물질 순환을 돕는 생물군은?',
      options: ['분해자 (세균, 곰팡이)', '생산자 (녹색식물)', '1차 소비자 (초식동물)', '최종 포식자'],
      answer: 0,
      explanation: '세균과 버섯, 곰팡이 등 분해자는 생물의 사체와 배설물을 분해하여 자연계의 물질 순환을 완성합니다.',
    },
  ],
  '지구과학': [
    {
      category: '지구과학',
      question: '태양계 행성 중 태양에서 가장 가까운 행성과 가장 큰 행성의 짝은?',
      options: ['수성 - 목성', '금성 - 토성', '지구 - 목성', '수성 - 해왕성'],
      answer: 0,
      explanation: '태양에서 가장 가까운 행성은 수성(Mercury)이고, 태양계에서 가장 부피와 질량이 큰 행성은 목성(Jupiter)입니다.',
    },
    {
      category: '지구과학',
      question: '지구 대기권 중 오존층이 위치하여 자외선을 흡수해 온도가 상승하는 층은?',
      options: ['성층권', '대류권', '중간권', '열권'],
      answer: 0,
      explanation: '성층권(약 10~50km)에는 오존층이 존재하여 해로운 태양 자외선을 흡수하며, 위로 올라갈수록 온도가 높아져 대류가 일어나지 않고 안정합니다.',
    },
    {
      category: '지구과학',
      question: '달이 태양과 지구 사이에 일직선으로 놓여 태양을 완전히 또는 일부 가리는 현상은?',
      options: ['일식 (Solar Eclipse)', '월식 (Lunar Eclipse)', '조석 현상', '밀물과 썰물'],
      answer: 0,
      explanation: '태양 - 달 - 지구 순서로 위치할 때 달의 그림자가 지구에 드리워져 태양이 가려지는 현상이 일식입니다.',
    },
    {
      category: '지구과학',
      question: '암석이 높은 열과 압력을 받아 원래의 성질과 조직이 변화하여 생성된 암석은?',
      options: ['변성암 (편마암 등)', '화성암 (화강암 등)', '퇴적암 (사암 등)', '화산쇄설암'],
      answer: 0,
      explanation: '기존의 화성암이나 퇴적암이 지하 깊은 곳에서 지각변동에 따른 고온·고압을 받아 새롭게 재결정된 암석이 변성암입니다.',
    },
  ],
  '융합과학': [
    {
      category: '융합과학',
      question: '화석 연료를 대체할 미래 청정 에너지원으로, 태양의 에너지 생성 원리와 동일한 반응은?',
      options: ['핵융합 발전 (인공태양)', '원자력 분열 발전', '화력 발전', '석탄 가스화'],
      answer: 0,
      explanation: '가벼운 수소 원자핵들이 고온·고압에서 결합하여 헬륨이 되는 핵융합 반응은 방사성 폐기물이 적고 무한한 미래 청정에너지입니다.',
    },
    {
      category: '융합과학',
      question: '나노 기술(Nanotechnology)에서 1 나노미터(nm)는 몇 미터(m)일까요?',
      options: ['10⁻⁹ m (10억분의 1미터)', '10⁻⁶ m (100만분의 1미터)', '10⁻³ m (1천분의 1미터)', '10⁻¹² m (1조분의 1미터)'],
      answer: 0,
      explanation: '1nm는 10의 -9제곱 미터로 머리카락 굵기의 약 10만 분의 1에 해당하는 극미세 세계입니다.',
    },
  ],
};

const CATEGORY_ICONS: Record<string, any> = {
  '물리': Atom,
  '화학': FlaskConical,
  '생명과학': Dna,
  '지구과학': Globe2,
  '융합과학': Lightbulb,
};

interface QuizBattleProps {
  onScoreSubmitted: () => void;
}

export default function QuizBattle({ onScoreSubmitted }: QuizBattleProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('물리');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [combo, setCombo] = useState<number>(0);
  const [maxCombo, setMaxCombo] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(15);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [nickname, setNickname] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);

  const questions = SCIENCE_QUIZ_DATA[selectedCategory] || SCIENCE_QUIZ_DATA['물리'];
  const currentQ = questions[currentIndex];
  const IconComponent = CATEGORY_ICONS[selectedCategory] || Atom;

  // Timer countdown
  useEffect(() => {
    if (isGameOver || isAnswered) return;

    if (timeLeft <= 0) {
      handleTimeOut();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isGameOver, isAnswered]);

  const handleTimeOut = () => {
    setIsAnswered(true);
    setSelectedOption(-1);
    setCombo(0);
  };

  const handleSelect = (idx: number) => {
    if (isAnswered || isGameOver) return;
    setSelectedOption(idx);
    setIsAnswered(true);

    if (idx === currentQ.answer) {
      const newCombo = combo + 1;
      setCombo(newCombo);
      if (newCombo > maxCombo) setMaxCombo(newCombo);
      
      const speedBonus = timeLeft * 15;
      const comboBonus = newCombo * 60;
      const points = 120 + speedBonus + comboBonus;
      setScore((prev) => prev + points);
    } else {
      setCombo(0);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setTimeLeft(15);
    } else {
      setIsGameOver(true);
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
      });
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setTimeLeft(15);
    setIsGameOver(false);
    setHasSubmitted(false);
  };

  const submitScore = async () => {
    if (!nickname.trim() || isSubmitting) return;
    setIsSubmitting(true);

    try {
      await fetch('/api/rankings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nickname: nickname.trim(),
          score,
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
      
      {/* HUD Header Bar */}
      <div className="skeuo-panel p-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/40 text-cyan-400">
            <IconComponent className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-slate-400">SCIENCE BATTLE ARENA</span>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-cyan-300 light:text-cyan-800">
                {selectedCategory} 사이언스 퀴즈 배틀
              </h2>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-mono">
                {currentIndex + 1} / {questions.length}
              </span>
            </div>
          </div>
        </div>

        {/* Stats Display */}
        <div className="flex items-center gap-4">
          {/* Combo Multiplier */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#1c2236] border border-amber-500/30 text-amber-400 font-mono shadow-sm">
            <Flame className={`w-5 h-5 ${combo > 1 ? 'animate-bounce text-orange-500' : ''}`} />
            <div>
              <div className="text-[10px] text-slate-400 uppercase">COMBO</div>
              <div className="text-sm font-bold">{combo}x</div>
            </div>
          </div>

          {/* Real-time Score */}
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-xl bg-gradient-to-r from-cyan-950 to-blue-950 border border-cyan-500/50 text-cyan-300 font-mono shadow-neon-cyan">
            <div>
              <div className="text-[10px] text-cyan-400 uppercase">SCORE</div>
              <div className="text-lg font-black">{score.toLocaleString()}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      {!isGameOver && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {Object.keys(SCIENCE_QUIZ_DATA).map((cat) => {
            const CatIcon = CATEGORY_ICONS[cat] || Atom;
            return (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  handleRestart();
                }}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all border flex items-center gap-2 ${
                  selectedCategory === cat
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white border-cyan-300 shadow-neon-cyan scale-105'
                    : 'bg-[#151928] text-slate-400 border-[#2a324b] hover:border-slate-500 hover:text-slate-200 light:bg-white light:text-slate-700'
                }`}
              >
                <CatIcon className="w-3.5 h-3.5" />
                <span>{cat}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Quiz Card or Result Screen */}
      {!isGameOver ? (
        <div className="skeuo-panel p-8 relative overflow-hidden">
          {/* Time Countdown Gauge */}
          <div className="w-full bg-slate-800/80 rounded-full h-2.5 mb-6 overflow-hidden border border-slate-700">
            <div
              className={`h-full transition-all duration-1000 ${
                timeLeft <= 5 ? 'bg-rose-500 shadow-neon-magenta animate-pulse' : 'bg-cyan-400 shadow-neon-cyan'
              }`}
              style={{ width: `${(timeLeft / 15) * 100}%` }}
            />
          </div>

          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-mono font-bold text-cyan-400 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" /> SCIENCE QUESTION 0{currentIndex + 1}
            </span>
            <div className="flex items-center gap-1 text-xs font-mono text-slate-400">
              <Clock className="w-4 h-4 text-cyan-400" />
              <span>{timeLeft}초 남음</span>
            </div>
          </div>

          {/* Question Text */}
          <h3 className="text-xl sm:text-2xl font-bold text-white mb-8 leading-snug light:text-slate-900">
            {currentQ.question}
          </h3>

          {/* Options (Skeuomorphic Buttons) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {currentQ.options.map((opt, idx) => {
              let btnClass = 'skeuo-btn p-4 text-left font-semibold text-slate-200 light:text-slate-800';
              if (isAnswered) {
                if (idx === currentQ.answer) {
                  btnClass = 'p-4 rounded-xl text-left font-bold bg-emerald-500/20 border-2 border-emerald-400 text-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.4)]';
                } else if (idx === selectedOption) {
                  btnClass = 'p-4 rounded-xl text-left font-bold bg-rose-500/20 border-2 border-rose-500 text-rose-300 shadow-[0_0_20px_rgba(244,63,94,0.4)]';
                } else {
                  btnClass = 'p-4 rounded-xl text-left text-slate-500 opacity-50 bg-[#121624] border border-slate-800';
                }
              }

              return (
                <button
                  key={idx}
                  disabled={isAnswered}
                  onClick={() => handleSelect(idx)}
                  className={`flex items-center justify-between gap-3 ${btnClass}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-[#141829] border border-slate-700 flex items-center justify-center font-mono text-xs font-bold text-cyan-400 light:bg-slate-200 light:text-slate-800">
                      {idx + 1}
                    </span>
                    <span className="text-sm sm:text-base">{opt}</span>
                  </div>
                  {isAnswered && idx === currentQ.answer && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  )}
                  {isAnswered && idx === selectedOption && idx !== currentQ.answer && (
                    <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Feedback & Scientific Explanation */}
          {isAnswered && (
            <div className="p-4 rounded-xl bg-[#14192b] border border-[#2d3652] mb-6 animate-fadeIn">
              <div className="flex items-center gap-2 mb-1.5 font-bold text-sm">
                {selectedOption === currentQ.answer ? (
                  <span className="text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> 정답입니다! (+보너스 콤보)
                  </span>
                ) : (
                  <span className="text-rose-400 flex items-center gap-1">
                    <XCircle className="w-4 h-4" /> 아쉽네요! 오답입니다.
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-300 font-mono leading-relaxed light:text-slate-600">
                🔬 과학 원리 해설: {currentQ.explanation}
              </p>
            </div>
          )}

          {/* Next Button */}
          {isAnswered && (
            <div className="flex justify-end">
              <button
                onClick={handleNext}
                className="skeuo-btn px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-sm flex items-center gap-2 shadow-neon-cyan hover:scale-105"
              >
                <span>{currentIndex + 1 < questions.length ? '다음 문제' : '결과 확인'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Game Over Result & Leaderboard Submission */
        <div className="skeuo-panel p-8 text-center space-y-6">
          <div className="inline-flex p-4 rounded-full bg-cyan-500/10 border-2 border-cyan-400 text-cyan-400 shadow-neon-cyan">
            <Award className="w-12 h-12" />
          </div>

          <div>
            <h3 className="text-2xl sm:text-3xl font-black text-white mb-2 light:text-slate-900">
              과학 배틀 완료! 🎉
            </h3>
            <p className="text-sm text-slate-400 font-mono">
              모든 문제를 풀었습니다. 당신의 최종 과학 배틀 성적입니다.
            </p>
          </div>

          {/* Score Summary Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-lg mx-auto">
            <div className="p-4 rounded-xl bg-[#14192b] border border-cyan-500/30">
              <div className="text-xs text-slate-400 font-mono">최종 점수</div>
              <div className="text-2xl font-black text-cyan-300">{score.toLocaleString()}</div>
            </div>
            <div className="p-4 rounded-xl bg-[#14192b] border border-amber-500/30">
              <div className="text-xs text-slate-400 font-mono">최대 콤보</div>
              <div className="text-2xl font-black text-amber-400">{maxCombo}x</div>
            </div>
            <div className="col-span-2 sm:col-span-1 p-4 rounded-xl bg-[#14192b] border border-fuchsia-500/30">
              <div className="text-xs text-slate-400 font-mono">과목</div>
              <div className="text-2xl font-black text-fuchsia-300">{selectedCategory}</div>
            </div>
          </div>

          {/* Leaderboard Submission Form */}
          {!hasSubmitted ? (
            <div className="max-w-md mx-auto p-6 rounded-2xl bg-[#161c30] border border-[#2e3756] shadow-inner space-y-4">
              <h4 className="text-sm font-bold text-slate-200">🏆 과학 명예의 전당에 점수 등록하기</h4>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="닉네임을 입력하세요 (예: 아인슈타인)"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-[#0e1220] border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                  maxLength={15}
                />
                <button
                  disabled={!nickname.trim() || isSubmitting}
                  onClick={submitScore}
                  className="skeuo-btn px-4 py-2.5 rounded-xl bg-cyan-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-neon-cyan disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? '등록중...' : '등록'}</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="p-4 max-w-md mx-auto rounded-xl bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 text-sm font-semibold flex items-center justify-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              <span>과학 명예의 전당에 정상적으로 등록되었습니다!</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-center gap-4 pt-4">
            <button
              onClick={handleRestart}
              className="skeuo-btn px-6 py-3 rounded-xl bg-[#1f253b] text-slate-200 font-bold text-sm flex items-center gap-2 hover:text-white"
            >
              <RotateCcw className="w-4 h-4" />
              <span>다시 도전하기</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
