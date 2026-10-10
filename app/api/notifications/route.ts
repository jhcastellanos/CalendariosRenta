import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { formatCleaningDate, notificationMessage } from '@/lib/calendar-notifications';

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ message: 'No autorizado' }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.id },
    select: { notificationsReadAt: true },
  });

  const readAt = user?.notificationsReadAt ?? new Date(0);
  const notifications = await prisma.calendarNotification.findMany({
    where: { createdAt: { gt: readAt } },
    orderBy: { createdAt: 'desc' },
    take: 20,
  });

  return NextResponse.json({
    unreadCount: notifications.length,
    notifications: notifications.map((item) => ({
      id: item.id,
      type: item.type,
      propertyTitle: item.propertyTitle,
      cleaningDate: item.cleaningDate.toISOString(),
      cleaningDateLabel: formatCleaningDate(item.cleaningDate),
      message: notificationMessage(item.type, item.propertyTitle, item.cleaningDate),
      createdAt: item.createdAt.toISOString(),
    })),
  });
}

export async function POST() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ message: 'No autorizado' }, { status: 401 });
  }

  await prisma.user.update({
    where: { id: session.id },
    data: { notificationsReadAt: new Date() },
  });

  return NextResponse.json({ success: true });
}
