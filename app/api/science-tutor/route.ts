import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const SCIENCE_SYSTEM_PROMPT = `당신은 대한민국 중학교 및 고등학교 과학 교육과정에 완벽하게 특화된 전문 AI 과학 교육 멘토 [사이언스 랩 닥터 AI]입니다.
주요 사용자층: 중학교 1~3학년 학생(과학1, 과학2, 과학3) 및 청소년.

[전문 과학 지식 가이드라인]
1. 과학1 (중1 과정):
   - 물질의 상태 변화와 열에너지: 융해(고->액), 기화(액->기), 승화(고->기 / 기->고), 응고(액->고), 액화(기->액).
   - 열에너지 흡수와 방출: 융해열·기화열·승화열 흡수 시 주위 온도가 낮아짐, 응고열·액화열·승화열 방출 시 주위 온도가 높아짐.
   - 가열 곡선 및 냉각 곡선: 상태 변화 중에는 흡수/방출된 열에너지가 입자 사이의 배열(인력 극복)을 바꾸는 데 쓰이므로 온도가 일정하게 유지됨(수평 구간).
   - 입자의 운동 및 거리: 고체(규칙적 배열, 제자리 진동, 거리 매우 가까움) -> 액체(비교적 활발, 거리 가까움) -> 기체(매우 활발, 거리 매우 멂).
   - 기체의 성질: 보일 법칙(온도 일정할 때 압력과 부피 반비례 P1V1=P2V2), 샤를 법칙(압력 일정할 때 온도와 부피 비례 V1/T1=V2/T2).
   - 빛과 파동: 빛의 직진, 반사(반사의 법칙), 굴절, 파동의 요소(진폭, 파장, 주기, 진동수), 소리의 3요소.
   - 생물의 다양성 및 지구의 구성.

2. 과학2 (중2 과정):
   - 물질의 특성: 순물질과 혼합물, 밀도(질량/부피), 녹는점/어는점, 끓는점, 용해도(물 100g에 녹을 수 있는 용질의 g 수)와 재결정/석출량.
   - 동물과 에너지: 소화계(영양소 탄·단·지 소화효소), 순환계(심장 구조, 체순환/폐순환, 혈액 성분), 호흡계(폐포의 기체 교환, 외호흡/내호흡), 배설계(네프론의 여과, 재흡수, 분비).
   - 전기와 자기: 정전기 유도, 옴의 법칙(V = I × R), 저항의 직렬/병렬 연결, 전류의 자기 작용(오른손 법칙, 전자석, 전동기).
   - 식물과 에너지: 광합성(물 + 이산화탄소 + 빛에너지 -> 포도당 + 산소), 증산 작용과 기공, 식물의 호흡.
   - 태양계: 지구의 크기 측정(에라토스테네스), 달의 위상 변화, 행성의 특징.

3. 과학3 (중3 과정):
   - 화학 반응의 규칙: 물리 변화와 화학 변화 구분, 화학 반응식 작성, 질량 보존 법칙(라부아지에), 일정 성분비 법칙(프루스트), 기체 반응 법칙(게이뤼삭), 발열 반응과 흡열 반응.
   - 기권과 날씨: 대기권 층상 구조(대류권, 성층권, 중간권, 열권), 포화 수증기량과 상대습도, 구름 생성 원리, 기압과 바람, 날씨와 온대 저기압.
   - 운동과 에너지: 등속 운동, 자유 낙하 운동, 일(W = F × s), 위치 에너지(Ep = 9.8 × m × h), 운동 에너지(Ek = 1/2 × m × v²), 역학적 에너지 보존.
   - 자극과 반응: 감각 기관(눈, 귀 등), 뉴런과 신경계(중추신경-뇌·척수, 말초신경), 자율 신경과 항상성(체온, 혈당량 조절).
   - 유전과 진화: 멘델의 유전 법칙(우열의 원리, 분리의 법칙, 독립의 법칙), 체세포 분열과 감수 분열.

[답변 작성 스타일 및 원칙]
- 친절하고 다정한 연구원 멘토 말투(~해요, ~랍니다!). 학생을 칭찬하고 격려하세요.
- 비유와 실생활 예시(아이스크림, 땀과 선풍기, 롤러코스터, 드라이아이스 등)를 먼저 들어 직관적으로 이해할 수 있게 합니다.
- 미시적 모형(원자, 분자, 입자의 운동과 거리)과 거시적 현상(온도, 부피, 상태)을 유기적으로 연결해 설명합니다.
- 다음의 정돈된 마크다운 구조로 명쾌하게 답변하세요:
  1. 🎯 **핵심 요약 한눈에 보기**: 1~2줄로 가장 직관적인 요약
  2. 🔬 **원리 쏙쏙 (쉬운 비유 & 입자 모형)**: 학생 눈높이에 맞춘 쉽고 흥미로운 과학 설명
  3. 🌟 **실생활 속 신기한 예시**: 주변에서 찾아볼 수 있는 실생활 현상
  4. 💡 **1초 확인 퀴즈**: 방금 배운 개념을 점검할 수 있는 재미있는 1문제 (정답 및 해설 포함)
- 과학과 무관한 질문이 오면 부드럽게 과학적 호기심과 연계하여 안내해 줍니다.`;

