import Link from 'next/link';

export default function Footer() {
  return (
    <footer style={{
      background: '#001529',
      color: '#fff',
      padding: '48px 48px 24px',
      marginTop: 80,
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 40,
        maxWidth: 1200,
        margin: '0 auto',
      }}>
        <div>
          <h3 style={{ marginBottom: 16 }}>WebsiteCMS</h3>
          <p style={{ color: '#ffffffaa', fontSize: 14, lineHeight: 1.8 }}>
            专业企业官网解决方案<br />
            让建站更简单高效
          </p>
        </div>
        <div>
          <h4 style={{ marginBottom: 16 }}>快速链接</h4>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <Link href="/" style={{ color: '#ffffffaa' }}>首页</Link>
            <Link href="/news" style={{ color: '#ffffffaa' }}>新闻动态</Link>
            <Link href="/products" style={{ color: '#ffffffaa' }}>产品服务</Link>
          </nav>
        </div>
        <div>
          <h4 style={{ marginBottom: 16 }}>案例展示</h4>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <Link href="/cases" style={{ color: '#ffffffaa' }}>案例展示</Link>
            <Link href="/contact" style={{ color: '#ffffffaa' }}>联系我们</Link>
          </nav>
        </div>
        <div>
          <h4 style={{ marginBottom: 16 }}>联系方式</h4>
          <p style={{ color: '#ffffffaa', fontSize: 14, lineHeight: 1.8 }}>
            邮箱: info@example.com<br />
            电话: 400-888-8888<br />
            地址: 某某市某某区某某路
          </p>
        </div>
      </div>
      <div style={{
        borderTop: '1px solid #ffffff22',
        marginTop: 32,
        paddingTop: 24,
        textAlign: 'center',
        color: '#ffffffaa',
        fontSize: 14,
      }}>
        © {new Date().getFullYear()} WebsiteCMS. All rights reserved.
      </div>
    </footer>
  );
}
