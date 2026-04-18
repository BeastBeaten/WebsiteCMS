import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: '未登录' }, { status: 401 });
  }

  const body = await req.json();
  const { oldPassword, newPassword } = body;

  if (!oldPassword || !newPassword) {
    return NextResponse.json({ error: '缺少参数' }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) {
    return NextResponse.json({ error: '用户不存在' }, { status: 404 });
  }

  const isValid = await bcrypt.compare(oldPassword, user.passwordHash);
  if (!isValid) {
    return NextResponse.json({ error: '当前密码错误' }, { status: 400 });
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { passwordHash: newPassword },
  });

  return NextResponse.json({ success: true });
}
