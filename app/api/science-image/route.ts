import { NextResponse } from 'next/server';
import { generateScienceImage } from '@/lib/science-visuals';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { prompt = '', grade = 'all' } = body;

    const apiKey = (process.env.CHATGPT_APIKEY || process.env.OPENAI_API_KEY || '').trim();

    const visualResult = await generateScienceImage(prompt, apiKey);

    return NextResponse.json({
      success: true,
      imageUrl: visualResult.imageUrl,
      source: visualResult.source,
      caption: visualResult.caption,
      revisedPrompt: visualResult.revisedPrompt,
    });

  } catch (error: any) {
    console.error('Science Image Route Error:', error);
    const { generateScienceSvgDiagram } = await import('@/lib/science-visuals');
    const fallback = generateScienceSvgDiagram('과학 개념 탐구');
    return NextResponse.json({
      success: true,
      imageUrl: fallback.svgDataUri,
      source: 'fallback-svg',
      caption: fallback.caption
    });
  }
}
