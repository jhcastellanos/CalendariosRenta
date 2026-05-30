import './globals.css';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Calendarios Renta',
  description: 'Administra calendarios de Airbnb y VRBO con limpieza automática.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-surface text-slate-900">
        {children}
      </body>
    </html>
  );
}
