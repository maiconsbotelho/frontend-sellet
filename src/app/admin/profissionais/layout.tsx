import React from 'react';

//Components
import HeaderPaginas from '@/components/ui/headerPaginas/headerPaginas';

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
