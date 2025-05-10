import { useEffect, useState } from 'react';

export interface User {
  id: number;
  nome_completo: string;
  email: string;
  tipo: 'ADMIN' | 'CLIENTE' | 'PROFISSIONAL';
}

export function useCurrentUser() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
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
  }, []);

  return { user, isLoading };
}
