'use client';

import { FiLogIn, FiChevronDown, FiLogOut, FiCalendar } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useEffect, useRef, useState } from 'react';
import { logout } from '@/services/authService';

type MenuItemsProps = {
  onItemClick?: () => void;
};

export function MenuItems({ onItemClick }: MenuItemsProps) {
  const router = useRouter();
  const { user, isLoading } = useCurrentUser();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLLIElement>(null);

  const handleClick = () => {
    if (onItemClick) onItemClick();
  };

  const handleLogin = () => {
    if (onItemClick) onItemClick();
    router.push('/login');
  };

  const handleToggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };

  const handleLogout = async () => {
    try {
      await logout();
      setShowDropdown(false);
      router.push('/login'); // ou '/' se preferir voltar à home
    } catch (err) {
      console.error('Erro ao sair:', err);
    }
  };

  const handleAgendamentos = () => {
    if (user?.tipo === 'ADMIN') router.push('/admin/agenda');
    else if (user?.tipo === 'CLIENTE') router.push('/cliente');
    else router.push('/');
  };

  // Detecta clique fora do dropdown para fechar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  return (
    <ul className="relative flex flex-col bg-[var(--secondary)] sm:bg-transparent text-[var(--primary)] sm:text-[var(--secondary)] sm:flex-row sm:gap-4 p-2">
      <li
        onClick={handleClick}
        className="p-2 hover:bg-gray-500 cursor-pointer border-b-2 lg:hover:bg-transparent"
      >
        Home
      </li>
      <li
        onClick={handleClick}
        className="p-2 hover:bg-gray-500 cursor-pointer lg:hover:bg-transparent"
      >
        Sobre
      </li>
      <li
        onClick={handleClick}
        className="p-2 hover:bg-gray-500 cursor-pointer lg:hover:bg-transparent"
      >
        Contato
      </li>

      {!isLoading && (
        <li ref={dropdownRef} className="relative">
          {user ? (
            <button
              onClick={handleToggleDropdown}
              className="p-2 flex items-center gap-2 hover:bg-gray-500 lg:hover:bg-transparent"
            >
              <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center text-sm font-bold border border-gray-300">
                {user.nome_completo?.[0]?.toUpperCase() ?? 'U'}
              </div>
              <FiChevronDown className="text-sm" />
            </button>
          ) : (
            <div
              onClick={handleLogin}
              className="p-2 flex items-center gap-2 hover:bg-gray-500 cursor-pointer lg:hover:bg-transparent"
            >
              <FiLogIn className="text-lg" />
              Login
            </div>
          )}

          {showDropdown && user && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded shadow-md z-50 text-black text-sm">
              <button
                onClick={handleAgendamentos}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
              >
                <FiCalendar /> Meus Agendamentos
              </button>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
              >
                <FiLogOut /> Sair
              </button>
            </div>
          )}
        </li>
      )}
    </ul>
  );
}
