import TituloSecao from '@/components/ui/TituloSecao';

export default function SecaoSobre() {
  return (
    <>
      <div className="container flex flex-col pt-7 mb-20 gap-y-16">
        <TituloSecao
          tag="Quem Somos"
          principal="Como Tudo Começou"
          secundario="só as melhores estão aqui! Temos o orgulho de contar com a equipe mais qualificada do Brasil!"
        />
      </div>

      <div className="container text-white">
        <p className="mb-3 text-lg text-justify">
          A Séllet nasceu em 2021, período pandêmico onde não se podia
          trabalhar. Era somente o essencial!! Nesse momento a Séllet precisou
          abrir as portas. Abriu as portas para algo q era essencial sim, era
          essencial para a mente e corpo das mulheres. Auto estima tem
          prioridade aqui.
        </p>
        <p className="mb-3 text-lg">
          A Séllet tem como prevalência o bem estar e aconchego do cliente. Ser
          um lugar para você ter um colo e também a auto estima elevada e
          devolvida. Risos e beleza andam juntos. Conversa e mate, se isso não
          te alegrar, café tbm tem tá?! Rsrsrs O amor impera nessa casa.Amor por
          unhas.
        </p>

        <p className="text-lg pb-7">
          Amor por cores.Amor por formas.Amor por pessoas. Amor por ver que
          temos aqui em nossas mãos o que vc precisa para ser uma mulher mais
          confiante e empoderada.Você é única e é isso que vamos te mostrar. Vem
          conhecer. É um prazer mostrar nossa casa e te fazer parte dessa
          selléta carta de clientes que são sempre essenciais e prioridade para
          nossa casa!!
        </p>
      </div>
    </>
  );
}
