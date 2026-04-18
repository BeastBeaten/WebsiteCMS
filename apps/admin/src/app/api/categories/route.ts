import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET() {
  const categories = await prisma.category.findMany({
    orderBy: { createdAt: 'asc' },
  });
  return NextResponse.json(categories);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: '未登录' }, { status: 401 });
  }

  const body = await req.json();
  const { name, slug, parentId } = body;

  if (!name || !slug) {
    return NextResponse.json({ error: '缺少必填字段' }, { status: 400 });
  }

  const existing = await prisma.category.findUnique({ where: { slug } });
  if (existing) {
    return NextResponse.json({ error: 'Slug已存在' }, { status: 400 });
  }

  const category = await prisma.category.create({
    data: { name, slug, parentId: parentId || null },
  });

  return NextResponse.json(category, { status: 201 });
}
