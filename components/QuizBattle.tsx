'use client';

import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Flame, Clock, Award, CheckCircle2, XCircle, ArrowRight, RotateCcw, Send, Sparkles } from 'lucide-react';

interface Question {
  question: string;
  options: string[];
  answer: number;
  explanation: string;
  category: string;
}

const QUIZ_DATA: Record<string, Question[]> = {
  '수학': [
    {
      category: '수학',
      question: '이차방정식 x² - 5x + 6 = 0 의 두 근의 합은 무엇일까요?',
      options: ['5', '-5', '6', '1'],
      answer: 0,
      explanation: '근과 계수의 관계에 의해 두 근의 합은 -(-5)/1 = 5 입니다.',
    },
    {
      category: '수학',
      question: '피타고라스 정리를 만족하는 세 자연수의 비로 올바른 것은?',
      options: ['3 : 4 : 5', '2 : 3 : 4', '4 : 5 : 6', '5 : 11 : 13'],
      answer: 0,
      explanation: '3² + 4² = 9 + 16 = 25 = 5² 로 피타고라스 정리를 성립합니다.',
    },
    {
      category: '수학',
      question: '미분 공식: 함수 f(x) = 3x² + 4x + 1 의 도함수 f\'(x)는?',
      options: ['6x + 4', '3x + 4', '6x² + 4', '6x + 1'],
      answer: 0,
      explanation: 'f\'(x) = 3*(2x) + 4*(1) + 0 = 6x + 4 입니다.',
    },
    {
      category: '수학',
      question: '서로 다른 4개 중 2개를 순서 없이 고르는 조합의 수 ₄C₂는?',
      options: ['6', '12', '8', '24'],
      answer: 0,
      explanation: '₄C₂ = (4 × 3) / (2 × 1) = 6 입니다.',
    },
  ],
  '과학': [
    {
      category: '과학',
      question: '주기율표에서 원자번호 1번인 원소의 기호는 무엇일까요?',
      options: ['H (수소)', 'He (헬륨)', 'O (산소)', 'C (탄소)'],
      answer: 0,
      explanation: '원자번호 1번은 가장 가벼운 원소인 수소(H)입니다.',
    },
    {
      category: '과학',
      question: '뉴턴의 운동 제2법칙을 나타내는 공식은?',
      options: ['F = ma', 'E = mc²', 'v = s/t', 'P = VI'],
      answer: 0,
      explanation: '힘(F)은 질량(m)과 가속도(a)의 곱과 같습니다 (F = ma).',
    },
    {
      category: '과학',
      question: '빛의 삼원색(RGB)에 해당하지 않는 색은?',
      options: ['노랑 (Yellow)', '빨강 (Red)', '초록 (Green)', '파랑 (Blue)'],
      answer: 0,
      explanation: '빛의 3원색은 빨강(R), 초록(G), 파랑(B)이며, 세 색을 모두 합치면 흰색이 됩니다.',
    },
    {
      category: '과학',
      question: '광합성에 필요한 필수 요소가 아닌 것은?',
      options: ['산소 (O₂)', '이산화탄소 (CO₂)', '물 (H₂O)', '빛 에너지'],
      answer: 0,
      explanation: '광합성은 물과 이산화탄소를 이용해 포도당과 산소를 생성하므로 산소는 생성물입니다.',
    },
  ],
  '코딩': [
    {
      category: '코딩',
      question: '파이썬(Python)에서 리스트의 마지막 요소를 제거하고 반환하는 메서드는?',
      options: ['pop()', 'remove()', 'delete()', 'shift()'],
      answer: 0,
      explanation: 'pop() 메서드는 리스트의 마지막 인덱스 요소를 꺼내어 반환합니다.',
    },
    {
      category: '코딩',
      question: '시간 복잡도 O(log N)을 가지는 대표적인 탐색 알고리즘은?',
      options: ['이진 탐색 (Binary Search)', '선형 탐색 (Linear Search)', '버블 정렬 (Bubble Sort)', 'DFS'],
      answer: 0,
      explanation: '정렬된 배열에서 중간값을 기준으로 탐색 범위를 반으로 줄여가는 이진 탐색은 O(log N)입니다.',
    },
    {
      category: '코딩',
      question: '웹 브라우저에서 HTML 문서를 조작하기 위한 인터페이스 규격은?',
      options: ['DOM (Document Object Model)', 'REST API', 'JSON', 'CSSOM'],
      answer: 0,
      explanation: 'DOM은 HTML 문서를 트리 구조 객체로 표현하여 자바스크립트로 제어할 수 있게 합니다.',
    },
    {
      category: '코딩',
      question: 'Git에서 원격 저장소의 최신 커밋을 내려받아 현재 브랜치와 병합하는 명령어는?',
      options: ['git pull', 'git push', 'git commit', 'git status'],
      answer: 0,
      explanation: 'git pull 은 git fetch 와 git merge를 결합하여 원격 브랜치 내용을 로컬에 반영합니다.',
    },
  ],
  '한국사': [
    {
      category: '한국사',
      question: '훈민정음을 창제하여 백성들이 쉽게 글을 익히도록 한 조선의 왕은?',
      options: ['세종대왕', '정조', '태종', '영조'],
      answer: 0,
      explanation: '세종대왕은 집현전 학사들과 함께 1443년 훈민정음을 창제하고 1446년 반포하였습니다.',
    },
    {
      category: '한국사',
      question: '조선 정조 때 축조된 과학적 계획도시이자 유네스코 세계문화유산은?',
      options: ['수원 화성', '남한산성', '북한산성', '해미읍성'],
      answer: 0,
      explanation: '정조의 효심과 개혁정치 의지가 담긴 수원 화성은 정약용의 거중기를 활용해 축조되었습니다.',
    },
  ],
};

interface QuizBattleProps {
  onScoreSubmitted: () => void;
}

export default function QuizBattle({ onScoreSubmitted }: QuizBattleProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('수학');
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

  const questions = QUIZ_DATA[selectedCategory] || QUIZ_DATA['수학'];
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
      
      const speedBonus = timeLeft * 10;
      const comboBonus = newCombo * 50;
      const points = 100 + speedBonus + comboBonus;
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
            <Award className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-slate-400">CURRENT BATTLE</span>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-cyan-300 light:text-cyan-800">
                {selectedCategory} 퀴즈 아레나
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
          {Object.keys(QUIZ_DATA).map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                handleRestart();
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                selectedCategory === cat
                  ? 'bg-cyan-500 text-white border-cyan-300 shadow-neon-cyan scale-105'
                  : 'bg-[#151928] text-slate-400 border-[#2a324b] hover:border-slate-500 hover:text-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
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
              <Sparkles className="w-4 h-4" /> QUESTION 0{currentIndex + 1}
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
                    <XCircle className="w-4 h-4" /> 오답입니다! (콤보 리셋)
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-300 font-mono leading-relaxed light:text-slate-600">
                💡 해설: {currentQ.explanation}
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
              배틀 클리어! 🎉
            </h3>
            <p className="text-sm text-slate-400 font-mono">
              모든 문제를 풀었습니다. 당신의 최종 배틀 성적표입니다.
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
              <h4 className="text-sm font-bold text-slate-200">🏆 명예의 전당 (랭킹)에 등록하기</h4>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="당신의 닉네임을 입력하세요 (예: 퀴즈마스터)"
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
              <span>명예의 전당에 성공적으로 등록되었습니다!</span>
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
