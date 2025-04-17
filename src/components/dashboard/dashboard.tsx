'use client';

import { useState, useEffect, useMemo } from 'react';
import { format, addMinutes, startOfWeek } from 'date-fns';

// Tipagem dos agendamentos
type Agendamento = {
  id: number;
  cliente: string;
  profissional: string;
  servico: string;
  data: string;
  hora: string;
  duracao: number;
};

// Função para obter os dias da semana
const getWeekDays = (date: Date): Date[] => {
  const start = startOfWeek(date, { weekStartsOn: 0 });
  return Array.from(
    { length: 7 },
    (_, i) => new Date(start.getTime() + i * 86400000)
  );
};

// Botão para alternar visualização
const ToggleViewButton = ({
  view,
  setView,
}: {
  view: 'day' | 'week';
  setView: React.Dispatch<React.SetStateAction<'day' | 'week'>>;
}) => (
  <button
    onClick={() => setView(view === 'day' ? 'week' : 'day')}
    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
    aria-label="Alternar visualização"
  >
    {view === 'day' ? 'Ver Semana' : 'Ver Dia'}
  </button>
);

// Lista de agendamentos
const AgendamentoList = ({ agendamentos }: { agendamentos: Agendamento[] }) => (
  <ul>
    {agendamentos.length > 0 ? (
      agendamentos.map((a) => {
        const horaInicio = new Date(`${a.data}T${a.hora}`);
        const horaFim = addMinutes(horaInicio, a.duracao);

        return (
          <li key={a.id} className="p-3 border-b">
            <p className="font-semibold">{a.cliente}</p>
            <p>
              Profissional:{' '}
              <span className="font-medium">{a.profissional}</span>
            </p>
            <p>Serviço: {a.servico}</p>
            <p>
              Horário: {format(horaInicio, 'HH:mm')} -{' '}
              {format(horaFim, 'HH:mm')} ({a.duracao} min)
            </p>
          </li>
        );
      })
    ) : (
      <p className="text-black">Nenhum agendamento encontrado.</p>
    )}
  </ul>
);

export default function Dashboard() {
  const [view, setView] = useState<'day' | 'week'>('week');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);

  useEffect(() => {
    const fetchAgendamentos = async () => {
      try {
        const response = await fetch('/api/agendamento');
        const data: Agendamento[] = await response.json();
        setAgendamentos(data);
      } catch (error) {
        console.error('Erro ao buscar agendamentos:', error);
      }
    };

    fetchAgendamentos();
  }, []);

  const weekDays = useMemo(() => getWeekDays(selectedDate), [selectedDate]);

  const filteredAgendamentos = useMemo(() => {
    const normalizeDate = (dateStr: string) => {
      const date = new Date(dateStr);
      date.setHours(0, 0, 0, 0);
      return date.getTime();
    };

    const weekTimestamps = weekDays.map((day) => {
      const d = new Date(day);
      d.setHours(0, 0, 0, 0);
      return d.getTime();
    });

    const selectedTimestamp = (() => {
      const d = new Date(selectedDate);
      d.setHours(0, 0, 0, 0);
      return d.getTime();
    })();

    return view === 'week'
      ? agendamentos.filter((a) => {
          const agendamentoTimestamp = normalizeDate(a.data);
          return weekTimestamps.includes(agendamentoTimestamp);
        })
      : agendamentos.filter((a) => {
          const agendamentoTimestamp = normalizeDate(a.data);
          return agendamentoTimestamp === selectedTimestamp;
        });
  }, [agendamentos, view, selectedDate, weekDays]);

  return (
    <div className="p-6 max-w-2xl mx-auto text-black bg-white shadow-lg rounded-lg">
      {/* Seção de Agendamentos */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <input
            type="date"
            value={format(selectedDate, 'yyyy-MM-dd')}
            onChange={(e) => setSelectedDate(new Date(e.target.value))}
            className="p-2 border border-gray-300 rounded-lg"
            aria-label="Selecionar data"
          />
          <ToggleViewButton view={view} setView={setView} />
        </div>

        {view === 'week' && (
          <div className="grid grid-cols-7 gap-2 text-center text-sm mb-4">
            {weekDays.map((day) => (
              <button
                key={day.toISOString()}
                onClick={() => setSelectedDate(day)}
                className={`p-2 border rounded-lg bg-gray-100 hover:bg-gray-200 ${
                  format(day, 'yyyy-MM-dd') ===
                  format(selectedDate, 'yyyy-MM-dd')
                    ? 'bg-blue-500 text-white'
                    : ''
                }`}
              >
                {format(day, 'dd/MM')}
              </button>
            ))}
          </div>
        )}

        <AgendamentoList agendamentos={filteredAgendamentos} />
      </div>
    </div>
  );
}
