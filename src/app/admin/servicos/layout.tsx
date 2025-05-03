import React from 'react';

//Components
import HeaderPaginas from '@/components/ui/headerPaginas/headerPaginas';

export default function ServicosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <HeaderPaginas title="Serviços" />
      {children}
    </div>
  );
}
