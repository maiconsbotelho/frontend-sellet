'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login, getCurrentUser } from '@/services/authService';
import Image from 'next/image';
import { FiMail, FiLock } from 'react-icons/fi';

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

    await login(email, password);

    // aguarda 300ms para garantir que o cookie esteja salvo
    setTimeout(async () => {
      try {
        const user = await getCurrentUser();

        if (user.tipo === 'CLIENTE') {
          router.push('/cliente');
        } else if (user.tipo === 'ADMIN') {
          router.push('/admin/agenda');
        } else {
          router.push('/');
        }
      } catch (err: any) {
        setErro(err.message || 'Erro ao obter usuário após login');
      } finally {
        setLoading(false);
      }
    }, 300);

    // try {
    //   await login(email, password);
    //   const user = await getCurrentUser();

    //   if (user.tipo === 'CLIENTE') {
    //     router.push('/cliente');
    //   } else if (user.tipo === 'ADMIN') {
    //     router.push('/admin/agenda');
    //   } else {
    //     router.push('/');
    //   }
    // } catch (err: any) {
    //   setErro(err.message || 'Erro ao fazer login');
    // } finally {
    //   setLoading(false);
    // }
  };

  return (
    <div className="relative min-h-screen p-8 flex items-center justify-center overflow-hidden">
      {/* Fundo de tijolo */}
      <Image
        src="/banners/sobre.png"
        alt="Plano de fundo tijolinho"
        fill
        className="object-cover z-0"
        priority
      />

      {/* Overlay rosado com blur */}
      <div className="absolute inset-0 bg-rose-100/30 backdrop-blur-sm z-10" />

      {/* Card de login */}
      <div className="relative z-20 w-full max-w-md bg-white rounded-3xl shadow-xl p-8 md:p-10 border border-rose-100">
        <div className="flex justify-center mb-6">
          <Image
            src="/avatar-nanda.jpg"
            alt="Logo Sellet"
            width={90}
            height={90}
            className="rounded-full shadow-lg border-2 border-rose-300"
          />
        </div>

        <h1 className="text-3xl font-serif font-bold text-center text-rose-700 mb-6 tracking-wide">
          Bem-vinda 💖
        </h1>

        {erro && (
          <p className="text-red-600 text-sm text-center bg-red-100 px-4 py-2 rounded-lg mb-4 border border-red-200">
            {erro}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm text-gray-700 mb-1">
              E-mail
            </label>
            <div className="relative">
              <FiMail className="absolute top-3.5 left-3 text-gray-400" />
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-300 transition"
                placeholder="seuemail@exemplo.com"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm text-gray-700 mb-1"
            >
              Senha
            </label>
            <div className="relative">
              <FiLock className="absolute top-3.5 left-3 text-gray-400" />
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-300 transition"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-rose-500 hover:bg-rose-600 text-white font-semibold py-3 rounded-lg shadow-lg transition-all duration-200 disabled:opacity-60"
          >
            {loading ? 'Entrando…' : 'Entrar'}
          </button>
        </form>

        {/* WhatsApp Link */}
        <div className="text-center mt-6 space-y-2">
          <p className="text-sm text-gray-600">Ainda não tem uma conta?</p>
          <a
            href="https://wa.me/5551999484099?text=Olá!%20Gostaria%20de%20criar%20minha%20conta%20na%20Sellet%20Esmalteria."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center text-sm text-green-600 hover:text-green-700 transition font-medium"
          >
            <span className="text-xl mr-1">💬</span> Fale com a gente no
            WhatsApp
          </a>
          <p className="text-xs text-gray-400 mt-4">
            © {new Date().getFullYear()} 💅 Sellet Esmalteria
          </p>
        </div>
      </div>
    </div>
  );
}
