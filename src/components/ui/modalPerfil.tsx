'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useModal } from '@/context/modalPerfilContext';

export default function ModalPerfil() {
  const categorias = ['favorita', 'romance', 'motivouLevou'];
  const router = useRouter();
  const pathname = usePathname();
  const [categoria, setCategoria] = useState<string>('');
  const { closeModal, isModalOpen } = useModal();
  const [shouldRender, setShouldRender] = useState(false);
  const [isVisible, setIsVisible] = useState(isModalOpen);

  useEffect(() => {
    if (isModalOpen) {
      setShouldRender(true);
      setTimeout(() => setIsVisible(true), 50);
    } else {
      setIsVisible(false);
      setTimeout(() => setShouldRender(false), 700);
    }
  }, [isModalOpen]);

  useEffect(() => {
    if (pathname === '/favorita') {
      setCategoria('favorita');
    } else if (pathname === '/romance') {
      setCategoria('romance');
    } else {
      setCategoria('motivouLevou');
    }
  }, [pathname]);

  const handleCategoriaChange = (value: string) => {
    setCategoria(value);

    const routeMap: { [key: string]: string } = {
      favorita: '/favorita',
      romance: '/romance',
      motivouLevou: '/motivou-levou',
    };

    router.replace(routeMap[value]);

    setTimeout(() => {
      closeModal();
    }, 120);
  };

  const handleLogout = () => {
    localStorage.clear();
    closeModal();
    router.push('/login');
  };

  if (!shouldRender) return null;

  return (
    <div
      className={`fixed inset-0 flex items-end justify-center z-50 transition-all duration-700 ease-out
          ${
            shouldRender
              ? isVisible
                ? 'opacity-100 translate-y-0 rounded-b-3xl'
                : 'opacity-0 translate-y-10'
              : 'opacity-0'
          }`}
    >
      <div
        className="bg-[#F5F5F5] w-[100%] md:max-w-full shadow-lg p-6 relative"
        style={{ height: 'calc(100vh - 130px)' }}
      >
        <div className="fixed top-1 left-2  text-white px-3 cursor-pointer">
          <button className="text-white text-[40px]" onClick={closeModal}>
            &times;
          </button>
        </div>

        <div className="mt-5 h-[550px] ">
          <h1 className="text-sm text-black font-semibold mb-1 tracking-tighter">
            O que está buscando?
          </h1>
          <p className="text-xs text-[#656565] tracking-tighter">
            Selecione sua área de interesse.
          </p>
          <div className="flex flex-col justify-between  h-full">
            <div className="flex flex-col gap-4 mt-6">
              {categorias.map((cat) => (
                <label
                  key={cat}
                  className={`flex  w-full h-[50px] px-4 rounded-[10px] items-center gap-2 text-sm font-semibold cursor-pointer ${
                    categoria === cat
                      ? ' text-black bg-white'
                      : 'text-[#131313] text-opacity-60 bg-[#FFFFFF] bg-opacity-60'
                  }`}
                >
                  <input
                    type="radio"
                    name="categoria"
                    value={cat}
                    checked={categoria === cat}
                    onChange={(e) => handleCategoriaChange(e.target.value)}
                    disabled={cat === 'romance'}
                    className="accent-[var(--icone)]"
                  />

                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </label>
              ))}
            </div>
            <button
              className="w-full h-12 border bg-[#E8E8E8] text-[#131313] rounded-[10px] text-sm font-semibold mt-6"
              onClick={handleLogout}
            >
              Sair do aplicativo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
