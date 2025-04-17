// src/components/TabelaAgendamentosCompleta.tsx
'use client';
import React, { useState } from 'react';
import { format, addMinutes, startOfWeek, addDays, isSameDay } from 'date-fns';

type Agendamento = {
  id: number;
  horario: string;
  data: string;
  cliente: string;
  servico: string;
};

export default function TabelaAgendamentosCompleta() {
  const [modo, setModo] = useState<'diario' | 'semanal'>('diario');
  const [dataSelecionada, setDataSelecionada] = useState(new Date());
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [agendamentoSelecionado, setAgendamentoSelecionado] =
    useState<Agendamento | null>(null);
  const [horarioSelecionado, setHorarioSelecionado] = useState<string>('');

  const horarios = gerarHorarios('08:00', '18:00', 30);

  const diasDaSemana = Array.from({ length: 7 }, (_, i) =>
    addDays(startOfWeek(dataSelecionada, { weekStartsOn: 1 }), i)
  );

  function gerarHorarios(
    inicio: string,
    fim: string,
    intervalo: number
  ): string[] {
    const [h, m] = inicio.split(':').map(Number);
    const [hFim, mFim] = fim.split(':').map(Number);
    const inicioDate = new Date(0, 0, 0, h, m);
    const fimDate = new Date(0, 0, 0, hFim, mFim);
    const resultado: string[] = [];
    let atual = inicioDate;
    while (atual <= fimDate) {
      resultado.push(format(atual, 'HH:mm'));
      atual = addMinutes(atual, intervalo);
    }
    return resultado;
  }

  function abrirModal(data: Date, horario: string) {
    const existente = agendamentos.find(
      (a) => a.horario === horario && a.data === format(data, 'yyyy-MM-dd')
    );
    setHorarioSelecionado(horario);
    setAgendamentoSelecionado(existente || null);
    setModalAberto(true);
  }

  function salvarAgendamento(novo: Omit<Agendamento, 'id'>) {
    setAgendamentos((prev) => {
      const existente = prev.find(
        (a) => a.horario === novo.horario && a.data === novo.data
      );
      if (existente) {
        return prev.map((a) =>
          a.id === existente.id ? { ...existente, ...novo } : a
        );
      } else {
        return [...prev, { ...novo, id: Date.now() }];
      }
    });
    setModalAberto(false);
  }

  function excluirAgendamento(id: number) {
    setAgendamentos((prev) => prev.filter((a) => a.id !== id));
    setModalAberto(false);
  }

  const renderDias = modo === 'diario' ? [dataSelecionada] : diasDaSemana;

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Agenda</h2>
        <div className="flex gap-2 items-center">
          <input
            type="date"
            value={format(dataSelecionada, 'yyyy-MM-dd')}
            onChange={(e) => setDataSelecionada(new Date(e.target.value))}
            className="border rounded px-2 py-1"
          />
          <select
            value={modo}
            onChange={(e) => setModo(e.target.value as 'diario' | 'semanal')}
            className="border rounded px-2 py-1"
          >
            <option value="diario">Diário</option>
            <option value="semanal">Semanal</option>
          </select>
        </div>
      </div>

      <div className="overflow-auto border rounded">
        <table className="bg-[var(--primary)] text-[var(--secondary)] min-w-full border-collapse table-fixed">
          <thead>
            <tr>
              <th className="border p-2 w-24 ">Horário</th>
              {renderDias.map((dia, i) => (
                <th key={i} className="border p-2 bg-[var(--primary)]">
                  {format(dia, 'dd/MM (EEE)')}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {horarios.map((horario, idx) => (
              <tr key={idx}>
                <td className="border p-2 text-center font-medium bg-[var(--primary)]">
                  {horario}
                </td>
                {renderDias.map((dia, i) => {
                  const agendamento = agendamentos.find(
                    (a) =>
                      a.horario === horario &&
                      a.data === format(dia, 'yyyy-MM-dd')
                  );
                  return (
                    <td
                      key={i}
                      className={`border p-2 text-sm cursor-pointer hover:bg-blue-100 ${
                        agendamento ? 'bg-blue-200' : ''
                      }`}
                      onClick={() => abrirModal(dia, horario)}
                    >
                      {agendamento ? (
                        <>
                          <div className="font-semibold">
                            {agendamento.cliente}
                          </div>
                          <div className="text-xs">{agendamento.servico}</div>
                        </>
                      ) : (
                        <span className="text-gray-400">Disponível</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modalAberto && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">
              {agendamentoSelecionado
                ? 'Editar Agendamento'
                : 'Novo Agendamento'}
            </h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const cliente = (form.cliente as HTMLInputElement).value;
                const servico = (form.servico as HTMLInputElement).value;
                salvarAgendamento({
                  cliente,
                  servico,
                  data: format(dataSelecionada, 'yyyy-MM-dd'),
                  horario: horarioSelecionado,
                });
              }}
            >
              <div className="mb-2">
                <label className="block text-sm mb-1">Cliente</label>
                <input
                  name="cliente"
                  defaultValue={agendamentoSelecionado?.cliente || ''}
                  className="w-full border rounded px-2 py-1"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm mb-1">Serviço</label>
                <input
                  name="servico"
                  defaultValue={agendamentoSelecionado?.servico || ''}
                  className="w-full border rounded px-2 py-1"
                  required
                />
              </div>
              <div className="flex justify-between">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Salvar
                </button>
                {agendamentoSelecionado && (
                  <button
                    type="button"
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    onClick={() =>
                      excluirAgendamento(agendamentoSelecionado.id)
                    }
                  >
                    Excluir
                  </button>
                )}
                <button
                  type="button"
                  className="px-4 py-2 border rounded"
                  onClick={() => setModalAberto(false)}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
