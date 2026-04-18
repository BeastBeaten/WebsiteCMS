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
  const { name, slug } = body;

  try {
    const category = await prisma.category.update({
      where: { id: params.id },
      data: { ...(name && { name }), ...(slug && { slug }) },
    });
    return NextResponse.json(category);
  } catch {
    return NextResponse.json({ error: '更新失败' }, { status: 400 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: '未登录' }, { status: 401 });
  }

  await prisma.category.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
