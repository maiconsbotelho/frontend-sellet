// aqui preciso utilizar o comonente card de shared/card, vou utilizar 3 cards, um para cada serviço
import Card from '@/components/ui/card';
import Nail1 from '@/../public/img/nail-1.png';
import Nail2 from '@/../public/img/nail-2.png';
import Nail3 from '@/../public/img/nail-3.png';

export default function SessaoServicos() {
  return (
    <div className="flex flex-col py-8 items-center justify-center w-full h-full px-4 bg-white">
      <h1 className="text-2xl text-[var(--text-primary)] font-bold text-center">
        Conheça nossos serviços
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
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
        <div className="w-full  p-2">
          <Card
            titulo="Spa dos Pés"
            imagem={Nail3}
            descricao="É feito a partir de uma técnica que envolve a aplicação de um gel específico por cima da unha natural. Resultando em unhas fortes e do tamanho desejado"
          />
        </div>
      </div>
    </div>
  );
}
