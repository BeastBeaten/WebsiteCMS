import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: '无权限' }, { status: 403 });
  }

  const users = await prisma.user.findMany({
    select: { id: true, username: true, email: true, role: true, createdAt: true },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(users);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: '无权限' }, { status: 403 });
  }

  const body = await req.json();
  const { username, email, password, role } = body;

  if (!username || !email || !password || !role) {
    return NextResponse.json({ error: '缺少必填字段' }, { status: 400 });
  }

  const existing = await prisma.user.findFirst({
    where: { OR: [{ username }, { email }] },
  });

  if (existing) {
    return NextResponse.json({ error: '用户名或邮箱已存在' }, { status: 400 });
  }

  const user = await prisma.user.create({
    data: { username, email, passwordHash: password, role },
    select: { id: true, username: true, email: true, role: true, createdAt: true },
  });

  return NextResponse.json(user, { status: 201 });
}
