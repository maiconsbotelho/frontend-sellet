import { IoClose } from 'react-icons/io5';
import { GiHamburgerMenu } from 'react-icons/gi';

type MenuToggleProps = {
  isOpen: boolean;
  toggle: () => void;
};

export function MenuToggle({ isOpen, toggle }: MenuToggleProps) {
  return (
    <button
      onClick={toggle}
      className="text-[var(--secondary)] text-[23px] rounded sm:hidden"
    >
      {isOpen ? <IoClose /> : <GiHamburgerMenu />}
    </button>
  );
}
