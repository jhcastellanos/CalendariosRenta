import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ message: 'No autorizado' }, { status: 401 });
  }

  const source = await prisma.calendarSource.findUnique({
    where: { id: params.id },
    include: { property: true },
  });

  if (!source) {
    return NextResponse.json({ message: 'Fuente no encontrada' }, { status: 404 });
  }

  return NextResponse.json({ source });
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session || session.role !== 'admin') {
    return NextResponse.json({ message: 'No autorizado' }, { status: 403 });
  }

  const body = await request.json();
  const { icalUrl, color, active } = body;
  const source = await prisma.calendarSource.update({
    where: { id: params.id },
    data: { icalUrl, color, active },
  });

  return NextResponse.json({ source });
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session || session.role !== 'admin') {
    return NextResponse.json({ message: 'No autorizado' }, { status: 403 });
  }

  await prisma.calendarSource.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
