import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'EDU REVIEW FUN GAME | 사이버펑크 퀴즈 배틀',
  description: '중고등학생을 위한 인터랙티브 퀴즈 배틀 & 미니 게임 플랫폼 (Seoul icn1 Region Optimized)',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className="dark">
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>⚡</text></svg>" />
      </head>
      <body className="min-h-screen cyber-grid antialiased select-none">
        {children}
      </body>
    </html>
  );
}
