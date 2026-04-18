import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const page = await prisma.page.findUnique({
    where: { id: params.id },
  });
  if (!page) {
    return NextResponse.json({ error: '页面不存在' }, { status: 404 });
  }
  return NextResponse.json(page);
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: '未登录' }, { status: 401 });
  }

  const body = await req.json();
  const { title, slug, status, contentJson, publishedAt } = body;

  try {
    const page = await prisma.page.update({
      where: { id: params.id },
      data: {
        ...(title && { title }),
        ...(slug && { slug }),
        ...(status && { status }),
        ...(contentJson !== undefined && { contentJson }),
        ...(publishedAt !== undefined && { publishedAt: publishedAt ? new Date(publishedAt) : null }),
      },
    });
    return NextResponse.json(page);
  } catch {
    return NextResponse.json({ error: '更新失败' }, { status: 400 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: '未登录' }, { status: 401 });
  }

  await prisma.page.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
