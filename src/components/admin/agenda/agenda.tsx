'use client';

import React, { useState, useMemo } from 'react';
import { FaPlus } from 'react-icons/fa';
import ModalAgenda from '@/components/admin/agenda/modalAgenda';
import { AgendaSlot, AgendaLinha, AgendamentoFormData } from '@/utils/types';
import useAgenda from '@/hooks/agenda/useAgenda';

const initialFormState: AgendamentoFormData = {
  cliente: '',
  profissional: '',
  servico: '',
  data: '',
  hora: '',
};

const calculateRowSpan = (
  agenda: AgendaLinha[],
  rowIndex: number,
  dia: string,
  agendamentoId: number | undefined
): number => {
  if (!agendamentoId) return 1;
  let span = 1;
  for (let i = rowIndex + 1; i < agenda.length; i++) {
    const nextSlot = agenda[i][dia] as AgendaSlot;
    if (nextSlot?.agendamento_id === agendamentoId) {
      span++;
    } else {
      break;
    }
  }
  return span;
};

function getStatusCellClass(status?: string) {
  switch (status) {
    case 'CONCLUIDO':
      return 'bg-green-100 border-green-500 hover:bg-green-200';
    case 'CANCELADO':
      return 'bg-gray-200 border-gray-400 hover:bg-gray-300 text-gray-400';
    default:
      return 'bg-[#fadadd] border-[var(--primary)] hover:bg-red-200';
  }
}

