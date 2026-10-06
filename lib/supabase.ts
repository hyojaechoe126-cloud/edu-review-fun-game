import { createClient } from '@supabase/supabase-js';

export interface Comment {
  id: string | number;
  author: string;
  content: string;
  created_at: string;
}

export interface Post {
  id: string | number;
  title: string;
  content: string;
  author: string;
  created_at: string;
  likes: number;
  category?: string;
  views?: number;
  comments?: Comment[];
}

export interface Ranking {
  id: string | number;
  nickname: string;
  score: number;
  played_at: string;
  subject?: string;
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Rich science-focused mockup data for out-of-the-box experience
export const INITIAL_POSTS: Post[] = [
  {
    id: 1,
    category: '물리',
    title: '🌌 [물리] 광전효과 진동수(f)와 일함수(W) 공식 3초 암기법',
    content: `광전효과에서 가장 많이 틀리는 핵심은 '빛의 세기'와 '빛의 진동수'의 차이입니다!\n\n1. 빛의 진동수(f) > 한계진동수(f₀) 이어야만 전자가 즉시 튀어나옵니다.\n2. 최대 운동에너지 E_k = hf - W (일함수 W = hf₀)\n3. 빛의 세기가 세지면? 나오는 광전자의 '개수'만 증가할 뿐, 각각의 전자가 가지는 운동에너지는 그대로입니다!\n\n물리 퀴즈 배틀에서 이 개념만 잡아도 3문제는 거저 맞춥니다. 다들 만점 도전해보세요!`,
    author: '양자역학_준혁',
    created_at: '2026-10-06T18:10:00Z',
    likes: 58,
    views: 342,
    comments: [
      { id: 101, author: '아인슈타인팬', content: '빛의 세기랑 진동수 매번 헷갈렸는데 깔끔하게 정리되었네요 감사합니다!', created_at: '2026-10-06 18:25' },
      { id: 102, author: '물리만점가자', content: 'E=hf-W 공식 덕분에 퀴즈 3연속 콤보 성공했습니다 ㅎㅎ', created_at: '2026-10-06 18:40' }
    ]
  },
  {
    id: 2,
    category: '화학',
    title: '🧪 [화학] 주기율표 1~20번 원소기호 & 원자가전자 한 방에 끝내기',
    content: `주기율표 외우기 힘든 친구들을 위한 리듬 암기 공식입니다.\n\n수(H) - 헬(He) - 리(Li) - 베(Be) - 붕(B) - 탄(C) - 질(N) - 산(O) - 플(F) - 네(Ne)\n나(Na) - 마(Mg) - 알(Al) - 규(Si) - 인(P) - 황(S) - 염(Cl) - 아(Ar) - 크(K) - 카(Ca)\n\n📌 꿀팁:\n- 18족 비활성 기체(He, Ne, Ar)는 최외각 전자가 8개(He는 2개)이지만 '원자가 전자는 0개'라는 점 시험 단골 출제 포인트입니다!`,
    author: '주기율표마스터',
    created_at: '2026-10-06T17:30:00Z',
    likes: 47,
    views: 289,
    comments: [
      { id: 201, author: '화학꿈나무', content: '원자가전자 0개인거 저번 시험에서 틀렸었는데 복습 제대로 하네요!', created_at: '2026-10-06 17:50' }
    ]
  },
  {
    id: 3,
    category: '생명과학',
    title: '🧬 [생명과학] 광합성과 세포호흡 화학반응식 비교 정리',
    content: `식물의 광합성과 동식물의 세포호흡은 서로 정반대의 반응식입니다.\n\n☀️ 광합성 (엽록체):\n6CO₂ + 6H₂O + 빛에너지 → C₆H₁₂O₆ (포도당) + 6O₂\n\n⚡ 세포호흡 (미토콘드리아):\nC₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + 38 ATP (에너지)\n\n동화작용(에너지 흡수) vs 이화작용(에너지 방출) 구분하는 문제 꼭 나옵니다!`,
    author: '세포생물학_서연',
    created_at: '2026-10-06T16:45:00Z',
    likes: 39,
    views: 215,
    comments: [
      { id: 301, author: '생명과학러', content: '미토콘드리아 엽록체 헷갈렸는데 완벽 이해!', created_at: '2026-10-06 17:00' }
    ]
  },
  {
    id: 4,
    category: '지구과학',
    title: '🌍 [지구과학] 판구조론 3대 판의 경계와 화산/지진 발생 정리',
    content: `지구과학 판의 경계 3가지 확실하게 외우는 법:\n\n1. 발산형 경계 (멀어짐): 대서양 중앙 해령, 열곡대 → 천발 지진, 화산 활동 활발\n2. 수렴형 경계 (모여듦): 해구, 호상열도, 습곡산맥(히말라야) → 천발~심발 지진, 화산 활동\n3. 보존형 경계 (어긋남): 산안드레아스 단층, 변환단층 → 천발 지진 발생, ★화산 활동 없음★\n\n변환단층에는 화산 활동이 없다는 게 킬러 보기입니다!`,
    author: '지구지킴이_태양',
    created_at: '2026-10-06T15:20:00Z',
    likes: 33,
    views: 180,
    comments: []
  },
];

export const INITIAL_RANKINGS: Ranking[] = [
  { id: 1, nickname: '양자마스터_민우', score: 9950, played_at: '2026-10-06 19:15', subject: '물리' },
  { id: 2, nickname: '주기율표의신_서연', score: 9400, played_at: '2026-10-06 18:50', subject: '화학' },
  { id: 3, nickname: 'DNA닥터_태양', score: 8950, played_at: '2026-10-06 18:10', subject: '생명과학' },
  { id: 4, nickname: '우주천문학자_민재', score: 8300, played_at: '2026-10-06 17:30', subject: '지구과학' },
  { id: 5, nickname: '노벨과학상_유진', score: 7900, played_at: '2026-10-06 16:45', subject: '융합과학' },
  { id: 6, nickname: '사이언스펄스_동현', score: 7500, played_at: '2026-10-06 15:20', subject: '미니게임' },
];
