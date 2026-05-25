import { syncAllCalendarSources } from '@/lib/sync-service';
import { NextResponse } from 'next/server';

let lastSyncTime = 0;
const SYNC_INTERVAL = 5 * 60 * 1000; // 5 minutes in milliseconds

export async function GET() {
  const now = Date.now();
  
  // Check if enough time has passed since last sync
  if (now - lastSyncTime < SYNC_INTERVAL) {
    return NextResponse.json({
      status: 'skipped',
      nextSync: new Date(lastSyncTime + SYNC_INTERVAL),
    });
  }

  lastSyncTime = now;

  try {
    await syncAllCalendarSources();
    return NextResponse.json({
      status: 'success',
      timestamp: new Date(),
      nextSync: new Date(now + SYNC_INTERVAL),
    });
  } catch (error) {
    console.error('Error in sync API:', error);
    return NextResponse.json(
      {
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
