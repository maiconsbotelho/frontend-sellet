import { WS_BASE } from '@/interface_ws/ws_link';

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
