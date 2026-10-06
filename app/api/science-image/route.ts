import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { prompt = '', apiKey: clientKey = '' } = body;

    const customKey = req.headers.get('x-openai-key') || clientKey || '';
    const apiKey = (
      customKey ||
      process.env.CHATGPT_APIKEY ||
      process.env.OPENAI_API_KEY ||
      process.env.NEXT_PUBLIC_CHATGPT_APIKEY ||
      process.env.NEXT_PUBLIC_OPENAI_API_KEY ||
      ''
    ).trim();

    if (!apiKey) {
      return NextResponse.json({
        success: false,
        error: 'API_KEY_REQUIRED',
        message: 'OpenAI API 키가 필요합니다. 상단의 [🔑 OpenAI 키 설정]을 눌러 등록하거나 Vercel 환경변수 CHATGPT_APIKEY를 등록해 주세요.',
      }, { status: 400 });
    }

    if (!prompt.trim()) {
      return NextResponse.json({
        success: false,
        error: 'PROMPT_EMPTY',
        message: '생성할 그림이나 사진의 주제를 입력해 주세요.',
      }, { status: 400 });
    }

    // Step 1: Optimize and translate prompt into precise English for DALL-E 3 using ChatGPT
    let refinedPrompt = prompt;
    try {
      const gptRes = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: 'You are an expert prompt engineer for OpenAI DALL-E 3. Convert the user\'s science request into an accurate, highly detailed, visually clear educational English illustration prompt. Ensure it directly and accurately depicts the exact science topic requested without off-topic elements. Output ONLY the prompt string.',
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          temperature: 0.5,
          max_tokens: 250,
        }),
      });

      if (gptRes.ok) {
        const gptData = await gptRes.json();
        const optimized = gptData.choices?.[0]?.message?.content?.trim();
        if (optimized) {
          refinedPrompt = optimized;
        }
      }
    } catch (refineErr) {
      console.warn('Prompt refine warning:', refineErr);
    }

    // Step 2: Call official OpenAI DALL-E 3 Image Generation API
    const dalle3Res = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt: refinedPrompt,
        n: 1,
        size: '1024x1024',
        quality: 'standard',
      }),
    });

    if (dalle3Res.ok) {
      const dalleData = await dalle3Res.json();
      const imageUrl = dalleData.data?.[0]?.url;
      const revised = dalleData.data?.[0]?.revised_prompt;

      if (imageUrl) {
        return NextResponse.json({
          success: true,
          imageUrl,
          model: 'dall-e-3',
          caption: `OpenAI DALL-E 3 생성: ${prompt}`,
          revisedPrompt: revised || refinedPrompt,
        });
      }
    }

    // Step 3: If DALL-E 3 fails, try DALL-E 2
    const d3ErrText = await dalle3Res.text();
    console.warn('DALL-E 3 returned error, trying DALL-E 2:', d3ErrText);

    const dalle2Res = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'dall-e-2',
        prompt: refinedPrompt.slice(0, 400),
        n: 1,
        size: '512x512',
      }),
    });

    if (dalle2Res.ok) {
      const d2Data = await dalle2Res.json();
      const imageUrl = d2Data.data?.[0]?.url;
      if (imageUrl) {
        return NextResponse.json({
          success: true,
          imageUrl,
          model: 'dall-e-2',
          caption: `OpenAI DALL-E 생성: ${prompt}`,
          revisedPrompt: refinedPrompt,
        });
      }
    }

    const d2ErrData = await dalle2Res.json().catch(() => ({}));
    let errorMessage = 'OpenAI DALL-E 이미지 생성에 실패했습니다.';
    try {
      const parsedD3 = JSON.parse(d3ErrText);
      errorMessage = parsedD3.error?.message || d2ErrData.error?.message || errorMessage;
    } catch {
      errorMessage = d2ErrData.error?.message || errorMessage;
    }

    return NextResponse.json({
      success: false,
      error: 'DALLE_API_ERROR',
      message: `OpenAI 이미지 생성 오류: ${errorMessage}`,
    }, { status: 400 });

  } catch (error: any) {
    console.error('Science Image API Error:', error);
    return NextResponse.json({
      success: false,
      error: 'SERVER_ERROR',
      message: `서버 통신 오류: ${error.message || '잠시 후 다시 시도해 주세요.'}`,
    }, { status: 500 });
  }
}
