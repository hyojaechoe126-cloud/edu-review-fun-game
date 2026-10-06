'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  RotateCcw, 
  Sparkles, 
  Atom, 
  Copy, 
  Check, 
  HelpCircle, 
  Lightbulb, 
  Flame, 
  Zap, 
  Compass, 
  ChevronRight,
  FlaskConical,
  BookOpen
} from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  grade?: string;
  source?: string;
}

const PRESET_QUESTIONS = [
  {
    grade: '과학1',
    category: '상태 변화 & 열에너지',
    icon: '🧊',
    text: '얼음이 녹는 동안 왜 온도가 계속 0℃에서 안 올라가나요?',
  },
  {
    grade: '과학1',
    category: '승화 & 입자 운동',
    icon: '💨',
    text: '드라이아이스는 왜 액체가 안 되고 곧바로 기체로 변하나요?',
  },
  {
    grade: '과학1',
    category: '기체의 성질',
    icon: '🎈',
    text: '높은 산에 올라가면 과자 봉지가 왜 빵빵하게 부풀어 오르나요?',
  },
  {
    grade: '과학2',
    category: '전기와 자기',
    icon: '⚡',
    text: '전류, 전압, 저항(옴의 법칙 V=IR)의 관계를 쉽게 비유로 설명해줘!',
  },
  {
    grade: '과학2',
    category: '식물과 에너지',
    icon: '🍃',
    text: '식물의 광합성과 세포 호흡은 어떻게 다른가요?',
  },
  {
    grade: '과학2',
    category: '물질의 특성',
    icon: '⚗️',
    text: '물과 기름은 왜 섞이지 않고 기름이 위에 뜨나요? (밀도)',
  },
  {
    grade: '과학3',
    category: '화학 반응의 규칙',
    icon: '🧪',
    text: '나무를 태우면 재만 남는데 왜 질량 보존 법칙이 성립하나요?',
  },
  {
    grade: '과학3',
    category: '운동과 에너지',
    icon: '🎢',
    text: '롤러코스터가 내려갈 때 위치 에너지와 운동 에너지는 어떻게 보존되나요?',
  },
];

