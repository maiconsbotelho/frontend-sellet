'use client';

import { useState } from 'react';
import { MenuToggle } from '@/components/landing/menu/menuToggle';
import { MenuItems } from '@/components/landing/menu/menuItems';

export default function Menu2() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen((prev) => !prev);

  return (
    <div>
      {/* Botão visível apenas no mobile */}
      <MenuToggle isOpen={isOpen} toggle={toggleMenu} />

      {/* Menu - visível no desktop, toggle no mobile */}
      <div
        className={`
          fixed top-[70px] right-0 w-full shadow-lg rounded transition-all duration-700 ease-out
          ${isOpen ? 'block' : 'hidden'} 
          sm:static sm:shadow-none sm:border-none sm:block
        `}
      >
        <MenuItems onItemClick={() => setIsOpen(false)} />
      </div>
    </div>
  );
}
