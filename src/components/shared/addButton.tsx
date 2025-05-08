import { FaPlus } from 'react-icons/fa';

export default function AddButton({
  onClick,
  disabled,
}: {
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      className="bg-[var(--accent)] text-white px-4 py-2 rounded flex items-center hover:bg-pink-700 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
      onClick={onClick}
      disabled={disabled}
      aria-label="Adicionar"
    >
      <FaPlus className="mr-2" /> ADD
    </button>
  );
}
