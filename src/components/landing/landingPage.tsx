'use client';

import Image from 'next/image';
import Logo from '../shared/Logo';
import { Playfair_Display } from 'next/font/google';
import Menu from './menu/menu';
import BotaoAgendar from './botaoAgendar';

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '700'],
});

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[var(--vinho)]  text-pink-900 font-sans">
      <header className="flex container mx-auto justify-between items-center p-4 md:px-0 bg-[var(--vinho)] shadow">
        <Logo />
        <div className="md:flex md:justify-end md:items-center md:gap-6">
          <nav className="hidden text-white md:flex md:justify-end md:items-end gap-6 text-sm">
            <a href="#sobre">Sobre Nós</a>
            <a href="#galeria">Galeria</a>
            <a href="#localizacao">Localização</a>
          </nav>
          <Menu />
        </div>
      </header>

      {/* Hero */}
      <section
        className="relative h-[650px] w-full flex items-center justify-center text-white text-center "
        style={{
          backgroundImage: "url('/banners/heroBanner.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-[#701c44dd] via-[var(--vinho)] to-transparent z-0" />

        <div className="relative container mx-auto px-4 md:px-0  w-full  text-start z-10">
          <h1 className={playfair.className + ' text-6xl  text-start'}>
            Realce sua <br /> beleza com <br />a Séllet
          </h1>

          <p className="mt-4 text-xl md:text-xl drop-shadow">
            Agende online, sem complicações.
          </p>
          <BotaoAgendar />
        </div>
      </section>

      {/* Benefícios */}
      <section className="relative z-20  -mt-20 px-4 pt-5 bg-pink-50 text-pink-800 rounded-tl-[100px]  ">
        <div className="grid container pl-8   mx-auto  grid-cols-2 md:flex md:justify-between gap-6 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-2xl">💕</span>
            <p className="text-left">Atendimento personalizado</p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-2xl">💅</span>
            <p className="text-left">
              Nail art & <br />
              Alongamento
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-2xl">📱</span>
            <p className="text-left">
              Agendamento <br />
              100% online
            </p>
          </div>

          <div className="flex items-center gap-2 ">
            <span className="text-2xl">❄️</span>
            <p className="text-left">Ambiente Climatizado</p>
          </div>
        </div>
      </section>

      {/* Galeria */}
      <section id="galeria" className="py-5  px-2 bg-pink-50">
        <div className="p-2 py-10 bg-[var(--primary)] container mx-auto  rounded-[50px]">
          <h3 className="text-3xl font-bold mb-10 text-center">Galeria</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[1, 2, 3, 4].map((img) => (
              <Image
                key={img}
                src={`/nail/nail${img}.jpg`}
                alt={`Foto ${img}`}
                width={300}
                height={300}
                className="rounded-lg shadow-md object-cover"
              />
            ))}
          </div>
        </div>
      </section>

      {/* Sobre Nós */}
      <section
        id="sobre"
        className="py-16 px-6 bg-white text-center   md:text-left"
      >
        <div className=" mx-auto container">
          <h3 className="mx-auto text-center text-3xl font-bold mb-4">
            Sobre Nós
          </h3>

          <p className="mb-3 text-lg text-justify">
            A Séllet nasceu em 2021, período pandêmico onde não se podia
            trabalhar. Era somente o essencial!! Nesse momento a Séllet precisou
            abrir as portas. Abriu as portas para algo q era essencial sim, era
            essencial para a mente e corpo das mulheres. Auto estima tem
            prioridade aqui.
          </p>
          <p className="mb-3 text-lg hidden md:block text-justify">
            A Séllet tem como prevalência o bem estar e aconchego do cliente.
            Ser um lugar para você ter um colo e também a auto estima elevada e
            devolvida. Risos e beleza andam juntos. Conversa e mate, se isso não
            te alegrar, café tbm tem tá?! Rsrsrs O amor impera nessa casa.Amor
            por unhas.
          </p>

          <p className="text-lg pb-7 hidden md:block text-justify ">
            Amor por cores.Amor por formas.Amor por pessoas. Amor por ver que
            temos aqui em nossas mãos o que vc precisa para ser uma mulher mais
            confiante e empoderada.Você é única e é isso que vamos te mostrar.
            Vem conhecer. É um prazer mostrar nossa casa e te fazer parte dessa
            selléta carta de clientes que são sempre essenciais e prioridade
            para nossa casa!!
          </p>
        </div>
      </section>

      {/* Localização */}
      <section id="localizacao" className="py-16 px-6 bg-white text-center">
        <h3 className="text-3xl font-bold mb-6">Localização</h3>
        <p className="mb-6 text-gray-700">
          Rua Evaristo da Veiga - 14 - Igrejinha/RS
        </p>
        <div className="container mx-auto">
          <iframe
            className="w-full max-w-3xl md:max-w-full h-64 mx-auto rounded shadow"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3469.7295239076952!2d-50.807108824986834!3d-29.582472110007!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9519231fb3223f8b%3A0x87cebf0c098b9833!2sSellet%20Esmalteria!5e0!3m2!1spt-BR!2sbr!4v1747147167767!5m2!1spt-BR!2sbr"
            allowFullScreen
            loading="lazy"
          ></iframe>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[var(--vinho)] text-center py-6 text-sm text-pink-100">
        © {new Date().getFullYear()} 💖Séllet Esmalteria. Todos os direitos
        reservados.
      </footer>
    </main>
  );
}
