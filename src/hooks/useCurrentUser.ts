import { useEffect, useState } from 'react';

interface User {
  nome_completo: string;
  email: string;
}

export function useCurrentUser() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/usuario/me/`, {
      credentials: 'include',
    })
      .then((res) => {
        if (!res.ok) throw new Error('Não autenticado');
        return res.json();
      })
      .then(setUser)
      .catch(() => setUser(null));
  }, []);

  return user;
}
