import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET() {
  const pages = await prisma.page.findMany({
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(pages);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: '未登录' }, { status: 401 });
  }

  const body = await req.json();
  const { title, slug, status } = body;

  if (!title || !slug) {
    return NextResponse.json({ error: '缺少必填字段' }, { status: 400 });
  }

  const existing = await prisma.page.findUnique({ where: { slug } });
  if (existing) {
    return NextResponse.json({ error: 'Slug已存在' }, { status: 400 });
  }

  const page = await prisma.page.create({
    data: {
      title,
      slug,
      status: status || 'DRAFT',
      contentJson: {},
      createdById: session.user.id,
    },
  });

  return NextResponse.json(page, { status: 201 });
}
