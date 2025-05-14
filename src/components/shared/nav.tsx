'use client';
import { usePathname, useRouter } from 'next/navigation';

// Icons
import { IoCalendarOutline, IoTimeOutline } from 'react-icons/io5';
import { FaPeopleGroup } from 'react-icons/fa6';
import { LiaClipboardListSolid } from 'react-icons/lia';
import { GiCaptainHatProfile } from 'react-icons/gi';

const navItems = [
  {
    label: 'Agenda',
    route: '/admin/agenda',
    icon: <IoCalendarOutline className="text-3xl" />,
    activePath: '/admin/agenda',
  },
  {
    label: 'Clientes',
    route: '/admin/clientes',
    icon: <FaPeopleGroup className="text-3xl" />,
    activePath: '/admin/clientes',
  },
  {
    label: 'Serviços',
    route: '/admin/servicos',
    icon: <LiaClipboardListSolid className="text-3xl" />,
    activePath: '/admin/servicos',
  },
  {
    label: 'Profissionais',
    route: '/admin/profissionais',
    icon: <GiCaptainHatProfile className="text-3xl" />,
    activePath: '/admin/profissionais',
  },
  {
    label: 'Expediente',
    route: '/admin/expediente',
    icon: <IoTimeOutline className="text-3xl" />,
    activePath: '/admin/expediente',
  },
];

export default function Nav() {
  const router = useRouter();
  const path = usePathname();

  return (
    <div className="w-screen z-50 fixed left-0 bottom-0 pt-4 pb-12 px-4 bg-[var(--primary)] backdrop-blur-sm tracking-tighter overflow-hidden">
      {' '}
      {/* Adicionado overflow-hidden */}
      <div className="w-full flex overflow-x-auto space-x-6 pb-2 relative text-xs text-[var(--secondary)]">
        {' '}
        {/* Alterado para flex, overflow-x-auto e adicionado space-x e pb */}
        {navItems.map((item, index) => (
          <div
            key={index}
            onClick={() => router.push(item.route)}
            className={`flex flex-col flex-shrink-0 justify-center items-center gap-1 cursor-pointer w-20 ${
              // Apply accent color to the icon as well if active
              path === item.activePath ? 'text-[var(--accent)]' : ''
            }`}
            aria-label={item.label}
          >
            {item.icon}
            <p
              className={`text-center ${
                path === item.activePath
                  ? 'text-[var(--accent)] font-semibold' // Use var(--accent) for active text color
                  : 'text-[var(--secondary)]' // Ensure non-active items use secondary color
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
