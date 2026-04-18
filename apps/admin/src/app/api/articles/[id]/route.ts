import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: '未登录' }, { status: 401 });
  }

  const body = await req.json();
  const { title, slug, content, excerpt, coverImage, categoryId, status, publishedAt } = body;

  try {
    const article = await prisma.article.update({
      where: { id: params.id },
      data: {
        ...(title && { title }),
        ...(slug && { slug }),
        ...(content && { content }),
        ...(excerpt !== undefined && { excerpt }),
        ...(coverImage !== undefined && { coverImage }),
        ...(categoryId !== undefined && { categoryId: categoryId || null }),
        ...(status && { status }),
        ...(publishedAt !== undefined && { publishedAt: publishedAt ? new Date(publishedAt) : null }),
      },
      include: { category: { select: { name: true } } },
    });
    return NextResponse.json(article);
  } catch {
    return NextResponse.json({ error: '更新失败' }, { status: 400 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: '未登录' }, { status: 401 });
  }

  await prisma.article.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
