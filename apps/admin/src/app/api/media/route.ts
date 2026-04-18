import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET() {
  const media = await prisma.media.findMany({
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(media);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: '未登录' }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get('file') as File;

  if (!file) {
    return NextResponse.json({ error: '没有文件' }, { status: 400 });
  }

  // In a real app, you'd upload to S3/OSS. Here we'll store a placeholder URL.
  const filename = file.name;
  const url = `/uploads/${filename}`;
  const size = file.size;
  const mimeType = file.type;

  const media = await prisma.media.create({
    data: {
      filename,
      url,
      size,
      mimeType,
      uploadedBy: session.user.id,
    },
  });

  return NextResponse.json(media, { status: 201 });
}
