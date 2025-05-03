import React from 'react';

//Components
import HeaderPaginas from '@/components/ui/headerPaginas/headerPaginas';
import Header from '@/components/ui/header';

export default function AgendaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Header />
      {children}
    </div>
  );
}
