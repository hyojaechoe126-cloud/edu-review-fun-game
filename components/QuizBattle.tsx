'use client';

import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Flame, Clock, Award, CheckCircle2, XCircle, ArrowRight, RotateCcw, Send, Sparkles, BookOpen, GraduationCap, Compass } from 'lucide-react';

interface Question {
  question: string;
  options: string[];
  answer: number;
  explanation: string;
  gradeLabel: string;
}

const MIDDLE_SCHOOL_QUIZ_DATA: Record<string, Question[]> = {
  '과학1': [
    {
      gradeLabel: '중1 과학',
      question: '물질이 열에너지를 \'흡수\'할 때 일어나는 상태 변화 3가지로만 올바르게 짝지어진 것은?',
      options: [
        '융해(고→액), 기화(액→기), 승화(고→기)',
        '응고(액→고), 액화(기→액), 승화(기→고)',
        '융해(고→액), 액화(기→액), 응고(액→고)',
        '기화(액→기), 응고(액→고), 승화(고→기)',
      ],
      answer: 0,
      explanation: '얼음이 녹는 융해, 물이 끓거나 증발하는 기화, 드라이아이스가 기체로 변하는 승화(고체→기체)는 모두 주변에서 열에너지를 흡수하는 상태 변화입니다.',
    },
    {
      gradeLabel: '중1 과학',
      question: '얼음의 가열 곡선(시간에 따른 온도 변화 그래프)에서 융해(0℃)와 기화(100℃) 동안 온도가 일정하게 유지되는 이유는?',
      options: [
        '흡수한 열에너지가 입자 사이의 인력을 끊고 배열을 바꾸는 데 쓰이기 때문에',
        '가열 장치의 열에너지가 공기 중으로 모두 손실되기 때문에',
        '얼음과 물의 분자 개수가 계속 감소하기 때문에',
        '상태 변화 중에는 열에너지를 전혀 흡수하지 않기 때문에',
      ],
      answer: 0,
      explanation: '상태 변화가 일어나는 동안 가해준 열에너지는 온도를 올리는 대신 입자 사이의 결합(인력)을 끊어 상태를 바꾸는 데 모두 사용되므로 온도가 일정하게 유지됩니다.',
    },
    {
      gradeLabel: '중1 과학',
      question: '얼음(고체)이 물(액체)을 거쳐 수증기(기체)로 변할 때, 입자 운동과 입자 사이 거리는 어떻게 변할까요?',
      options: [
        '입자 운동은 점점 활발해지고, 입자 사이 거리는 점점 멀어진다.',
        '입자 운동은 점점 둔해지고, 입자 사이 거리는 점점 가까워진다.',
        '입자 운동은 활발해지지만, 입자 사이 거리는 일정하다.',
        '입자 운동과 거리는 변하지 않고, 입자 자체의 크기만 커진다.',
      ],
      answer: 0,
      explanation: '열에너지를 흡수하면 입자가 에너지를 얻어 운동이 둔함(제자리 진동)에서 활발함(매우 자유로운 운동)으로 변하고, 입자 사이 거리가 멀어집니다.',
    },
    {
      gradeLabel: '중1 과학',
      question: '여름철 마당에 물을 뿌리거나, 주사를 맞기 전 피부에 알코올을 바르면 시원해지는 과학적 원리는?',
      options: [
        '물이 기화하면서 주변으로부터 열에너지를 흡수하기 때문에',
        '물이 융해하면서 피부에 열에너지를 방출하기 때문에',
        '알코올이 피부로 응고되면서 차가워지기 때문에',
        '알코올이 공기 중의 수증기와 만나 액화하기 때문에',
      ],
      answer: 0,
      explanation: '액체가 기체로 기화할 때 주변에서 기화열(열에너지)을 흡수하므로 주위의 온도가 낮아지는 냉각 효과가 발생합니다.',
    },
    {
      gradeLabel: '중1 과학',
      question: '지구 내부 구조(지각, 맨틀, 외핵, 내핵) 중 전체 부피의 약 80%를 차지하는 가장 두꺼운 층은?',
      options: ['맨틀 (Mantle)', '지각 (Crust)', '외핵 (Outer Core)', '내핵 (Inner Core)'],
      answer: 0,
      explanation: '맨틀은 지각 아래부터 지하 약 2,900km 깊이까지 위치하며, 지구 전체 부피의 약 80% 이상을 차지하는 가장 거대한 층입니다.',
    },
  ],
  '과학2': [
    {
      gradeLabel: '중2 과학',
      question: '전기 회로에서 전압(V), 전류(I), 저항(R)의 상호 관계를 나타낸 옴의 법칙 공식은?',
      options: ['V = I × R (전압 = 전류 × 저항)', 'I = V × R', 'R = V × I', 'V = I / R'],
      answer: 0,
      explanation: '옴의 법칙(Ohm\'s Law)은 전압(V) = 전류(I) × 저항(R)로 표현되며, 전류는 전압에 비례하고 저항에 반비례합니다.',
    },
    {
      gradeLabel: '중2 과학',
      question: '식물의 잎 속 엽록체에서 빛에너지, 물, 이산화탄소를 이용해 포도당과 산소를 만드는 작용은?',
      options: ['광합성 (Photosynthesis)', '호흡 작용', '증산 작용', '소화 작용'],
      answer: 0,
      explanation: '광합성은 식물이 태양의 빛에너지를 화학 에너지(포도당)로 전환하고 산소를 배출하는 가장 핵심적인 생명 활동입니다.',
    },
    {
      gradeLabel: '중2 과학',
      question: '스스로 빛을 내지 못하고 행성(예: 지구)의 주위를 공전하는 천체를 무엇이라고 할까요?',
      options: ['위성 (Satellite, 예: 달)', '소행성 (Asteroid)', '혜성 (Comet)', '항성 (Star, 예: 태양)'],
      answer: 0,
      explanation: '스스로 빛을 내는 천체는 항성(태양), 항성 주위를 도는 천체는 행성(지구), 행성 주위를 도는 천체는 위성(달)입니다.',
    },
    {
      gradeLabel: '중2 과학',
      question: '음식물 속 3대 영양소 중 입 속 침의 소화 효소(아밀레이스)에 의해 가장 먼저 소화되는 것은?',
      options: ['탄수화물 (녹말)', '단백질 (고기)', '지방 (기름)', '무기염류'],
      answer: 0,
      explanation: '침 속의 아밀레이스는 밥이나 빵에 들어 있는 녹말(탄수화물)을 엿당으로 분해하여 단맛을 느끼게 합니다.',
    },
    {
      gradeLabel: '중2 과학',
      question: '더 이상 다른 물질로 분해되지 않으며 물질을 이루는 기본 성분을 무엇이라고 할까요?',
      options: ['원소 (Element)', '화합물', '혼합물', '분자'],
      answer: 0,
      explanation: '원소(Element)는 수소(H), 산소(O), 탄소(C)처럼 더 이상 다른 순물질로 분해되지 않는 물질의 기본 성분입니다.',
    },
  ],
  '과학3': [
    {
      gradeLabel: '중3 과학',
      question: '화학 반응이 일어날 때, 반응 전 물질들의 총질량과 반응 후 생성 물질들의 총질량이 같은 법칙은?',
      options: ['질량 보존 법칙 (라부아지에)', '일정 성분비 법칙', '기체 반응 법칙', '배수 비례 법칙'],
      answer: 0,
      explanation: '라부아지에가 발견한 질량 보존 법칙은 화학 반응 전후에 원자의 종류와 개수가 변하지 않기 때문에 총질량이 항상 보존됨을 뜻합니다.',
    },
    {
      gradeLabel: '중3 과학',
      question: '롤러코스터가 높은 곳에서 아래로 하강할 때, 에너지의 전환 과정으로 올바른 것은?',
      options: [
        '위치 에너지가 운동 에너지로 전환된다',
        '운동 에너지가 위치 에너지로 전환된다',
        '전기 에너지가 화학 에너지로 전환된다',
        '열에너지가 원자력 에너지로 전환된다',
      ],
      answer: 0,
      explanation: '공기 저항을 무시할 때, 하강하면서 높이가 낮아져 위치 에너지가 감소한 만큼 속력이 빨라지며 운동 에너지로 전환됩니다 (역학적 에너지 보존).',
    },
    {
      gradeLabel: '중3 과학',
      question: '상승하는 공기 덩어리가 주변 기압이 낮아져 부피가 팽창하고 온도가 낮아지는 현상은?',
      options: ['단열 팽창 (Adiabatic expansion)', '단열 압축', '복사 냉각', '대류 순환'],
      answer: 0,
      explanation: '공기가 상승하면 외부와 열교환 없이 부피가 팽창(단열 팽창)하면서 온도가 낮아지고, 이슬점에 도달해 수증기가 응결하여 구름이 형성됩니다.',
    },
    {
      gradeLabel: '중3 과학',
      question: '멘델의 유전 연구에서, 순종의 대립 형질을 교배했을 때 잡종 1대에서 한 가지 형질만 나타나는 원리는?',
      options: ['우열의 원리 (우성과 열성)', '분리의 법칙', '독립의 법칙', '돌연변이의 원리'],
      answer: 0,
      explanation: '우성 유전자와 열성 유전자가 함께 있을 때 우성 형질만 겉으로 드러나는 것을 우열의 원리라고 합니다 (예: 둥근 완두와 주름진 완두 교배 시 둥근 완두 발현).',
    },
    {
      gradeLabel: '중3 과학',
      question: '지구가 태양 주위를 공전하기 때문에 6개월 간격으로 별을 관측할 때 나타나는 시차의 절반은?',
      options: ['연주 시차 (Parallax)', '일주 시차', '광행차', '적색 편이'],
      answer: 0,
      explanation: '연주 시차(Annual parallax)는 가까운 별의 거리를 측정하는 대표적 방법으로, 별까지의 거리는 연주 시차에 반비례합니다.',
    },
  ],
};

