'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaUser, FaSignOutAlt, FaCalendarAlt } from 'react-icons/fa';
import { useCurrentUser } from '@/hooks/useCurrentUser'; // ajuste o path conforme necessário
import { logout } from '@/services/authService'; // seu serviço real de logout

export default function Menu() {
  const router = useRouter();
  const { user, isLoading, refetch } = useCurrentUser();
  const [isOpen, setIsOpen] = useState(false);

  if (isLoading) return null;

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  const handleLogout = async () => {
    console.log('logout clicado');
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/usuario/logout/`,
      {
        method: 'POST',
        credentials: 'include',
      }
    );
    console.log('resposta logout', res.status);
  };

  const handleAgendamentos = () => {
    setIsOpen(false);
    router.push('/agendamentos');
  };

  return (
    <div className="relative">
      {user ? (
        <>
          <button
            onClick={toggleDropdown}
            className="text-[var(--secondary)] text-xl"
            aria-label="Abrir menu do usuário"
          >
            <FaUser />
          </button>

          {isOpen && (
            <div className="absolute right-0 mt-2 w-44 bg-pink-700 border rounded shadow-lg z-50">
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
          <FaUser />
        </button>
      )}
    </div>
  );
}
