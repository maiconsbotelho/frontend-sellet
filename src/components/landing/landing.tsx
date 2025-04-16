import Slogan from '@/components/landing/Slogan';
import NossosServicos from '@/components/landing/sessoes/sessaoServicos';
import Rodape from '@/components/landing/sessoes/Rodape';
import SecaoBackground from '@/components/landing/sessoes/SecaoBackground';
import SecaoSobre from '@/components/landing/sessoes/SecaoSobre';

export default function Landing() {
  return (
    <div className="flex flex-col">
      <Slogan />
      <SecaoBackground imagem="/banners/servicos.png">
        <NossosServicos />
      </SecaoBackground>
      <SecaoBackground imagem="/banners/sobre.png">
        <SecaoSobre />
      </SecaoBackground>

      <Rodape />
    </div>
  );
}