export default function ScienceChatbot() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      role: 'assistant',
      content: `👋 안녕! 나는 너의 전담 **AI 과학 튜터 [사이언스 랩 닥터]**야!\n\n중학교 **과학1(중1), 과학2(중2), 과학3(중3)** 교과서 속 어려운 개념이나 시험 문제, 실험 원리를 쉽고 명쾌하게 알려줄게.\n\n✨ **이런 것들을 물어볼 수 있어:**\n- 🧊 얼음이 녹을 때 온도가 0℃로 유지되는 이유 (융해열)\n- 💨 드라이아이스가 바로 기체가 되는 승화 현상과 입자 운동\n- ⚡ 옴의 법칙(V=IR)과 전구 연결 회로 분석\n- 🧪 질량 보존 법칙, 일정 성분비 법칙과 화학 반응식\n- 🎢 롤러코스터와 역학적 에너지 보존\n\n아래의 **추천 질문 카드**를 누르거나, 궁금한 과학 질문을 자유롭게 채팅창에 입력해 봐! 🚀`,
      timestamp: '방금 전',
      source: 'openai-gpt-4o-mini',
    },
  ]);

  const [input, setInput] = useState<string>('');
  const [selectedGrade, setSelectedGrade] = useState<'all' | 'sci1' | 'sci2' | 'sci3'>('all');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (questionText?: string) => {
    const textToSend = (questionText || input).trim();
    if (!textToSend || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!questionText) setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/science-tutor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
          gradeCategory: selectedGrade,
        }),
      });

      const data = await response.json();

      const aiReply: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: data.reply || '답변을 불러오지 못했어요. 잠시 후 다시 질문해 주세요.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: data.source,
      };

      setMessages((prev) => [...prev, aiReply]);
    } catch (err) {
      console.error('Chat error:', err);
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: '네트워크 연결 상태가 불안정해요. 잠시 후 다시 시도해 주세요!',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleResetChat = () => {
    if (confirm('대화 내용을 초기화하고 새로운 과학 탐구를 시작할까요?')) {
      setMessages([
        {
          id: `welcome-${Date.now()}`,
          role: 'assistant',
          content: `새로운 과학 탐구를 시작할 준비 완료! 🔬 중1~중3 과학 교과서 내용 중 무엇이든 편하게 물어보세요!`,
          timestamp: '방금 전',
        },
      ]);
    }
  };

  // Grade badge labels
  const gradeLabels = [
    { id: 'all', label: '전체 교과정', desc: '중1~중3 통합' },
    { id: 'sci1', label: '과학1 (중1)', desc: '상태변화·기체·빛' },
    { id: 'sci2', label: '과학2 (중2)', desc: '전기·물질·생물' },
    { id: 'sci3', label: '과학3 (중3)', desc: '화학반응·역학·우주' },
  ];

  return (
    <div className="space-y-6">
      
      {/* HUD Header Panel */}
      <div className="skeuo-panel p-5 sm:p-6 bg-gradient-to-r from-[#12162a]/95 via-[#181d36]/95 to-[#101428]/95 border-cyan-500/40 shadow-neon-cyan">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          
          <div className="flex items-center gap-3.5">
            <div className="relative flex items-center justify-center w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-400/60 shadow-neon-cyan">
              <Bot className="w-7 h-7 text-cyan-300 animate-pulse" />
              <span className="absolute -bottom-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border border-black"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-300">
                  AI 과학 튜터 [사이언스 랩봇]
                </h2>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono font-bold rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                  GPT-4o-mini
                </span>
              </div>
              <p className="text-xs text-slate-300 font-sans mt-0.5 light:text-slate-600">
                중등 과학(과학1 · 과학2 · 과학3) 개념 질문에 24시간 실시간으로 알기 쉽게 답해주는 전문 AI 멘토입니다.
              </p>
            </div>
          </div>

          {/* Controls: Reset & Grade Selector */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
            <button
              onClick={handleResetChat}
              title="대화 초기화"
              className="skeuo-btn px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1.5 whitespace-nowrap"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
              <span>새 질문</span>
            </button>
          </div>

        </div>

        {/* Grade Filter Pill Tabs */}
        <div className="mt-4 pt-4 border-t border-[#232a42] flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-xs font-mono text-cyan-400 flex items-center gap-1 shrink-0 whitespace-nowrap">
            <Compass className="w-3.5 h-3.5" />
            <span>탐구 영역:</span>
          </span>
          {gradeLabels.map((item) => {
            const isSelected = selectedGrade === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setSelectedGrade(item.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-cyan-500 text-black shadow-neon-cyan font-black'
                    : 'bg-[#181d33] text-slate-300 hover:text-white hover:bg-[#222947] border border-[#2c3555]'
                }`}
              >
                <span>{item.label}</span>
                <span className={`text-[10px] font-normal ${isSelected ? 'text-cyan-950 font-bold' : 'text-slate-400'}`}>
                  ({item.desc})
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Preset Curiosity Questions Carousel */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400 px-1 font-mono">
          <div className="flex items-center gap-1.5 text-cyan-300 font-bold">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>아이들이 가장 많이 묻는 인기 과학 질문 (클릭 시 즉시 답변)</span>
          </div>
          <span className="text-[11px] text-slate-500 hidden sm:inline">원클릭 빠른 탐구</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {PRESET_QUESTIONS.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q.text)}
              disabled={isLoading}
              className="skeuo-btn p-3 rounded-xl text-left bg-[#14182a] border border-[#283250] hover:border-cyan-400/60 transition-all group flex flex-col justify-between hover:scale-[1.02] active:scale-[0.99] disabled:opacity-50"
            >
              <div className="flex items-center justify-between gap-1 mb-1.5">
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                  {q.grade} · {q.category}
                </span>
                <span className="text-sm">{q.icon}</span>
              </div>
              <p className="text-xs text-slate-200 group-hover:text-cyan-200 font-medium line-clamp-2 leading-snug">
                {q.text}
              </p>
              <div className="mt-2 flex items-center text-[10px] text-slate-400 group-hover:text-cyan-300 font-mono">
                <span>답변 알아보기</span>
                <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Log Container */}
      <div className="skeuo-panel p-4 sm:p-6 bg-[#0c0e1a]/95 border-cyan-500/30 min-h-[460px] max-h-[640px] flex flex-col justify-between">
        
        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto space-y-5 pr-1 sm:pr-2 no-scrollbar">
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {/* AI Avatar */}
                {!isUser && (
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500/30 to-blue-600/30 border border-cyan-400/50 flex items-center justify-center text-cyan-300 shrink-0 shadow-sm mt-1">
                    <FlaskConical className="w-4 h-4 text-cyan-400" />
                  </div>
                )}

                {/* Message Body */}
                <div className={`max-w-[88%] sm:max-w-[80%] space-y-1.5 ${isUser ? 'items-end' : 'items-start'}`}>
                  
                  {/* Sender Header */}
                  <div className={`flex items-center gap-2 text-[11px] font-mono ${isUser ? 'justify-end text-purple-300' : 'text-cyan-400'}`}>
                    <span className="font-bold">
                      {isUser ? '🧑‍🔬 학생 탐구원' : '🤖 AI 사이언스 닥터'}
                    </span>
                    <span className="text-slate-500">{msg.timestamp}</span>
                    {msg.source && (
                      <span className="text-[10px] text-cyan-400/70 border border-cyan-500/30 px-1 rounded">
                        {msg.source === 'openai-gpt-4o-mini' ? 'GPT-4o-mini' : '내장 과학 엔진'}
                      </span>
                    )}
                  </div>

                  {/* Bubble Container */}
                  <div
                    className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-wrap break-words ${
                      isUser
                        ? 'bg-gradient-to-r from-purple-600 to-indigo-700 text-white shadow-md rounded-tr-xs'
                        : 'bg-[#15192c] border border-cyan-500/30 text-slate-100 shadow-neon-cyan/20 rounded-tl-xs light:bg-slate-100 light:text-slate-800 light:border-slate-300'
                    }`}
                  >
                    {msg.content}
                  </div>

                  {/* AI Quick Actions (Copy, Quiz) */}
                  {!isUser && (
                    <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-400">
                      <button
                        onClick={() => handleCopy(msg.id, msg.content)}
                        className="flex items-center gap-1 hover:text-cyan-300 transition-colors px-2 py-0.5 rounded bg-[#131728] border border-[#232b47]"
                      >
                        {copiedId === msg.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400">복사 완료!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>내용 복사</span>
                          </>
                        )}
                      </button>

                      <span className="text-slate-600">|</span>

                      <span className="text-slate-500 text-[11px] flex items-center gap-1">
                        <Lightbulb className="w-3 h-3 text-amber-400" />
                        <span>궁금한 점을 꼬리 질문으로 더 물어보세요!</span>
                      </span>
                    </div>
                  )}

                </div>

                {/* User Avatar */}
                {isUser && (
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-500/30 to-indigo-600/30 border border-purple-400/50 flex items-center justify-center text-purple-300 shrink-0 shadow-sm mt-1">
                    <span className="text-xs font-bold">ME</span>
                  </div>
                )}
              </div>
            );
          })}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex gap-3 justify-start animate-fade-in">
              <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center text-cyan-300 shrink-0 shadow-neon-cyan mt-1">
                <Atom className="w-4 h-4 animate-spin text-cyan-400" />
              </div>
              <div className="p-4 rounded-2xl rounded-tl-xs bg-[#15192c] border border-cyan-400/40 text-cyan-300 text-xs sm:text-sm shadow-neon-cyan/20 space-y-2 max-w-sm">
                <div className="flex items-center gap-2 font-mono font-bold text-xs text-cyan-400">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                  </span>
                  <span>AI 과학 멘토가 원리를 분석 중입니다...</span>
                </div>
                <div className="w-full bg-[#0d101e] h-1.5 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-cyan-400 to-indigo-500 h-full rounded-full animate-pulse w-3/4"></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar Area */}
        <div className="mt-4 pt-3 border-t border-[#20273f]">
          <div className="relative flex items-center gap-2">
            
            <div className="relative flex-1">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="과학 개념이나 궁금한 원리를 질문해 보세요! (예: 얼음이 녹을 때 왜 0도예요? / 옴의 법칙 공식 쉽게 알려줘)"
                rows={2}
                disabled={isLoading}
                className="w-full bg-[#121629] text-slate-100 placeholder-slate-400 text-xs sm:text-sm rounded-xl px-3.5 py-2.5 border border-[#2b3554] focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 resize-none transition-all light:bg-white light:text-slate-800 light:border-slate-300"
              />
              <div className="absolute right-2.5 bottom-2.5 text-[10px] font-mono text-slate-500 hidden sm:block">
                Shift+Enter 줄바꿈 · Enter 전송
              </div>
            </div>

            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || isLoading}
              className="skeuo-btn h-12 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold flex items-center justify-center gap-1.5 shadow-neon-cyan disabled:opacity-40 disabled:cursor-not-allowed hover:scale-[1.03] active:scale-[0.98] transition-all shrink-0"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline text-xs font-bold">질문하기</span>
            </button>

          </div>
          
          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 font-mono">
            <span className="flex items-center gap-1 text-cyan-400/80">
              <BookOpen className="w-3 h-3" />
              <span>중학교 2022 개정 과학 교육과정 표준 개념 탑재</span>
            </span>
            <span className="hidden md:inline text-slate-500">
              안전한 교육용 튜터링 · 24시간 응답
            </span>
          </div>
        </div>

      </div>

    </div>
  );
}
