'use client';

import { useEffect, useMemo, useState } from 'react';
import useAPI from '@/interface_ws/apiClient';
import { format, startOfWeek, addDays } from 'date-fns';

interface Agendamento {
  id: number;
  data: string;
  hora: string;
  cliente: {
    nome: string;
  };
  duracao: number;
}

export default function DashboardSemanal() {
  const { httpGet } = useAPI();

  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const [modalAberto, setModalAberto] = useState(false);
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [diaSelecionado, setDiaSelecionado] = useState<Date | null>(null);
  const [horaSelecionada, setHoraSelecionada] = useState<string>('');

  const [nomeCliente, setNomeCliente] = useState('');
  const [duracao, setDuracao] = useState(30);
  const [idAgendamento, setIdAgendamento] = useState<number | null>(null);
  const [view, setView] = useState<'day' | 'week'>('week');
  const [selectedDate, setSelectedDate] = useState(new Date());

  const horarios = useMemo(() => {
    const hs = [];
    for (let h = 8; h <= 21; h++) {
      hs.push(`${String(h).padStart(2, '0')}:00`);
      hs.push(`${String(h).padStart(2, '0')}:30`);
    }
    return hs;
  }, []);

  const diasDaSemana = useMemo(() => {
    const inicioDaSemana = startOfWeek(selectedDate, { weekStartsOn: 0 });
    return Array.from({ length: 7 }, (_, i) => addDays(inicioDaSemana, i));
  }, [selectedDate]);

  // useEffect(() => {
  //   async function carregarAgendamentos() {
  //     try {
  //       const res = await fetch('/api/agendamento');
  //       const dados = await res.json();
  //       console.log(dados);
  //     } catch (e) {
  //       console.error('Erro no fetch direto:', e);
  //     }
  //   }

  //   carregarAgendamentos();
  // }, []);

  useEffect(() => {
    async function carregarAgendamentos() {
      setCarregando(true);
      setErro(null);

      try {
        const dados = await fetch('/api/agendamento');
        console.log('Dados recebidos:', dados);

        if (Array.isArray(dados)) {
          setAgendamentos(dados);
        } else {
          console.error('Dados recebidos não são um array:', dados);
          setAgendamentos([]);
        }
      } catch (err) {
        console.error('Erro ao carregar agendamentos:', err);
        setErro('Erro ao carregar agendamentos.');
      } finally {
        setCarregando(false);
      }
    }

    carregarAgendamentos();
  }, []);

  function obterAgendamento(dia: Date, hora: string) {
    const data = dia.toISOString().slice(0, 10);

    if (!Array.isArray(agendamentos)) {
      console.error('Agendamentos não é um array:', agendamentos);
      return null;
    }

    return agendamentos.find((ag) => ag.data === data && ag.hora === hora);
  }

  function abrirModal(dia: Date, hora: string) {
    const ag = obterAgendamento(dia, hora);
    setDiaSelecionado(dia);
    setHoraSelecionada(hora);
    setNomeCliente(ag?.cliente?.nome ?? '');
    setDuracao(ag?.duracao ?? 30);
    setIdAgendamento(ag?.id ?? null);
    setModalAberto(true);
  }

  return (
    <div className="overflow-auto max-w-full p-4">
      <h1 className="text-2xl font-bold mb-4">Agenda Semanal</h1>

      <div className="flex justify-between items-center mb-4">
        <input
          type="date"
          value={format(selectedDate, 'yyyy-MM-dd')}
          onChange={(e) => setSelectedDate(new Date(e.target.value))}
          className="p-2 border border-gray-300 rounded-lg"
          aria-label="Selecionar data"
        />
        <button
          onClick={() => setView(view === 'day' ? 'week' : 'day')}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          aria-label="Alternar visualização"
        >
          {view === 'day' ? 'Ver Semana' : 'Ver Dia'}
        </button>
      </div>

      {carregando ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-500"></div>
        </div>
      ) : erro ? (
        <p className="text-red-600 text-center">{erro}</p>
      ) : (
        <table className="table-auto border-collapse w-full">
          <thead>
            <tr>
              <th className="border px-2 py-1 text-left">Horário</th>
              {view === 'week' &&
                diasDaSemana.map((dia, i) => (
                  <th
                    key={i}
                    className="border px-2 py-1 text-center capitalize"
                  >
                    <button
                      onClick={() => setSelectedDate(dia)}
                      className={`p-2 rounded-lg bg-gray-100 hover:bg-gray-200 ${
                        format(dia, 'yyyy-MM-dd') ===
                        format(selectedDate, 'yyyy-MM-dd')
                          ? 'bg-blue-500 text-white'
                          : ''
                      }`}
                    >
                      {format(dia, 'dd/MM')}
                    </button>
                  </th>
                ))}
            </tr>
          </thead>
          <tbody>
            {horarios.map((hora, i) => (
              <tr key={i}>
                <td className="border px-2 py-1 text-sm font-medium">{hora}</td>
                {view === 'week' &&
                  diasDaSemana.map((dia, j) => {
                    const agendamento = obterAgendamento(dia, hora);
                    return (
                      <td
                        key={j}
                        className={`border h-10 text-sm text-center cursor-pointer transition duration-200 ${
                          agendamento
                            ? 'bg-green-200 hover:bg-green-300'
                            : 'hover:bg-gray-100'
                        }`}
                        onClick={() => abrirModal(dia, hora)}
                      >
                        {agendamento?.cliente?.nome || ''}
                      </td>
                    );
                  })}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
