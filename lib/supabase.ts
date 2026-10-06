import { createClient } from '@supabase/supabase-js';

export interface Post {
  id: string | number;
  title: string;
  content: string;
  author: string;
  created_at: string;
  likes: number;
}

export interface Ranking {
  id: string | number;
  nickname: string;
  score: number;
  played_at: string;
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Initial rich mockup data for out-of-the-box demonstration
export const INITIAL_POSTS: Post[] = [
  {
    id: 1,
    title: '⚡ [수학] 미적분 킬러문항 3초 풀이법 공유합니다!',
    content: '접선의 방정식과 극값의 관계를 이용하면 2026 수능 대비 기출 15번을 30초 안에 풀 수 있습니다. 다들 퀴즈 배틀에서 수학 만점 도전해 보세요!',
    author: '수학의신_민우',
    created_at: '2026-10-06T15:20:00Z',
    likes: 42,
  },
  {
    id: 2,
    title: '🌌 [물리] 광전효과 진동수랑 일함수 헷갈리는 사람 필독',
    content: '에너지 보존법칙 E = hf - W만 기억하면 이번 과학 퀴즈 5번 문제는 그냥 보너스 점수입니다. 콤보 점수 3배 노리세요!',
    author: '양자역학꿈나무',
    created_at: '2026-10-06T16:05:00Z',
    likes: 28,
  },
  {
    id: 3,
    title: '💻 [코딩] 파이썬 리스트 컴프리헨션 한 줄 컷 퀴즈',
    content: 'for문 3줄 쓸 거 [x**2 for x in arr if x%2==0] 로 끝내기. 정보올림피아드 기출 퀴즈 피드에 추가해 두었습니다.',
    author: '알고리즘마스터',
    created_at: '2026-10-06T17:10:00Z',
    likes: 35,
  },
  {
    id: 4,
    title: '⚔️ [한국사] 조선 후기 실학파 정약용 정조 개혁정치 요약',
    content: '수원 화성 축조, 거중기, 목민심서! 역사 배틀 랭킹 1위 탈환하고 갑니다. 덤벼보세요~',
    author: '역사덕후_지호',
    created_at: '2026-10-06T18:00:00Z',
    likes: 19,
  },
];

export const INITIAL_RANKINGS: Ranking[] = [
  { id: 1, nickname: '네온사이버_준혁', score: 9800, played_at: '2026-10-06 18:20' },
  { id: 2, nickname: '수학요정_서연', score: 9250, played_at: '2026-10-06 17:45' },
  { id: 3, nickname: '코딩장인_태양', score: 8900, played_at: '2026-10-06 16:30' },
  { id: 4, nickname: '하이퍼러너_민재', score: 8100, played_at: '2026-10-06 15:10' },
  { id: 5, nickname: '과학괴짜_유진', score: 7600, played_at: '2026-10-06 14:00' },
  { id: 6, nickname: '역사탐험가_동현', score: 7200, played_at: '2026-10-06 13:15' },
  { id: 7, nickname: '사이버펑크_하은', score: 6800, played_at: '2026-10-06 12:40' },
];
