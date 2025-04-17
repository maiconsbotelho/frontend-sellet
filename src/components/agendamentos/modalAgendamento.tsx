import React, { useState } from 'react';

interface Agendamento {
  id: number;
  cliente: string;
  profissional: string;
  servico: string;
  data: string;
  hora: string;
  duracao: number;
}

interface FormularioAgendamentoModalProps {
  agendamento?: Agendamento | null;
  data: string;
  hora: string;
  onClose: () => void;
}

export default function FormularioAgendamentoModal({
  agendamento,
  data,
  hora,
  onClose,
}: FormularioAgendamentoModalProps) {
  const [cliente, setCliente] = useState(agendamento?.cliente || '');
  const [profissional, setProfissional] = useState(
    agendamento?.profissional || ''
  );
  const [servico, setServico] = useState(agendamento?.servico || '');
  const [duracao, setDuracao] = useState(agendamento?.duracao || 30);

  const isEditando = Boolean(agendamento);

  const handleSalvar = () => {
    const payload = {
      cliente,
      profissional,
      servico,
      data,
      hora,
      duracao: Number(duracao),
    };
    console.log(
      isEditando ? 'Editar agendamento:' : 'Novo agendamento:',
      payload
    );
    onClose();
  };

  const handleExcluir = () => {
    console.log('Excluir agendamento:', agendamento);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4">
          {isEditando ? 'Editar Agendamento' : 'Novo Agendamento'}
        </h2>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Cliente"
            value={cliente}
            onChange={(e) => setCliente(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
          <input
            type="text"
            placeholder="Profissional"
            value={profissional}
            onChange={(e) => setProfissional(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
          <input
            type="text"
            placeholder="Serviço"
            value={servico}
            onChange={(e) => setServico(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
          <input
            type="number"
            placeholder="Duração (min)"
            value={duracao}
            onChange={(e) => setDuracao(Number(e.target.value))}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div className="flex justify-end gap-2 mt-6">
          {isEditando && (
            <button
              onClick={handleExcluir}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Excluir
            </button>
          )}
          <button
            onClick={onClose}
            className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
          >
            Cancelar
          </button>
          <button
            onClick={handleSalvar}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}
