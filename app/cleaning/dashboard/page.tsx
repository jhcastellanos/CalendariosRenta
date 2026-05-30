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

  const cleaningsTodayForClient = cleaningsToday.map((cleaning) => ({
    ...cleaning,
    cleaningDate: cleaning.cleaningDate.toISOString(),
    reservation: {
      ...cleaning.reservation,
      checkOutDate: cleaning.reservation.checkOutDate.toISOString(),
    },
  }));

  const upcomingCleaningsForClient = upcomingCleanings.map((cleaning) => ({
    ...cleaning,
    cleaningDate: cleaning.cleaningDate.toISOString(),
    reservation: {
      ...cleaning.reservation,
      checkOutDate: cleaning.reservation.checkOutDate.toISOString(),
    },
  }));

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
