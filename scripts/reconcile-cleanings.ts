import { PrismaClient } from '@prisma/client';
import { reconcileCleaningsForProperty } from '../lib/ical';

const prisma = new PrismaClient();

(async () => {
  const properties = await prisma.reservation.findMany({
    where: { status: 'active' },
    select: { propertyId: true },
    distinct: ['propertyId'],
  });
  console.log('properties to reconcile', properties.length);
  for (const { propertyId } of properties) {
    console.log('reconciling', propertyId);
    await reconcileCleaningsForProperty(propertyId);
  }
  const count = await prisma.cleaning.count();
  console.log('cleanings after reconcile', count);
  await prisma.$disconnect();
})();
