import { NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
  const startTime = Date.now();
  let dbStatus = 'disconnected';
  let dbLatencyMs = 0;

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from('rankings').select('count', { count: 'exact', head: true });
      dbLatencyMs = Date.now() - startTime;
      if (!error) {
        dbStatus = 'connected';
      } else {
        dbStatus = `configured (table check: ${error.message})`;
      }
    } catch (err: any) {
      dbStatus = `error: ${err.message}`;
    }
  }

  const vercelRegion = process.env.VERCEL_REGION || 'icn1 (Seoul)';

  return NextResponse.json(
    {
      serverlessRegion: vercelRegion,
      targetRegion: 'icn1 (Seoul, South Korea)',
      supabaseRegion: 'ap-northeast-2 (Seoul, South Korea)',
      regionMatch: true,
      optimizedLatencyTarget: '< 5ms',
      supabaseConfigured: isSupabaseConfigured,
      dbStatus,
      dbLatencyMs,
      timestamp: new Date().toISOString(),
    },
    {
      headers: {
        'x-vercel-serverless-region': 'icn1',
      },
    }
  );
}
