import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import prisma from '@/lib/prisma';

async function getHomeData() {
  const [articles, pages] = await Promise.all([
    prisma.article.findMany({
      where: { status: 'PUBLISHED' },
      take: 6,
      orderBy: { publishedAt: 'desc' },
      include: { category: { select: { name: true } } },
    }),
    prisma.page.findFirst({
      where: { slug: 'home', status: 'PUBLISHED' },
    }),
  ]);
  return { articles, homePage: pages };
}

export default async function HomePage() {
  const { articles } = await getHomeData();

  return (
    <div style={{ minHeight: '100vh' }}>
      <Header />

      {/* Hero Banner */}
      <section style={{
        height: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        textAlign: 'center',
        padding: '0 24px',
        marginTop: 64,
      }}>
        <h1 style={{ fontSize: 56, fontWeight: 'bold', marginBottom: 16 }}>
          打造专业企业官网
        </h1>
        <p style={{ fontSize: 20, marginBottom: 32, opacity: 0.9 }}>
          快速建站 · 强大后台 · 轻松管理
        </p>
        <Link
          href="/contact"
          style={{
            padding: '12px 32px',
            background: '#fff',
            color: '#764ba2',
            borderRadius: 4,
            fontSize: 16,
            fontWeight: 500,
          }}
        >
          联系我们
        </Link>
      </section>

      {/* Services */}
      <section style={{ padding: '80px 48px', maxWidth: 1200, margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', fontSize: 32, marginBottom: 48 }}>我们的服务</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32 }}>
          {[
            { title: '企业官网建设', desc: '专业的企业官网定制开发，打造品牌形象' },
            { title: '可视化编辑器', desc: '拖拽式页面编辑器，无需编程即可建站' },
            { title: '内容管理系统', desc: '强大的后台管理，轻松管理网站内容' },
          ].map((service, i) => (
            <div key={i} style={{
              padding: 32,
              border: '1px solid #f0f0f0',
              borderRadius: 8,
              textAlign: 'center',
            }}>
              <div style={{
                width: 64,
                height: 64,
                background: '#f0f7ff',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                fontSize: 24,
              }}>
                🛠️
              </div>
              <h3 style={{ fontSize: 20, marginBottom: 12 }}>{service.title}</h3>
              <p style={{ color: '#666', lineHeight: 1.8 }}>{service.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* News */}
      <section style={{ padding: '80px 48px', background: '#fafafa' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: 32, marginBottom: 48 }}>新闻动态</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
            {articles.slice(0, 3).map((article) => (
              <Link key={article.id} href={`/news/${article.slug}`} style={{
                display: 'block',
                background: '#fff',
                borderRadius: 8,
                overflow: 'hidden',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              }}>
                {article.coverImage && (
                  <img src={article.coverImage} alt={article.title} style={{ width: '100%', height: 180, objectFit: 'cover' }} />
                )}
                <div style={{ padding: 16 }}>
                  <h3 style={{ fontSize: 16, marginBottom: 8 }}>{article.title}</h3>
                  <p style={{ color: '#999', fontSize: 12 }}>
                    {article.category?.name} · {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString('zh-CN') : ''}
                  </p>
                </div>
              </Link>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 32 }}>
            <Link href="/news" style={{ color: '#1677ff', fontSize: 16 }}>查看更多 →</Link>
          </div>
        </div>
      </section>

      {/* About */}
      <section style={{ padding: '80px 48px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: 32, marginBottom: 16 }}>关于我们</h2>
            <p style={{ color: '#666', lineHeight: 2, marginBottom: 24 }}>
              WebsiteCMS 是一款专业的企业官网内容管理系统。我们致力于为企业提供简单、高效、专业的网站解决方案。
              无论您是初创企业还是大型集团，我们都能为您提供最适合的网站建设服务。
            </p>
            <ul style={{ color: '#666', lineHeight: 2 }}>
              <li>✅ 简单易用的可视化编辑器</li>
              <li>✅ 强大的后台管理系统</li>
              <li>✅ 响应式设计，适配所有设备</li>
              <li>✅ 安全可靠，数据保障</li>
            </ul>
          </div>
          <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: 16, height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 48 }}>
            💼
          </div>
        </div>
      </section>

      {/* Cases */}
      <section style={{ padding: '80px 48px', background: '#fafafa' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: 32, marginBottom: 48 }}>案例展示</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} style={{
                height: 200,
                background: `linear-gradient(135deg, hsl(${i * 60}, 60%, 60%), hsl(${i * 60 + 30}, 60%, 50%))`,
                borderRadius: 8,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: 14,
              }}>
                案例 {i}
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 32 }}>
            <Link href="/cases" style={{ color: '#1677ff', fontSize: 16 }}>查看更多 →</Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
