import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ message: 'No autorizado' }, { status: 401 });
  }

  const properties = await prisma.property.findMany({
    include: {
      sources: true,
      reservations: true,
      cleanings: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({ properties });
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session || session.role !== 'admin') {
    return NextResponse.json({ message: 'No autorizado' }, { status: 403 });
  }

  const body = await request.json();
  const { title, photoUrl } = body;
  if (!title) {
    return NextResponse.json({ message: 'El título es obligatorio' }, { status: 400 });
  }

  const property = await prisma.property.create({
    data: { title, photoUrl },
  });

  return NextResponse.json({ property });
}
