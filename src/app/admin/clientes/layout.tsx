import HeaderPaginas from '@/components/shared/headers/headerPaginas/headerPaginas';

export default function ClientesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <HeaderPaginas title="Clientes" />
      {children}
    </div>
  );
}
