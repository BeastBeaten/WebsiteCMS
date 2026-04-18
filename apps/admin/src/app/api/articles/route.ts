import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET() {
  const articles = await prisma.article.findMany({
    include: { category: { select: { name: true } } },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(articles);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: '未登录' }, { status: 401 });
  }

  const body = await req.json();
  const { title, slug, content, excerpt, coverImage, categoryId, status, publishedAt } = body;

  if (!title || !slug || !content) {
    return NextResponse.json({ error: '缺少必填字段' }, { status: 400 });
  }

  const existing = await prisma.article.findUnique({ where: { slug } });
  if (existing) {
    return NextResponse.json({ error: 'Slug已存在' }, { status: 400 });
  }

  const article = await prisma.article.create({
    data: {
      title,
      slug,
      content,
      excerpt,
      coverImage,
      categoryId: categoryId || null,
      status: status || 'DRAFT',
      publishedAt: publishedAt ? new Date(publishedAt) : null,
      createdById: session.user.id,
    },
    include: { category: { select: { name: true } } },
  });

  return NextResponse.json(article, { status: 201 });
}
