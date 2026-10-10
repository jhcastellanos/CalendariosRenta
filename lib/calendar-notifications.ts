import { NotificationType, PrismaClient } from '@prisma/client';

export type CleaningSnapshot = {
  key: string;
  propertyId: string;
  propertyTitle: string;
  cleaningDate: Date;
};

export function cleaningSnapshotKey(propertyId: string, cleaningDate: Date) {
  return `${propertyId}|${cleaningDate.toISOString().slice(0, 10)}`;
}

export async function getPendingCleaningSnapshots(prisma: PrismaClient): Promise<CleaningSnapshot[]> {
  const cleanings = await prisma.cleaning.findMany({
    where: { status: 'pending' },
    include: { property: true },
    orderBy: { cleaningDate: 'asc' },
  });

  return cleanings.map((cleaning) => ({
    key: cleaningSnapshotKey(cleaning.propertyId, cleaning.cleaningDate),
    propertyId: cleaning.propertyId,
    propertyTitle: cleaning.property.title,
    cleaningDate: cleaning.cleaningDate,
  }));
}

export async function recordCleaningChanges(
  prisma: PrismaClient,
  before: CleaningSnapshot[],
  after: CleaningSnapshot[]
) {
  const beforeMap = new Map(before.map((item) => [item.key, item]));
  const afterMap = new Map(after.map((item) => [item.key, item]));
  const notifications: Array<{
    type: NotificationType;
    propertyId: string;
    propertyTitle: string;
    cleaningDate: Date;
  }> = [];

  for (const [key, item] of afterMap) {
    if (!beforeMap.has(key)) {
      notifications.push({
        type: NotificationType.new_cleaning,
        propertyId: item.propertyId,
        propertyTitle: item.propertyTitle,
        cleaningDate: item.cleaningDate,
      });
    }
  }

  for (const [key, item] of beforeMap) {
    if (!afterMap.has(key)) {
      notifications.push({
        type: NotificationType.canceled_cleaning,
        propertyId: item.propertyId,
        propertyTitle: item.propertyTitle,
        cleaningDate: item.cleaningDate,
      });
    }
  }

  if (notifications.length === 0) return [];

  return prisma.calendarNotification.createManyAndReturn({ data: notifications });
}

export function formatCleaningDate(date: Date) {
  const raw = date.toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
  return raw.charAt(0).toUpperCase() + raw.slice(1);
}

export function notificationMessage(type: NotificationType, propertyTitle: string, cleaningDate: Date) {
  const dateLabel = formatCleaningDate(cleaningDate);
  if (type === NotificationType.new_cleaning) {
    return `Nueva limpieza en ${propertyTitle} — ${dateLabel}`;
  }
  return `Limpieza cancelada en ${propertyTitle} — ${dateLabel}`;
}
