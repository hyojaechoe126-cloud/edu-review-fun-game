import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SCIENCE ARENA | 사이버 과학 퀴즈 배틀 & 사이언스 랩',
  description: '중고등학생을 위한 인터랙티브 과학 퀴즈 배틀, 원소기호 스피드 랩, 명예의 전당 & 과학 탐구 커뮤니티 (Seoul icn1 Region Optimized)',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className="dark">
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>⚛️</text></svg>" />
      </head>
      <body className="min-h-screen cyber-grid antialiased select-none">
        {children}
      </body>
    </html>
  );
}