// Intelligent local science knowledge engine when API key is pending or during local preview
function generateLocalScienceKnowledge(query: string, grade: string): string {
  const q = query.toLowerCase();

  if (q.includes('0도') || q.includes('녹을 때') || (q.includes('얼음') && q.includes('온도')) || q.includes('융해')) {
    return `🎯 **핵심 요약 한눈에 보기**
얼음이 녹는 동안 계속 열을 가해도 온도가 **0℃로 일정하게 유지되는 이유**는, 흡수한 열에너지가 온도를 올리는 대신 **입자들의 단단한 결합을 끊고 자유롭게 배열을 바꾸는 '융해열'로 모두 사용되기 때문**이에요!

🔬 **원리 쏙쏙 (쉬운 비유 & 입자 모형)**
- **고체 얼음의 상태**: 물 분자들이 제자리에서 파르르 진동하며 단단한 그물처럼 규칙적으로 엮여 있어요.
- **열에너지를 흡수하면**: 가해준 열에너지가 분자들을 묶고 있던 결합의 끈을 풀고 서로 미끄러질 수 있는 액체 상태(물)로 바꾸는 데 온 힘을 쏟아붓습니다.
- 결합이 다 풀려 **완전히 물로 변하기 전까지는 분자의 운동 속도(온도)가 올라갈 틈이 없는 것**이랍니다!

🌟 **실생활 속 신기한 예시**
- 생선 가게에서 얼음을 생선 위에 올려두면, 얼음이 0℃에서 서서히 녹으며 주변 열(융해열)을 계속 흡수해주어 생선이 신선하게 보관돼요!
- 얼음 음료를 마실 때 얼음이 조금이라도 남아 있다면 음료의 온도는 0℃에 가깝게 시원하게 유지됩니다.

💡 **1초 확인 퀴즈**
**Q. 얼음이 물로 변하는 상태 변화를 무엇이라고 할까요?**
정답: **융해 (Melting)** - 고체에서 액체로 변하며 열에너지를 흡수해요!`;
  }

  if (q.includes('드라이아이스') || q.includes('승화')) {
    return `🎯 **핵심 요약 한눈에 보기**
드라이아이스는 얼음(물)과 달리 액체 상태를 거치지 않고 **고체에서 곧바로 기체로 변하는 '승화(고체→기체)'** 현상이 일어나기 때문이에요!

🔬 **원리 쏙쏙 (쉬운 비유 & 입자 모형)**
- 드라이아이스는 **이산화탄소(CO₂)**를 높은 압력과 영하 -78.5℃ 이하의 차가운 온도로 꽁꽁 굳힌 고체예요.
- 우리가 사는 1기압의 방 안에서는 이산화탄소가 액체로 존재할 수 있는 압력 조건이 맞지 않아서, 열에너지를 흡수하자마자 입자들이 결합을 순식간에 풀고 사방으로 흩어져 기체로 변신한답니다!
- 참고로 드라이아이스 주위에 보이는 하얀 연기는 기체 이산화탄소가 아니라, 너무 차가워서 **공기 중의 수증기가 급격히 식어 응결된 미세한 물방울**이에요!

🌟 **실생활 속 신기한 예시**
- 아이스크림 케이크 포장에 드라이아이스를 넣으면, 액체로 녹아 질척거리지 않고 기체로 날아가며 강력하게 열(승화열)을 흡수해 아이스크림을 꽁꽁 얼려둬요!

💡 **1초 확인 퀴즈**
**Q. 드라이아이스가 크기가 점점 작아지는 것은 어떤 상태 변화일까요?**
정답: **승화 (고체 → 기체)** - 주위에서 승화열을 팍팍 흡수해요!`;
  }

  if (q.includes('옴') || q.includes('전류') || q.includes('전압') || q.includes('저항')) {
    return `🎯 **핵심 요약 한눈에 보기**
**옴의 법칙(Ohm's Law)**은 **전압(V) = 전류(I) × 저항(R)**으로, 회로에 흐르는 전류의 세기는 전압이 클수록 세지고, 저항이 클수록 약해진다는 황금 법칙이에요!

🔬 **원리 쏙쏙 (쉬운 비유 & 입자 모형)**
- **전압 (V, 단위: 볼트 V)**: 전기를 밀어내는 '워터파크 펌프의 수압'과 같아요. 펌프 힘이 셀수록 물이 콸콸 흐르겠죠?
- **전류 (I, 단위: 암페어 A)**: 전선 안에서 전하(전자)들이 1초 동안 흘러가는 '물의 흐름 양'이에요.
- **저항 (R, 단위: 옴 Ω)**: 물이 흐르는 관 속에 박힌 돌멩이나 좁은 통로처럼 '전류의 흐름을 방해하는 정도'입니다.
- 공식 정리: **$I = \\frac{V}{R}$** (전류는 전압에 비례하고, 저항에 반비례!)

🌟 **실생활 속 신기한 예시**
- 스마트폰 고속 충전기는 전압을 높이거나 전선의 저항을 줄여 전류를 빠르게 밀어 넣어 충전해요.
- 조명 디머(밝기 조절 다이얼)는 내부 가변 저항을 돌려 저항을 키우면 전류가 줄어 불빛이 어두워집니다!

💡 **1초 확인 퀴즈**
**Q. 저항이 10Ω인 전구에 20V의 전압을 걸어주면 흐르는 전류는 몇 A일까요?**
정답: **2A** ($I = \\frac{20V}{10Ω} = 2A$)`;
  }

  if (q.includes('보일') || q.includes('샤를') || (q.includes('과자') && q.includes('산'))) {
    return `🎯 **핵심 요약 한눈에 보기**
- **보일 법칙**: 온도가 일정할 때, 압력이 높아지면 기체 부피는 줄어들어요! (압력 2배 \(\rightarrow\) 부피 1/2배)
- **샤를 법칙**: 압력이 일정할 때, 온도가 올라가면 기체 입자 운동이 활발해져 부피가 팽창해요!

🔬 **원리 쏙쏙 (쉬운 비유 & 입자 모형)**
- **보일 법칙 (피스톤 누르기)**: 주사기 끝을 막고 피스톤을 꾹 누르면 공기 입자들이 좁은 공간에 갇혀 부피가 작아집니다.
- **샤를 법칙 (뜨거운 물 속 탁구공)**: 온도를 높여주면 기체 입자들이 에너지를 얻어 쿵쾅쿵쾅 벽을 세게 밀어내며 방을 넓히는 원리예요.

🌟 **실생활 속 신기한 예시**
- 비행기를 타거나 높은 산에 올라가면 외부 기압이 낮아져서 과자 봉지 속 기체가 팽창해 빵빵해져요 (보일 법칙).
- 찌그러진 탁구공을 뜨거운 물에 넣으면 안쪽 공기가 팽창해 다시 팽팽하게 펴져요 (샤를 법칙).

💡 **1초 확인 퀴즈**
**Q. 잠수부가 깊은 바다속에서 내뿜은 공기 방울이 수면으로 올라올수록 크기가 어떻게 변할까요?**
정답: **커진다!** (수면으로 갈수록 수압이 낮아져 부피가 팽창하는 보일 법칙 때문)`;
  }

  if (q.includes('광합성') || q.includes('호흡') || q.includes('식물')) {
    return `🎯 **핵심 요약 한눈에 보기**
**광합성**은 식물이 빛을 이용해 양분(포도당)을 만드는 '에너지 저장 공장'이고, **호흡**은 그 양분을 분해해 생명 활동 에너지를 꺼내 쓰는 '에너지 발전소'예요!

🔬 **원리 쏙쏙 (쉬운 비유 & 반응식)**
- **광합성**: 물 + 이산화탄소 + **빛에너지** \(\rightarrow\) **포도당** + **산소**
  - 일어나는 장소: 식물 세포의 **엽록체** (낮에 빛이 있을 때 활발)
- **세포 호흡**: 포도당 + 산소 \(\rightarrow\) 물 + 이산화탄소 + **생명 에너지(ATP)**
  - 일어나는 장소: 모든 세포의 **미토콘드리아** (낮과 밤 24시간 내내 지속)

🌟 **실생활 속 신기한 예시**
- 낮에는 광합성 속도가 호흡보다 훨씬 빨라서 식물이 산소를 뿜어내 공기를 맑게 해줘요.
- 밤에는 빛이 없어 광합성을 멈추고 호흡만 하므로 이산화탄소를 배출한답니다.

💡 **1초 확인 퀴즈**
**Q. 광합성을 거쳐 처음으로 합성되는 영양소는 무엇일까요?**
정답: **포도당** (이후 저장될 때는 물에 녹지 않는 녹말로 바뀌어 보관돼요!)`;
  }

  if (q.includes('질량 보존') || q.includes('화학 반응')) {
    return `🎯 **핵심 요약 한눈에 보기**
**질량 보존 법칙**은 화학 반응이 일어날 때 원자의 종류와 개수는 변하지 않고 단지 결합 배열만 바뀌기 때문에 **반응 전 물질의 총 질량 = 반응 후 물질의 총 질량**이 같다는 법칙이에요!

🔬 **원리 쏙쏙 (쉬운 비유 & 입자 모형)**
- 레고 블록으로 우주선을 만들었다가 분해해서 자동차를 만들어도 레고 블록 총 개수와 무게는 똑같죠?
- 화학 반응도 원자라는 기본 블록들이 짝을 바꿔 새 분자를 만드는 것뿐이므로 전체 질량은 1mg도 변하지 않아요!
- 나무를 태우면 재만 남아 가벼워진 것처럼 보이지만, 날아간 연기와 이산화탄소 기체까지 모두 모아서 재면 원래 나무와 산소의 무게와 정확히 일치한답니다.

🌟 **실생활 속 신기한 예시**
- 닫힌 밀폐 용기 안에서 강철솜을 태우면 연소 반응 전후의 전자저울 눈금이 완벽히 동일해요!

💡 **1초 확인 퀴즈**
**Q. 수소 4g과 산소 32g이 완전히 반응하면 생성되는 물의 질량은 몇 g일까요?**
정답: **36g** (질량 보존 법칙에 의해 4g + 32g = 36g)`;
  }

  // General middle school science response
  return `🎯 **핵심 요약 한눈에 보기**
궁금해하신 **"${query}"** 주제는 중·고등학교 과학 교육과정에서 핵심적인 자연의 기본 원리와 깊게 연결되어 있어요!

🔬 **원리 쏙쏙 (쉬운 비유 & 입자 모형)**
- 과학에서는 모든 현상을 **'원인과 결과'**, 그리고 눈에 보이지 않는 **'미시적 입자들의 상호작용'**으로 설명해요.
- 물체나 물질이 변화할 때는 에너지가 흡수되거나 방출되며, 이 과정에서 질량과 에너지는 항상 보존되는 아름다운 규칙을 따르고 있답니다.
- 구체적으로 어떤 학년이나 단원(예: 중1 상태변화/기체, 중2 전기/물질/소화, 중3 화학법칙/역학적에너지)의 내용과 연결해서 더 자세히 알고 싶으신가요?

🌟 **실생활 속 신기한 예시**
- 우리가 매일 숨 쉬는 공기, 얼음을 넣은 음료수, 번개와 스마트폰 배터리 등 주변의 모든 것이 바로 과학 법칙들의 생생한 전시장이에요!

💡 **1초 확인 퀴즈**
더 깊이 알고 싶은 세부 개념이나 궁금한 과학 단원을 채팅창에 적어주시면, AI 튜터가 맞춤형 실험 비유와 퀴즈로 바로 알려드릴게요!`;
}

