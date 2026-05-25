import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { PropertyManager } from '@/components/PropertyManager';
import { TopBar } from '@/components/TopBar';
import { PageShell } from '@/components/PageShell';

export default async function PropertiesPage() {
  const session = await getSession();
  if (!session) {
    redirect('/login');
  }
  if (session.role !== 'admin') {
    redirect('/cleaning/dashboard');
  }

  const properties = await prisma.property.findMany({
    include: { sources: true },
    orderBy: { updatedAt: 'desc' },
  });

  return (
    <PageShell widthClass="max-w-6xl">
      <div className="space-y-8">
        <TopBar title="Administración de propiedades" />
        <PropertyManager properties={properties} />
      </div>
    </PageShell>
  );
}
