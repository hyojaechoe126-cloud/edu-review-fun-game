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
  Key, 
  Image as ImageIcon, 
  Maximize2, 
  Download, 
  X, 
  Compass, 
  ChevronRight, 
  ShieldCheck, 
  Zap, 
  Rocket 
} from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  model?: string;
  imageUrl?: string;
  imageCaption?: string;
  revisedPrompt?: string;
  isError?: boolean;
}

const PRESET_TOPICS = [
  {
    grade: '과학1',
    title: '상태 변화 & 가열 곡선',
    text: '얼음이 녹는 동안 계속 가열해도 왜 온도가 0℃에서 안 올라가나요? 입자 운동과 융해열로 설명해줘.',
    isImage: false,
  },
  {
    grade: '과학1',
    title: 'AI 시각 도해',
    text: '드라이아이스의 승화(고체→기체) 현상과 이산화탄소 입자 배열 그림 그려줘.',
    isImage: true,
  },
  {
    grade: '과학2',
    title: '전기와 자기',
    text: '옴의 법칙(V = I × R)의 원리와 직렬·병렬 연결 회로의 차이점을 알기 쉽게 설명해줘.',
    isImage: false,
  },
  {
    grade: '과학2',
    title: 'AI 시각 도해',
    text: '식물 엽록체 안에서 일어나는 광합성과 산소 발생 메커니즘 그림 보여줘.',
    isImage: true,
  },
  {
    grade: '과학3',
    title: '화학 반응의 규칙',
    text: '수소와 산소가 반응해 물이 될 때 질량 보존 법칙이 성립하는 원자 배열 원리를 알려줘.',
    isImage: false,
  },
  {
    grade: '과학3',
    title: '운동과 에너지',
    text: '롤러코스터가 오르내릴 때 위치 에너지와 운동 에너지가 보존되는 원리를 정리해줘.',
    isImage: false,
  },
];

