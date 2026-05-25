import ical from 'node-ical';
import { prisma } from './prisma';
import { SourceType, ReservationStatus, CleaningStatus } from '@prisma/client';

const SOURCE_COLOR_MAP: Record<SourceType, string> = {
  airbnb: '#f15a5a',
  vrbo: '#3b82f6',
};

function extractEventData(item: ical.VEvent) {
  return {
    externalUid: String(item.uid || ''),
    guestName: item.summary ? String(item.summary) : null,
    checkInDate: new Date(item.start),
    checkOutDate: new Date(item.end),
    status: item.status === 'CANCELLED' ? ReservationStatus.canceled : ReservationStatus.active,
  };
}

export async function syncIcalSource(sourceId: string) {
  const source = await prisma.calendarSource.findUnique({
    where: { id: sourceId },
    include: { property: true, reservations: true },
  });

  if (!source) {
    throw new Error('Calendar source no encontrado');
  }

  const now = new Date();
  const events = (await ical.async.fromURL(source.icalUrl).catch((error: unknown) => {
    throw new Error(`No se pudo leer el calendario: ${String(error)}`);
  })) as Record<string, any>;

  const incomingUids = new Set<string>();
  const calendarEvents = Object.values(events).filter((item) => (item as any).type === 'VEVENT');

  for (const item of calendarEvents) {
    const event = extractEventData(item as ical.VEvent);
    if (!event.externalUid || !event.checkInDate || !event.checkOutDate) {
      continue;
    }

    incomingUids.add(event.externalUid);
    const existing = await prisma.reservation.findUnique({
      where: {
        calendarSourceId_externalUid: {
          calendarSourceId: source.id,
          externalUid: event.externalUid,
        },
      },
    });

    if (existing) {
      await prisma.reservation.update({
        where: { id: existing.id },
        data: {
          checkInDate: event.checkInDate,
          checkOutDate: event.checkOutDate,
          guestName: event.guestName,
          status: event.status,
        },
      });
    } else {
      await prisma.reservation.create({
        data: {
          propertyId: source.propertyId,
          calendarSourceId: source.id,
          sourceType: source.sourceType,
          externalUid: event.externalUid,
          checkInDate: event.checkInDate,
          checkOutDate: event.checkOutDate,
          guestName: event.guestName,
          status: event.status,
        },
      });
    }
  }

  const existingReservations = await prisma.reservation.findMany({
    where: { calendarSourceId: source.id },
  });

  for (const reservation of existingReservations) {
    if (!incomingUids.has(reservation.externalUid)) {
      await prisma.reservation.update({
        where: { id: reservation.id },
        data: { status: ReservationStatus.canceled },
      });
    }
  }

  await prisma.syncLog.create({
    data: {
      calendarSourceId: source.id,
      success: true,
      message: `Sincronización completada con ${calendarEvents.length} eventos procesados`,
      syncedAt: now,
    },
  });

  await reconcileCleaningsForProperty(source.propertyId);
  return { success: true, message: 'Sincronización finalizada' };
}

export async function reconcileCleaningsForProperty(propertyId: string) {
  const reservations = await prisma.reservation.findMany({
    where: { propertyId, status: ReservationStatus.active },
    include: { calendarSource: true },
  });

  for (const reservation of reservations) {
    const existingCleaning = await prisma.cleaning.findFirst({
      where: { reservationId: reservation.id },
    });

    const cleaningDate = reservation.checkOutDate;

    if (existingCleaning) {
      await prisma.cleaning.update({
        where: { id: existingCleaning.id },
        data: { cleaningDate, status: CleaningStatus.pending },
      });
      continue;
    }

    await prisma.cleaning.create({
      data: {
        propertyId,
        reservationId: reservation.id,
        cleaningDate,
        status: CleaningStatus.pending,
      },
    });
  }

  const canceledCleanings = await prisma.cleaning.findMany({
    where: {
      propertyId,
      reservation: { status: ReservationStatus.canceled },
    },
  });

  for (const cleaning of canceledCleanings) {
    await prisma.cleaning.update({
      where: { id: cleaning.id },
      data: { status: CleaningStatus.canceled },
    });
  }
}

export function sourceColor(sourceType: SourceType) {
  return SOURCE_COLOR_MAP[sourceType] ?? '#64748b';
}
