-- ========================================================
-- EDU REVIEW FUN GAME - Supabase SQL Schema (Seoul Region)
-- ========================================================

-- 1. Create 게시물 테이블 (posts)
CREATE TABLE IF NOT EXISTS public.posts (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  likes INTEGER DEFAULT 0
);

-- 2. Create 점수 랭킹 테이블 (rankings)
CREATE TABLE IF NOT EXISTS public.rankings (
  id BIGSERIAL PRIMARY KEY,
  nickname TEXT NOT NULL,
  score INTEGER NOT NULL,
  played_at TEXT NOT NULL
);

-- 3. Enable Row Level Security (RLS) & Policies
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rankings ENABLE ROW LEVEL SECURITY;

-- Allow public read & write (anon access) for educational app demo
CREATE POLICY "Allow public read access to posts" ON public.posts
  FOR SELECT USING (true);

CREATE POLICY "Allow public insert to posts" ON public.posts
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update likes to posts" ON public.posts
  FOR UPDATE USING (true);

CREATE POLICY "Allow public read access to rankings" ON public.rankings
  FOR SELECT USING (true);

CREATE POLICY "Allow public insert to rankings" ON public.rankings
  FOR INSERT WITH CHECK (true);

-- Insert Initial Sample Data
INSERT INTO public.posts (title, content, author, likes)
VALUES
  ('⚡ [수학] 미적분 킬러문항 3초 풀이법 공유합니다!', '접선의 방정식과 극값의 관계를 이용하면 2026 수능 대비 기출 15번을 30초 안에 풀 수 있습니다. 다들 퀴즈 배틀에서 수학 만점 도전해 보세요!', '수학의신_민우', 42),
  ('🌌 [물리] 광전효과 진동수랑 일함수 헷갈리는 사람 필독', '에너지 보존법칙 E = hf - W만 기억하면 이번 과학 퀴즈 5번 문제는 그냥 보너스 점수입니다. 콤보 점수 3배 노리세요!', '양자역학꿈나무', 28),
  ('💻 [코딩] 파이썬 리스트 컴프리헨션 한 줄 컷 퀴즈', 'for문 3줄 쓸 거 [x**2 for x in arr if x%2==0] 로 끝내기. 정보올림피아드 기출 퀴즈 피드에 추가해 두었습니다.', '알고리즘마스터', 35),
  ('⚔️ [한국사] 조선 후기 실학파 정약용 정조 개혁정치 요약', '수원 화성 축조, 거중기, 목민심서! 역사 배틀 랭킹 1위 탈환하고 갑니다. 덤벼보세요~', '역사덕후_지호', 19);

INSERT INTO public.rankings (nickname, score, played_at)
VALUES
  ('네온사이버_준혁', 9800, '2026-10-06 18:20'),
  ('수학요정_서연', 9250, '2026-10-06 17:45'),
  ('코딩장인_태양', 8900, '2026-10-06 16:30'),
  ('하이퍼러너_민재', 8100, '2026-10-06 15:10'),
  ('과학괴짜_유진', 7600, '2026-10-06 14:00'),
  ('역사탐험가_동현', 7200, '2026-10-06 13:15');
