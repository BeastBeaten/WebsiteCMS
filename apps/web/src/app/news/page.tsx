import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import prisma from '@/lib/prisma';

async function getArticles() {
  return prisma.article.findMany({
    where: { status: 'PUBLISHED' },
    orderBy: { publishedAt: 'desc' },
    include: { category: { select: { name: true } } },
  });
}

export default async function NewsPage() {
  const articles = await getArticles();

  return (
    <div style={{ minHeight: '100vh' }}>
      <Header />

      {/* Page Header */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: '#fff',
        padding: '140px 48px 80px',
        textAlign: 'center',
      }}>
        <h1 style={{ fontSize: 40, fontWeight: 'bold' }}>新闻动态</h1>
        <p style={{ marginTop: 16, opacity: 0.9 }}>了解我们的最新动态和行业资讯</p>
      </div>

      {/* Articles */}
      <div style={{ padding: '64px 48px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32 }}>
          {articles.map((article) => (
            <Link key={article.id} href={`/news/${article.slug}`} style={{
              display: 'block',
              background: '#fff',
              borderRadius: 8,
              overflow: 'hidden',
              boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
              transition: 'transform 0.2s',
            }}>
              {article.coverImage && (
                <img
                  src={article.coverImage}
                  alt={article.title}
                  style={{ width: '100%', height: 200, objectFit: 'cover' }}
                />
              )}
              <div style={{ padding: 24 }}>
                <h3 style={{ fontSize: 18, marginBottom: 12, lineHeight: 1.5 }}>{article.title}</h3>
                {article.excerpt && (
                  <p style={{ color: '#666', fontSize: 14, lineHeight: 1.8, marginBottom: 16 }}>
                    {article.excerpt.slice(0, 80)}...
                  </p>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#999', fontSize: 12 }}>
                  <span>{article.category?.name || '未分类'}</span>
                  <span>{article.publishedAt ? new Date(article.publishedAt).toLocaleDateString('zh-CN') : ''}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {articles.length === 0 && (
          <div style={{ textAlign: 'center', padding: 80, color: '#999' }}>
            暂无文章
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
