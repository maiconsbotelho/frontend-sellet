import HeaderPrincipal from '@/components/shared/headers/headerPrincipal/headerPrincipal';

export default function AgendaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <HeaderPrincipal />
      {children}
    </div>
  );
}
