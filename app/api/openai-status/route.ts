import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const hasEnvKey = Boolean(
    process.env.CHATGPT_APIKEY ||
    process.env.OPENAI_API_KEY ||
    process.env.NEXT_PUBLIC_CHATGPT_APIKEY ||
    process.env.NEXT_PUBLIC_OPENAI_API_KEY
  );

  return NextResponse.json({
    configured: hasEnvKey,
    source: hasEnvKey ? 'vercel-environment' : 'none',
  });
}
