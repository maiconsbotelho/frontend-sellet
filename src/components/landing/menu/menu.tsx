'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaUser, FaSignOutAlt, FaCalendarAlt } from 'react-icons/fa';
import { FiLogIn } from 'react-icons/fi';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import Image from 'next/image';
import Avatar from '@/../public/avatar.png';

export default function Menu() {
  const router = useRouter();
  const { user, isLoading, refetch } = useCurrentUser();
  const [isOpen, setIsOpen] = useState(false);

  if (isLoading) return null;

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  const handleLogout = async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/usuario/logout/`,
      {
        method: 'POST',
        credentials: 'include',
      }
    );
    if (res.ok) {
      await refetch?.();
      router.push('/login');
    }
  };

  const handleAgendamentos = () => {
    setIsOpen(false);
    router.push('/admin/agenda');
  };

  return (
    <div className="relative">
      {user ? (
        <>
          <button
            onClick={toggleDropdown}
            className="w-10 h-10 overflow-hidden "
            aria-label="Abrir menu do usuário"
          >
            {/* <Image src={Avatar} alt="Avatar" fill className="object-cover" /> */}
            <div className="flex justify-center">
              <Image
                src="/avatar-nanda.jpg"
                alt="Logo Sellet"
                width={200}
                height={200}
                className="rounded-full shadow-lg border-2 border-rose-300"
              />
            </div>
          </button>

          {isOpen && (
            <div className="absolute right-0 mt-2 w-44 bg-white border rounded shadow-lg z-50">
              <button
                onClick={handleAgendamentos}
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
              >
                <FaCalendarAlt /> Agendamentos
              </button>
              <button
                onClick={handleLogout}
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
              >
                <FaSignOutAlt /> Sair
              </button>
            </div>
          )}
        </>
      ) : (
        <button
          onClick={() => router.push('/login')}
          className="text-[var(--secondary)] text-xl"
          aria-label="Ir para login"
        >
          <FiLogIn />
        </button>
      )}
    </div>
  );
}
