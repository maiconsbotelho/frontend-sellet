import React from 'react';

//Components
import HeaderPaginas from '@/components/ui/headerPaginas/headerPaginas';

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
