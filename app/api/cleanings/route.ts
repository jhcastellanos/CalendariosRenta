import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ message: 'No autorizado' }, { status: 401 });
  }

  const url = new URL(request.url);
  const propertyId = url.searchParams.get('propertyId');
  const status = url.searchParams.get('status');

  const where: any = {};
  if (propertyId) where.propertyId = propertyId;
  if (status) where.status = status;

  const cleanings = await prisma.cleaning.findMany({
    where,
    include: { property: true, reservation: { include: { calendarSource: true } } },
    orderBy: { cleaningDate: 'asc' },
  });

  return NextResponse.json({ cleanings });
}

export async function PATCH(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ message: 'No autorizado' }, { status: 401 });
  }

  const body = await request.json();
  const { cleaningId, status } = body;
  if (!cleaningId || !status) {
    return NextResponse.json({ message: 'CleaningId y status son requeridos' }, { status: 400 });
  }

  const cleaning = await prisma.cleaning.update({
    where: { id: cleaningId },
    data: { status },
  });

  return NextResponse.json({ cleaning });
}
