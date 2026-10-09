/** Prefix for externalUid on reservations created outside iCal feeds. */
export const MANUAL_RESERVATION_UID_PREFIX = 'manual-';

export function isManualExternalUid(externalUid: string) {
  return externalUid.startsWith(MANUAL_RESERVATION_UID_PREFIX);
}
