'use client';
import Link from 'next/link';

import Logo from '@/components/ui/Logo';
// import useSessao from "@/data/hooks/useSessao";

export default function Cabecalho() {
  // const { usuario } = useSessao();

  return (
    <header className="flex items-center h-24 bg-pink-950/60 self-stretch">
      <nav className="flex items-center text-white justify-between container">
        <Logo />
      </nav>
    </header>
  );
}
