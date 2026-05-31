import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { TopBar } from '@/components/TopBar';
import { CleaningDashboardView } from '@/components/CleaningDashboardView';
import { PageShell } from '@/components/PageShell';

export default async function CleaningDashboard() {
  const session = await getSession();
  if (!session) {
    redirect('/login');
  }
  if (session.role !== 'cleaning') {
    redirect('/admin/dashboard');
  }

  const now = new Date();
  // Reservation/cleaning dates are stored at UTC midnight, so compute the
  // "today" window in UTC to match them regardless of server timezone.
  const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const tomorrow = new Date(today);
  tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);

  // Limpiezas de hoy
  const cleaningsToday = await prisma.cleaning.findMany({
    where: { 
      cleaningDate: { gte: today, lt: tomorrow },
      status: 'pending'
    },
    include: { 
      property: true, 
      reservation: { include: { calendarSource: true } } 
    },
    orderBy: { cleaningDate: 'asc' },
  });

  // Próximas limpiezas (desde mañana en adelante)
  const upcomingCleanings = await prisma.cleaning.findMany({
    where: {
      cleaningDate: { gte: tomorrow },
      status: 'pending',
    },
    include: {
      property: true,
      reservation: { include: { calendarSource: true } },
    },
    orderBy: {
      reservation: { checkOutDate: 'asc' },
    },
  });

  // A cleaning is "priority" when there's a check-in the same day in the same
  // property (back-to-back turnover). Build a lookup of active check-ins so we
  // can flag it.
  const allCleanings = [...cleaningsToday, ...upcomingCleanings];
  const propertyIds = Array.from(new Set(allCleanings.map((c) => c.propertyId)));

  const checkInReservations = propertyIds.length
    ? await prisma.reservation.findMany({
        where: {
          propertyId: { in: propertyIds },
          status: 'active',
          checkInDate: { gte: today },
        },
        select: { propertyId: true, checkInDate: true },
      })
    : [];

  const dateKey = (date: Date) => date.toISOString().slice(0, 10);
  const checkInIndex = new Set(
    checkInReservations.map((reservation) => `${reservation.propertyId}|${dateKey(reservation.checkInDate)}`)
  );
  const hasSameDayCheckIn = (cleaning: (typeof allCleanings)[number]) =>
    checkInIndex.has(`${cleaning.propertyId}|${dateKey(cleaning.cleaningDate)}`);

  const cleaningsTodayForClient = cleaningsToday.map((cleaning) => ({
    ...cleaning,
    cleaningDate: cleaning.cleaningDate.toISOString(),
    priority: hasSameDayCheckIn(cleaning),
    reservation: {
      ...cleaning.reservation,
      checkOutDate: cleaning.reservation.checkOutDate.toISOString(),
    },
  }));

  const upcomingCleaningsForClient = upcomingCleanings.map((cleaning) => ({
    ...cleaning,
    cleaningDate: cleaning.cleaningDate.toISOString(),
    priority: hasSameDayCheckIn(cleaning),
    reservation: {
      ...cleaning.reservation,
      checkOutDate: cleaning.reservation.checkOutDate.toISOString(),
    },
  }));

  // Sort by date ascending; within the same day, priority cleanings (same-day
  // check-in) come first.
  const sortCleanings = (
    a: { cleaningDate: string; priority: boolean },
    b: { cleaningDate: string; priority: boolean }
  ) => {
    const dateDiff = a.cleaningDate.localeCompare(b.cleaningDate);
    if (dateDiff !== 0) return dateDiff;
    return Number(b.priority) - Number(a.priority);
  };

  cleaningsTodayForClient.sort(sortCleanings);
  upcomingCleaningsForClient.sort(sortCleanings);

  return (
    <PageShell>
      <div className="space-y-8">
        <TopBar title={`Panel de limpieza — ${session.name}`} />
        <CleaningDashboardView
          userName={session.name}
          cleaningsToday={cleaningsTodayForClient}
          upcomingCleanings={upcomingCleaningsForClient}
        />
      </div>
    </PageShell>
  );
}
