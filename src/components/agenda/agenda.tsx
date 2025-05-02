'use client';

import React, { useEffect, useState, useMemo } from 'react'; // Added useMemo
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

// --- Type Definitions ---
type Profissional = {
  id: string;
  nome: string;
};

type Cliente = {
  id: number;
  nome_completo: string;
};

type Servico = {
  id: number;
  nome: string;
  profissionais?: number[]; // Array of professional IDs
};

type AgendaSlot = {
  ocupado: boolean | null; // true = occupied, false = available, null = outside expediente
  nome_cliente?: string;
  agendamento_id?: number;
  cliente_id?: number;
  servico_id?: number;
  servico_nome?: string;
};

type AgendaLinha = {
  horario: string;
  [data: string]: AgendaSlot | string; // horario is string, others are AgendaSlot
};

type AgendamentoFormData = {
  id?: number;
  cliente: string; // Store ID as string for form compatibility
  profissional: string; // Store ID as string
  servico: string; // Store ID as string
  data: string; // YYYY-MM-DD
  hora: string; // HH:MM
};

// --- Initial State ---
const initialFormState: AgendamentoFormData = {
  cliente: '',
  profissional: '',
  servico: '',
  data: '',
  hora: '',
};

// --- API Base URL ---
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// --- Helper Function to calculate Row Span ---
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