interface QuizBattleProps {
  onScoreSubmitted: () => void;
}

export default function QuizBattle({ onScoreSubmitted }: QuizBattleProps) {
  const [selectedGrade, setSelectedGrade] = useState<string>('과학1');
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

  const questions = MIDDLE_SCHOOL_QUIZ_DATA[selectedGrade] || MIDDLE_SCHOOL_QUIZ_DATA['과학1'];
  const currentQ = questions[currentIndex];

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
      const points = 150 + speedBonus + comboBonus;
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
      
      {/* HUD Header Bar (Single-line clean flex) */}
      <div className="skeuo-panel p-5 sm:p-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/40 text-cyan-400 shrink-0">
            <BookOpen className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <span className="text-[11px] font-mono uppercase tracking-widest text-slate-400 whitespace-nowrap">
              MIDDLE SCHOOL SCIENCE ARENA
            </span>
            <div className="flex items-center gap-2 whitespace-nowrap">
              <h2 className="text-lg sm:text-xl font-black text-cyan-300 light:text-cyan-800">
                {selectedGrade} 퀴즈 배틀
              </h2>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-mono">
                {currentIndex + 1} / {questions.length}
              </span>
            </div>
          </div>
        </div>

        {/* Stats Display (Single Line) */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Combo Multiplier */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1c2236] border border-amber-500/30 text-amber-400 font-mono shadow-sm whitespace-nowrap">
            <Flame className={`w-4 h-4 ${combo > 1 ? 'animate-bounce text-orange-500' : ''}`} />
            <span className="text-xs font-bold">{combo}x COMBO</span>
          </div>

          {/* Real-time Score */}
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-950 to-blue-950 border border-cyan-500/50 text-cyan-300 font-mono shadow-neon-cyan whitespace-nowrap">
            <span className="text-[10px] text-cyan-400">SCORE</span>
            <span className="text-base sm:text-lg font-black">{score.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Grade Selector Tabs: 과학1, 과학2, 과학3 (Single Line) */}
      {!isGameOver && (
        <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
          {[
            { id: '과학1', title: '과학1 (중1 과정)', desc: '지권의 변화, 기체의 성질, 빛과 파동, 상태변화' },
            { id: '과학2', title: '과학2 (중2 과정)', desc: '원소와 물질, 옴의 법칙, 식물광합성, 소화순환' },
            { id: '과학3', title: '과학3 (중3 과정)', desc: '화학반응 질량보존, 구름날씨, 역학적에너지, 멘델유전' },
          ].map((grade) => (
            <button
              key={grade.id}
              onClick={() => {
                setSelectedGrade(grade.id);
                handleRestart();
              }}
              className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all border flex items-center justify-center gap-2 ${
                selectedGrade === grade.id
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white border-cyan-300 shadow-neon-cyan scale-[1.02]'
                  : 'bg-[#151928] text-slate-400 border-[#2a324b] hover:text-white hover:border-slate-500 light:bg-white light:text-slate-700'
              }`}
            >
              <GraduationCap className="w-4 h-4 shrink-0" />
              <span>{grade.title}</span>
            </button>
          ))}
        </div>
      )}

      {/* Quiz Card or Result Screen */}
      {!isGameOver ? (
        <div className="skeuo-panel p-6 sm:p-8 relative overflow-hidden">
          {/* Time Countdown Gauge */}
          <div className="w-full bg-slate-800/80 rounded-full h-2 mb-6 overflow-hidden border border-slate-700">
            <div
              className={`h-full transition-all duration-1000 ${
                timeLeft <= 5 ? 'bg-rose-500 shadow-neon-magenta animate-pulse' : 'bg-cyan-400 shadow-neon-cyan'
              }`}
              style={{ width: `${(timeLeft / 15) * 100}%` }}
            />
          </div>

          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-mono font-bold text-cyan-400 flex items-center gap-1.5 whitespace-nowrap">
              <Sparkles className="w-4 h-4" /> {selectedGrade} QUESTION 0{currentIndex + 1}
            </span>
            <div className="flex items-center gap-1 text-xs font-mono text-slate-400 whitespace-nowrap">
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
                    <span className="w-7 h-7 rounded-lg bg-[#141829] border border-slate-700 flex items-center justify-center font-mono text-xs font-bold text-cyan-400 light:bg-slate-200 light:text-slate-800 shrink-0">
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

          {/* Feedback & Explanation */}
          {isAnswered && (
            <div className="p-4 rounded-xl bg-[#14192b] border border-[#2d3652] mb-6 animate-fadeIn">
              <div className="flex items-center gap-2 mb-1.5 font-bold text-sm">
                {selectedOption === currentQ.answer ? (
                  <span className="text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> 정답입니다! (+콤보 보너스)
                  </span>
                ) : (
                  <span className="text-rose-400 flex items-center gap-1">
                    <XCircle className="w-4 h-4" /> 아쉽네요! 오답입니다.
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-300 font-mono leading-relaxed light:text-slate-600">
                💡 중학 과학 개념 해설: {currentQ.explanation}
              </p>
            </div>
          )}

          {/* Next Button */}
          {isAnswered && (
            <div className="flex justify-end">
              <button
                onClick={handleNext}
                className="skeuo-btn px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-sm flex items-center gap-2 shadow-neon-cyan hover:scale-105 whitespace-nowrap"
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
              {selectedGrade} 퀴즈 완료! 🎉
            </h3>
            <p className="text-sm text-slate-400 font-mono">
              모든 문제를 풀었습니다. 당신의 최종 성적표입니다.
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
              <div className="text-2xl font-black text-fuchsia-300">{selectedGrade}</div>
            </div>
          </div>

          {/* Leaderboard Submission Form */}
          {!hasSubmitted ? (
            <div className="max-w-md mx-auto p-6 rounded-2xl bg-[#161c30] border border-[#2e3756] shadow-inner space-y-4">
              <h4 className="text-sm font-bold text-slate-200">🏆 명예의 전당에 점수 등록하기</h4>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="닉네임을 입력하세요 (예: 중등과학왕)"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-[#0e1220] border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  maxLength={15}
                />
                <button
                  disabled={!nickname.trim() || isSubmitting}
                  onClick={submitScore}
                  className="skeuo-btn px-4 py-2.5 rounded-xl bg-cyan-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-neon-cyan disabled:opacity-50 whitespace-nowrap"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? '등록중...' : '등록'}</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="p-4 max-w-md mx-auto rounded-xl bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 text-sm font-semibold flex items-center justify-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              <span>명예의 전당에 성공적으로 등록되었습니다!</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-center gap-4 pt-4">
            <button
              onClick={handleRestart}
              className="skeuo-btn px-6 py-3 rounded-xl bg-[#1f253b] text-slate-200 font-bold text-sm flex items-center gap-2 hover:text-white whitespace-nowrap"
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
