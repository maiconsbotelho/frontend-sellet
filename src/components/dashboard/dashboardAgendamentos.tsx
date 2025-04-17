// pages/Agenda.tsx
'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';

type Agendamento = {
  id: number;
  cliente: string;
  profissional: string;
  servico: string;
  data: string;
  hora: string;
  duracao: number;
};

type ModoVisualizacao = 'diario' | 'semanal';

const gerarHorarios = () => {
  const horarios: string[] = [];
  let hora = 8 * 60;
  while (hora <= 18 * 60) {
    const h = String(Math.floor(hora / 60)).padStart(2, '0');
    const m = String(hora % 60).padStart(2, '0');
    horarios.push(`${h}:${m}`);
    hora += 30;
  }
  return horarios;
};

function formatarData(d: Date): string {
  const ano = d.getFullYear();
  const mes = String(d.getMonth() + 1).padStart(2, '0');
  const dia = String(d.getDate()).padStart(2, '0');
  return `${ano}-${mes}-${dia}`;
}

function parseDataHora(data: string, hora: string): Date {
  const [ano, mes, dia] = data.split('-').map(Number);
  const [h, m] = hora.split(':').map(Number);
  return new Date(ano, mes - 1, dia, h, m);
}

function adicionarMinutos(date: Date, minutos: number): Date {
  return new Date(date.getTime() + minutos * 60000);
}

function estaNoIntervalo(alvo: Date, inicio: Date, fim: Date): boolean {
  return alvo >= inicio && alvo <= fim;
}

function diaSemanaPorExtenso(data: Date): string {
  return data.toLocaleDateString('pt-BR', { weekday: 'long' });
}

function gerarSemana(dataBase: Date): Date[] {
  const dias: Date[] = [];
  const diaSemana = dataBase.getDay(); // 0 = domingo, 1 = segunda...
  const diferencaParaSegunda = (diaSemana + 6) % 7;
  const segunda = new Date(dataBase);
  segunda.setDate(dataBase.getDate() - diferencaParaSegunda);
  for (let i = 0; i < 7; i++) {
    const dia = new Date(segunda);
    dia.setDate(segunda.getDate() + i);
    dias.push(dia);
  }
  return dias;
}

export default function Agenda() {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [dataSelecionada, setDataSelecionada] = useState(new Date());
  const [modo, setModo] = useState<ModoVisualizacao>('diario');
  const [modalAberto, setModalAberto] = useState(false);
  const [agendamentoSelecionado, setAgendamentoSelecionado] =
    useState<Agendamento | null>(null);
  const horarios = gerarHorarios();

  useEffect(() => {
    axios
      .get('https://api-mock.maiconbotelho.com.br/api/agendamento')
      .then((res) => setAgendamentos(res.data as Agendamento[]))
      .catch((err) => console.error('Erro ao buscar agendamentos', err));
  }, []);

  const diasSemana = gerarSemana(dataSelecionada);

  const abrirModal = (dia: Date, hora: string) => {
    const agendamento = agendamentos.find((a) => {
      const inicio = parseDataHora(a.data, a.hora);
      const fim = adicionarMinutos(inicio, a.duracao);
      const horarioSelecionado = parseDataHora(formatarData(dia), hora);
      return estaNoIntervalo(horarioSelecionado, inicio, fim);
    });
    setAgendamentoSelecionado(
      agendamento ?? {
        id: 0,
        cliente: '',
        profissional: '',
        servico: '',
        data: formatarData(dia),
        hora,
        duracao: 30,
      }
    );
    setModalAberto(true);
  };

  const renderCelula = (dia: Date, hora: string) => {
    const agendamento = agendamentos.find((a) => {
      const inicio = parseDataHora(a.data, a.hora);
      const fim = adicionarMinutos(inicio, a.duracao);
      const horario = parseDataHora(formatarData(dia), hora);
      return estaNoIntervalo(horario, inicio, fim);
    });

    return (
      <td
        key={hora}
        className={`border p-2 text-sm cursor-pointer hover:bg-purple-100 ${
          agendamento ? 'bg-purple-200' : ''
        }`}
        onClick={() => abrirModal(dia, hora)}
      >
        {agendamento ? `${agendamento.cliente} (${agendamento.servico})` : ''}
      </td>
    );
  };

  const diasParaMostrar = modo === 'diario' ? [dataSelecionada] : diasSemana;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <input
          type="date"
          value={formatarData(dataSelecionada)}
          onChange={(e) => setDataSelecionada(new Date(e.target.value))}
          className="border rounded p-2"
        />
        <select
          value={modo}
          onChange={(e) => setModo(e.target.value as ModoVisualizacao)}
          className="border p-2 rounded"
        >
          <option value="diario">Visualização Diária</option>
          <option value="semanal">Visualização Semanal</option>
        </select>
      </div>

      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="border p-2">Horário</th>
            {diasParaMostrar.map((dia) => (
              <th key={dia.toDateString()} className="border p-2 capitalize">
                {diaSemanaPorExtenso(dia)} {('0' + dia.getDate()).slice(-2)}/
                {('0' + (dia.getMonth() + 1)).slice(-2)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {horarios.map((hora) => (
            <tr key={hora}>
              <td className="border p-2 text-center font-semibold">{hora}</td>
              {diasParaMostrar.map((dia) => renderCelula(dia, hora))}
            </tr>
          ))}
        </tbody>
      </table>

      {modalAberto && agendamentoSelecionado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">
              {agendamentoSelecionado.id
                ? 'Editar Agendamento'
                : 'Novo Agendamento'}
            </h2>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex flex-col gap-2"
            >
              <input
                className="border p-2 rounded"
                placeholder="Cliente"
                value={agendamentoSelecionado.cliente}
                readOnly
              />
              <input
                className="border p-2 rounded"
                placeholder="Profissional"
                value={agendamentoSelecionado.profissional}
                readOnly
              />
              <input
                className="border p-2 rounded"
                placeholder="Serviço"
                value={agendamentoSelecionado.servico}
                readOnly
              />
              <div className="flex justify-end gap-2 mt-4">
                <button
                  className="px-4 py-2 bg-gray-300 rounded"
                  onClick={() => setModalAberto(false)}
                >
                  Fechar
                </button>
                {agendamentoSelecionado.id !== 0 && (
                  <button className="px-4 py-2 bg-red-500 text-white rounded">
                    Excluir
                  </button>
                )}
                {agendamentoSelecionado.id === 0 && (
                  <button className="px-4 py-2 bg-green-500 text-white rounded">
                    Criar
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
