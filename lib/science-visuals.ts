// Shared Science Visual Diagram & DALL-E Generator

export function generateScienceSvgDiagram(concept: string): { svgDataUri: string; caption: string } {
  const c = concept.toLowerCase();

  // 1. 상태 변화 & 입자 모형 (Phase Changes & Latent Heat)
  if (c.includes('상태') || c.includes('융해') || c.includes('기화') || c.includes('승화') || c.includes('얼음') || c.includes('입자') || c.includes('열에너지')) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 480" width="100%" height="100%">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#0a0d1a"/>
          <stop offset="100%" stop-color="#14192d"/>
        </linearGradient>
        <linearGradient id="heatFlow" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#ff007f"/>
          <stop offset="100%" stop-color="#ff9900"/>
        </linearGradient>
        <radialGradient id="particleSolid" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#00f3ff"/>
          <stop offset="100%" stop-color="#0055ff"/>
        </radialGradient>
        <radialGradient id="particleGas" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#ff007f"/>
          <stop offset="100%" stop-color="#990033"/>
        </radialGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      <rect width="800" height="480" fill="url(#bg)" rx="16"/>
      <rect x="20" y="20" width="760" height="440" fill="none" stroke="#00f3ff" stroke-width="1.5" stroke-opacity="0.3" rx="12"/>
      
      <text x="400" y="55" font-family="system-ui, sans-serif" font-size="22" font-weight="900" fill="#00f3ff" text-anchor="middle" filter="url(#glow)">
        ⚡ [중1 과학] 물질의 상태 변화와 열에너지 흡수·방출 도해
      </text>
      
      <!-- Solid Chamber -->
      <g transform="translate(60, 110)">
        <rect width="180" height="200" fill="#0d1326" stroke="#00f3ff" stroke-width="2" rx="12"/>
        <text x="90" y="32" font-family="system-ui, sans-serif" font-size="16" font-weight="bold" fill="#00f3ff" text-anchor="middle">고체 (Solid)</text>
        <text x="90" y="185" font-family="system-ui, sans-serif" font-size="12" fill="#88a0cc" text-anchor="middle">제자리 진동 · 규칙적 배열</text>
        <circle cx="50" cy="70" r="12" fill="url(#particleSolid)"/>
        <circle cx="90" cy="70" r="12" fill="url(#particleSolid)"/>
        <circle cx="130" cy="70" r="12" fill="url(#particleSolid)"/>
        <circle cx="50" cy="110" r="12" fill="url(#particleSolid)"/>
        <circle cx="90" cy="110" r="12" fill="url(#particleSolid)"/>
        <circle cx="130" cy="110" r="12" fill="url(#particleSolid)"/>
        <circle cx="50" cy="150" r="12" fill="url(#particleSolid)"/>
        <circle cx="90" cy="150" r="12" fill="url(#particleSolid)"/>
        <circle cx="130" cy="150" r="12" fill="url(#particleSolid)"/>
      </g>
      
      <!-- Transition 1: Solid to Liquid -->
      <g transform="translate(255, 170)">
        <path d="M 0 10 L 45 10" stroke="#ff007f" stroke-width="4" stroke-linecap="round"/>
        <polygon points="45,5 55,10 45,15" fill="#ff007f"/>
        <text x="25" y="0" font-family="system-ui, sans-serif" font-size="12" font-weight="bold" fill="#ff007f" text-anchor="middle">융해 (열 흡수)</text>
        <path d="M 50 40 L 5 40" stroke="#00f3ff" stroke-width="3" stroke-linecap="round"/>
        <polygon points="5,35 -5,40 5,45" fill="#00f3ff"/>
        <text x="25" y="55" font-family="system-ui, sans-serif" font-size="11" fill="#00f3ff" text-anchor="middle">응고 (열 방출)</text>
      </g>
      
      <!-- Liquid Chamber -->
      <g transform="translate(310, 110)">
        <rect width="180" height="200" fill="#0d1326" stroke="#00aaff" stroke-width="2" rx="12"/>
        <text x="90" y="32" font-family="system-ui, sans-serif" font-size="16" font-weight="bold" fill="#00aaff" text-anchor="middle">액체 (Liquid)</text>
        <text x="90" y="185" font-family="system-ui, sans-serif" font-size="12" fill="#88a0cc" text-anchor="middle">미끄러지는 운동 · 불규칙</text>
        <circle cx="55" cy="85" r="12" fill="url(#particleSolid)"/>
        <circle cx="120" cy="75" r="12" fill="url(#particleSolid)"/>
        <circle cx="85" cy="105" r="12" fill="url(#particleSolid)"/>
        <circle cx="45" cy="135" r="12" fill="url(#particleSolid)"/>
        <circle cx="135" cy="125" r="12" fill="url(#particleSolid)"/>
        <circle cx="95" cy="155" r="12" fill="url(#particleSolid)"/>
      </g>
      
      <!-- Transition 2: Liquid to Gas -->
      <g transform="translate(505, 170)">
        <path d="M 0 10 L 45 10" stroke="#ff007f" stroke-width="4" stroke-linecap="round"/>
        <polygon points="45,5 55,10 45,15" fill="#ff007f"/>
        <text x="25" y="0" font-family="system-ui, sans-serif" font-size="12" font-weight="bold" fill="#ff007f" text-anchor="middle">기화 (열 흡수)</text>
        <path d="M 50 40 L 5 40" stroke="#00f3ff" stroke-width="3" stroke-linecap="round"/>
        <polygon points="5,35 -5,40 5,45" fill="#00f3ff"/>
        <text x="25" y="55" font-family="system-ui, sans-serif" font-size="11" fill="#00f3ff" text-anchor="middle">액화 (열 방출)</text>
      </g>
      
      <!-- Gas Chamber -->
      <g transform="translate(560, 110)">
        <rect width="180" height="200" fill="#0d1326" stroke="#ff007f" stroke-width="2" rx="12"/>
        <text x="90" y="32" font-family="system-ui, sans-serif" font-size="16" font-weight="bold" fill="#ff007f" text-anchor="middle">기체 (Gas)</text>
        <text x="90" y="185" font-family="system-ui, sans-serif" font-size="12" fill="#88a0cc" text-anchor="middle">매우 활발 · 거리 매우 멂</text>
        <circle cx="40" cy="70" r="10" fill="url(#particleGas)"/>
        <path d="M 40 70 L 60 55" stroke="#ff007f" stroke-width="2"/>
        <circle cx="140" cy="95" r="10" fill="url(#particleGas)"/>
        <path d="M 140 95 L 120 115" stroke="#ff007f" stroke-width="2"/>
        <circle cx="70" cy="140" r="10" fill="url(#particleGas)"/>
        <path d="M 70 140 L 95 145" stroke="#ff007f" stroke-width="2"/>
      </g>
      
      <!-- Top Arc: Sublimation -->
      <path d="M 150 95 Q 400 45 650 95" fill="none" stroke="url(#heatFlow)" stroke-width="4" stroke-dasharray="6,4"/>
      <polygon points="650,95 640,88 642,98" fill="#ff9900"/>
      <text x="400" y="70" font-family="system-ui, sans-serif" font-size="13" font-weight="bold" fill="#ff9900" text-anchor="middle">
        승화 (고체 → 기체, 열에너지 대량 흡수 ⚡)
      </text>
      
      <!-- Bottom Summary Box -->
      <rect x="60" y="340" width="680" height="90" fill="#11172a" stroke="#253150" rx="10"/>
      <text x="80" y="368" font-family="system-ui, sans-serif" font-size="13" font-weight="bold" fill="#00ff66">
        💡 과학 닥터 핵심 분석 포인트:
      </text>
      <text x="80" y="392" font-family="system-ui, sans-serif" font-size="12" fill="#cbd5e1">
        • 열에너지 흡수 구간(융해·기화·승화): 흡수한 열이 입자 결합을 끊는 데 쓰여 온도가 일정하게 유지됩니다.
      </text>
      <text x="80" y="414" font-family="system-ui, sans-serif" font-size="12" fill="#cbd5e1">
        • 입자 운동: 고체(제자리 진동) → 액체(비교적 활발) → 기체(사방으로 매우 활발, 부피 수천 배 증가)
      </text>
    </svg>`;
    return {
      svgDataUri: `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`,
      caption: '물질의 상태 변화(융해·기화·승화)와 입자 운동 모형 도해'
    };
  }

  // 2. 옴의 법칙 회로도 (Ohm's Law Circuit)
  if (c.includes('옴') || c.includes('전류') || c.includes('전압') || c.includes('저항') || c.includes('회로')) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 480" width="100%" height="100%">
      <rect width="800" height="480" fill="#0a0c18" rx="16"/>
      <rect x="20" y="20" width="760" height="440" fill="none" stroke="#00f3ff" stroke-width="1.5" stroke-opacity="0.3" rx="12"/>
      <text x="400" y="55" font-family="system-ui, sans-serif" font-size="22" font-weight="900" fill="#00f3ff" text-anchor="middle">
        ⚡ [중2 과학] 옴의 법칙(V = I × R) 전기 회로 & 공식 도해
      </text>
      <rect x="120" y="110" width="560" height="230" fill="none" stroke="#38bdf8" stroke-width="4" rx="8"/>
      <g transform="translate(120, 200)">
        <line x1="-20" y1="0" x2="20" y2="0" stroke="#f43f5e" stroke-width="6"/>
        <line x1="-12" y1="20" x2="12" y2="20" stroke="#38bdf8" stroke-width="4"/>
        <text x="-40" y="-10" font-family="system-ui, sans-serif" font-size="16" font-weight="bold" fill="#f43f5e">+</text>
        <text x="-40" y="35" font-family="system-ui, sans-serif" font-size="16" font-weight="bold" fill="#38bdf8">-</text>
        <text x="-85" y="12" font-family="system-ui, sans-serif" font-size="14" font-weight="bold" fill="#f43f5e">전압 V (Volt)</text>
      </g>
      <g transform="translate(280, 110)">
        <circle cx="-15" cy="0" r="5" fill="#38bdf8"/>
        <circle cx="25" cy="0" r="5" fill="#38bdf8"/>
        <line x1="-15" y1="0" x2="20" y2="-18" stroke="#facc15" stroke-width="4"/>
        <text x="5" y="-30" font-family="system-ui, sans-serif" font-size="12" fill="#facc15" text-anchor="middle">스위치 (ON/OFF)</text>
      </g>
      <g transform="translate(680, 220)">
        <circle cx="0" cy="0" r="28" fill="#172554" stroke="#facc15" stroke-width="3"/>
        <path d="M -12 -12 L 12 12 M -12 12 L 12 -12" stroke="#facc15" stroke-width="3"/>
        <text x="65" y="5" font-family="system-ui, sans-serif" font-size="14" font-weight="bold" fill="#facc15">전구 (저항 R)</text>
      </g>
      <g transform="translate(400, 340)">
        <rect x="-60" y="-15" width="120" height="30" fill="#1e293b" stroke="#a855f7" stroke-width="3" rx="4"/>
        <text x="0" y="5" font-family="system-ui, sans-serif" font-size="13" font-weight="bold" fill="#c084fc" text-anchor="middle">저항체 R (Ω)</text>
        <text x="0" y="32" font-family="system-ui, sans-serif" font-size="11" fill="#94a3b8" text-anchor="middle">전류의 흐름을 방해</text>
      </g>
      <g transform="translate(480, 100)">
        <polygon points="10,10 0,5 0,15" fill="#00f3ff"/>
        <text x="25" y="14" font-family="system-ui, sans-serif" font-size="12" font-weight="bold" fill="#00f3ff">전류 I (Ampere) 이동 방향 (＋ → －)</text>
      </g>
      <rect x="60" y="370" width="680" height="75" fill="#111827" stroke="#374151" rx="10"/>
      <text x="400" y="400" font-family="system-ui, sans-serif" font-size="18" font-weight="900" fill="#38bdf8" text-anchor="middle">
        옴의 법칙 3단 공식:  V = I × R   |   I = V / R   |   R = V / I
      </text>
      <text x="400" y="425" font-family="system-ui, sans-serif" font-size="12" fill="#9ca3af" text-anchor="middle">
        • 전압이 2배 커지면 전류는 2배 세집니다 (비례)   • 저항이 2배 커지면 전류는 1/2로 줄어듭니다 (반비례)
      </text>
    </svg>`;
    return {
      svgDataUri: `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`,
      caption: '전기 회로 구성 및 옴의 법칙(V=IR) 원리 도해'
    };
  }

  // 3. 식물의 광합성과 세포 호흡
  if (c.includes('광합성') || c.includes('호흡') || c.includes('식물') || c.includes('엽록체') || c.includes('세포')) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 480" width="100%" height="100%">
      <rect width="800" height="480" fill="#091310" rx="16"/>
      <rect x="20" y="20" width="760" height="440" fill="none" stroke="#10b981" stroke-width="1.5" stroke-opacity="0.3" rx="12"/>
      <text x="400" y="55" font-family="system-ui, sans-serif" font-size="22" font-weight="900" fill="#34d399" text-anchor="middle">
        🍃 [중2 과학] 식물의 광합성과 세포 호흡 상호작용 도해
      </text>
      <g transform="translate(100, 130)">
        <circle cx="0" cy="0" r="35" fill="#f59e0b"/>
        <line x1="0" y1="-45" x2="0" y2="-55" stroke="#fbbf24" stroke-width="3"/>
        <line x1="0" y1="45" x2="0" y2="55" stroke="#fbbf24" stroke-width="3"/>
        <line x1="-45" y1="0" x2="-55" y2="0" stroke="#fbbf24" stroke-width="3"/>
        <line x1="45" y1="0" x2="55" y2="0" stroke="#fbbf24" stroke-width="3"/>
        <text x="0" y="5" font-family="system-ui, sans-serif" font-size="12" font-weight="bold" fill="#78350f" text-anchor="middle">빛에너지</text>
      </g>
      <g transform="translate(200, 110)">
        <rect width="250" height="220" fill="#064e3b" stroke="#10b981" stroke-width="3" rx="16"/>
        <text x="125" y="35" font-family="system-ui, sans-serif" font-size="16" font-weight="bold" fill="#a7f3d0" text-anchor="middle">엽록체 (광합성)</text>
        <text x="125" y="60" font-family="system-ui, sans-serif" font-size="11" fill="#6ee7b7" text-anchor="middle">낮에 빛을 받아 양분 합성</text>
        <text x="25" y="105" font-family="system-ui, sans-serif" font-size="12" fill="#e0e7ff">흡수: 물(H₂O) + 이산화탄소(CO₂)</text>
        <path d="M 25 125 L 225 125" stroke="#10b981" stroke-width="2" stroke-dasharray="4,4"/>
        <text x="25" y="160" font-family="system-ui, sans-serif" font-size="13" font-weight="bold" fill="#fde047">생성: 포도당(C₆H₁₂O₆)</text>
        <text x="25" y="185" font-family="system-ui, sans-serif" font-size="13" font-weight="bold" fill="#38bdf8">배출: 산소(O₂)</text>
      </g>
      <g transform="translate(500, 110)">
        <rect width="250" height="220" fill="#450a0a" stroke="#ef4444" stroke-width="3" rx="16"/>
        <text x="125" y="35" font-family="system-ui, sans-serif" font-size="16" font-weight="bold" fill="#fecaca" text-anchor="middle">미토콘드리아 (호흡)</text>
        <text x="125" y="60" font-family="system-ui, sans-serif" font-size="11" fill="#fca5a5" text-anchor="middle">24시간 내내 생명 에너지 방출</text>
        <text x="25" y="105" font-family="system-ui, sans-serif" font-size="12" fill="#e0e7ff">사용: 포도당 + 산소(O₂)</text>
        <path d="M 25 125 L 225 125" stroke="#ef4444" stroke-width="2" stroke-dasharray="4,4"/>
        <text x="25" y="160" font-family="system-ui, sans-serif" font-size="13" font-weight="bold" fill="#facc15">방출: 생명 활동 에너지(ATP)</text>
        <text x="25" y="185" font-family="system-ui, sans-serif" font-size="12" fill="#cbd5e1">배출: 물 + 이산화탄소</text>
      </g>
      <path d="M 460 170 Q 480 150 495 170" fill="none" stroke="#38bdf8" stroke-width="3"/>
      <text x="475" y="145" font-family="system-ui, sans-serif" font-size="10" fill="#38bdf8" text-anchor="middle">산소·포도당 전달</text>
      <rect x="60" y="355" width="680" height="80" fill="#061c14" stroke="#047857" rx="10"/>
      <text x="400" y="385" font-family="system-ui, sans-serif" font-size="14" font-weight="bold" fill="#6ee7b7" text-anchor="middle">
        광합성 반응식: 6CO₂ + 6H₂O + 빛에너지 ➔ C₆H₁₂O₆(포도당) + 6O₂
      </text>
      <text x="400" y="415" font-family="system-ui, sans-serif" font-size="12" fill="#d1fae5" text-anchor="middle">
        낮: 광합성량 > 호흡량 (산소 방출)  |  밤: 호흡만 진행 (이산화탄소 방출)
      </text>
    </svg>`;
    return {
      svgDataUri: `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`,
      caption: '엽록체의 광합성과 미토콘드리아의 세포 호흡 메커니즘'
    };
  }

  // 4. 화학 반응과 질량 보존 법칙
  if (c.includes('질량') || c.includes('화학') || c.includes('보존') || c.includes('반응식') || c.includes('원자')) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 480" width="100%" height="100%">
      <rect width="800" height="480" fill="#0f0c1b" rx="16"/>
      <rect x="20" y="20" width="760" height="440" fill="none" stroke="#a855f7" stroke-width="1.5" stroke-opacity="0.3" rx="12"/>
      <text x="400" y="55" font-family="system-ui, sans-serif" font-size="22" font-weight="900" fill="#c084fc" text-anchor="middle">
        🧪 [중3 과학] 화학 반응과 질량 보존의 법칙 (원자 모형)
      </text>
      <g transform="translate(60, 110)">
        <rect width="280" height="210" fill="#18132e" stroke="#8b5cf6" stroke-width="2" rx="12"/>
        <text x="140" y="35" font-family="system-ui, sans-serif" font-size="16" font-weight="bold" fill="#ddd6fe" text-anchor="middle">반응물: 2H₂ + O₂ (총 36g)</text>
        <circle cx="70" cy="90" r="14" fill="#38bdf8"/>
        <circle cx="95" cy="90" r="14" fill="#38bdf8"/>
        <text x="82" y="125" font-family="system-ui, sans-serif" font-size="11" fill="#38bdf8" text-anchor="middle">H₂ 분자 (수소 4g)</text>
        <circle cx="70" cy="155" r="14" fill="#38bdf8"/>
        <circle cx="95" cy="155" r="14" fill="#38bdf8"/>
        <circle cx="200" cy="120" r="22" fill="#ef4444"/>
        <circle cx="235" cy="120" r="22" fill="#ef4444"/>
        <text x="217" y="165" font-family="system-ui, sans-serif" font-size="11" fill="#ef4444" text-anchor="middle">O₂ 분자 (산소 32g)</text>
      </g>
      <g transform="translate(365, 200)">
        <path d="M 0 10 L 60 10" stroke="#facc15" stroke-width="4" stroke-linecap="round"/>
        <polygon points="60,5 75,10 60,15" fill="#facc15"/>
        <text x="35" y="-5" font-family="system-ui, sans-serif" font-size="12" font-weight="bold" fill="#facc15" text-anchor="middle">화학 반응</text>
        <text x="35" y="32" font-family="system-ui, sans-serif" font-size="10" fill="#9ca3af" text-anchor="middle">원자 재배열</text>
      </g>
      <g transform="translate(460, 110)">
        <rect width="280" height="210" fill="#18132e" stroke="#ec4899" stroke-width="2" rx="12"/>
        <text x="140" y="35" font-family="system-ui, sans-serif" font-size="16" font-weight="bold" fill="#fbcfe8" text-anchor="middle">생성물: 2H₂O (총 36g)</text>
        <circle cx="100" cy="100" r="22" fill="#ef4444"/>
        <circle cx="75" cy="125" r="14" fill="#38bdf8"/>
        <circle cx="125" cy="125" r="14" fill="#38bdf8"/>
        <circle cx="200" cy="100" r="22" fill="#ef4444"/>
        <circle cx="175" cy="125" r="14" fill="#38bdf8"/>
        <circle cx="225" cy="125" r="14" fill="#38bdf8"/>
        <text x="140" y="175" font-family="system-ui, sans-serif" font-size="12" font-weight="bold" fill="#f472b6" text-anchor="middle">
          물(H₂O) 2개 분자 생성 (36g)
        </text>
      </g>
      <rect x="60" y="350" width="680" height="85" fill="#130e24" stroke="#4c1d95" rx="10"/>
      <text x="400" y="380" font-family="system-ui, sans-serif" font-size="15" font-weight="bold" fill="#a78bfa" text-anchor="middle">
        ⚖️ 반응 전 질량(36g) = 반응 후 질량(36g) 완벽 일치!
      </text>
      <text x="400" y="410" font-family="system-ui, sans-serif" font-size="12" fill="#ddd6fe" text-anchor="middle">
        원자의 종류와 개수(수소 원자 4개, 산소 원자 2개)는 변하지 않고 단지 원자의 '배열'만 바뀌기 때문입니다.
      </text>
    </svg>`;
    return {
      svgDataUri: `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`,
      caption: '화학 반응(2H₂+O₂→2H₂O)과 질량 보존의 법칙 원자 결합 모형'
    };
  }

  // 5. Default General Science Hologram Infographic
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 480" width="100%" height="100%">
    <rect width="800" height="480" fill="#080b16" rx="16"/>
    <rect x="20" y="20" width="760" height="440" fill="none" stroke="#00f3ff" stroke-width="1.5" stroke-opacity="0.4" rx="12"/>
    <text x="400" y="55" font-family="system-ui, sans-serif" font-size="22" font-weight="900" fill="#00f3ff" text-anchor="middle">
      🔬 [사이언스 랩봇] 중등 과학 시각 탐구 도해
    </text>
    <g transform="translate(400, 230)">
      <circle cx="0" cy="0" r="28" fill="#ec4899"/>
      <circle cx="-6" cy="-6" r="10" fill="#f43f5e"/>
      <circle cx="8" cy="6" r="10" fill="#a855f7"/>
      <text x="0" y="35" font-family="system-ui, sans-serif" font-size="11" font-weight="bold" fill="#f472b6" text-anchor="middle">원자핵 (양성자+중성자)</text>
      <ellipse cx="0" cy="0" rx="160" ry="60" fill="none" stroke="#00f3ff" stroke-width="2" transform="rotate(30)"/>
      <ellipse cx="0" cy="0" rx="160" ry="60" fill="none" stroke="#38bdf8" stroke-width="2" transform="rotate(-30)"/>
      <ellipse cx="0" cy="0" rx="160" ry="60" fill="none" stroke="#a855f7" stroke-width="2" transform="rotate(90)"/>
      <circle cx="120" cy="-60" r="8" fill="#00f3ff"/>
      <circle cx="-130" cy="50" r="8" fill="#38bdf8"/>
      <circle cx="0" cy="150" r="8" fill="#a855f7"/>
    </g>
    <rect x="150" y="370" width="500" height="65" fill="#0d1428" stroke="#1e293b" rx="10"/>
    <text x="400" y="398" font-family="system-ui, sans-serif" font-size="14" font-weight="bold" fill="#00f3ff" text-anchor="middle">
      주제: ${concept.replace(/<[^>]*>?/gm, '').slice(0, 35)}
    </text>
    <text x="400" y="420" font-family="system-ui, sans-serif" font-size="11" fill="#94a3b8" text-anchor="middle">
      자연의 물질을 이루는 미시적 입자와 에너지의 상호작용
    </text>
  </svg>`;

  return {
    svgDataUri: `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`,
    caption: `AI 과학 도해: ${concept}`
  };
}

export async function generateScienceImage(prompt: string, apiKey?: string): Promise<{ imageUrl: string; caption: string; source: string; revisedPrompt?: string }> {
  const trimmedKey = (apiKey || '').trim();

  if (trimmedKey) {
    try {
      const enrichedPrompt = `A high quality, clear educational science textbook illustration for middle school students explaining: "${prompt}". 3D render style, cyberpunk neon lighting touches, scientifically accurate, colorful, labeled elements clearly visualized without random gibberish text, ultra detailed.`;

      const dalleResponse = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${trimmedKey}`,
        },
        body: JSON.stringify({
          model: 'dall-e-3',
          prompt: enrichedPrompt,
          n: 1,
          size: '1024x1024',
          quality: 'standard',
        }),
      });

      if (dalleResponse.ok) {
        const dalleData = await dalleResponse.json();
        const imageUrl = dalleData.data?.[0]?.url;
        if (imageUrl) {
          return {
            imageUrl,
            source: 'dall-e-3',
            caption: `[DALL-E 3 AI 과학 도해] ${prompt}`,
            revisedPrompt: dalleData.data?.[0]?.revised_prompt || prompt,
          };
        }
      } else {
        // Fallback to DALL-E 2 if DALL-E 3 fails
        const dalle2Response = await fetch('https://api.openai.com/v1/images/generations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${trimmedKey}`,
          },
          body: JSON.stringify({
            model: 'dall-e-2',
            prompt: `Scientific diagram for middle school students: ${prompt}, clean educational illustration.`,
            n: 1,
            size: '512x512',
          }),
        });

        if (dalle2Response.ok) {
          const d2Data = await dalle2Response.json();
          const d2Url = d2Data.data?.[0]?.url;
          if (d2Url) {
            return {
              imageUrl: d2Url,
              source: 'dall-e-2',
              caption: `[DALL-E AI 과학 도해] ${prompt}`,
            };
          }
        }
      }
    } catch (err) {
      console.warn('DALL-E generation failed, falling back to SVG diagram:', err);
    }
  }

  // Guaranteed fallback to clean SVG
  const { svgDataUri, caption } = generateScienceSvgDiagram(prompt);
  return {
    imageUrl: svgDataUri,
    source: 'smart-science-svg',
    caption,
  };
}
