import Slogan from '@/components/landing/Slogan';
import NossosServicos from '@/components/secoes/nossosServicos/NossosServicos';
import Rodape from '@/components/secoes/rodape/Rodape';
import SecaoBackground from '@/components/secoes/secaoBackground/SecaoBackground';
import SecaoSobre from '@/components/secoes/sobre/SecaoSobre';

export default function Landing() {
  return (
    <div className="flex flex-col">
      <Slogan />
      <SecaoBackground imagem="/banners/servicos.png">
        <NossosServicos />
      </SecaoBackground>
      {/* <SecaoBackground imagem="/banners/profissionais.webp">
                <NossosProfissionais />
            </SecaoBackground> */}
      <SecaoBackground imagem="/banners/sobre.png">
        <SecaoSobre />
      </SecaoBackground>

      <Rodape />
    </div>
  );
}
