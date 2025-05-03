import React from 'react';

//Components
import HeaderPaginas from '@/components/ui/headerPaginas/headerPaginas';

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
