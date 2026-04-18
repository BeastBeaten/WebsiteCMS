import type { Metadata } from 'next';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import SessionProvider from '@/components/SessionProvider';
import './globals.css';

export const metadata: Metadata = {
  title: 'WebsiteCMS 管理后台',
  description: '企业官网内容管理系统',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body>
        <SessionProvider>
          <AntdRegistry>{children}</AntdRegistry>
        </SessionProvider>
      </body>
    </html>
  );
}
