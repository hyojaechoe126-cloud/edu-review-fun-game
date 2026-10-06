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

// Rich middle-school science focused mockup data (과학1, 과학2, 과학3)
export const INITIAL_POSTS: Post[] = [
  {
    id: 1,
    category: '과학1',
    title: '⚡ [과학1] 보일 법칙 vs 샤를 법칙 3초 암기 꿀팁!',
    content: `중1 기체의 성질 파트에서 꼭 시험에 나오는 보일 법칙과 샤를 법칙 구분법입니다!\n\n1. 보일 법칙 (온도 일정):\n- 압력이 2배가 되면 기체의 부피는 1/2로 줄어듭니다! (P × V = 일정)\n- 예: 높은 산에 올라가면 과자 봉지가 빵빵해지는 현상\n\n2. 샤를 법칙 (압력 일정):\n- 온도가 올라가면 기체의 부피가 늘어납니다!\n- 예: 찌그러진 탁구공을 뜨거운 물에 넣으면 다시 펴지는 현상\n\n퀴즈 배틀 풀 때 이 두 가지만 머릿속에 넣고 들어가세요!`,
    author: '중1과학마스터',
    created_at: '2026-10-06T18:10:00Z',
    likes: 54,
    views: 310,
    comments: [
      { id: 101, author: '시험만점노림', content: '탁구공 뜨거운 물 예시 덕분에 머리에 쏙 들어왔어요!', created_at: '2026-10-06 18:25' }
    ]
  },
  {
    id: 2,
    category: '과학2',
    title: '💡 [과학2] 옴의 법칙(V=IR)과 광합성 반응식 총정리',
    content: `중2 과학에서 가장 헷갈리는 전기와 식물 파트 요약입니다.\n\n1. 옴의 법칙:\n- V (전압, V) = I (전류, A) × R (저항, Ω)\n- 전류 = 전압 / 저항 (전압에 비례, 저항에 반비례)\n\n2. 광합성 필수 3요소:\n- 빛에너지 + 물(뿌리 흡수) + 이산화탄소(기공 흡수)\n- 결과물: 포도당(양분) + 산소\n\n중2 퀴즈 배틀에서 이 공식과 반응식으로 콤보 달성해 보세요!`,
    author: '과학2뿌시기',
    created_at: '2026-10-06T17:30:00Z',
    likes: 48,
    views: 275,
    comments: [
      { id: 201, author: '전기요정', content: 'V=IR 공식 암기 완료! 퀴즈 1위 도전합니다.', created_at: '2026-10-06 17:50' }
    ]
  },
  {
    id: 3,
    category: '과학3',
    title: '🌌 [과학3] 멘델의 유전 법칙과 역학적 에너지 보존',
    content: `중3 과학 핵심 총정리 노트:\n\n1. 멘델의 유전 법칙 3단계:\n- 우열의 원리: 대립 형질 중 우성만 발현\n- 분리의 법칙: 생식세포 형성 시 대립 유전자가 분리 (3:1 비)\n- 독립의 법칙: 두 쌍 이상의 형질이 서로 영향 없이 독립적으로 유전\n\n2. 역학적 에너지 보존:\n- 위치 에너지 + 운동 에너지 = 일정!\n- 롤러코스터 최고점 = 위치에너지 최대 / 최저점 = 운동에너지 최대`,
    author: '중3멘델_태양',
    created_at: '2026-10-06T16:45:00Z',
    likes: 41,
    views: 230,
    comments: [
      { id: 301, author: '예비고1', content: '멘델 유전비 3:1 나오는 거 퀴즈에서 바로 맞췄네요 ㅎㅎ', created_at: '2026-10-06 17:00' }
    ]
  },
];

export const INITIAL_RANKINGS: Ranking[] = [
  { id: 1, nickname: '중등과학왕_민우', score: 9950, played_at: '2026-10-06 19:15', subject: '과학1' },
  { id: 2, nickname: '빛과파동_서연', score: 9400, played_at: '2026-10-06 18:50', subject: '과학2' },
  { id: 3, nickname: '멘델마스터_태양', score: 8950, played_at: '2026-10-06 18:10', subject: '과학3' },
  { id: 4, nickname: '스피드러너_민재', score: 8300, played_at: '2026-10-06 17:30', subject: '미니게임' },
  { id: 5, nickname: '오옴의법칙_유진', score: 7900, played_at: '2026-10-06 16:45', subject: '과학2' },
  { id: 6, nickname: '보일샤를_동현', score: 7500, played_at: '2026-10-06 15:20', subject: '과학1' },
];
