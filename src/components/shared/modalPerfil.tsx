'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useModal } from '@/context/modalPerfilContext';
import { logout } from '@/services/authService'; // novo serviço real de logout
import Image from 'next/image'; // Importar Image para o avatar
// Se a imagem estiver em public/avatar-nanda.jpg, você pode referenciá-la diretamente no src do Image como /avatar-nanda.jpg

export default function ModalPerfil() {
  const categorias = ['favorita', 'romance', 'motivouLevou']; // Mantido, caso seja usado no futuro
  const router = useRouter();
  const pathname = usePathname();
  const [categoria, setCategoria] = useState<string>(''); // Mantido
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

  const handleLogout = async () => {
    try {
      await logout(); // chamada real ao backend
      closeModal();
      router.push('/login');
    } catch (err) {
      console.error('Erro ao deslogar:', err);
      // Adicionar feedback de erro para o usuário, se necessário
    }
  };

  if (!shouldRender) return null;

  return (
    <div
      className={`fixed inset-0 flex items-end justify-center z-50 transition-all duration-700 ease-out
        ${
          shouldRender
            ? isVisible
              ? 'opacity-100 translate-y-0' // Removido rounded-b-3xl daqui
              : 'opacity-0 translate-y-10'
            : 'opacity-0'
        }`}
      onClick={closeModal} // Fechar ao clicar no overlay
    >
      <div
        className={`bg-[#F5F5F5] w-[100%] md:max-w-full shadow-lg p-6 relative rounded-t-3xl md:rounded-t-none md:rounded-b-3xl transition-all duration-700 ease-out transform ${
          // Adicionado rounded-t-3xl e transform
          isVisible ? 'translate-y-0' : 'translate-y-full'
        }`}
        style={{ height: 'calc(100vh - 100px)' }} // Ajuste na altura se necessário
        onClick={(e) => e.stopPropagation()} // Evitar fechar ao clicar dentro do modal
      >
        <div className="absolute top-0 right-4 text-gray-600 px-3 cursor-pointer z-10">
          {' '}
          {/* Botão de fechar mais visível */}
          <button className="text-gray-700 text-[28px]" onClick={closeModal}>
            &times;
          </button>
        </div>
        <div className="flex flex-col items-center justify-center  text-center pt-8 pb-4">
          {/* Avatar */}
          <div className="mb-6">
            <div className="w-24 h-24 rounded-full flex items-center justify-center overflow-hidden border-2 border-rose-300 shadow-sm">
              <Image
                src="/avatar-nanda.jpg" // Caminho para a imagem na pasta public
                alt="Avatar do usuário"
                width={96} // Deve ser um pouco menor que o container para a borda ser visível
                height={96}
                className="object-cover rounded-full" // Garante que a imagem preencha o círculo
              />
            </div>
          </div>

          {/* Pergunta */}
          <h1 className="text-xl text-black font-semibold mb-8 tracking-tight">
            O que você gostaria de fazer?
          </h1>

          {/* Outras opções podem ser adicionadas aqui no futuro */}
          {/* Exemplo:
          <div className="space-y-4 w-full max-w-xs mb-8">
            <button className="w-full h-12 border bg-white text-[#131313] rounded-[10px] text-sm font-semibold">
              Ver meu perfil
            </button>
            <button className="w-full h-12 border bg-white text-[#131313] rounded-[10px] text-sm font-semibold">
              Configurações
            </button>
          </div>
          */}

          {/* Botão de Sair */}
          <div className="w-full max-w-xs mt-8">
            {' '}
            {/* Alterado de mt-auto para mt-8 */}
            <button
              className="w-full h-12 border bg-[#E8E8E8] hover:bg-gray-300 text-[#131313] rounded-[10px] text-sm font-semibold transition-colors"
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
