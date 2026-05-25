import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ message: 'No autorizado' }, { status: 401 });
  }

  const sources = await prisma.calendarSource.findMany({
    include: { property: true },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({ sources });
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session || session.role !== 'admin') {
    return NextResponse.json({ message: 'No autorizado' }, { status: 403 });
  }

  const body = await request.json();
  const { propertyId, sourceType, icalUrl, color, active } = body;
  if (!propertyId || !sourceType || !icalUrl) {
    return NextResponse.json({ message: 'Datos incompletos' }, { status: 400 });
  }

  const source = await prisma.calendarSource.create({
    data: {
      propertyId,
      sourceType,
      icalUrl,
      color: color || (sourceType === 'airbnb' ? '#f15a5a' : '#3b82f6'),
      active: active ?? true,
    },
  });

  return NextResponse.json({ source });
}
