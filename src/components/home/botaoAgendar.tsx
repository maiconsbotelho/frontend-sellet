'use client';

import { useRouter } from 'next/navigation';
import { useCurrentUser } from '@/hooks/useCurrentUser';

export default function BotaoAgendar() {
  const router = useRouter();
  const { user } = useCurrentUser();

  const handleClick = () => {
    if (user) {
      router.push('/admin/agenda');
    } else {
      router.push('/login');
    }
  };

  return (
    <button
      onClick={handleClick}
      className="mt-12 bg-pink-500 hover:bg-pink-600 text-white font-semibold text-lg px-8 py-3 rounded-full shadow-lg transition-all"
    >
      Agendar Agora
    </button>
  );
}
