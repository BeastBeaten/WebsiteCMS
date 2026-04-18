import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';

async function getArticle(slug: string) {
  return prisma.article.findUnique({
    where: { slug },
    include: { category: { select: { name: true, slug: true } } },
  });
}

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const article = await getArticle(params.slug);

  if (!article || article.status !== 'PUBLISHED') {
    notFound();
  }

  return (
    <div style={{ minHeight: '100vh' }}>
      <Header />

      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: '#fff',
        padding: '140px 48px 80px',
        textAlign: 'center',
      }}>
        <h1 style={{ fontSize: 36, fontWeight: 'bold', maxWidth: 800, margin: '0 auto' }}>
          {article.title}
        </h1>
        <div style={{ marginTop: 16, opacity: 0.9, fontSize: 14 }}>
          {article.category?.name && (
            <Link href={`/news?category=${article.category.slug}`} style={{ color: '#fff', marginRight: 16 }}>
              {article.category.name}
            </Link>
          )}
          <span>{article.publishedAt ? new Date(article.publishedAt).toLocaleDateString('zh-CN') : ''}</span>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '64px 48px', maxWidth: 800, margin: '0 auto' }}>
        {article.coverImage && (
          <img
            src={article.coverImage}
            alt={article.title}
            style={{ width: '100%', borderRadius: 8, marginBottom: 40 }}
          />
        )}
        <div
          style={{ lineHeight: 2, fontSize: 16, color: '#333' }}
          dangerouslySetInnerHTML={{ __html: article.content.replace(/\n/g, '<br/>') }}
        />
      </div>

      {/* Back */}
      <div style={{ textAlign: 'center', padding: '32px 48px' }}>
        <Link href="/news" style={{ color: '#1677ff' }}>← 返回新闻列表</Link>
      </div>

      <Footer />
    </div>
  );
}
