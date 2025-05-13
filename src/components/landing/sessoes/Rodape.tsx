import {
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandLinkedin,
  IconBrandWhatsapp,
  IconBrandYoutube,
} from '@tabler/icons-react';
import Logo from '@/components/ui/Logo';
export default function Rodape() {
  return (
    <div className="bg-pink-950">
      <footer className="container flex flex-col bg-pink-950 text-zinc-400 py-10 gap-10">
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between text-center md:text-left gap-5 md:gap-0">
          {/* <Logo /> */}
          {/* <div className="flex flex-col gap-1">
            <span className="text-2xl font-bold text-zinc-200 pb-2">Sobre</span>
            <span className="text-sm">Nossa História</span>
            <span className="text-sm">Política de Privacidade</span>
            <span className="text-sm">Termos de Uso</span>
          </div> */}
          {/* <div className="flex flex-col gap-1">
            <span className="text-2xl font-bold text-zinc-200 pb-2">
              Contato
            </span>
            <span className="text-sm">suporte@sellet.app</span>
            <div className=" text-sm flex items-center gap-2 justify-center md:justify-start">
              <IconBrandWhatsapp size={20} className="text-green-500" />
              <span>WhatsApp</span>
            </div>
          </div> */}
        </div>
        <div className="flex flex-col md:flex-row items-center gap-1.5 justify-between">
          <div className="flex mt-5 flex-col md:flex-row items-center gap-1.5">
            © {new Date().getFullYear()} 💖 Séllet Esmalteria. Todos os direitos
            reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}