const Agenda = () => {
  const {
    profissionais,
    isLoadingProfissionais,
    clientes,
    isLoadingClientes,
    isLoadingServicos,
    agenda,
    isLoadingAgenda,
    errorAgenda,
    profissionalSelecionado,
    setProfissionalSelecionado,
    dataInicial,
    setDataInicial,
    dataFinal,
    setDataFinal,
    addAgendamento,
    updateAgendamento,
    deleteAgendamento,
    servicosDisponiveisParaProfissional,
  } = useAgenda();

  const [loadingModal, setLoadingModal] = useState(false);
  const [visao, setVisao] = useState<'dia' | 'semana'>('semana');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [modalFormData, setModalFormData] =
    useState<AgendamentoFormData>(initialFormState);
  const [modalError, setModalError] = useState<string | null>(null);
  const { deleteRecorrencia } = useAgenda();

  const handleProfissionalChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setProfissionalSelecionado(e.target.value || null);
  };

  const handleDateChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'inicial' | 'final'
  ) => {
    const newDate = e.target.value;
    if (type === 'inicial') {
      setDataInicial(newDate);
      if (visao === 'dia') {
        setDataFinal(newDate);
      }
      if (visao === 'semana' && newDate > dataFinal) {
        setDataFinal(newDate);
      }
    } else {
      if (newDate >= dataInicial) {
        setDataFinal(newDate);
      }
    }
  };

  const alternarVisao = () => {
    if (visao === 'semana') {
      setVisao('dia');
      setDataFinal(dataInicial);
    } else {
      setVisao('semana');
      const start = new Date(dataInicial + 'T00:00:00');
      if (!isNaN(start.getTime())) {
        const end = new Date(start.setDate(start.getDate() + 6));
        setDataFinal(end.toISOString().split('T')[0]);
      } else {
        const today = new Date();
        const nextWeek = new Date(new Date().setDate(today.getDate() + 6));
        setDataInicial(today.toISOString().split('T')[0]);
        setDataFinal(nextWeek.toISOString().split('T')[0]);
      }
    }
  };

  const handleModalChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setModalFormData((prev) => ({ ...prev, [name]: value }));
  };

  const openModal = (
    mode: 'add' | 'edit',
    data?: string,
    hora?: string,
    agendamento?: AgendaSlot
  ) => {
    setModalError(null);
    setModalMode(mode);

    if (mode === 'add') {
      setModalFormData({
        id: undefined,
        cliente: '',
        profissional: profissionalSelecionado || '',
        servico: '',
        data: data || dataInicial,
        hora: hora || '',
      });
    } else if (mode === 'edit' && agendamento && data && hora) {
      setModalFormData({
        id: agendamento.agendamento_id,
        cliente: String(agendamento.cliente_id || ''),
        profissional: profissionalSelecionado || '',
        servico: String(agendamento.servico_id || ''),
        data: data,
        hora: hora.substring(0, 5),
        status: agendamento.status || 'AGENDADO',
        recorrencia_id: agendamento.recorrencia_id,
      });
    } else {
      setModalFormData({
        ...initialFormState,
        profissional: profissionalSelecionado || '',
        data: dataInicial,
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalFormData(initialFormState);
    setModalError(null);
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoadingModal(true);
    setModalError(null);

    const { id, ...formData } = modalFormData;
    const clienteId = parseInt(formData.cliente, 10);
    const profissionalId = parseInt(formData.profissional, 10);
    const servicoId = parseInt(formData.servico, 10);

    if (
      isNaN(clienteId) ||
      isNaN(profissionalId) ||
      isNaN(servicoId) ||
      !formData.data ||
      !formData.hora
    ) {
      setModalError('Todos os campos são obrigatórios e devem ser válidos.');
      setLoadingModal(false);
      return;
    }

    const payload: any = {
      cliente: clienteId,
      profissional: profissionalId,
      servico: servicoId,
      data: formData.data,
      hora: formData.hora,
    };
    if (formData.status) {
      payload.status = formData.status;
    }

    if ('duracao_personalizada' in formData && formData.duracao_personalizada) {
      payload.duracao_personalizada = Number(formData.duracao_personalizada);
    }
    // ...existing code...
    if (formData.recorrencia)
      payload.recorrencia = Number(formData.recorrencia);
    if (formData.repeticoes) payload.repeticoes = Number(formData.repeticoes);
    // ...existing code...

    let success = false;
    try {
      if (modalMode === 'add') {
        success = await addAgendamento({
          ...payload,
          cliente: String(payload.cliente),
          profissional: String(payload.profissional),
          servico: String(payload.servico),
        });
      } else if (id) {
        success = await updateAgendamento(id, {
          ...payload,
          cliente: String(payload.cliente),
          profissional: String(payload.profissional),
          servico: String(payload.servico),
        });
      }

      if (success) {
        closeModal();
      } else {
        setModalError('Ocorreu um erro ao salvar o agendamento.');
      }
    } catch (error: any) {
      console.error(
        `Erro ao ${modalMode === 'add' ? 'criar' : 'editar'} agendamento:`,
        error
      );
      setModalError(error.message || 'Ocorreu um erro.');
    } finally {
      setLoadingModal(false);
    }
  };

  const handleDeleteAgendamento = async () => {
    if (
      !modalFormData.id ||
      !window.confirm('Tem certeza que deseja excluir este agendamento?')
    ) {
      return;
    }
    setLoadingModal(true);
    setModalError(null);
    try {
      const success = await deleteAgendamento(modalFormData.id);
      if (success) {
        closeModal();
        // fetchAgendaData(); // O hook já deve re-fetch
      } else {
        setModalError('Ocorreu um erro ao excluir o agendamento.');
      }
    } catch (error: any) {
      console.error('Erro ao excluir agendamento:', error);
      setModalError(error.message || 'Ocorreu um erro ao excluir.');
    } finally {
      setLoadingModal(false);
    }
  };

  const handleDeleteRecorrencia = async () => {
    if (!modalFormData.recorrencia_id) return;
    setLoadingModal(true);
    setModalError(null);
    const ok = await deleteRecorrencia(modalFormData.recorrencia_id);
    setLoadingModal(false);
    if (ok) {
      setIsModalOpen(false);
    } else {
      setModalError('Falha ao excluir recorrência.');
    }
  };

  const dateKeys = useMemo(() => {
    if (agenda.length === 0) return [];
    return Object.keys(agenda[0]).filter((key) => key !== 'horario');
  }, [agenda]);

  const isLoading =
    isLoadingProfissionais ||
    isLoadingClientes ||
    isLoadingServicos ||
    isLoadingAgenda;

  return (
    <div className="w-screen text-[#757575] mx-auto p-5 md:px-0">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-[var(--accent)]">Agenda</h1>
          <button
            onClick={() => openModal('add')}
            className="bg-[var(--accent)] text-white p-2 rounded-full disabled:opacity-50"
            title="Novo Agendamento"
            disabled={!profissionalSelecionado || isLoading}
          >
            <FaPlus />
          </button>
        </div>

        {/* Controles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 items-end">
          <div>
            <label
              htmlFor="profissional"
              className="block text-sm font-medium mb-1"
            >
              Profissional:
            </label>
            <select
              id="profissional"
              value={profissionalSelecionado || ''}
              onChange={handleProfissionalChange}
              className="w-full p-2 border border-[#E0E0E0] bg-[var(--primary)] rounded-md text-[var(--text-primary)]"
              disabled={isLoadingProfissionais}
            >
              <option value="" disabled={profissionais.length > 0}>
                -- Selecione --
              </option>
              {profissionais.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nome_completo}
                </option>
              ))}
            </select>
          </div>

          <div
            className={`flex gap-4 ${
              visao === 'dia' ? 'col-span-1' : 'col-span-1 md:col-span-1'
            }`}
          >
            <div>
              <label
                htmlFor="dataInicial"
                className="block text-sm font-medium mb-1"
              >
                Data {visao === 'semana' ? 'Inicial' : ''}:
              </label>
              <input
                type="date"
                id="dataInicial"
                value={dataInicial}
                onChange={(e) => handleDateChange(e, 'inicial')}
                className="p-2 border text-[#212121] bg-[#FFFFFF] border-[#E0E0E0] rounded-md w-full"
                disabled={isLoading}
              />
            </div>
            {visao === 'semana' && (
              <div>
                <label
                  htmlFor="dataFinal"
                  className="block text-sm font-medium mb-1"
                >
                  Data Final:
                </label>
                <input
                  type="date"
                  id="dataFinal"
                  value={dataFinal}
                  min={dataInicial}
                  onChange={(e) => handleDateChange(e, 'final')}
                  className="p-2 border text-[#212121] bg-[#FFFFFF] border-[#E0E0E0] rounded-md w-full"
                  disabled={isLoading}
                />
              </div>
            )}
          </div>

          <div className="flex justify-end">
            <button
              onClick={alternarVisao}
              className="text-[var(--text-primary)] bg-[var(--primary)] px-4 py-2 rounded-md hover:bg-gray-600 h-10"
              disabled={isLoading}
            >
              Ver {visao === 'semana' ? 'Dia' : 'Semana'}
            </button>
          </div>
        </div>

        {/* Tabela de Agenda */}
        {isLoadingAgenda && (
          <p className="text-center mt-4">Carregando agenda...</p>
        )}
        {errorAgenda && (
          <p className="text-center mt-4 text-red-500">
            Erro ao carregar agenda: {errorAgenda}
          </p>
        )}

        {!isLoadingAgenda && !errorAgenda && !profissionalSelecionado && (
          <p className="text-center mt-4 text-gray-500">
            Selecione um profissional para ver a agenda.
          </p>
        )}
        {!isLoadingAgenda &&
          !errorAgenda &&
          profissionalSelecionado &&
          agenda.length === 0 && (
            <p className="text-center mt-4 text-gray-500">
              Nenhum horário encontrado para o profissional e período
              selecionados.
            </p>
          )}

        {!isLoadingAgenda &&
          !errorAgenda &&
          profissionalSelecionado &&
          agenda.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300 mt-4 mb-40 text-sm">
                <thead>
                  <tr className="bg-[var(--primary)] text-[var(--text-primary)]">
                    <th className="border border-gray-300 p-2 font-semibold sticky left-0 bg-[var(--primary)] z-10">
                      Horário
                    </th>
                    {dateKeys.map((dia) => (
                      <th
                        key={dia}
                        className="border border-gray-300 p-2 font-semibold min-w-[100px]"
                      >
                        {new Date(dia + 'T00:00:00').toLocaleDateString(
                          'pt-BR',
                          {
                            weekday: 'short',
                            day: '2-digit',
                            month: '2-digit',
                          }
                        )}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {agenda.map((linha, rowIndex) => (
                    <tr
                      key={linha.horario}
                      className="hover:bg-gray-50 bg-white"
                    >
                      <td className="border border-gray-300 p-2 font-medium sticky left-0 bg-white z-10">
                        {linha.horario}
                      </td>
                      {dateKeys.map((dia) => {
                        const slot = linha[dia] as AgendaSlot;
                        const horario = linha.horario;
                        const agendamentoId = slot?.agendamento_id;

                        if (rowIndex > 0 && agendamentoId) {
                          const prevSlot = agenda[rowIndex - 1][
                            dia
                          ] as AgendaSlot;
                          if (prevSlot?.agendamento_id === agendamentoId) {
                            return null;
                          }
                        }

                        const rowSpan =
                          slot?.ocupado === true
                            ? calculateRowSpan(
                                agenda,
                                rowIndex,
                                dia,
                                agendamentoId
                              )
                            : 1;

                        let cellContent;
                        let cellClassName =
                          'border border-gray-300 p-0 text-center h-12 align-top';

                        if (slot?.ocupado === null) {
                          cellContent = (
                            <button
                              onClick={() => openModal('add', dia, horario)}
                              className="w-full h-full text-gray-400 italic text-xs p-1 hover:bg-gray-100 rounded"
                              title={`Agendar ${dia} ${horario} (fora do expediente)`}
                              type="button"
                            >
                              Fora
                            </button>
                          );
                        } else if (slot?.ocupado === true) {
                          cellContent = (
                            <button
                              onClick={() =>
                                openModal('edit', dia, horario, slot)
                              }
                              className={`w-full h-full text-left p-1 border-2 rounded text-xs flex flex-col gap-1 justify-center ${getStatusCellClass(
                                slot.status
                              )}`}
                              title={`Editar Agendamento: ${
                                slot.nome_cliente
                              } (${slot.servico_nome || 'Serviço'})`}
                              style={{ height: `${rowSpan * 3}rem` }}
                            >
                              <span className="font-medium text-zinc-900 truncate">
                                {slot.nome_cliente}
                              </span>
                              <span className="truncate">
                                ({slot.servico_nome || 'Serviço'})
                              </span>
                            </button>
                          );
                        } else {
                          cellContent = (
                            <button
                              onClick={() => openModal('add', dia, horario)}
                              className="w-full h-full text-black bg-transparent font-bold hover:bg-[var(--primary)] rounded flex items-center justify-center text-xs px-5"
                              title={`Agendar ${dia} ${horario}`}
                            ></button>
                          );
                          cellClassName =
                            'border border-gray-300 p-0 text-center h-12';
                        }

                        return (
                          <td
                            key={`${dia}-${linha.horario}`}
                            className={cellClassName}
                            rowSpan={rowSpan > 1 ? rowSpan : undefined}
                          >
                            {cellContent}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        <ModalAgenda
          isOpen={isModalOpen}
          mode={modalMode}
          formData={modalFormData}
          clientes={clientes} // Vem do hook
          profissionais={profissionais} // Vem do hook
          servicosDisponiveis={servicosDisponiveisParaProfissional} // Vem do hook
          error={modalError}
          loading={loadingModal}
          onClose={closeModal}
          onChange={handleModalChange}
          onSubmit={handleFormSubmit}
          onDelete={handleDeleteAgendamento}
          onDeleteRecorrencia={handleDeleteRecorrencia}
        />
      </div>
    </div>
  );
};

export default Agenda;
