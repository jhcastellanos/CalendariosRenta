import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const ONE_HOUR_MS = 60 * 60 * 1000;

export async function POST() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ message: 'No autorizado' }, { status: 401 });
  }

  try {
    // "Horario de la última sincronización" guardado en el sistema (SyncLog).
    const lastSync = await prisma.syncLog.findFirst({
      where: { success: true },
      orderBy: { syncedAt: 'desc' },
    });

    const now = Date.now();
    if (lastSync && now - new Date(lastSync.syncedAt).getTime() < ONE_HOUR_MS) {
      // Sincronizado hace menos de una hora: no volvemos a sincronizar.
      return NextResponse.json({ synced: false, skipped: true, lastSync: lastSync.syncedAt });
    }

    // Import dinámico para que el análisis de build no ejecute código de DB/red.
    const { syncAllCalendarSources } = await import('@/lib/sync-service');
    await syncAllCalendarSources();

    return NextResponse.json({ synced: true, syncedAt: new Date().toISOString() });
  } catch (error) {
    console.error('[SYNC-ON-LOGIN] Calendar sync failed:', error);
    // No bloqueamos el acceso si la sincronización falla.
    return NextResponse.json({ synced: false, error: true });
  }
}
