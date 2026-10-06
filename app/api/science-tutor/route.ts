import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const CHATGPT_SCIENCE_SYSTEM_PROMPT = `You are ChatGPT, an advanced AI developed by OpenAI, serving as a dedicated, brilliant, and friendly Science Education Mentor for middle and high school students (Korean curriculum: 과학1, 과학2, 과학3, and integrated science).

[Guidelines]
1. Answer the student's question accurately, directly, and naturally in Korean.
2. Directly address the exact topic the student asks about without getting sidetracked or outputting unrelated canned text.
3. Tailor explanations to middle/high school students: intuitive analogies, particle models, clear scientific principles, and accurate formulas (e.g. Ohm's Law, Boyle/Charles Laws, Chemical Equations, Conservation of Mechanical Energy).
4. Use clean Markdown formatting (bullet points, bold text, code blocks, math formulas).
5. If the student asks for a drawing, picture, illustration, or visual diagram, provide a descriptive visual explanation and let them know they can click the 'DALL-E 3 이미지 생성' button or that DALL-E can generate it for them.
6. Maintain an encouraging, intellectual, and supportive mentor tone.`;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { 
      messages = [], 
      model = 'gpt-4o-mini', 
      gradeCategory = 'all', 
      apiKey: clientKey = '' 
    } = body;

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
        reply: `⚠️ **OpenAI API 키가 설정되지 않았습니다.**\n\n- **Vercel 배포 환경**: Vercel 대시보드(Settings > Environment Variables)에 \`CHATGPT_APIKEY\`를 등록해 두셨다면 새 빌드(Redeploy) 후 프로덕션 사이트에서 자동 적용됩니다.\n- **현재 화면에서 즉시 사용**: 상단 우측의 **[🔑 OpenAI 키 설정]** 버튼을 눌러 OpenAI API 키(\`sk-...\`)를 입력하시면 즉시 정품 ChatGPT와 대화하실 수 있습니다!`,
        source: 'api-key-required',
        isKeyMissing: true,
      });
    }

    // Prepare message array for OpenAI Chat Completions API
    const gradeContext = gradeCategory !== 'all' 
      ? `\n[Current Grade Focus: ${gradeCategory === 'sci1' ? 'Middle School Science 1 (중1 과학)' : gradeCategory === 'sci2' ? 'Middle School Science 2 (중2 과학)' : 'Middle School Science 3 (중3 과학)'}]`
      : '';

    const sanitizedMessages = messages
      .filter((m: any) => m.content && (m.role === 'user' || m.role === 'assistant'))
      .slice(-10)
      .map((m: any) => ({
        role: m.role,
        content: m.content,
      }));

    const chatPayload = {
      model: model === 'gpt-4o' ? 'gpt-4o' : 'gpt-4o-mini',
      messages: [
        { role: 'system', content: CHATGPT_SCIENCE_SYSTEM_PROMPT + gradeContext },
        ...sanitizedMessages,
      ],
      temperature: 0.7,
      max_tokens: 1500,
    };

    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify(chatPayload),
    });

    if (!openaiRes.ok) {
      const errText = await openaiRes.text();
      console.error('OpenAI API Error:', openaiRes.status, errText);

      let detail = errText;
      try {
        const parsed = JSON.parse(errText);
        detail = parsed.error?.message || errText;
      } catch {}

      return NextResponse.json({
        reply: `⚠️ **OpenAI ChatGPT 호출 오류 (코드: ${openaiRes.status})**\n\n> ${detail}\n\n• API 키가 올바른지, 또는 OpenAI 계정의 크레딧 잔액을 확인해 주세요. 상단 **[🔑 OpenAI 키 설정]**에서 새로운 키로 변경할 수 있습니다.`,
        source: 'openai-error',
        errorDetail: detail,
      });
    }

    const openAiData = await openaiRes.json();
    const reply = openAiData.choices?.[0]?.message?.content || 'OpenAI ChatGPT로부터 응답을 받지 못했습니다. 다시 시도해 주세요.';

    return NextResponse.json({
      reply,
      source: 'official-openai-chatgpt',
      model: openAiData.model || model,
    });

  } catch (err: any) {
    console.error('Science Tutor API Error:', err);
    return NextResponse.json(
      { 
        reply: `통신 중 오류가 발생했습니다: ${err.message || '네트워크 상태를 확인해 주세요.'}`,
        source: 'server-error',
      },
      { status: 500 }
    );
  }
}
