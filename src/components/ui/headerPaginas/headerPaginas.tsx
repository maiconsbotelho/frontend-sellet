'use client';

import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import Image from 'next/image';
import LogoSellet from '@/../public/logo3.png';
import Link from 'next/link';

interface Props {
  title: string;
  voltarFunc?: (() => void) | null;
}

export default function HeaderPaginas({ title, voltarFunc = null }: Props) {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div
      className="fixed left-0 top-0 p-6 z-30  w-screen h-20 flex  justify-between items-center tracking-tight bg-[var(--primary)] transition-[min-height] duration-700 ease-out
        "
    >
      <div className="flex items-center gap-2">
        {isClient && (
          <FaArrowLeft
            color="var(--text-primary)"
            className="cursor-pointer"
            onClick={() => router.back()}
          />
        )}
        <p className="text-lg text-white font-semibold tracking-tighter">
          {title}
        </p>
      </div>
      <Link href={'/'}>
        <Image
          src={LogoSellet}
          width={84}
          height={34}
          alt="Logo Motivou Levou"
        />
      </Link>
    </div>
  );
}
