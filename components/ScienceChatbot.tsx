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
  BookOpen,
  Image as ImageIcon,
  Maximize2,
  Download,
  Palette,
  X,
  Layers
} from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  grade?: string;
  source?: string;
  imageUrl?: string;
  imageCaption?: string;
  imageSource?: string;
}

const PRESET_QUESTIONS = [
  {
    grade: '과학1',
    category: '상태 변화 & 열에너지',
    icon: '🧊',
    text: '얼음이 녹는 동안 왜 온도가 계속 0℃에서 안 올라가나요? (도해 포함)',
    visual: true,
  },
  {
    grade: '과학1',
    category: '승화 & 입자 운동',
    icon: '💨',
    text: '드라이아이스는 왜 액체가 안 되고 곧바로 기체로 변하나요? 그림으로 보여줘!',
    visual: true,
  },
  {
    grade: '과학1',
    category: '기체의 성질',
    icon: '🎈',
    text: '높은 산에 올라가면 과자 봉지가 왜 빵빵하게 부풀어 오르나요?',
    visual: false,
  },
  {
    grade: '과학2',
    category: '전기와 자기',
    icon: '⚡',
    text: '전류, 전압, 저항(옴의 법칙 V=IR)의 회로도를 그림으로 보여줘!',
    visual: true,
  },
  {
    grade: '과학2',
    category: '식물과 에너지',
    icon: '🍃',
    text: '식물의 광합성과 세포 호흡 메커니즘을 그림과 도해로 설명해줘!',
    visual: true,
  },
  {
    grade: '과학2',
    category: '물질의 특성',
    icon: '⚗️',
    text: '물과 기름은 왜 섞이지 않고 기름이 위에 뜨나요? (밀도)',
    visual: false,
  },
  {
    grade: '과학3',
    category: '화학 반응의 규칙',
    icon: '🧪',
    text: '화학 반응에서 원자가 재배열되어 질량이 보존되는 원자 모형 도해 그려줘!',
    visual: true,
  },
  {
    grade: '과학3',
    category: '운동과 에너지',
    icon: '🎢',
    text: '롤러코스터가 내려갈 때 위치 에너지와 운동 에너지는 어떻게 보존되나요?',
    visual: false,
  },
];

