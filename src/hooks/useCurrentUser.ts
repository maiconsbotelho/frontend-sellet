import { useEffect, useState, useCallback } from 'react';
import { WS_BASE } from '@/interface_ws/ws_link';

export interface User {
  id: number;
  nome_completo: string;
  email: string;
  tipo: 'ADMIN' | 'CLIENTE' | 'PROFISSIONAL';
}

export function useCurrentUser() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [version, setVersion] = useState(0); // ← gatilho
  const refetch = useCallback(() => {
    setVersion((v) => v + 1); // força reexecução do efeito
  }, []);

  useEffect(() => {
    setIsLoading(true);
    fetch(`${WS_BASE}/usuario/me/`, {
      credentials: 'include',
    })
      .then((res) => {
        if (!res.ok) throw new Error('Não autenticado');
        return res.json();
      })
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setIsLoading(false));
  }, [version]); // ← quando version muda, reexecuta

  return { user, isLoading, refetch };
}
