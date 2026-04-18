import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: '无权限' }, { status: 403 });
  }

  const body = await req.json();
  const { username, email, password, role } = body;

  const updateData: Record<string, unknown> = {};
  if (username) updateData.username = username;
  if (email) updateData.email = email;
  if (role) updateData.role = role;
  if (password) updateData.passwordHash = password;

  try {
    const user = await prisma.user.update({
      where: { id: params.id },
      data: updateData,
      select: { id: true, username: true, email: true, role: true, createdAt: true },
    });
    return NextResponse.json(user);
  } catch {
    return NextResponse.json({ error: '更新失败' }, { status: 400 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: '无权限' }, { status: 403 });
  }

  if (params.id === session.user.id) {
    return NextResponse.json({ error: '不能删除自己' }, { status: 400 });
  }

  await prisma.user.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
