'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function Splash() {
  const [visible, setVisible] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const timeout = setTimeout(() => {
      setVisible(false);
      router.push('/');
    }, 2500);

    return () => clearTimeout(timeout);
  }, [router]);

  if (!visible) return null;

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-gradient-to-b from-pink-100 to-pink-200 text-center px-6">
      {/* Logo Séllet */}
      <h1 className="text-4xl font-bold tracking-wide text-pink-700 mb-2">
        SÉLLET
      </h1>
      <p className="text-sm uppercase tracking-widest text-pink-500 mb-6">
        Esmalteria
      </p>

      {/* Mão com unha - Ilustração/ícone */}
      <div className="relative w-[220px] h-[220px] mb-6">
        <Image
          src="/img/unhas-splash.png" // substitua pela imagem recortada da mão
          alt="Unhas decoradas"
          fill
          className="object-contain"
        />
      </div>

      {/* Texto principal */}
      <h2 className="text-xl font-semibold text-pink-900 mb-2">
        Book Your Next Manicure Online
      </h2>
      <p className="text-sm text-pink-700 mb-6">
        Discover beauty and elegance at our premium nail studio.
      </p>

      {/* Botões */}
      <div className="flex gap-4">
        <button className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded-full text-sm font-medium shadow">
          Book Now
        </button>
        <button className="border border-pink-500 text-pink-600 px-6 py-2 rounded-full text-sm font-medium shadow">
          Log In
        </button>
      </div>
    </div>
  );
}
