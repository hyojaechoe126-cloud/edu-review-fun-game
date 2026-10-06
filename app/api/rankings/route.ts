import { NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured, INITIAL_RANKINGS, Ranking } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('rankings')
        .select('*')
        .order('score', { ascending: false })
        .limit(20);

      if (!error && data && data.length > 0) {
        return NextResponse.json({ source: 'supabase', data });
      }
    } catch (e) {
      console.error('Error fetching rankings from Supabase:', e);
    }
  }

  return NextResponse.json({ source: 'mockup', data: INITIAL_RANKINGS });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { nickname, score } = body;

    if (!nickname || score === undefined) {
      return NextResponse.json({ error: 'Missing nickname or score' }, { status: 400 });
    }

    const played_at = new Date().toISOString().replace('T', ' ').substring(0, 16);

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('rankings')
        .insert([{ nickname, score, played_at }])
        .select()
        .single();

      if (!error && data) {
        return NextResponse.json({ success: true, source: 'supabase', data });
      }
    }

    const newRanking: Ranking = {
      id: Date.now(),
      nickname,
      score,
      played_at,
    };

    return NextResponse.json({ success: true, source: 'local', data: newRanking });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
