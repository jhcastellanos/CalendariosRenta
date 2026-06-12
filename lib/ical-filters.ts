import { SourceType } from '@prisma/client';

export type ICalEventFields = {
  summary?: string | null;
  description?: string | null;
  sourceType: SourceType;
  status?: string | null;
  transp?: string | null;
  busyStatus?: string | null;
};

// Patterns shared by Airbnb and VRBO manual blocks / holds.
const BLOCK_SUMMARY_PATTERN =
  /blocked|bloqueado|not\s+available|no\s+disponible|unavailable|owner\s*block|airbnb\s*\(\s*not\s+available\s*\)/i;

const AIRBNB_RESERVATION_URL_PATTERN = /reservation\s+url|airbnb\.com\/hosting\/reservations/i;
const VRBO_RESERVATION_SUMMARY_PATTERN = /^reserved\s*-\s*.+/i;

export function isRealReservationEvent(fields: ICalEventFields): boolean {
  const summary = (fields.summary || '').trim();
  const description = (fields.description || '').trim();
  const status = (fields.status || 'CONFIRMED').toUpperCase();

  if (status === 'CANCELLED') return false;
  if (fields.transp?.toUpperCase() === 'TRANSPARENT') return false;
  if (fields.busyStatus?.toUpperCase() === 'FREE') return false;
  if (BLOCK_SUMMARY_PATTERN.test(summary)) return false;

  if (fields.sourceType === 'airbnb') {
    // Real Airbnb reservations always ship a hosting reservation URL in DESCRIPTION.
    // Manual blocks (e.g. "Airbnb (Not available)") have no URL.
    return AIRBNB_RESERVATION_URL_PATTERN.test(description);
  }

  if (fields.sourceType === 'vrbo') {
    // Real VRBO reservations use "Reserved - GuestName". Blocks use other summaries.
    return VRBO_RESERVATION_SUMMARY_PATTERN.test(summary);
  }

  return true;
}
