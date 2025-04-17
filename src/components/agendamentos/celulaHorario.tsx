// components/CelulaHorario.tsx
import React from 'react';

interface CelulaHorarioProps {
  horario: string;
  data: string;
  agendamento?: {
    id: number;
    cliente: string;
    profissional: string;
    servico: string;
    duracao: number;
  };
  onClick: () => void;
}

export default function CelulaHorario({
  horario,
  data,
  agendamento,
  onClick,
}: CelulaHorarioProps) {
  return (
    <td
      onClick={onClick}
      className={`border p-2 cursor-pointer hover:bg-zinc-100 transition-all text-sm ${
        agendamento ? 'bg-rose-100' : 'bg-white'
      }`}
      title={
        agendamento ? `${agendamento.cliente} - ${agendamento.servico}` : ''
      }
    >
      {agendamento ? (
        <div className="flex flex-col">
          <span className="font-semibold">{agendamento.cliente}</span>
          <span className="text-xs text-gray-600">{agendamento.servico}</span>
        </div>
      ) : (
        <span className="text-gray-400 italic">Disponível</span>
      )}
    </td>
  );
}
