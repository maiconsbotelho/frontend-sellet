import { WS_BASE } from '@/interface_ws/ws_link';

// Defina ou importe a interface User conforme necessário
export interface User {
  id: number;
  nome_completo: string;
  email: string;
  tipo: string;
  // adicione outros campos conforme necessário
}

export async function login(email: string, password: string) {
  const response = await fetch(`${WS_BASE}/usuario/login/`, {
    method: 'POST',
    credentials: 'include', // envia e recebe cookies
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.detail || 'Erro ao fazer login');
  }

  return { success: true };
}

export async function logout() {
  await fetch(`${WS_BASE}/usuario/logout/`, {
    method: 'POST',
    credentials: 'include',
  });
}

export async function refreshToken() {
  await fetch(`${WS_BASE}/usuario/refresh/`, {
    method: 'POST',
    credentials: 'include',
  });
}

export async function getCurrentUser() {
  const response = await fetch(`${WS_BASE}/usuario/me/`, {
    method: 'GET',
    credentials: 'include', // envia cookie com access_token
  });

  if (!response.ok) {
    throw new Error('Falha ao obter usuário autenticado');
  }

  return response.json(); // ← deve retornar { id, nome_completo, email, tipo, ... }
}

export async function getCurrentUserSafely(
  attempts = 2,
  delay = 400
): Promise<User> {
  for (let i = 0; i < attempts; i++) {
    try {
      const res = await fetch(`${WS_BASE}/usuario/me/`, {
        credentials: 'include',
      });

      if (res.ok) {
        return await res.json();
      }
    } catch {
      // ignora erros, tentará novamente
    }

    // espera antes de tentar de novo
    await new Promise((resolve) => setTimeout(resolve, delay));
  }

  throw new Error('Não foi possível obter o usuário autenticado');
}