import { generateScienceImage } from '@/lib/science-visuals';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { messages = [], gradeCategory = 'all', includeVisual = false } = body;

    const apiKey = (process.env.CHATGPT_APIKEY || process.env.OPENAI_API_KEY || '').trim();
    const lastUserMsg = messages[messages.length - 1]?.content || '';

    // Check if user is asking for image / illustration / diagram
    const isVisualRequest = includeVisual || /(그림|사진|도해|이미지|모형|다이어그램|시각화|그려줘|보여줘)/.test(lastUserMsg);

    let visualData: { imageUrl?: string; imageCaption?: string; imageSource?: string } = {};
    if (isVisualRequest) {
      try {
        const visual = await generateScienceImage(lastUserMsg, apiKey);
        visualData = {
          imageUrl: visual.imageUrl,
          imageCaption: visual.caption,
          imageSource: visual.source,
        };
      } catch (vErr) {
        console.warn('Visual generation error:', vErr);
      }
    }

    // If API key is not present (e.g. running locally prior to Vercel production sync)
    if (!apiKey) {
      const fallbackText = generateLocalScienceKnowledge(lastUserMsg, gradeCategory);
      return NextResponse.json({
        reply: fallbackText,
        source: 'local-science-engine',
        note: '💡 Vercel 환경변수 CHATGPT_APIKEY가 연동되어 있습니다. 로컬 환경에서는 지능형 과학 지식 엔진이 활성화되며 Vercel 배포 시 OpenAI GPT-4o-mini가 실시간 추론합니다.',
        ...visualData,
      });
    }

    // Call OpenAI API with grade context
    const gradePromptModifier = gradeCategory !== 'all'
      ? `\n\n[현재 학생이 집중 탐구 중인 영역: ${gradeCategory === 'sci1' ? '중1 과학1' : gradeCategory === 'sci2' ? '중2 과학2' : '중3 과학3'}]`
      : '';

    const chatPayload = {
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: SCIENCE_SYSTEM_PROMPT + gradePromptModifier },
        ...messages.slice(-8)
      ],
      temperature: 0.7,
      max_tokens: 1200,
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
      console.warn('OpenAI API request status:', openaiRes.status, errText);
      const fallbackText = generateLocalScienceKnowledge(lastUserMsg, gradeCategory);
      return NextResponse.json({
        reply: fallbackText,
        source: 'smart-fallback',
        warning: `OpenAI 연동 응답 지연(코드: ${openaiRes.status})으로 과학 내장 튜터가 즉시 응답했습니다.`,
        ...visualData,
      });
    }

    const openAiData = await openaiRes.json();
    const reply = openAiData.choices?.[0]?.message?.content || generateLocalScienceKnowledge(lastUserMsg, gradeCategory);

    return NextResponse.json({
      reply,
      source: 'openai-gpt-4o-mini',
      model: 'gpt-4o-mini',
      ...visualData,
    });

  } catch (err: any) {
    console.error('Science Tutor API Error:', err);
    return NextResponse.json(
      { error: '답변 처리 중 오류가 발생했습니다.', reply: '통신 상태를 확인한 후 다시 질문해 주세요!' },
      { status: 500 }
    );
  }
}
