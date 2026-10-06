import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const GPT_61_SOL_SYSTEM_PROMPT = `당신은 OpenAI가 개발한 차세대 과학 특화 초지능 AI 모델 [GPT-6.1Sol (Solaris Deep Science)]입니다.
대한민국 중학교 및 고등학교 과학(과학1, 과학2, 과학3, 통합과학) 학습을 돕는 최고 수준의 과학 교육 멘토입니다.

[핵심 행동 원칙]
1. 사용자의 질문에 정확하고 자연스러우며 깊이 있는 과학적 설명을 한국어로 제공하세요.
2. 핀트를 벗어나지 않고, 사용자가 질문한 바로 그 핵심 개념(물리, 화학, 생명과학, 지구과학)에 100% 집중하여 명쾌하게 답변하세요.
3. 중·고등학생의 이해도에 맞추어 직관적인 비유, 미시적 입자 모형(원자·분자 운동 및 거리), 그리고 명확한 공식과 단위(℃, N, J, V, Ω, m/s 등)를 체계적으로 정리해 주세요.
4. 마크다운 문법(글머리 기호, 굵은 글씨, 코드 블록, 공식)을 깔끔하게 사용하여 시각적으로 읽기 편하게 구성하세요.
5. 학생이 그림이나 사진, 도해를 요청한 경우, 개념을 생생하게 묘사해 주면서 시각 자료가 함께 생성되었음을 친절하게 안내하세요.`;

const GPT_54_MINI_SYSTEM_PROMPT = `당신은 OpenAI의 초고속 경량화 과학 탐구 AI 모델 [GPT-5.4Mini (Quantum Express)]입니다.
대한민국 중·고등 과학 개념을 신속하고 직관적이며 친근하게 설명하는 전문 과학 튜터입니다.

[핵심 행동 원칙]
1. 군더더기 없이 빠르고 명쾌하게 핵심 과학 원리를 한국어로 설명하세요.
2. 질문의 요점에 정확히 집중하여 핀트를 벗어나지 않는 맞춤형 설명을 제공하세요.
3. 쉬운 비유와 실생활 예시를 통해 학생이 단번에 원리를 이해할 수 있도록 도와주세요.`;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { 
      messages = [], 
      model = 'gpt-6.1-sol', 
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
        reply: `⚠️ **OpenAI API 키가 필요합니다.**\n\n- **Vercel 배포 환경**: Vercel 대시보드(Settings > Environment Variables)에 \`CHATGPT_APIKEY\`를 설정하시면 프로덕션 환경에서 자동으로 연결됩니다.\n- **즉시 사용**: 상단 우측의 **[🔑 OpenAI 키 설정]** 버튼을 눌러 발급받으신 OpenAI API 키(\`sk-...\`)를 입력하시면 즉시 \`${model === 'gpt-6.1-sol' ? 'GPT-6.1Sol' : 'GPT-5.4Mini'}\`와 대화할 수 있습니다!`,
        source: 'api-key-required',
        isKeyMissing: true,
      });
    }

    const isGpt61 = model === 'gpt-6.1-sol';
    const systemPrompt = isGpt61 ? GPT_61_SOL_SYSTEM_PROMPT : GPT_54_MINI_SYSTEM_PROMPT;
    const modelBadge = isGpt61 ? 'GPT-6.1Sol' : 'GPT-5.4Mini';

    const gradeContext = gradeCategory !== 'all' 
      ? `\n[현재 학습 집중 단원: ${gradeCategory === 'sci1' ? '중1 과학1' : gradeCategory === 'sci2' ? '중2 과학2' : '중3 과학3'}]`
      : '';

    const sanitizedMessages = messages
      .filter((m: any) => m.content && (m.role === 'user' || m.role === 'assistant'))
      .slice(-10)
      .map((m: any) => ({
        role: m.role,
        content: m.content,
      }));

    // Map to the highest-capability OpenAI execution engine
    // gpt-6.1-sol utilizes OpenAI's flagship gpt-4o engine
    // gpt-5.4-mini utilizes OpenAI's fast gpt-4o-mini engine
    const backendEngine = isGpt61 ? 'gpt-4o' : 'gpt-4o-mini';

    const chatPayload = {
      model: backendEngine,
      messages: [
        { role: 'system', content: systemPrompt + gradeContext },
        ...sanitizedMessages,
      ],
      temperature: isGpt61 ? 0.7 : 0.6,
      max_tokens: 1800,
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
        reply: `⚠️ **OpenAI ${modelBadge} 호출 오류 (코드: ${openaiRes.status})**\n\n> ${detail}\n\n• API 키가 유효한지, 또는 계정 크레딧 한도가 초과되지 않았는지 확인해 주세요. 상단 **[🔑 OpenAI 키 설정]**에서 언제든 키를 교체할 수 있습니다.`,
        source: 'openai-error',
        errorDetail: detail,
      });
    }

    const openAiData = await openaiRes.json();
    const reply = openAiData.choices?.[0]?.message?.content || `${modelBadge}로부터 응답을 수신하지 못했습니다. 다시 시도해 주세요.`;

    return NextResponse.json({
      reply,
      source: `openai-${modelBadge.toLowerCase()}`,
      model: modelBadge,
      backendEngine,
    });

  } catch (err: any) {
    console.error('Science Tutor API Error:', err);
    return NextResponse.json(
      { 
        reply: `통신 오류가 발생했습니다: ${err.message || '네트워크 상태를 확인해 주세요.'}`,
        source: 'server-error',
      },
      { status: 500 }
    );
  }
}
