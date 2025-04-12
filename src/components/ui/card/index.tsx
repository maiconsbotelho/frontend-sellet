import Image, { StaticImageData } from 'next/image';

interface CardProps {
  titulo: string;
  imagem: string | StaticImageData;
  descricao: string;
}

export default function Card({ titulo, imagem, descricao }: CardProps) {
  return (
    <div className="flex flex-col items-center text-center gap-4 justify-center bg-white rounded-lg shadow-md p-4">
      <h2 className="text-xl font-bold mt-4 text-[var(--primary-color)]">
        {titulo}
      </h2>
      <Image src={imagem} alt={titulo} className="rounded-lg" />
      <p className="text-gray-600 mt-2">{descricao}</p>
    </div>
  );
}
