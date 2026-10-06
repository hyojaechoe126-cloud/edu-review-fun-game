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
  Lightbulb, 
  Key, 
  Image as ImageIcon, 
  Maximize2, 
  Download, 
  X, 
  Compass, 
  ChevronRight,
  ShieldCheck,
  AlertCircle,
  ExternalLink,
  Flame,
  Zap
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
    text: '얼음이 녹을 때 계속 가열해도 왜 온도가 0℃로 유지되나요? 분자 운동과 융해열로 설명해줘.',
    isImage: false,
  },
  {
    grade: '과학1',
    title: 'DALL-E 3 도해',
    text: '드라이아이스의 승화 현상과 이산화탄소 입자 배열을 보여주는 과학 교육용 그림 그려줘.',
    isImage: true,
  },
  {
    grade: '과학2',
    title: '전기와 자기',
    text: '옴의 법칙(V = I × R)을 직관적인 비유와 회로 예시로 쉽게 이해할 수 있게 설명해줘.',
    isImage: false,
  },
  {
    grade: '과학2',
    title: 'DALL-E 3 도해',
    text: '식물 엽록체 안에서 일어나는 광합성과 산소 발생 메커니즘을 3D 일러스트로 그려줘.',
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
      content: `👋 안녕하세요! OpenAI의 **공식 ChatGPT & DALL-E 3** 엔진으로 구동되는 **과학 전문 AI 튜터**입니다.\n\n중학교 과학(과학1, 과학2, 과학3) 및 고등 과학의 개념 질문, 시험 대비, 원리 탐구는 물론 **원하는 과학 주제의 그림/사진 시각화**까지 직접 수행합니다.\n\n✨ **이용 방법:**\n- 💬 **텍스트 질문**: 아래 입력창에 궁금한 과학 내용을 적고 **[질문하기]**를 누르세요.\n- 🎨 **DALL-E 3 그림 생성**: **[🎨 DALL-E 3 생성]** 버튼을 누르거나 *"~ 그림 그려줘"*, *"~ 사진 보여줘"*라고 질문하시면 OpenAI DALL-E 3가 고화질 이미지를 즉시 생성합니다.\n\n궁금한 과학 주제를 아래 추천 카드에서 선택하거나 자유롭게 질문해 보세요! 🚀`,
      timestamp: '방금 전',
      model: 'ChatGPT 4o-mini',
    },
  ]);

  const [input, setInput] = useState<string>('');
  const [selectedModel, setSelectedModel] = useState<'gpt-4o' | 'gpt-4o-mini'>('gpt-4o-mini');
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

  // Check server environment key status & load custom key from localStorage
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

  // Send request to real OpenAI ChatGPT or DALL-E 3
  const handleSend = async (overridePrompt?: string, forceDalle?: boolean) => {
    const textToSend = (overridePrompt || input).trim();
    if (!textToSend || isLoading) return;

    const isDalleRequest = forceDalle || /(그림|사진|도해|일러스트|그려줘|보여줘|생성해줘)/.test(textToSend);

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!overridePrompt) setInput('');
    setIsLoading(true);

    try {
      // 1. If user specifically requested DALL-E 3 Image Generation
      if (isDalleRequest && forceDalle) {
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
          const aiImageReply: ChatMessage = {
            id: `ai-img-${Date.now()}`,
            role: 'assistant',
            content: `🎨 **OpenAI DALL-E 3로 요청하신 이미지를 생성했습니다.**\n\n주제: **"${textToSend}"**\n\n이미지를 클릭하시면 고화질 전체화면으로 감상하거나 다운로드할 수 있습니다.`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            model: 'DALL-E 3',
            imageUrl: imgData.imageUrl,
            imageCaption: imgData.caption || textToSend,
            revisedPrompt: imgData.revisedPrompt,
          };
          setMessages((prev) => [...prev, aiImageReply]);
          return;
        } else {
          const errMsg = imgData.message || 'OpenAI 이미지 생성에 실패했습니다.';
          setMessages((prev) => [
            ...prev,
            {
              id: `err-${Date.now()}`,
              role: 'assistant',
              content: `⚠️ **DALL-E 3 이미지 생성 오류**\n\n> ${errMsg}\n\n상단의 **[🔑 OpenAI 키 설정]**에서 API 키 및 계정 크레딧을 확인해 주세요.`,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              isError: true,
            },
          ]);
          return;
        }
      }

      // 2. Standard Official OpenAI ChatGPT Conversation
      const response = await fetch('/api/science-tutor', {
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

      const data = await response.json();

      const aiReply: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: data.reply || '답변을 수신하지 못했습니다. 다시 시도해 주세요.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        model: data.model || (selectedModel === 'gpt-4o' ? 'GPT-4o' : 'GPT-4o-mini'),
        isError: Boolean(data.errorDetail || data.isKeyMissing),
      };

      setMessages((prev) => [...prev, aiReply]);

      if (data.isKeyMissing && !customKey) {
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

  // Generate DALL-E 3 image for an existing message topic
  const handleGenerateDalleForTopic = (topic: string) => {
    handleSend(`"${topic}"에 대한 고화질 과학 교육용 일러스트 도해를 그려줘`, true);
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
          content: `새 대화를 시작합니다. 🔬 OpenAI 공식 ChatGPT & DALL-E 3에게 무엇이든 질문해 보세요!`,
          timestamp: '방금 전',
          model: selectedModel === 'gpt-4o' ? 'GPT-4o' : 'GPT-4o-mini',
        },
      ]);
    }
  };

  const isKeyActive = Boolean(hasServerKey || customKey);

  return (
    <div className="space-y-6">
      
      {/* Official OpenAI ChatGPT Header Panel */}
      <div className="skeuo-panel p-5 sm:p-6 bg-gradient-to-r from-[#0d111a]/95 via-[#131929]/95 to-[#0b101d]/95 border-emerald-500/30 shadow-lg">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          
          {/* Brand & Engine Badge */}
          <div className="flex items-center gap-3.5">
            <div className="relative flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-400/50 shadow-sm">
              <Bot className="w-7 h-7 text-emerald-400" />
              <span className="absolute -bottom-1 -right-1 flex h-3 w-3">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isKeyActive ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
                <span className={`relative inline-flex rounded-full h-3 w-3 border border-black ${isKeyActive ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                  <span>OpenAI ChatGPT & DALL-E 3</span>
                </h2>
                <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  공식 AI 엔진
                </span>
              </div>
              <p className="text-xs text-slate-300 font-sans mt-0.5 light:text-slate-600">
                인위적인 템플릿 없이 OpenAI 정품 ChatGPT가 직접 자연스럽게 답하고 DALL-E 3로 시각화합니다.
              </p>
            </div>
          </div>

          {/* Model Switcher & Key Setup Button */}
          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-end">
            
            {/* Model Selector Toggle */}
            <div className="flex items-center bg-[#151b2e] p-1 rounded-xl border border-[#263152]">
              <button
                onClick={() => setSelectedModel('gpt-4o-mini')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  selectedModel === 'gpt-4o-mini'
                    ? 'bg-emerald-500 text-black shadow-sm font-black'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                GPT-4o-mini
              </button>
              <button
                onClick={() => setSelectedModel('gpt-4o')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  selectedModel === 'gpt-4o'
                    ? 'bg-emerald-500 text-black shadow-sm font-black'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                GPT-4o (고성능)
              </button>
            </div>

            {/* API Key Status / Setup Button */}
            <button
              onClick={() => setShowKeyModal(true)}
              className={`skeuo-btn px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all whitespace-nowrap ${
                isKeyActive
                  ? 'bg-[#162238] text-emerald-300 border-emerald-500/40 hover:border-emerald-400'
                  : 'bg-amber-500/20 text-amber-300 border-amber-500/50 animate-pulse'
              }`}
            >
              <Key className="w-3.5 h-3.5" />
              <span>{isKeyActive ? 'OpenAI 키 연동됨' : 'OpenAI 키 설정'}</span>
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
              <span>과정 선택:</span>
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
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400'
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
              <span>{customKey ? '사용자 등록 키 사용 중' : hasServerKey ? 'Vercel CHATGPT_APIKEY 사용 중' : '키 등록 대기 중'}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Preset Curiosity Topic Cards */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400 px-1 font-mono">
          <div className="flex items-center gap-1.5 text-slate-300 font-bold">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>OpenAI 정품 즉시 질의응답 & DALL-E 3 시각화 예시</span>
          </div>
          <span className="text-[11px] text-emerald-400">자연어 자유 질문 가능</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {PRESET_TOPICS.map((item, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(item.text, item.isImage)}
              disabled={isLoading}
              className="skeuo-btn p-3 rounded-xl text-left bg-[#111627] border border-[#212b45] hover:border-emerald-400/50 transition-all group flex flex-col justify-between hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
            >
              <div className="flex items-center justify-between gap-1 mb-1.5">
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                  {item.grade} · {item.title}
                </span>
                {item.isImage && (
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-pink-500/20 text-pink-300 border border-pink-500/40 flex items-center gap-1">
                    <ImageIcon className="w-3 h-3" />
                    <span>DALL-E 3</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-200 group-hover:text-emerald-300 font-medium line-clamp-2 leading-relaxed">
                {item.text}
              </p>
              <div className="mt-2 flex items-center text-[10px] text-slate-400 group-hover:text-cyan-300 font-mono">
                <span>{item.isImage ? 'DALL-E 3 이미지 생성' : 'ChatGPT에게 질문'}</span>
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

            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {/* AI Avatar */}
                {!isUser && (
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-400/50 flex items-center justify-center text-emerald-300 shrink-0 shadow-sm mt-1">
                    <Bot className="w-4 h-4 text-emerald-400" />
                  </div>
                )}

                {/* Message Body */}
                <div className={`max-w-[92%] sm:max-w-[85%] space-y-2.5 ${isUser ? 'items-end' : 'items-start'}`}>
                  
                  {/* Sender Header */}
                  <div className={`flex items-center gap-2 text-[11px] font-mono ${isUser ? 'justify-end text-purple-300' : 'text-emerald-400'}`}>
                    <span className="font-bold">
                      {isUser ? '🧑‍🔬 학생' : '🤖 OpenAI ChatGPT'}
                    </span>
                    <span className="text-slate-500">{msg.timestamp}</span>
                    {msg.model && (
                      <span className="text-[10px] text-emerald-400/80 border border-emerald-500/30 px-1 rounded">
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

                  {/* DALL-E 3 Image Display Frame */}
                  {msg.imageUrl && (
                    <div className="rounded-2xl overflow-hidden border-2 border-emerald-400/60 bg-[#070912] shadow-2xl transition-all">
                      
                      {/* Frame Top Header */}
                      <div className="flex items-center justify-between px-3.5 py-2.5 bg-[#101526] border-b border-[#212c4d] text-xs font-mono">
                        <div className="flex items-center gap-2 text-emerald-300 font-bold">
                          <ImageIcon className="w-4 h-4 text-pink-400" />
                          <span>OpenAI DALL-E 3 고화질 렌더링</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setZoomImage({ url: msg.imageUrl!, caption: msg.imageCaption || '', prompt: msg.revisedPrompt })}
                            className="p-1 rounded hover:bg-[#202947] text-slate-300 hover:text-emerald-300 transition-colors flex items-center gap-1 text-[11px]"
                            title="전체화면 확대"
                          >
                            <Maximize2 className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">확대</span>
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
                          alt={msg.imageCaption || 'DALL-E 3 생성 이미지'}
                          className="w-full h-auto max-h-[480px] object-contain transition-transform duration-300 group-hover:scale-[1.01]"
                        />

                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white text-xs font-mono font-bold backdrop-blur-[2px]">
                          <Maximize2 className="w-4 h-4 text-emerald-300" />
                          <span>클릭하여 고화질 확대 및 다운로드</span>
                        </div>
                      </div>

                      {/* Prompt Details Footer */}
                      <div className="p-3 bg-[#0c101e] border-t border-[#1b233c] text-xs text-slate-300 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-emerald-400 font-bold">💡 시각화 주제: {msg.imageCaption}</span>
                          <span className="text-[10px] text-slate-500 font-mono">1024×1024 해상도</span>
                        </div>
                        {msg.revisedPrompt && (
                          <p className="text-[11px] text-slate-400 font-sans italic line-clamp-2">
                            DALL-E 프롬프트: &ldquo;{msg.revisedPrompt}&rdquo;
                          </p>
                        )}
                      </div>

                    </div>
                  )}

                  {/* Actions (Copy, DALL-E for this topic) */}
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
                          onClick={() => handleGenerateDalleForTopic(msg.content.slice(0, 60))}
                          className="flex items-center gap-1 text-pink-400 hover:text-pink-300 transition-colors px-2 py-0.5 rounded bg-[#1c142b] border border-pink-500/40 hover:border-pink-400 font-medium"
                        >
                          <ImageIcon className="w-3 h-3" />
                          <span>🎨 이 내용 DALL-E 3로 그리기</span>
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
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-400/50 flex items-center justify-center text-emerald-300 shrink-0 mt-1">
                <Atom className="w-4 h-4 animate-spin text-emerald-400" />
              </div>
              <div className="p-4 rounded-2xl rounded-tl-xs bg-[#13182b] border border-emerald-400/40 text-emerald-300 text-xs sm:text-sm space-y-2 max-w-sm">
                <div className="flex items-center gap-2 font-mono font-bold text-xs text-emerald-400">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span>OpenAI 서버에서 직접 응답을 생성하고 있습니다...</span>
                </div>
                <div className="w-full bg-[#0d101e] h-1.5 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-indigo-500 h-full rounded-full animate-pulse w-3/4"></div>
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
                placeholder="궁금한 과학 개념을 질문하거나, '~ 그림 그려줘'라고 입력해 보세요!"
                rows={2}
                disabled={isLoading}
                className="w-full bg-[#121626] text-slate-100 placeholder-slate-400 text-xs sm:text-sm rounded-xl px-3.5 py-2.5 border border-[#273250] focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400 resize-none transition-all light:bg-white light:text-slate-800 light:border-slate-300"
              />
              <div className="absolute right-2.5 bottom-2 text-[10px] font-mono text-slate-500 hidden sm:block">
                Shift+Enter 줄바꿈 · Enter 전송
              </div>
            </div>

            {/* Action Buttons: Text Send & DALL-E Generate */}
            <div className="flex items-center gap-2 shrink-0">
              
              {/* DALL-E 3 Direct Button */}
              <button
                onClick={() => handleSend(input, true)}
                disabled={!input.trim() || isLoading}
                title="입력한 내용으로 DALL-E 3 고화질 이미지를 생성합니다"
                className="skeuo-btn h-11 px-3.5 rounded-xl bg-gradient-to-r from-pink-600 to-fuchsia-600 text-white font-bold flex items-center justify-center gap-1.5 shadow-md disabled:opacity-40 hover:scale-[1.02] active:scale-[0.98] transition-all text-xs whitespace-nowrap"
              >
                <ImageIcon className="w-4 h-4 text-pink-200" />
                <span>🎨 DALL-E 3 생성</span>
              </button>

              {/* Standard ChatGPT Text Send Button */}
              <button
                onClick={() => handleSend()}
                disabled={!input.trim() || isLoading}
                className="skeuo-btn h-11 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold flex items-center justify-center gap-1.5 shadow-md disabled:opacity-40 hover:scale-[1.02] active:scale-[0.98] transition-all text-xs whitespace-nowrap"
              >
                <Send className="w-4 h-4" />
                <span>질문하기</span>
              </button>

            </div>

          </div>
          
          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 font-mono">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>정품 OpenAI API Direct Connection · {selectedModel} & DALL-E 3</span>
            </span>
            <button
              onClick={() => setShowKeyModal(true)}
              className="text-slate-400 hover:text-emerald-300 underline decoration-dotted"
            >
              API 키 상태 확인 / 변경
            </button>
          </div>
        </div>

      </div>

      {/* Lightbox Zoom Modal for High-Resolution DALL-E Inspection */}
      {zoomImage && (
        <div 
          onClick={() => setZoomImage(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md p-4 sm:p-8 flex flex-col items-center justify-center animate-fade-in"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl w-full max-h-[92vh] bg-[#0c101e] border-2 border-emerald-400 rounded-2xl overflow-hidden shadow-2xl flex flex-col"
          >
            <div className="flex items-center justify-between px-4 py-3 bg-[#13192f] border-b border-[#232f54]">
              <div className="flex items-center gap-2 text-emerald-300 font-bold text-sm">
                <ImageIcon className="w-4 h-4 text-pink-400" />
                <span>OpenAI DALL-E 3 고화질 뷰어</span>
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
                  link.download = `dalle3-science-${Date.now()}.png`;
                  link.click();
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500 hover:text-black transition-all font-bold shrink-0"
              >
                <Download className="w-3.5 h-3.5" />
                <span>원본 다운로드</span>
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
            className="max-w-md w-full bg-[#111628] border border-emerald-500/50 rounded-2xl p-6 shadow-2xl space-y-4 text-slate-200"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
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
              본 앱은 공식 OpenAI ChatGPT 및 DALL-E 3 API를 사용합니다.
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
                className="w-full bg-[#0b0e1b] text-white text-xs rounded-xl px-3.5 py-2.5 border border-[#263252] focus:border-emerald-400 focus:outline-none font-mono"
              />
              <p className="text-[11px] text-slate-400">
                입력하신 키는 브라우저 localStorage에 안전하게 보관되며 OpenAI API 호출 시에만 사용됩니다.
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
                className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-black transition-colors"
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
