'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useModal } from '@/context/modalPerfilContext';
import ModalPerfil from '@/components/ui/modalPerfil';

import LogoMotivouLevou from '@/../public/logo3.png';

export default function Header() {
  const router = useRouter();
  const { isModalOpen, openModal } = useModal();
  const [usuario, setUsuario] = useState<string>('');

  useEffect(() => {
    if (!usuario) {
      setUsuario(localStorage.getItem('usuario') || 'usuário');
    }
  }, [usuario]);

  return (
    <>
      <header
        className={`w-screen p-6 h-20 flex flex-col justify-center items-start tracking-tight bg-[var(--primary)] transition-[min-height] duration-700 ease-out
        `}
      >
        <div
          className={`w-full   flex items-center justify-between transition-[margin-top] duration-500 ease-in-out ${
            isModalOpen ? 'mt-8' : ''
          }`}
        >
          <button
            onClick={openModal}
            className="flex gap-2 items-start cursor-pointer"
          >
            <Image src="/ui/perfil.svg" width={40} height={40} alt="Perfil" />
            <div>
              <p className="text-[10px] text-start">&lt; </p>
              <p className="font-semibold text-sm capitalize">
                Olá, {usuario?.toLowerCase()}
              </p>
            </div>
          </button>

          <ModalPerfil />

          <Image
            src={LogoMotivouLevou}
            width={84}
            height={34}
            alt="Logo Motivou Levou"
            className={`transition-opacity duration-700 ease-in-out `}
          />
        </div>
      </header>
    </>
  );
}