export default function ScienceChatbot() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      role: 'assistant',
      content: `👋 안녕! 나는 너의 전담 **AI 과학 튜터 [사이언스 랩 닥터]**야!\n\n중학교 **과학1(중1), 과학2(중2), 과학3(중3)** 교과서 속 어려운 개념이나 실험 원리를 알기 쉽게 설명해 줄 뿐만 아니라, **사진이나 그림, 시각 도해(다이어그램)**도 함께 보여줄 수 있어!\n\n🎨 **시각 자료가 보고 싶을 때:**\n- 질문할 때 *"그림으로 보여줘"*, *"도해 그려줘"*, *"사진 보여줘"*라고 말하거나\n- 각 답변 밑의 **[🎨 도해/그림 생성]** 버튼을 누르면 즉시 시각 자료를 그려준단다!\n\n아래의 **추천 질문 카드**를 누르거나 궁금한 과학 질문을 자유롭게 물어봐! 🚀`,
      timestamp: '방금 전',
      source: 'openai-gpt-4o-mini',
    },
  ]);

  const [input, setInput] = useState<string>('');
  const [selectedGrade, setSelectedGrade] = useState<'all' | 'sci1' | 'sci2' | 'sci3'>('all');
  const [autoVisual, setAutoVisual] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [generatingImageId, setGeneratingImageId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [zoomImage, setZoomImage] = useState<{ url: string; caption: string } | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, generatingImageId]);

  const handleSend = async (questionText?: string, forceVisual?: boolean) => {
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
      const isVisualDemand = forceVisual || autoVisual || /(그림|사진|도해|이미지|모형|다이어그램|시각화|그려줘|보여줘)/.test(textToSend);

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
          includeVisual: isVisualDemand,
        }),
      });

      const data = await response.json();

      const aiReply: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: data.reply || '답변을 불러오지 못했어요. 잠시 후 다시 질문해 주세요.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: data.source,
        imageUrl: data.imageUrl,
        imageCaption: data.imageCaption,
        imageSource: data.imageSource,
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

  // Generate visual image on demand for a specific message
  const handleGenerateImageForMessage = async (msgId: string, topicText: string) => {
    if (generatingImageId) return;
    setGeneratingImageId(msgId);

    try {
      const res = await fetch('/api/science-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: topicText,
          grade: selectedGrade,
        }),
      });

      const data = await res.json();
      if (data.imageUrl) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === msgId
              ? {
                  ...m,
                  imageUrl: data.imageUrl,
                  imageCaption: data.caption,
                  imageSource: data.source,
                }
              : m
          )
        );
      }
    } catch (error) {
      console.error('Failed to generate image:', error);
    } finally {
      setGeneratingImageId(null);
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
          content: `새로운 과학 탐구를 시작할 준비 완료! 🔬 중1~중3 과학 교과서 내용 중 무엇이든 편하게 물어보세요! 그림이나 사진이 필요하면 언제든 말씀해 주세요! 🎨`,
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
                  AI 과학 튜터 & 비주얼 랩봇
                </h2>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono font-bold rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                  GPT-4o-mini & DALL-E
                </span>
              </div>
              <p className="text-xs text-slate-300 font-sans mt-0.5 light:text-slate-600">
                중등 과학 핵심 개념 질의응답 및 **실시간 과학 사진·그림·도해 시각화**를 지원하는 AI 멘토입니다.
              </p>
            </div>
          </div>

          {/* Controls: Auto-Visual Toggle & Reset */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
            
            {/* Auto Visual Toggle Switch */}
            <button
              onClick={() => setAutoVisual(!autoVisual)}
              title="모든 답변에 과학 도해/그림을 자동으로 포함합니다"
              className={`skeuo-btn px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all whitespace-nowrap ${
                autoVisual
                  ? 'bg-gradient-to-r from-fuchsia-600 to-pink-600 text-white shadow-neon-magenta border-pink-400'
                  : 'bg-[#181d33] text-slate-300 hover:text-white border-[#2c3555]'
              }`}
            >
              <Palette className={`w-3.5 h-3.5 ${autoVisual ? 'text-white' : 'text-pink-400'}`} />
              <span>{autoVisual ? '🎨 도해 항상 생성: ON' : '🎨 도해 자동생성'}</span>
            </button>

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
            <span>추천 인기 과학 질문 (클릭 시 그림·도해와 함께 즉시 탐구)</span>
          </div>
          <span className="text-[11px] text-pink-400 font-semibold hidden sm:inline">🖼️ 시각 자료 지원</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {PRESET_QUESTIONS.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q.text, q.visual)}
              disabled={isLoading}
              className="skeuo-btn p-3 rounded-xl text-left bg-[#14182a] border border-[#283250] hover:border-cyan-400/60 transition-all group flex flex-col justify-between hover:scale-[1.02] active:scale-[0.99] disabled:opacity-50"
            >
              <div className="flex items-center justify-between gap-1 mb-1.5">
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                  {q.grade} · {q.category}
                </span>
                <div className="flex items-center gap-1">
                  {q.visual && (
                    <span className="px-1 py-0.2 rounded text-[9px] bg-pink-500/20 text-pink-300 border border-pink-500/40">
                      도해
                    </span>
                  )}
                  <span className="text-sm">{q.icon}</span>
                </div>
              </div>
              <p className="text-xs text-slate-200 group-hover:text-cyan-200 font-medium line-clamp-2 leading-snug">
                {q.text}
              </p>
              <div className="mt-2 flex items-center text-[10px] text-slate-400 group-hover:text-cyan-300 font-mono">
                <span>{q.visual ? '그림과 함께 알아보기' : '답변 알아보기'}</span>
                <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Log Container */}
      <div className="skeuo-panel p-4 sm:p-6 bg-[#0c0e1a]/95 border-cyan-500/30 min-h-[480px] max-h-[700px] flex flex-col justify-between">
        
        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto space-y-6 pr-1 sm:pr-2 no-scrollbar">
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            const isGeneratingThisImage = generatingImageId === msg.id;

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
                <div className={`max-w-[92%] sm:max-w-[85%] space-y-2.5 ${isUser ? 'items-end' : 'items-start'}`}>
                  
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

                  {/* Text Bubble Container */}
                  <div
                    className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-wrap break-words ${
                      isUser
                        ? 'bg-gradient-to-r from-purple-600 to-indigo-700 text-white shadow-md rounded-tr-xs'
                        : 'bg-[#15192c] border border-cyan-500/30 text-slate-100 shadow-neon-cyan/20 rounded-tl-xs light:bg-slate-100 light:text-slate-800 light:border-slate-300'
                    }`}
                  >
                    {msg.content}
                  </div>

                  {/* Visual Diagram / Image Frame (If Generated) */}
                  {msg.imageUrl && (
                    <div className="rounded-2xl overflow-hidden border border-cyan-400/50 bg-[#0b0e1b] shadow-neon-cyan/30 transition-all hover:border-cyan-300">
                      
                      {/* Image Top Bar */}
                      <div className="flex items-center justify-between px-3 py-2 bg-[#12172d] border-b border-[#232c4a] text-xs font-mono">
                        <div className="flex items-center gap-1.5 text-cyan-300 font-bold">
                          <ImageIcon className="w-3.5 h-3.5 text-pink-400" />
                          <span>AI 과학 시각 도해</span>
                          {msg.imageSource && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-pink-500/20 text-pink-300 border border-pink-500/40">
                              {msg.imageSource.toUpperCase()}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => setZoomImage({ url: msg.imageUrl!, caption: msg.imageCaption || '과학 개념 도해' })}
                            className="p-1 rounded hover:bg-[#202947] text-slate-300 hover:text-cyan-300 transition-colors"
                            title="크게 확대해서 보기"
                          >
                            <Maximize2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Image Content Container */}
                      <div 
                        onClick={() => setZoomImage({ url: msg.imageUrl!, caption: msg.imageCaption || '과학 개념 도해' })}
                        className="relative group cursor-pointer overflow-hidden max-h-[360px] flex items-center justify-center bg-[#070912]"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={msg.imageUrl}
                          alt={msg.imageCaption || '과학 도해'}
                          className="w-full h-auto object-contain transition-transform duration-300 group-hover:scale-[1.01]"
                        />

                        {/* Hover Overlay Hint */}
                        <div className="absolute inset-0 bg-cyan-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white text-xs font-mono font-bold backdrop-blur-[2px]">
                          <Maximize2 className="w-4 h-4 text-cyan-300 animate-pulse" />
                          <span>클릭하여 고화질 확대 보기</span>
                        </div>
                      </div>

                      {/* Image Caption Footer */}
                      {msg.imageCaption && (
                        <div className="p-3 bg-[#0f1426] border-t border-[#1e2744] text-xs text-slate-300 flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <span className="text-cyan-400 font-bold">💡 도해 해설:</span>
                            <span>{msg.imageCaption}</span>
                          </div>
                          <span className="text-[10px] text-slate-500 font-mono hidden sm:inline">
                            학생 맞춤 시각화 랩
                          </span>
                        </div>
                      )}

                    </div>
                  )}

                  {/* Image Generation in progress for this specific message */}
                  {isGeneratingThisImage && (
                    <div className="p-3.5 rounded-xl bg-[#12182c] border border-pink-500/50 text-pink-300 text-xs shadow-neon-magenta flex items-center gap-2.5 animate-pulse">
                      <Atom className="w-4 h-4 animate-spin text-pink-400" />
                      <span>AI가 맞춤형 과학 도해 및 그림을 생성하고 있습니다...</span>
                    </div>
                  )}

                  {/* AI Quick Actions (Copy, Generate Visual, Quiz) */}
                  {!isUser && (
                    <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-slate-400">
                      
                      {/* Copy Text Button */}
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

                      {/* On-demand Visual Request Button (if not already shown) */}
                      {!msg.imageUrl && !isGeneratingThisImage && (
                        <button
                          onClick={() => handleGenerateImageForMessage(msg.id, msg.content.slice(0, 80))}
                          className="flex items-center gap-1 text-pink-400 hover:text-pink-300 transition-colors px-2 py-0.5 rounded bg-[#1a1329] border border-pink-500/40 hover:border-pink-400"
                        >
                          <ImageIcon className="w-3 h-3 text-pink-400" />
                          <span>🎨 이 개념 그림/도해로 보기</span>
                        </button>
                      )}

                      <span className="text-slate-600">|</span>

                      <span className="text-slate-500 text-[11px] flex items-center gap-1">
                        <Lightbulb className="w-3 h-3 text-amber-400" />
                        <span>꼬리 질문이나 그림 요청을 해보세요!</span>
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

          {/* Loading Indicator for general message */}
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
                  <span>AI 과학 멘토가 원리와 시각 자료를 분석 중입니다...</span>
                </div>
                <div className="w-full bg-[#0d101e] h-1.5 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-cyan-400 via-pink-500 to-indigo-500 h-full rounded-full animate-pulse w-3/4"></div>
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
                placeholder="과학 개념 질문 또는 '그림으로 보여줘'라고 입력하세요! (예: 얼음이 녹을 때 입자 모형 그림 그려줘)"
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
              <span>중학교 2022 개정 과학 교육과정 표준 개념 & 시각 도해 탑재</span>
            </span>
            <span className="hidden md:flex items-center gap-2 text-pink-400">
              <ImageIcon className="w-3 h-3" />
              <span>사진/그림 요청 시 실시간 시각화 제공</span>
            </span>
          </div>
        </div>

      </div>

      {/* Lightbox Zoom Modal for High-Resolution Visual Inspection */}
      {zoomImage && (
        <div 
          onClick={() => setZoomImage(null)}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md p-4 sm:p-8 flex flex-col items-center justify-center animate-fade-in"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl w-full max-h-[90vh] bg-[#0c0f1d] border-2 border-cyan-400 rounded-2xl overflow-hidden shadow-2xl flex flex-col"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-[#13182e] border-b border-[#242f54]">
              <div className="flex items-center gap-2 text-cyan-300 font-bold text-sm">
                <ImageIcon className="w-4 h-4 text-pink-400" />
                <span>{zoomImage.caption}</span>
              </div>
              <button
                onClick={() => setZoomImage(null)}
                className="p-1 rounded-lg hover:bg-[#253158] text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Image View */}
            <div className="p-4 flex-1 overflow-auto flex items-center justify-center bg-[#070912]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={zoomImage.url}
                alt={zoomImage.caption}
                className="max-w-full max-h-[70vh] object-contain rounded-lg"
              />
            </div>

            {/* Modal Footer */}
            <div className="px-4 py-3 bg-[#13182e] border-t border-[#242f54] flex items-center justify-between text-xs text-slate-300">
              <span>🔎 고화질 과학 교육용 시각 도해</span>
              <button
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = zoomImage.url;
                  link.download = `science-diagram-${Date.now()}.png`;
                  link.click();
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500 hover:text-black transition-all font-bold"
              >
                <Download className="w-3.5 h-3.5" />
                <span>도해 이미지 다운로드</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
