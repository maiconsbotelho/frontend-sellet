import HeaderPaginas from '@/components/shared/headers/headerPaginas/headerPaginas';

export default function ExpedienteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <HeaderPaginas title="Expediente" />
      {children}
    </div>
  );
}
