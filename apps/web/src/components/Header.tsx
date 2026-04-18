import Link from 'next/link';

export default function Header() {
  return (
    <header style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      height: 64,
      background: '#fff',
      borderBottom: '1px solid #f0f0f0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 48px',
      zIndex: 100,
    }}>
      <div style={{ fontSize: 20, fontWeight: 'bold', color: '#1677ff' }}>
        WebsiteCMS
      </div>
      <nav style={{ display: 'flex', gap: 32 }}>
        <Link href="/">首页</Link>
        <Link href="/news">新闻动态</Link>
        <Link href="/products">产品服务</Link>
        <Link href="/cases">案例展示</Link>
        <Link href="/contact">联系我们</Link>
      </nav>
    </header>
  );
}