export default function ScienceChatbot() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      role: 'assistant',
      content: `👋 안녕하세요! 차세대 초지능 과학 추론 모델 **GPT-6.1Sol** 및 고속 탐구 모델 **GPT-5.4Mini**가 탑재된 **AI 과학 튜터**입니다.\n\n중학교 과학(과학1, 과학2, 과학3) 및 고등 과학의 개념 질문, 시험 대비는 물론 **원하는 과학 주제의 그림/사진 시각화 도해**까지 즉시 생성해 드립니다.\n\n✨ **특징 및 이용 안내:**\n- ⚡ **GPT-6.1Sol (Solaris)**: 심층 과학 추론 및 정밀 개념 해설 특화 플래그십 엔진\n- 🚀 **GPT-5.4Mini (Express)**: 빠르고 직관적인 핵심 개념 탐구 경량화 엔진\n- 🎨 **실시간 시각화**: 대화창에 *"~ 그림 그려줘"*, *"~ 사진 보여줘"*라고 질문하시거나 **[🎨 그림 생성]** 버튼을 누르면 질문에 꼭 맞는 과학 도해를 함께 그려드립니다!\n\n궁금한 과학 주제를 아래 추천 카드에서 선택하거나 질문을 입력해 보세요! 🚀`,
      timestamp: '방금 전',
      model: 'GPT-6.1Sol',
    },
  ]);

  const [input, setInput] = useState<string>('');
  const [selectedModel, setSelectedModel] = useState<'gpt-6.1-sol' | 'gpt-5.4-mini'>('gpt-6.1-sol');
  const [selectedGrade, setSelectedGrade] = useState<'all' | 'sci1' | 'sci2' | 'sci3'>('all');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [zoomImage, setZoomImage] = useState<{ url: string; caption: string; prompt?: string } | null>(null);

  // OpenAI API Key management (Vercel env var + localStorage custom key fallback)
  const [hasServerKey, setHasServerKey] = useState<boolean>(true);
  const [customKey, setCustomKey] = useState<string>('');
  const [showKeyModal, setShowKeyModal] = useState<boolean>(false);
  const [keyInputTemp, setKeyInputTemp] = useState<string>('');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('openai_custom_key');
    if (saved) {
      setCustomKey(saved);
      setKeyInputTemp(saved);
    }

    fetch('/api/openai-status')
      .then((res) => res.json())
      .then((data) => {
        setHasServerKey(Boolean(data.configured));
      })
      .catch(() => {});
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const saveCustomKey = (key: string) => {
    const trimmed = key.trim();
    setCustomKey(trimmed);
    if (trimmed) {
      localStorage.setItem('openai_custom_key', trimmed);
    } else {
      localStorage.removeItem('openai_custom_key');
    }
    setShowKeyModal(false);
  };

  // Main Send Handler: Handles Text and Image generation seamlessly
  const handleSend = async (overridePrompt?: string, forceImage?: boolean) => {
    const textToSend = (overridePrompt || input).trim();
    if (!textToSend || isLoading) return;

    // Detect if user is asking for an image/drawing
    const isImageDemand = forceImage || /(그림|사진|도해|일러스트|그려줘|보여줘|생성해줘|모형|이미지)/.test(textToSend);

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!overridePrompt) setInput('');
    setIsLoading(true);

    const modelName = selectedModel === 'gpt-6.1-sol' ? 'GPT-6.1Sol' : 'GPT-5.4Mini';

    try {
      // If user requested an image, run image generation concurrently or directly
      let generatedImage: { url?: string; caption?: string; prompt?: string } = {};

      if (isImageDemand) {
        try {
          const imgRes = await fetch('/api/science-image', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-openai-key': customKey,
            },
            body: JSON.stringify({
              prompt: textToSend,
              apiKey: customKey,
            }),
          });
          const imgData = await imgRes.json();
          if (imgData.success && imgData.imageUrl) {
            generatedImage = {
              url: imgData.imageUrl,
              caption: imgData.caption || textToSend,
              prompt: imgData.revisedPrompt,
            };
          }
        } catch (imgErr) {
          console.warn('Image generation warning:', imgErr);
        }
      }

      // Fetch text answer from GPT-6.1Sol or GPT-5.4Mini
      const tutorRes = await fetch('/api/science-tutor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-openai-key': customKey,
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
          model: selectedModel,
          gradeCategory: selectedGrade,
          apiKey: customKey,
        }),
      });

      const tutorData = await tutorRes.json();

      let replyContent = tutorData.reply || '답변을 불러오지 못했습니다. 다시 시도해 주세요.';
      if (isImageDemand && generatedImage.url) {
        replyContent = `🎨 **요청하신 [${textToSend}] 과학 도해를 생성했습니다.**\n\n` + replyContent;
      }

      const aiReply: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: replyContent,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        model: tutorData.model || modelName,
        imageUrl: generatedImage.url,
        imageCaption: generatedImage.caption,
        revisedPrompt: generatedImage.prompt,
        isError: Boolean(tutorData.errorDetail || tutorData.isKeyMissing),
      };

      setMessages((prev) => [...prev, aiReply]);

      if (tutorData.isKeyMissing && !customKey) {
        setShowKeyModal(true);
      }

    } catch (err: any) {
      console.error('Chat request error:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: 'assistant',
          content: `네트워크 통신 오류가 발생했습니다: ${err.message || '잠시 후 다시 시도해 주세요.'}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isError: true,
        },
      ]);
    } finally {
      setIsLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleGenerateImageForTopic = (topic: string) => {
    handleSend(`"${topic}"에 대한 고화질 과학 교육용 도해를 그려줘`, true);
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
    if (confirm('대화 내용을 초기화하고 새로운 과학 질의응답을 시작할까요?')) {
      setMessages([
        {
          id: `welcome-${Date.now()}`,
          role: 'assistant',
          content: `새 대화를 시작합니다. 🔬 **${selectedModel === 'gpt-6.1-sol' ? 'GPT-6.1Sol' : 'GPT-5.4Mini'}**에게 과학 개념 질문이나 그림 생성을 자유롭게 요청해 보세요!`,
          timestamp: '방금 전',
          model: selectedModel === 'gpt-6.1-sol' ? 'GPT-6.1Sol' : 'GPT-5.4Mini',
        },
      ]);
    }
  };

  const isKeyActive = Boolean(hasServerKey || customKey);

  return (
    <div className="space-y-6">
      
      {/* Official GPT-6.1Sol & GPT-5.4Mini Header Panel */}
      <div className="skeuo-panel p-5 sm:p-6 bg-gradient-to-r from-[#0d101c]/95 via-[#13192e]/95 to-[#0b0e1b]/95 border-cyan-500/40 shadow-neon-cyan">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          
          {/* Brand & Engine Badge */}
          <div className="flex items-center gap-3.5">
            <div className="relative flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-fuchsia-500/20 border border-cyan-400/60 shadow-neon-cyan">
              <Atom className="w-7 h-7 text-cyan-300 animate-spin" style={{ animationDuration: '15s' }} />
              <span className="absolute -bottom-1 -right-1 flex h-3 w-3">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isKeyActive ? 'bg-cyan-400' : 'bg-amber-400'}`}></span>
                <span className={`relative inline-flex rounded-full h-3 w-3 border border-black ${isKeyActive ? 'bg-cyan-500' : 'bg-amber-500'}`}></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-sky-300 to-fuchsia-400">
                    GPT-6.1Sol
                  </span>
                  <span className="text-slate-400 text-sm font-semibold">&amp; GPT-5.4Mini</span>
                </h2>
                <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                  차세대 AI 튜터
                </span>
              </div>
              <p className="text-xs text-slate-300 font-sans mt-0.5 light:text-slate-600">
                초지능 과학 추론 모델 탑재 · 텍스트 질문과 실시간 시각 도해 생성을 원스톱으로 지원합니다.
              </p>
            </div>
          </div>

          {/* Model Switcher & Key Setup Button */}
          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-end">
            
            {/* Model Selector Toggle (GPT-6.1Sol vs GPT-5.4Mini) */}
            <div className="flex items-center bg-[#151c33] p-1 rounded-xl border border-[#263459] shadow-inner">
              <button
                onClick={() => setSelectedModel('gpt-6.1-sol')}
                title="GPT-6.1Sol: 초지능 심층 과학 추론 플래그십 엔진"
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  selectedModel === 'gpt-6.1-sol'
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-neon-cyan font-black scale-[1.02]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Zap className="w-3.5 h-3.5 text-cyan-300" />
                <span>GPT-6.1Sol (Solaris)</span>
              </button>
              
              <button
                onClick={() => setSelectedModel('gpt-5.4-mini')}
                title="GPT-5.4Mini: 초고속 경량화 과학 탐구 엔진"
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  selectedModel === 'gpt-5.4-mini'
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md font-black scale-[1.02]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Rocket className="w-3.5 h-3.5 text-emerald-300" />
                <span>GPT-5.4Mini</span>
              </button>
            </div>

            {/* API Key Status / Setup Button */}
            <button
              onClick={() => setShowKeyModal(true)}
              className={`skeuo-btn px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all whitespace-nowrap ${
                isKeyActive
                  ? 'bg-[#152038] text-cyan-300 border-cyan-500/40 hover:border-cyan-300'
                  : 'bg-amber-500/20 text-amber-300 border-amber-500/50 animate-pulse'
              }`}
            >
              <Key className="w-3.5 h-3.5" />
              <span>{isKeyActive ? 'API 키 활성' : '키 설정'}</span>
            </button>

            {/* Reset Chat */}
            <button
              onClick={handleResetChat}
              title="대화 초기화"
              className="skeuo-btn p-2 rounded-xl text-slate-400 hover:text-white"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

          </div>

        </div>

        {/* Grade Filter Pill Tabs */}
        <div className="mt-4 pt-3.5 border-t border-[#1e263d] flex items-center justify-between flex-wrap gap-2 text-xs">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            <span className="text-slate-400 font-mono flex items-center gap-1 shrink-0">
              <Compass className="w-3.5 h-3.5 text-cyan-400" />
              <span>탐구 영역:</span>
            </span>
            {[
              { id: 'all', label: '전체 과학' },
              { id: 'sci1', label: '과학1 (중1)' },
              { id: 'sci2', label: '과학2 (중2)' },
              { id: 'sci3', label: '과학3 (중3)' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedGrade(tab.id as any)}
                className={`px-2.5 py-1 rounded-lg font-bold text-xs transition-all whitespace-nowrap ${
                  selectedGrade === tab.id
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400 font-black'
                    : 'bg-[#151a2d] text-slate-400 hover:text-white border border-[#232c49]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>{customKey ? '사용자 등록 키 사용 중' : hasServerKey ? 'Vercel CHATGPT_APIKEY 가동 중' : 'API 키 필요'}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Preset Curiosity Topic Cards */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400 px-1 font-mono">
          <div className="flex items-center gap-1.5 text-slate-300 font-bold">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>추천 탐구 질문 (클릭 시 GPT-6.1Sol 해설 & 그림 도해 즉시 출력)</span>
          </div>
          <span className="text-[11px] text-cyan-400 font-bold">원클릭 시각화 지원</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {PRESET_TOPICS.map((item, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(item.text, item.isImage)}
              disabled={isLoading}
              className="skeuo-btn p-3 rounded-xl text-left bg-[#111627] border border-[#212b45] hover:border-cyan-400/50 transition-all group flex flex-col justify-between hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
            >
              <div className="flex items-center justify-between gap-1 mb-1.5">
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                  {item.grade} · {item.title}
                </span>
                {item.isImage && (
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/40 flex items-center gap-1">
                    <ImageIcon className="w-3 h-3" />
                    <span>도해 생성</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-200 group-hover:text-cyan-200 font-medium line-clamp-2 leading-relaxed">
                {item.text}
              </p>
              <div className="mt-2 flex items-center text-[10px] text-slate-400 group-hover:text-cyan-300 font-mono">
                <span>{item.isImage ? '그림 도해와 함께 탐구' : 'GPT-6.1Sol에게 질문'}</span>
                <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Log Container */}
      <div className="skeuo-panel p-4 sm:p-6 bg-[#0a0d17]/95 border-[#202944] min-h-[500px] max-h-[720px] flex flex-col justify-between">
        
        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto space-y-6 pr-1 sm:pr-2 no-scrollbar">
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            const isGpt61 = msg.model?.includes('6.1') || selectedModel === 'gpt-6.1-sol';

            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {/* AI Avatar */}
                {!isUser && (
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-sm mt-1 border ${
                    isGpt61 
                      ? 'bg-cyan-500/20 border-cyan-400/60 text-cyan-300 shadow-neon-cyan' 
                      : 'bg-emerald-500/20 border-emerald-400/60 text-emerald-300'
                  }`}>
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                {/* Message Body */}
                <div className={`max-w-[92%] sm:max-w-[85%] space-y-2.5 ${isUser ? 'items-end' : 'items-start'}`}>
                  
                  {/* Sender Header */}
                  <div className={`flex items-center gap-2 text-[11px] font-mono ${isUser ? 'justify-end text-purple-300' : 'text-cyan-400'}`}>
                    <span className="font-bold">
                      {isUser ? '🧑‍🔬 학생 탐구원' : `🤖 ${msg.model || 'GPT-6.1Sol'}`}
                    </span>
                    <span className="text-slate-500">{msg.timestamp}</span>
                    {msg.model && (
                      <span className={`text-[10px] px-1 rounded border ${
                        isGpt61 ? 'text-cyan-300 border-cyan-500/40 bg-cyan-950/30' : 'text-emerald-300 border-emerald-500/40 bg-emerald-950/30'
                      }`}>
                        {msg.model}
                      </span>
                    )}
                  </div>

                  {/* Text Bubble Container */}
                  <div
                    className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-wrap break-words ${
                      isUser
                        ? 'bg-gradient-to-r from-purple-600 to-indigo-700 text-white shadow-md rounded-tr-xs'
                        : msg.isError
                        ? 'bg-red-950/40 border border-red-500/50 text-red-200 rounded-tl-xs'
                        : 'bg-[#13182b] border border-[#232d4b] text-slate-100 shadow-sm rounded-tl-xs light:bg-slate-100 light:text-slate-800 light:border-slate-300'
                    }`}
                  >
                    {msg.content}
                  </div>

                  {/* Generated Science Image / Diagram Viewer Frame */}
                  {msg.imageUrl && (
                    <div className="rounded-2xl overflow-hidden border-2 border-cyan-400/60 bg-[#070912] shadow-2xl transition-all">
                      
                      {/* Frame Top Header */}
                      <div className="flex items-center justify-between px-3.5 py-2.5 bg-[#101526] border-b border-[#212c4d] text-xs font-mono">
                        <div className="flex items-center gap-2 text-cyan-300 font-bold">
                          <ImageIcon className="w-4 h-4 text-fuchsia-400" />
                          <span>AI 과학 시각 도해 (Visual Simulation)</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setZoomImage({ url: msg.imageUrl!, caption: msg.imageCaption || '', prompt: msg.revisedPrompt })}
                            className="p-1 rounded hover:bg-[#202947] text-slate-300 hover:text-cyan-300 transition-colors flex items-center gap-1 text-[11px]"
                            title="전체화면 확대"
                          >
                            <Maximize2 className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">확대 보기</span>
                          </button>
                        </div>
                      </div>

                      {/* Image Viewer */}
                      <div 
                        onClick={() => setZoomImage({ url: msg.imageUrl!, caption: msg.imageCaption || '', prompt: msg.revisedPrompt })}
                        className="relative group cursor-pointer overflow-hidden flex items-center justify-center bg-black min-h-[300px]"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={msg.imageUrl}
                          alt={msg.imageCaption || '과학 시각 도해'}
                          className="w-full h-auto max-h-[480px] object-contain transition-transform duration-300 group-hover:scale-[1.01]"
                        />

                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white text-xs font-mono font-bold backdrop-blur-[2px]">
                          <Maximize2 className="w-4 h-4 text-cyan-300" />
                          <span>클릭하여 고화질 확대 및 다운로드</span>
                        </div>
                      </div>

                      {/* Prompt Details Footer */}
                      <div className="p-3 bg-[#0c101e] border-t border-[#1b233c] text-xs text-slate-300 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-cyan-400 font-bold">💡 시각 도해 해설: {msg.imageCaption}</span>
                          <span className="text-[10px] text-slate-500 font-mono">고화질 렌더링 완료</span>
                        </div>
                        {msg.revisedPrompt && (
                          <p className="text-[11px] text-slate-400 font-sans italic line-clamp-2">
                            AI 시각 프롬프트: &ldquo;{msg.revisedPrompt}&rdquo;
                          </p>
                        )}
                      </div>

                    </div>
                  )}

                  {/* Actions (Copy, Draw Image for this topic) */}
                  {!isUser && (
                    <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-slate-400">
                      
                      <button
                        onClick={() => handleCopy(msg.id, msg.content)}
                        className="flex items-center gap-1 hover:text-white transition-colors px-2 py-0.5 rounded bg-[#131728] border border-[#232b47]"
                      >
                        {copiedId === msg.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400">복사됨</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>내용 복사</span>
                          </>
                        )}
                      </button>

                      {!msg.imageUrl && (
                        <button
                          onClick={() => handleGenerateImageForTopic(msg.content.slice(0, 50))}
                          className="flex items-center gap-1 text-fuchsia-400 hover:text-fuchsia-300 transition-colors px-2 py-0.5 rounded bg-[#1c142b] border border-fuchsia-500/40 hover:border-fuchsia-400 font-medium"
                        >
                          <ImageIcon className="w-3 h-3" />
                          <span>🎨 이 내용 그림/도해로 시각화하기</span>
                        </button>
                      )}

                    </div>
                  )}

                </div>

                {/* User Avatar */}
                {isUser && (
                  <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-400/50 flex items-center justify-center text-purple-300 shrink-0 shadow-sm mt-1">
                    <span className="text-xs font-bold font-mono">나</span>
                  </div>
                )}
              </div>
            );
          })}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex gap-3 justify-start animate-fade-in">
              <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center text-cyan-300 shrink-0 mt-1">
                <Atom className="w-4 h-4 animate-spin text-cyan-400" />
              </div>
              <div className="p-4 rounded-2xl rounded-tl-xs bg-[#13182b] border border-cyan-400/40 text-cyan-300 text-xs sm:text-sm space-y-2 max-w-sm">
                <div className="flex items-center gap-2 font-mono font-bold text-xs text-cyan-400">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                  </span>
                  <span>{selectedModel === 'gpt-6.1-sol' ? 'GPT-6.1Sol 심층 과학 추론' : 'GPT-5.4Mini 빠른 답변'} 및 시각화 진행 중...</span>
                </div>
                <div className="w-full bg-[#0d101e] h-1.5 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-indigo-500 h-full rounded-full animate-pulse w-3/4"></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar Area */}
        <div className="mt-4 pt-3 border-t border-[#1e2740]">
          <div className="relative flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            
            <div className="relative flex-1">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="과학 질문을 입력하세요! (예: 드라이아이스 승화 그림 그려줘 / 옴의 법칙 공식 쉽게 설명해줘)"
                rows={2}
                disabled={isLoading}
                className="w-full bg-[#121626] text-slate-100 placeholder-slate-400 text-xs sm:text-sm rounded-xl px-3.5 py-2.5 border border-[#273250] focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 resize-none transition-all light:bg-white light:text-slate-800 light:border-slate-300"
              />
              <div className="absolute right-2.5 bottom-2 text-[10px] font-mono text-slate-500 hidden sm:block">
                Shift+Enter 줄바꿈 · Enter 전송 (그림 요청 시 도해 자동 출력)
              </div>
            </div>

            {/* Action Buttons: Text Send & Image Generate */}
            <div className="flex items-center gap-2 shrink-0">
              
              {/* Direct Image Generate Button */}
              <button
                onClick={() => handleSend(input, true)}
                disabled={!input.trim() || isLoading}
                title="입력한 과학 개념을 고화질 그림 및 도해로 시각화합니다"
                className="skeuo-btn h-11 px-3.5 rounded-xl bg-gradient-to-r from-fuchsia-600 to-pink-600 text-white font-bold flex items-center justify-center gap-1.5 shadow-md disabled:opacity-40 hover:scale-[1.02] active:scale-[0.98] transition-all text-xs whitespace-nowrap"
              >
                <ImageIcon className="w-4 h-4 text-pink-200" />
                <span>🎨 그림 도해 생성</span>
              </button>

              {/* Standard Send Button */}
              <button
                onClick={() => handleSend()}
                disabled={!input.trim() || isLoading}
                className="skeuo-btn h-11 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold flex items-center justify-center gap-1.5 shadow-neon-cyan disabled:opacity-40 hover:scale-[1.02] active:scale-[0.98] transition-all text-xs whitespace-nowrap"
              >
                <Send className="w-4 h-4" />
                <span>질문하기</span>
              </button>

            </div>

          </div>
          
          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 font-mono">
            <span className="flex items-center gap-1.5 text-cyan-400">
              <Zap className="w-3.5 h-3.5" />
              <span>현재 선택 엔진: {selectedModel === 'gpt-6.1-sol' ? 'GPT-6.1Sol (Solaris Deep Science)' : 'GPT-5.4Mini (Express)'}</span>
            </span>
            <button
              onClick={() => setShowKeyModal(true)}
              className="text-slate-400 hover:text-cyan-300 underline decoration-dotted"
            >
              API 키 상태 확인 / 변경
            </button>
          </div>
        </div>

      </div>

      {/* Lightbox Zoom Modal for High-Resolution Inspection */}
      {zoomImage && (
        <div 
          onClick={() => setZoomImage(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md p-4 sm:p-8 flex flex-col items-center justify-center animate-fade-in"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl w-full max-h-[92vh] bg-[#0c101e] border-2 border-cyan-400 rounded-2xl overflow-hidden shadow-2xl flex flex-col"
          >
            <div className="flex items-center justify-between px-4 py-3 bg-[#13192f] border-b border-[#232f54]">
              <div className="flex items-center gap-2 text-cyan-300 font-bold text-sm">
                <ImageIcon className="w-4 h-4 text-fuchsia-400" />
                <span>AI 과학 고화질 시각 뷰어</span>
              </div>
              <button
                onClick={() => setZoomImage(null)}
                className="p-1 rounded-lg hover:bg-[#253158] text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 flex-1 overflow-auto flex items-center justify-center bg-black">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={zoomImage.url}
                alt={zoomImage.caption}
                className="max-w-full max-h-[68vh] object-contain rounded-lg"
              />
            </div>

            <div className="px-4 py-3 bg-[#13192f] border-t border-[#232f54] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-slate-300">
              <div>
                <p className="font-bold text-white">{zoomImage.caption}</p>
                {zoomImage.prompt && (
                  <p className="text-[11px] text-slate-400 line-clamp-1 italic">{zoomImage.prompt}</p>
                )}
              </div>
              <button
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = zoomImage.url;
                  link.download = `science-diagram-${Date.now()}.png`;
                  link.click();
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500 hover:text-black transition-all font-bold shrink-0"
              >
                <Download className="w-3.5 h-3.5" />
                <span>도해 이미지 다운로드</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* OpenAI API Key Settings Modal */}
      {showKeyModal && (
        <div 
          onClick={() => setShowKeyModal(false)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm p-4 flex items-center justify-center animate-fade-in"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="max-w-md w-full bg-[#111628] border border-cyan-500/50 rounded-2xl p-6 shadow-2xl space-y-4 text-slate-200"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-cyan-500/20 flex items-center justify-center text-cyan-400">
                  <Key className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-white">OpenAI API 키 설정</h3>
              </div>
              <button
                onClick={() => setShowKeyModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              본 앱은 **GPT-6.1Sol** 및 **GPT-5.4Mini** 고성능 추론 엔진으로 구동됩니다.
            </p>

            <div className="p-3 rounded-xl bg-[#0b0e1b] border border-[#212b48] text-xs space-y-1.5 font-mono">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Vercel 환경변수 (CHATGPT_APIKEY):</span>
                <span className={hasServerKey ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
                  {hasServerKey ? '✅ 등록됨 (배포 시 적용)' : '⚠️ 로컬 미등록'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">브라우저 로컬 키:</span>
                <span className={customKey ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                  {customKey ? '✅ 등록됨' : '미등록'}
                </span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">
                OpenAI API Key (sk-...) 직접 등록 / 갱신:
              </label>
              <input
                type="password"
                value={keyInputTemp}
                onChange={(e) => setKeyInputTemp(e.target.value)}
                placeholder="sk-proj-..."
                className="w-full bg-[#0b0e1b] text-white text-xs rounded-xl px-3.5 py-2.5 border border-[#263252] focus:border-cyan-400 focus:outline-none font-mono"
              />
              <p className="text-[11px] text-slate-400">
                입력하신 키는 브라우저 localStorage에 안전하게 보관되며 AI 질문 및 이미지 생성에 사용됩니다.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              {customKey && (
                <button
                  onClick={() => {
                    saveCustomKey('');
                    setKeyInputTemp('');
                  }}
                  className="px-3 py-2 rounded-xl text-xs font-bold text-red-400 hover:bg-red-950/30 transition-colors"
                >
                  키 삭제
                </button>
              )}
              <button
                onClick={() => saveCustomKey(keyInputTemp)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-black transition-colors"
              >
                저장 및 적용
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
