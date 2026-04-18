import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'WebsiteCMS - 企业官网',
  description: '专业企业官网展示平台',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
