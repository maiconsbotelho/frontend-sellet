'use client';

import Image from 'next/image';

export default function Home() {
  return (
    <main className="min-h-screen bg-pink-50 text-pink-900 font-sans">
      {/* Header */}
      <header className="flex justify-between items-center p-4 bg-pink-100 shadow">
        <h1 className="text-2xl font-bold">Séllet</h1>
        <nav className="hidden md:flex gap-6 text-sm">
          <a href="#sobre">Sobre Nós</a>
          <a href="#galeria">Galeria</a>
          <a href="#localizacao">Localização</a>
        </nav>
        <button className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded">
          Fazer Login
        </button>
      </header>

      {/* Hero */}
      <section
        className="relative h-[650px] w-full flex items-center justify-center text-white text-center"
        style={{
          backgroundImage: "url('/banners/heroBanner.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-[#701c44dd] via-[#701c4480] to-transparent z-0" />

        <div className="relative z-10 px-6">
          <h1 className="text-4xl font-extrabold leading-tight drop-shadow-md md:text-5xl">
            Realce sua beleza com a <span className="text-white">Séllet</span>
          </h1>
          <p className="mt-4 text-lg md:text-xl drop-shadow">
            Agende online, sem complicações.
          </p>
          <button className="mt-8 bg-pink-500 hover:bg-pink-600 text-white font-semibold text-lg px-8 py-3 rounded-full shadow-lg transition-all">
            Agendar Agora
          </button>
        </div>
      </section>

      {/* Benefícios */}
      <section className="py-10 px-4 bg-pink-50 text-pink-800">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-sm">
          <div className="flex flex-col items-center">
            <span className="text-xl">✔️</span>
            <p className="mt-2">Atendimento personalizado</p>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-xl">💅</span>
            <p className="mt-2">Nail art & esmaltação em gel</p>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-xl">📱</span>
            <p className="mt-2">Agendamento 100% online</p>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-xl">⭐</span>
            <p className="mt-2">Avaliação 5 estrelas</p>
          </div>
        </div>
      </section>

      {/* Sobre Nós */}
      <section
        id="sobre"
        className="py-16 px-6 bg-white text-center md:text-left"
      >
        <div className="max-w-3xl mx-auto">
          <h3 className="text-3xl font-bold mb-4">Sobre Nós</h3>
          <p className="text-lg text-gray-700">
            Somos uma esmalteria dedicada à autoestima feminina. Nossos serviços
            são pensados para oferecer beleza, bem-estar e confiança em cada
            atendimento. Na Séllet, o cuidado começa nos detalhes.
          </p>
        </div>
      </section>

      {/* Galeria */}
      <section id="galeria" className="py-16 px-6 bg-pink-50">
        <h3 className="text-3xl font-bold mb-10 text-center">Galeria</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {[1, 2, 3, 4].map((img) => (
            <Image
              key={img}
              src={`/gallery-${img}.jpg`}
              alt={`Foto ${img}`}
              width={300}
              height={300}
              className="rounded-lg shadow-md object-cover"
            />
          ))}
        </div>
      </section>

      {/* Localização */}
      <section id="localizacao" className="py-16 px-6 bg-white text-center">
        <h3 className="text-3xl font-bold mb-6">Localização</h3>
        <p className="mb-6 text-gray-700">Av. Exemplo, 123 - Cidade Exemplo</p>
        <iframe
          className="w-full max-w-3xl h-64 mx-auto rounded shadow"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3656.2400880916653!2d-46.65893668441695!3d-23.59327186811186!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce59c97ce7a5f9%3A0x6e21806b0b87e11b!2sAv.%20Paulista%2C%201570!5e0!3m2!1spt-BR!2sbr!4v1620041945632!5m2!1spt-BR!2sbr"
          allowFullScreen
          loading="lazy"
        ></iframe>
      </section>

      {/* Footer */}
      <footer className="bg-pink-100 text-center py-6 text-sm text-pink-800">
        © {new Date().getFullYear()} Séllet Esmalteria. Todos os direitos
        reservados.
      </footer>
    </main>
  );
}