const Agenda = () => {
  // --- State Variables ---
  const [profissionais, setProfissionais] = useState<Profissional[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [profissionalSelecionado, setProfissionalSelecionado] = useState<
    string | null
  >(null);
  const [agenda, setAgenda] = useState<AgendaLinha[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingModal, setLoadingModal] = useState(false); // Loading state for modal actions
  const [dataInicial, setDataInicial] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0]; // Default to today
  });
  const [dataFinal, setDataFinal] = useState(() => {
    const today = new Date();
    const nextWeek = new Date(today.setDate(today.getDate() + 6));
    return nextWeek.toISOString().split('T')[0]; // Default to end of week
  });
  const [visao, setVisao] = useState<'dia' | 'semana'>('semana');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add'); // 'add' or 'edit'
  const [modalFormData, setModalFormData] =
    useState<AgendamentoFormData>(initialFormState);
  const [modalError, setModalError] = useState<string | null>(null);

  // --- Data Fetching Effects ---

  // Fetch Profissionais
  useEffect(() => {
    const fetchProfissionais = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/usuario/?tipo=PROFISSIONAL`
        );
        if (!response.ok) throw new Error('Network response was not ok');

        const data = await response.json();

        // Tipando diretamente como Profissional[]
        const profissionaisFormatados: Profissional[] = data.map((p: any) => ({
          id: String(p.id),
          nome: p.nome_completo,
        }));

        setProfissionais(profissionaisFormatados);

        // SETA FERNANDA TELLES como padrão se ainda não tiver um profissional selecionado
        const PROFISSIONAL_PADRAO = 'fernanda telles';
        const fernanda = profissionaisFormatados.find((p) =>
          p.nome.toLowerCase().includes(PROFISSIONAL_PADRAO)
        );

        // Only set default if profissionalSelecionado is currently null
        if (profissionalSelecionado === null && fernanda) {
          setProfissionalSelecionado(fernanda.id);
        }
      } catch (error) {
        console.error('Erro ao buscar profissionais:', error);
      }
    };

    fetchProfissionais();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once on mount

  // Fetch Clientes
  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/usuario/?tipo=CLIENTE`);
        if (!response.ok) throw new Error('Network response was not ok');
        const data: Cliente[] = await response.json();
        setClientes(data);
      } catch (error) {
        console.error('Erro ao buscar clientes:', error);
      }
    };
    fetchClientes();
  }, []);

  // Fetch Servicos
  useEffect(() => {
    const fetchServicos = async () => {
      try {
        // Fetch all services for now, filter later based on professional
        const response = await fetch(`${API_BASE_URL}/servicos/`);
        if (!response.ok) throw new Error('Network response was not ok');
        const data: Servico[] = await response.json();
        setServicos(data);
      } catch (error) {
        console.error('Erro ao buscar serviços:', error);
      }
    };
    fetchServicos();
  }, []);

  // Fetch Agenda Data
  const fetchAgenda = async () => {
    if (!profissionalSelecionado) {
      setAgenda([]); // Clear agenda if no professional is selected
      return;
    }
    setLoading(true);
    setModalError(null); // Clear errors on refetch
    try {
      const response = await fetch(
        `${API_BASE_URL}/agenda/agendamentos/agenda/?profissional=${profissionalSelecionado}&data_inicial=${dataInicial}&data_final=${dataFinal}`
      );
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({})); // Attempt to get error details
        console.error('API Error Data:', errorData);
        throw new Error(`Network response was not ok (${response.status})`);
      }
      const data = await response.json();
      // Ensure data is an array before setting state
      setAgenda(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Erro ao buscar a agenda:', error);
      setAgenda([]); // Clear agenda on error
      // Optionally set a general error state to display to the user
    } finally {
      setLoading(false);
    }
  };

  // Re-fetch agenda when dependencies change
  useEffect(() => {
    // Only fetch if a professional is selected
    if (profissionalSelecionado) {
      fetchAgenda();
    } else {
      setAgenda([]); // Clear agenda if no professional is selected
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profissionalSelecionado, dataInicial, dataFinal]); // fetchAgenda is stable

  // --- Event Handlers ---

  const handleProfissionalChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setProfissionalSelecionado(e.target.value || null); // Set to null if empty option selected
  };

  const handleDateChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'inicial' | 'final'
  ) => {
    const newDate = e.target.value;
    if (type === 'inicial') {
      setDataInicial(newDate);
      if (visao === 'dia') {
        setDataFinal(newDate); // Keep final date same as initial in day view
      }
      // Ensure final date is not before initial date
      if (visao === 'semana' && newDate > dataFinal) {
        setDataFinal(newDate);
      }
    } else {
      // Ensure final date is not before initial date
      if (newDate >= dataInicial) {
        setDataFinal(newDate);
      }
    }
  };

  const alternarVisao = () => {
    // No need for today here
    if (visao === 'semana') {
      setVisao('dia');
      setDataFinal(dataInicial); // Set final date to initial date for day view
    } else {
      setVisao('semana');
      // Reset to a week view starting from dataInicial
      const start = new Date(dataInicial + 'T00:00:00'); // Ensure correct date parsing
      // Check if start date is valid before proceeding
      if (!isNaN(start.getTime())) {
        const end = new Date(start.setDate(start.getDate() + 6));
        setDataFinal(end.toISOString().split('T')[0]);
      } else {
        console.error(
          'Invalid start date for week view calculation:',
          dataInicial
        );
        // Optionally reset to default week view or show an error
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
    setModalError(null); // Clear previous errors
    setModalMode(mode);

    if (mode === 'add') {
      // Pre-fill for adding from cell or '+' button
      setModalFormData({
        id: undefined,
        cliente: '',
        profissional: profissionalSelecionado || '',
        servico: '',
        // Use current dataInicial if 'data' is not provided (e.g., '+' button)
        data: data || dataInicial,
        hora: hora || '', // Pre-fill if provided (from cell click)
      });
    } else if (mode === 'edit' && agendamento && data && hora) {
      // Pre-fill for editing
      setModalFormData({
        id: agendamento.agendamento_id,
        cliente: String(agendamento.cliente_id || ''),
        profissional: profissionalSelecionado || '',
        servico: String(agendamento.servico_id || ''),
        data: data,
        hora: hora.substring(0, 5), // Ensure HH:MM format
      });
    } else {
      // Fallback for '+' button add or error case
      setModalFormData({
        ...initialFormState,
        profissional: profissionalSelecionado || '',
        data: dataInicial, // Default to current start date
      });
    }

    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalFormData(initialFormState); // Reset form
    setModalError(null);
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoadingModal(true);
    setModalError(null);

    const { id, ...formData } = modalFormData;

    // Ensure IDs are valid numbers before parsing
    const clienteId = parseInt(formData.cliente, 10);
    const profissionalId = parseInt(formData.profissional, 10);
    const servicoId = parseInt(formData.servico, 10);

    // Basic validation including checking if parsing resulted in NaN
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

    const payload = {
      cliente: clienteId,
      profissional: profissionalId,
      servico: servicoId,
      data: formData.data,
      hora: formData.hora,
    };

    const url =
      modalMode === 'add'
        ? `${API_BASE_URL}/agenda/agendamentos/`
        : `${API_BASE_URL}/agenda/agendamentos/${id}/`;
    const method = modalMode === 'add' ? 'POST' : 'PUT';

    try {
      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        // Try to parse specific Django validation errors
        let errorMessage = `Erro ${response.status}: ${response.statusText}`;
        if (typeof errorData === 'object' && errorData !== null) {
          // Handle non_field_errors or specific field errors
          if (errorData.non_field_errors) {
            errorMessage = errorData.non_field_errors.join(' ');
          } else if (errorData.detail) {
            // Handle DRF default detail error
            errorMessage = errorData.detail;
          } else {
            // Join messages from all fields
            errorMessage = Object.entries(errorData)
              .map(
                ([field, errors]) =>
                  `${field}: ${
                    Array.isArray(errors) ? errors.join(' ') : errors
                  }` // Handle both array and string errors
              )
              .join('; ');
          }
        } else if (typeof errorData === 'string') {
          errorMessage = errorData;
        }
        throw new Error(
          errorMessage || `Erro desconhecido (${response.status})`
        );
      }

      closeModal();
      await fetchAgenda(); // Refresh agenda data
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
      const response = await fetch(
        `${API_BASE_URL}/agenda/agendamentos/${modalFormData.id}/`,
        {
          method: 'DELETE',
        }
      );

      if (!response.ok && response.status !== 204) {
        // 204 No Content is success for DELETE
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          `Erro ${response.status}: ${
            JSON.stringify(errorData.detail || errorData) || response.statusText
          }`
        );
      }

      closeModal();
      await fetchAgenda(); // Refresh agenda data
    } catch (error: any) {
      console.error('Erro ao excluir agendamento:', error);
      setModalError(error.message || 'Ocorreu um erro ao excluir.');
    } finally {
      setLoadingModal(false);
    }
  };

  // --- Helper Functions ---

  // Filter services available for the selected professional
  const getAvailableServices = useMemo(() => {
    if (!profissionalSelecionado) return [];
    // Ensure profissionalSelecionado is a valid number before parsing
    const profIdNumber = parseInt(profissionalSelecionado, 10);
    if (isNaN(profIdNumber)) return [];

    // Ensure s.profissionais is treated as an array and contains numbers
    return servicos.filter(
      (s) =>
        Array.isArray(s.profissionais) &&
        s.profissionais.some(
          (profId) => typeof profId === 'number' && profId === profIdNumber
        )
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profissionalSelecionado, servicos]); // Dependencies

  // Memoize date keys to avoid recalculating on every render
  const dateKeys = useMemo(() => {
    if (agenda.length === 0) return [];
    return Object.keys(agenda[0]).filter((key) => key !== 'horario');
  }, [agenda]);

  // --- Render Logic ---

  return (
    <div className="w-screen text-[#757575] mx-auto p-5">
      <div className="flex justify-between  items-center mb-4">
        <h1 className="text-2xl  font-bold text-[#E91E63] ">Agenda</h1>
        <button
          onClick={() => openModal('add')}
          className="bg-[#E91E63] text-white p-2 rounded-full hover:bg-[var(--secondary)] disabled:opacity-50"
          title="Novo Agendamento"
          disabled={!profissionalSelecionado} // Disable if no professional selected
        >
          <FaPlus />
        </button>
      </div>

      {/* Controles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 items-end">
        {/* Seleção de profissional */}
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
            className="w-full p-2 border border-[#E0E0E0] bg-[var(--primary)] rounded-md text-[#fff]"
          >
            {/* Add a default "Selecione" option */}
            <option value="" disabled={profissionais.length > 0}>
              -- Selecione --
            </option>
            {profissionais.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nome}
              </option>
            ))}
          </select>
        </div>

        {/* Seleção de Datas */}
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
                min={dataInicial} // Prevent end date before start date
                onChange={(e) => handleDateChange(e, 'final')}
                className="p-2 border text-[#212121] bg-[#FFFFFF] border-[#E0E0E0] rounded-md w-full"
              />
            </div>
          )}
        </div>

        {/* Botão Alternar Visão */}
        <div className="flex justify-end">
          <button
            onClick={alternarVisao}
            className=" text-[var(--secondary)] bg-[var(--primary)] px-4 py-2 rounded-md hover:bg-gray-600 h-10" // Match input height
          >
            Ver {visao === 'semana' ? 'Dia' : 'Semana'}
          </button>
        </div>
      </div>

      {/* Tabela de Agenda */}
      {loading ? (
        <p className="text-center mt-4">Carregando agenda...</p>
      ) : !profissionalSelecionado ? (
        <p className="text-center mt-4 text-gray-500">
          Selecione um profissional para ver a agenda.
        </p>
      ) : agenda.length === 0 && !loading ? ( // Check loading state again
        <p className="text-center mt-4 text-gray-500">
          Nenhum horário encontrado para o profissional e período selecionados.
        </p>
      ) : (
        <div className="overflow-x-auto ">
          <table className="w-full border-collapse border border-gray-300 mt-4 mb-40 text-sm">
            <thead>
              <tr className="bg-[var(--primary)]  text-[var(--secondary)]">
                <th className="border border-gray-300 p-2 font-semibold sticky left-0 bg-[var(--primary)] z-10">
                  Horário
                </th>
                {/* Use memoized dateKeys */}
                {dateKeys.map((dia) => (
                  <th
                    key={dia}
                    className="border border-gray-300 p-2 font-semibold min-w-[100px]" // Add min-width
                  >
                    {/* Format date for display if needed */}
                    {new Date(dia + 'T00:00:00').toLocaleDateString('pt-BR', {
                      weekday: 'short',
                      day: '2-digit',
                      month: '2-digit',
                    })}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {agenda.map((linha, rowIndex) => (
                <tr key={linha.horario} className="hover:bg-gray-50">
                  <td className="border border-gray-300 p-2 font-medium sticky left-0 bg-white z-10">
                    {linha.horario}
                  </td>
                  {/* Iterate through dateKeys to ensure consistent column order */}
                  {dateKeys.map((dia) => {
                    const slot = linha[dia] as AgendaSlot;
                    const horario = linha.horario;
                    const agendamentoId = slot?.agendamento_id;

                    // Check if this cell is part of a previous row's span
                    if (rowIndex > 0 && agendamentoId) {
                      const prevSlot = agenda[rowIndex - 1][dia] as AgendaSlot;
                      if (prevSlot?.agendamento_id === agendamentoId) {
                        return null; // Don't render this cell, it's covered by rowspan
                      }
                    }

                    // Calculate rowspan if it's an occupied slot starting here
                    const rowSpan =
                      slot?.ocupado === true
                        ? calculateRowSpan(agenda, rowIndex, dia, agendamentoId)
                        : 1;

                    // --- Render Cell Content ---
                    let cellContent;
                    let cellClassName =
                      'border border-gray-300 p-0 text-center h-12 align-top'; // Default class, align top for rowspan

                    if (slot?.ocupado === null) {
                      cellContent = (
                        <span className="text-gray-400 italic text-xs p-1">
                          Fora
                        </span>
                      );
                    } else if (slot?.ocupado === true) {
                      // Occupied slot - clickable to edit/view
                      cellContent = (
                        <button
                          onClick={() => openModal('edit', dia, horario, slot)}
                          className="w-full h-full text-left p-1 bg-[#fadadd] border-[var(--primary)] border-2 hover:bg-red-200 rounded text-xs flex flex-col gap-1 justify-center"
                          title={`Editar Agendamento: ${slot.nome_cliente} (${
                            slot.servico_nome || 'Serviço'
                          })`}
                          // Adjust height based on rowspan if needed, or use flex properties
                          style={{ height: `${rowSpan * 3}rem` }} // 3rem approx h-12
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
                      // Available slot - clickable to add
                      cellContent = (
                        <button
                          onClick={() => openModal('add', dia, horario)}
                          className="w-full h-full text-black bg-transparent font-bold hover:bg-[var(--primary)] rounded flex items-center justify-center text-xs px-5"
                          title={`Agendar ${dia} ${horario}`}
                        ></button>
                      );
                      cellClassName =
                        'border border-gray-300 p-0 text-center h-12'; // Reset class for non-rowspan
                    }

                    return (
                      <td
                        key={`${dia}-${linha.horario}`}
                        className={cellClassName}
                        rowSpan={rowSpan > 1 ? rowSpan : undefined} // Apply rowspan only if > 1
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

      {/* --- Modal para Adicionar/Editar Agendamento --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          {' '}
          {/* Added overflow-y-auto */}
          <form
            onSubmit={handleFormSubmit}
            className="bg-white p-6 rounded shadow-lg w-full max-w-lg text-black relative my-8" /* Added margin */
          >
            <button
              type="button"
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-2xl"
              aria-label="Fechar modal"
            >
              &times;
            </button>
            <h2 className="text-xl font-semibold mb-4">
              {modalMode === 'add' ? 'Novo Agendamento' : 'Editar Agendamento'}
            </h2>

            {modalError && (
              <div
                className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded relative mb-3"
                role="alert"
              >
                <span className="block sm:inline">{modalError}</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {/* Cliente */}
              <div>
                <label
                  htmlFor="cliente"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Cliente
                </label>
                <select
                  id="cliente"
                  name="cliente"
                  value={modalFormData.cliente}
                  onChange={handleModalChange}
                  required
                  className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="" disabled>
                    -- Selecione --
                  </option>
                  {clientes.map((c) => (
                    <option key={c.id} value={String(c.id)}>
                      {c.nome_completo}
                    </option>
                  ))}
                </select>
              </div>

              {/* Serviço */}
              <div>
                <label
                  htmlFor="servico"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Serviço
                </label>
                <select
                  id="servico"
                  name="servico"
                  value={modalFormData.servico}
                  onChange={handleModalChange}
                  required
                  className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={
                    !profissionalSelecionado ||
                    getAvailableServices.length === 0
                  } // Disable if no services
                >
                  <option value="" disabled>
                    {profissionalSelecionado
                      ? '-- Selecione --'
                      : '-- Selecione Profissional --'}
                  </option>
                  {getAvailableServices.map(
                    (
                      s // Use memoized list
                    ) => (
                      <option key={s.id} value={String(s.id)}>
                        {s.nome}
                      </option>
                    )
                  )}
                </select>
                {profissionalSelecionado &&
                  getAvailableServices.length === 0 && (
                    <p className="text-xs text-red-500 mt-1">
                      Nenhum serviço disponível para este profissional.
                    </p>
                  )}
              </div>

              {/* Data */}
              <div>
                <label
                  htmlFor="data"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Data
                </label>
                <input
                  id="data"
                  name="data"
                  type="date"
                  value={modalFormData.data}
                  onChange={handleModalChange}
                  required
                  className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  // Allow changing date/time when editing if needed, remove readOnly
                  // readOnly={modalMode === 'edit'}
                />
              </div>

              {/* Hora */}
              <div>
                <label
                  htmlFor="hora"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Hora
                </label>
                <input
                  id="hora"
                  name="hora"
                  type="time" // Use time input
                  value={modalFormData.hora}
                  onChange={handleModalChange}
                  required
                  className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  // Allow changing date/time when editing if needed, remove readOnly
                  // readOnly={modalMode === 'edit'}
                  step="1800" // Optional: Set step for time picker (e.g., 30 minutes)
                />
              </div>

              {/* Profissional (Readonly display) */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Profissional
                </label>
                <input
                  type="text"
                  value={
                    profissionais.find(
                      (p) => p.id === modalFormData.profissional
                    )?.nome || 'N/A'
                  }
                  readOnly
                  className="w-full border px-3 py-2 rounded bg-gray-100 text-gray-600"
                />
                {/* Hidden input to ensure profissional ID is submitted */}
                <input
                  type="hidden"
                  name="profissional"
                  value={modalFormData.profissional}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between items-center mt-6">
              <div>
                {modalMode === 'edit' && (
                  <button
                    type="button"
                    onClick={handleDeleteAgendamento}
                    disabled={loadingModal}
                    className="px-4 py-2 rounded bg-red-600 text-white flex items-center hover:bg-red-700 disabled:opacity-50"
                  >
                    <FaTrash className="mr-2" />{' '}
                    {loadingModal ? 'Excluindo...' : 'Excluir'}
                  </button>
                )}
              </div>
              <div className="space-x-2">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={loadingModal}
                  className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loadingModal}
                  className={`px-4 py-2 rounded text-white ${
                    modalMode === 'add'
                      ? 'bg-blue-600 hover:bg-blue-700'
                      : 'bg-green-600 hover:bg-green-700'
                  } disabled:opacity-50`}
                >
                  {loadingModal
                    ? 'Salvando...'
                    : modalMode === 'add'
                    ? 'Agendar'
                    : 'Salvar Alterações'}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Agenda;
