import { useEffect, useState, useCallback } from 'react';

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
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/usuario/me/`, {
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
