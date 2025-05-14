import HeaderPaginas from '@/components/shared/headers/headerPaginas/headerPaginas';

export default function ProfissionaisLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <HeaderPaginas title="Profissionais" />
      {children}
    </div>
  );
}
