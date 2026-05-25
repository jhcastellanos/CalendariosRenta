import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ message: 'No autorizado' }, { status: 401 });
  }

  const property = await prisma.property.findUnique({
    where: { id: params.id },
    include: {
      sources: true,
      reservations: { orderBy: { checkInDate: 'asc' } },
      cleanings: { orderBy: { cleaningDate: 'asc' } },
    },
  });

  if (!property) {
    return NextResponse.json({ message: 'Propiedad no encontrada' }, { status: 404 });
  }

  return NextResponse.json({ property });
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session || session.role !== 'admin') {
    return NextResponse.json({ message: 'No autorizado' }, { status: 403 });
  }

  const body = await request.json();
  const { title, photoUrl } = body;

  const property = await prisma.property.update({
    where: { id: params.id },
    data: { title, photoUrl },
  });

  return NextResponse.json({ property });
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session || session.role !== 'admin') {
    return NextResponse.json({ message: 'No autorizado' }, { status: 403 });
  }

  await prisma.cleaning.deleteMany({ where: { propertyId: params.id } });
  await prisma.reservation.deleteMany({ where: { propertyId: params.id } });
  await prisma.calendarSource.deleteMany({ where: { propertyId: params.id } });
  await prisma.property.delete({ where: { id: params.id } });

  return NextResponse.json({ success: true });
}
