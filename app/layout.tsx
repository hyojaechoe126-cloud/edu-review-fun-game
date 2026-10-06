import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ScienceEDU_with 효재T | 중등 과학 퀴즈 & AI 사이언스 랩',
  description: '효재T와 함께하는 인터랙티브 중등 과학(과학1·2·3) 퀴즈 배틀, 미니게임 & AI 탐구',
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
