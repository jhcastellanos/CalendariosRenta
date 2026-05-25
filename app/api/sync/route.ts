import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { syncIcalSource, reconcileCleaningsForProperty } from '@/lib/ical';

export async function POST(request: Request) {
  const session = await getSession();
  if (!session || session.role !== 'admin') {
    return NextResponse.json({ message: 'No autorizado' }, { status: 403 });
  }

  const body = await request.json();
  const { sourceId, propertyId } = body;

  if (!sourceId && !propertyId) {
    return NextResponse.json({ message: 'sourceId o propertyId son requeridos' }, { status: 400 });
  }

  if (sourceId) {
    const result = await syncIcalSource(sourceId);
    return NextResponse.json(result);
  }

  const sources = await prisma.calendarSource.findMany({ where: { propertyId } });
  const results = [];
  for (const source of sources) {
    results.push(await syncIcalSource(source.id));
  }
  await reconcileCleaningsForProperty(propertyId);

  return NextResponse.json({ success: true, results });
}
