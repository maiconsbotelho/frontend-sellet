import { IconeMao } from '@/components/icons';

export default function BoasVindas() {
  return (
    <div className="flex w-full flex-col text-center p-5 items-center justify-center h-[480px] bg-[#F9F5F1]">
      <h1 className="text-4xl font-bold text-[var(--text-primary)]">
        Seja bem-vinda!
      </h1>
      <p className=" text-lg my-8 text-gray-500">
        Na Séllet oferecemos mais que unhas esmaltadas. Aqui você encontra e faz
        amigas, toma um mate fresquinho, mas também tem o cafezinho que não pode
        faltar! Venha nos conhecer e entenda porquê somos O LUGAR PARA MULHERES
        "SELLÉTAS".
      </p>
      {IconeMao}
    </div>
  );
}
