import { prisma } from './prisma';
import { reconcileCleaningsForProperty } from './ical';

export async function syncAllCalendarSources() {
  try {
    console.log('[SYNC] Starting automatic sync of all calendar sources...');
    
    const calendarSources = await prisma.calendarSource.findMany({
      include: { property: true },
    });

    if (calendarSources.length === 0) {
      console.log('[SYNC] No calendar sources found to sync');
      return;
    }

    for (const source of calendarSources) {
      try {
        console.log(`[SYNC] Syncing source: ${source.id} (${source.sourceType}) for property: ${source.property.title}`);
        
        // Fetch iCal data
        const response = await fetch(source.icalUrl);
        if (!response.ok) {
          throw new Error(`Failed to fetch iCal: ${response.statusText}`);
        }

        const iCalData = await response.text();

        // Parse iCal and create/update reservations
        const reservations = parseICalData(iCalData, source.id);

        // Clear existing reservations for this source and re-add
        await prisma.cleaning.deleteMany({
          where: { reservation: { calendarSourceId: source.id } },
        });
        await prisma.reservation.deleteMany({
          where: { calendarSourceId: source.id },
        });

        // Create new reservations
        for (const reservation of reservations) {
          await prisma.reservation.create({
            data: {
              propertyId: source.propertyId,
              calendarSourceId: source.id,
              checkInDate: reservation.checkInDate,
              checkOutDate: reservation.checkOutDate,
              guestName: reservation.guestName,
              sourceType: source.sourceType,
              externalUid: reservation.externalUid,
              status: 'active',
            },
          });
        }

        await reconcileCleaningsForProperty(source.propertyId);

        // Log sync
        await prisma.syncLog.create({
          data: {
            calendarSourceId: source.id,
            success: true,
            message: 'Sync completed successfully',
          },
        });

        console.log(`[SYNC] Successfully synced source: ${source.id}`);
      } catch (error) {
        console.error(`[SYNC] Error syncing source ${source.id}:`, error);
        await prisma.syncLog.create({
          data: {
            calendarSourceId: source.id,
            success: false,
            message: error instanceof Error ? error.message : 'Unknown error',
          },
        });
      }
    }

    console.log('[SYNC] Automatic sync completed');
  } catch (error) {
    console.error('[SYNC] Error in syncAllCalendarSources:', error);
  }
}

function parseICalData(iCalData: string, sourceId: string): any[] {
  const reservations: any[] = [];

  // Split by VEVENT
  const events = iCalData.split('BEGIN:VEVENT');

  for (let i = 1; i < events.length; i++) {
    const eventData = events[i].split('END:VEVENT')[0];

    // Extract dates and summary
    const dtstart = eventData.match(/DTSTART(?:;[^:]*)?:(\d{8})/);
    const dtend = eventData.match(/DTEND(?:;[^:]*)?:(\d{8})/);
    const summary = eventData.match(/SUMMARY:(.+?)(?:\r?\n|$)/);
    const uid = eventData.match(/UID:(.+?)(?:\r?\n|$)/);
    const status = eventData.match(/STATUS:(.+?)(?:\r?\n|$)/)?.[1]?.trim().toUpperCase() ?? 'CONFIRMED';
    const transp = eventData.match(/TRANSP:(.+?)(?:\r?\n|$)/)?.[1]?.trim().toUpperCase();
    const busyStatus = eventData.match(/X-MICROSOFT-CDO-BUSYSTATUS:(.+?)(?:\r?\n|$)/)?.[1]?.trim().toUpperCase();

    if (dtstart && dtend) {
      const summaryText = summary ? summary[1].trim() : '';
      const isBlockedSummary = /blocked|bloqueado|no[- ]disponible|unavailable|hold|block/i.test(summaryText);
      const isTransparent = transp === 'TRANSPARENT';
      const isFreeBusyFree = busyStatus === 'FREE';

      if (status === 'CANCELLED' || isTransparent || isFreeBusyFree || isBlockedSummary) {
        continue;
      }
      const checkInDate = parseICalDate(dtstart[1]);
      const checkOutDate = parseICalDate(dtend[1]);
      const guestName = summary ? summary[1].trim() : 'Guest';
      const externalUid = uid ? uid[1].trim() : `${sourceId}-${i}`;

      reservations.push({
        checkInDate,
        checkOutDate,
        guestName,
        externalUid,
      });
    }
  }

  return reservations;
}

function parseICalDate(dateStr: string): Date {
  // Format: YYYYMMDD
  const year = parseInt(dateStr.substring(0, 4), 10);
  const month = parseInt(dateStr.substring(4, 6), 10);
  const day = parseInt(dateStr.substring(6, 8), 10);

  return new Date(year, month - 1, day, 0, 0, 0, 0);
}
