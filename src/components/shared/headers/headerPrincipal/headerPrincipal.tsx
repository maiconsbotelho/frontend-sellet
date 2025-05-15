'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useModal } from '@/context/modalPerfilContext';
import ModalPerfil from '@/components/shared/modalPerfil';
import LogoSellet from '@/../public/logo3.png';
import { useCurrentUser } from '@/hooks/useCurrentUser';

export default function HeaderPrincipal() {
  const router = useRouter();
  const { isModalOpen, openModal } = useModal();
  const { user, isLoading } = useCurrentUser();

  function capitalize(word: string) {
    if (!word) return '';
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  }

  return (
    <>
      <header
        className={`w-screen fixed z-50 p-6 h-20 flex flex-col justify-center items-start tracking-tight bg-[var(--primary)] transition-[min-height] duration-700 ease-out`}
      >
        <div
          className={`w-full flex items-center container mx-auto justify-between transition-[margin-top] duration-500 ease-in-out ${
            isModalOpen ? 'mt-8' : ''
          }`}
        >
          <button
            onClick={openModal}
            className="flex items-center gap-3 cursor-pointer"
          >
            {/* {user ? (
              <div className="w-9 h-9 rounded-full bg-white text-black flex items-center justify-center text-sm font-bold border border-gray-300">
                {user.nome_completo?.[0]?.toUpperCase() ?? 'U'}
              </div>
            ) : (
              <Image src="/ui/perfil.svg" width={40} height={40} alt="Perfil" />
            )} */}

            {user ? (
              <Image
                src="/avatar-nanda.jpg"
                alt="Avatar do usuário"
                width={40}
                height={40}
                className="rounded-full border-2 border-rose-300 shadow-sm object-cover"
              />
            ) : (
              <Image
                src="/ui/perfil.svg"
                width={40}
                height={40}
                alt="Perfil padrão"
                className="rounded-full"
              />
            )}

            <div className="text-left leading-tight text-white">
              <p className="text-[10px]">&lt;</p>
              <p className="font-semibold text-sm">
                Olá,{' '}
                {capitalize(user?.nome_completo?.split(' ')[0] || 'visitante')}
              </p>
            </div>
          </button>

          <ModalPerfil />

          <Image
            src={LogoSellet}
            width={84}
            height={34}
            alt="Logo Motivou Levou"
            className="transition-opacity duration-700 ease-in-out"
          />
        </div>
      </header>
    </>
  );
}
