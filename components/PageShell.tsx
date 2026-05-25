export function PageShell({
  children,
  widthClass = 'max-w-7xl',
}: {
  children: React.ReactNode;
  widthClass?: string;
}) {
  return (
    <main className="min-h-screen bg-surface px-6 py-10">
      <div className={`mx-auto ${widthClass} rounded-3xl bg-white p-10 shadow-soft`}>{children}</div>
    </main>
  );
}