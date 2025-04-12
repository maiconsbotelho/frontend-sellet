import Image from "next/image";
import Profissional1 from "/public/img/profissional-1.png";

export default function SessaoProfissional() {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full py-8 bg-[#E9DCCE] px-4 gap-4">
      <h1 className="text-4xl text-[var(--text-primary)] font-bold text-center ">Profissional</h1>
      <div className="flex md:flex-row md:items-start flex-col items-center justify-center w-fullh-full gap-4 p-4 ">
        <Image src={Profissional1} alt="Profissional" className="rounded-lg md:w-[50%] lg:w-[30%]" />
        <div className="md:w-[40%] md:flex flex-col md-h-full items-start justify-start ">
          <h2 className="font-bold mt-4 md:mt-0 text-[var(--text-primary)]">Fernanda Telles</h2>
          <p className="mt-4  text-start text-sm text-[var(--color-text)]">
            Iniciei minha jornada aos 15 anos, quando queria seguir minha carreira na área da beleza, como cabeleireira.
            Por motivos de falta de espaço no salão da minha mãe, a proposta foi preencher a vaga de manicure
            temporariamente. Neste desvio de rota encontrei minha paixão nas unhas. Após aprender os primeiros passos,
            minha vocação pela profissão se consolidou e ao longo desses anos, minha dedicação para atingir a excelência
            em meu trabalho só aumentou. Hoje, com{" "}
            <span className="font-bold text-[var(--text-primary)]"> 20 anos de experiência</span>, tenho muito orgulho
            de ser a Fernanda Telles, a manicure.
          </p>
        </div>
      </div>
    </div>
  );
}
