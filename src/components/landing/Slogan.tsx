import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/landing/header';

export default function Slogan() {
  return (
    <div className="relative h-[450px] sm:h-[700px]">
      <Image
        src="/banners/heroBanner.jpg"
        fill
        alt="Esmalteria"
        className="object-cover"
      />
      <div
        className="
                    flex flex-col items-center
                    absolute top-0 left-0 w-full h-full
                    bg-black/65
                "
      >
        <Header />

        <div className="flex flex-col justify-center items-center flex-1 gap-5">
          <h1 className="flex flex-col items-center">
            <span className="text-2xl text-white sm:text-3xl md:text-4xl lg:text-5xl font-thin ">
              Transformações
            </span>
            <span className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-gradient">
              Lendárias
            </span>
          </h1>
          <p className="text-base text-white sm:text-lg font-extralight">
            💅 Sua beleza é nossa motivação 💅
          </p>
          <Link
            href="/agendamento"
            className="
                            bg-gradient-to-r from-pink-600 to-pink-950
                            text-white font-semibold text-base md:text-lg
                            px-4 py-2 rounded-xl hover:from-pink-500 hover:to-pink-500
                        "
          >
            Agendar Agora
          </Link>
        </div>
      </div>
    </div>
  );
}
