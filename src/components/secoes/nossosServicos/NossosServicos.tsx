'use client';

import TituloSecao from '@/components/ui/TituloSecao';
import Card from '@/components/ui/card/index';
import Nail1 from '@/../public/nail/nail1.jpg';
import Nail2 from '@/../public/nail/nail2.jpg';
import Nail3 from '@/../public/nail/nail3.jpg';
import Nail4 from '@/../public/nail/nail4.jpg';

// import useServicos from "@/data/hooks/useServicos";

export default function NossosServicos() {
  // const { servicos } = useServicos();

  return (
    <div className="flex flex-col  gap-y-16">
      <TituloSecao
        tag="Serviços"
        principal="Do Clássico ao Moderno"
        secundario="Unhas impecáveis, cutículas bem cuidadas e nail art personalizada, tudo em um ambiente que mistura elegância e atitude! ✨"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 mx-auto lg:grid-cols-4 gap-4 mt-4">
        <div className="w-full  p-2">
          <Card
            titulo="Esmaltação tradicional"
            imagem={Nail1}
            descricao="A esmaltação convencional possui uma durabilidade padrão de aproximadamente 7 dias"
          />
        </div>
        <div className="w-full  p-2">
          <Card
            titulo="Esmaltação em gel"
            imagem={Nail2}
            descricao="O esmalte em gel é mais resistente e impede que aquela pontinha descasque, desbote ou perca ainda o brilho. Sensacional, né?"
          />
        </div>
        <div className="w-full p-2">
          <Card
            titulo="Alongamento"
            imagem={Nail3}
            descricao="É feito a partir de uma técnica que envolve a aplicação de um gel específico por cima da unha natural. Resultando em unhas fortes e do tamanho desejado"
          />
        </div>
        <div className="w-full p-2">
          <Card
            titulo="Alongamento"
            imagem={Nail4}
            descricao="É feito a partir de uma técnica que envolve a aplicação de um gel específico por cima da unha natural. Resultando em unhas fortes e do tamanho desejado"
          />
        </div>
      </div>
    </div>
  );
}
