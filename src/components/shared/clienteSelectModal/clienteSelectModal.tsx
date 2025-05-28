import React, { useState, useMemo } from 'react';
import { Cliente } from '@/utils/types';
import { FiX } from 'react-icons/fi';

interface ClienteSelectModalProps {
  isOpen: boolean;
  clientes: Cliente[];
  onClose: () => void;
  onSelect: (clienteId: number) => void;
}

const ClienteSelectModal: React.FC<ClienteSelectModalProps> = ({
  isOpen,
  clientes,
  onClose,
  onSelect,
}) => {
  const [search, setSearch] = useState('');
  const filtrados = useMemo(
    () =>
      clientes.filter((c) =>
        c.nome_completo.toLowerCase().includes(search.toLowerCase())
      ),
    [clientes, search]
  );

  if (!isOpen) return null;

  return (
    <div className="fixed top-[80px] inset-0 pb-[80px] bg-white bg-opacity-50 flex items-start justify-center z-30">
      <div className="bg-white p-6 rounded  w-full max-w-lg text-black max-h-[calc(100vh-160px)] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-[var(--accent)]">
            Selecionar Cliente
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-black">
            <FiX size={24} />
          </button>
        </div>
        <input
          type="text"
          placeholder="Pesquisar cliente..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border px-3 py-2 rounded mb-4"
        />
        <ul>
          {filtrados.map((c, idx) => (
            <li
              key={c.id}
              className={`py-2 px-2 hover:bg-blue-100 cursor-pointer rounded-none ${
                idx < filtrados.length - 1 ? 'border-b border-gray-200' : ''
              }`}
              onClick={() => {
                onSelect(c.id);
                onClose();
              }}
            >
              {c.nome_completo}
            </li>
          ))}
          {filtrados.length === 0 && (
            <li className="text-gray-500 py-2">Nenhum cliente encontrado.</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default ClienteSelectModal;
