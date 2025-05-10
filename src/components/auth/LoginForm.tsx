'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '@/services/authService';

export default function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [erro, setErro] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro(null);
    setLoading(true);
    try {
      await login(email, password);
      router.push('/admin/agenda'); // ou outra rota inicial após login
    } catch (err: any) {
      setErro(err.message || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-sm mx-auto mt-24 bg-white p-6 rounded-lg shadow-md flex flex-col gap-4"
    >
      <h1 className="text-xl font-bold text-center">Entrar</h1>

      {erro && <p className="text-red-600 text-sm text-center">{erro}</p>}

      <div>
        <label className="block text-sm mb-1">E-mail</label>
        <input
          type="email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      <div>
        <label className="block text-sm mb-1">Senha</label>
        <input
          type="password"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[var(--primary)] text-white py-2 rounded hover:opacity-90 transition"
      >
        {loading ? 'Entrando...' : 'Entrar'}
      </button>
    </form>
  );
}
