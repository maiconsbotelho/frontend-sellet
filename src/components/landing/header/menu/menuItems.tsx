type MenuItemsProps = {
  onItemClick?: () => void;
};

export function MenuItems({ onItemClick }: MenuItemsProps) {
  const handleClick = () => {
    if (onItemClick) onItemClick();
  };

  return (
    <ul className="flex flex-col bg-[var(--secondary)] sm:bg-transparent text-[var(--primary)] sm:text-[var(--secondary)] sm:flex-row sm:gap-4 p-2">
      <li
        onClick={handleClick}
        className="p-2 hover:bg-gray-500 cursor-pointer border-b-2 lg:hover:bg-transparent"
      >
        Home
      </li>
      <li
        onClick={handleClick}
        className="p-2 hover:bg-gray-500 cursor-pointer lg:hover:bg-transparent"
      >
        Sobre
      </li>
      <li
        onClick={handleClick}
        className="p-2 hover:bg-gray-500 cursor-pointer lg:hover:bg-transparent"
      >
        Contato
      </li>
    </ul>
  );
}
