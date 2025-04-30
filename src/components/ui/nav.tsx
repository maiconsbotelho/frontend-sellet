'use client';
import { usePathname, useRouter } from 'next/navigation';

// Icons
import { IoCalendarOutline } from 'react-icons/io5';
import { FaPeopleGroup } from 'react-icons/fa6';
import { LiaClipboardListSolid } from 'react-icons/lia';

const navItems = [
  {
    label: 'Agenda',
    route: '/admin',
    icon: <IoCalendarOutline className="text-3xl" />,
    activePath: '/admin',
  },
  {
    label: 'Clientes',
    route: '/admin/clientes',
    icon: <FaPeopleGroup className="text-3xl" />,
    activePath: '/clientes',
  },
  {
    label: 'Serviços',
    route: '/admin/servicos',
    icon: <LiaClipboardListSolid className="text-3xl" />,
    activePath: '/servicos',
  },
  {
    label: 'Profissionais',
    route: '/admin/profissionais',
    icon: <LiaClipboardListSolid className="text-3xl" />,
    activePath: '/profissionais',
  },
];

export default function Nav() {
  const router = useRouter();
  const path = usePathname();

  return (
    <div className="w-screen fixed left-0 bottom-0 pt-4 pb-12 px-4 bg-[var(--primary)] backdrop-blur-sm tracking-tighter">
      <div className="w-full grid grid-cols-[1fr_1fr_1fr] relative text-xs text-[var(--secondary)]">
        {navItems.map((item, index) => (
          <div
            key={index}
            onClick={() => router.push(item.route)}
            className="flex flex-col justify-center items-center gap-1 cursor-pointer"
            aria-label={item.label}
          >
            {item.icon}
            <p
              className={`text-center ${
                path === item.activePath ? 'text-principal' : ''
              }`}
            >
              {item.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
