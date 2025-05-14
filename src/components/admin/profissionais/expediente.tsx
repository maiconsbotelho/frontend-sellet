'use client';

import { useState, useEffect, useCallback } from 'react';
import { FaClock, FaEdit, FaPlus, FaTrash, FaSave } from 'react-icons/fa';
import ModalExpediente from './modalExpediente';
import { DIAS_DA_SEMANA } from '@/utils/constants';
import {
  Profissional,
  Horario,
  HorarioExpediente,
  ExpedienteFormData,
} from '@/utils/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function ExpedientePage() {
  const [profissionais, setProfissionais] = useState<Profissional[]>([]);
  const [selectedProfissionalId, setSelectedProfissionalId] = useState<
    string | null
  >(null);
  const [expedientes, setExpedientes] = useState<HorarioExpediente[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [currentExpediente, setCurrentExpediente] =
    useState<HorarioExpediente | null>(null);
  const [modalFormData, setModalFormData] = useState<ExpedienteFormData>({
    profissional: '',
    dia_semana: '',
    inicio: '',
    fim: '',
  });
  const [modalError, setModalError] = useState<string | null>(null);

  // Função para buscar profissionais e definir o profissional selecionado
  const fetchProfissionais = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE_URL}/usuario/?tipo=PROFISSIONAL`);
      if (!res.ok) throw new Error(`Erro ${res.status}`);

      // Verifica se a resposta é um JSON válido
      const data: Profissional[] = await res.json();
      setProfissionais(data);

      // Seleciona o primeiro profissional por padrão se a lista não estiver vazia e nenhum estiver selecionado
      if (data.length > 0 && !selectedProfissionalId) {
        setSelectedProfissionalId(String(data[0].id));
        setIsLoading(false);
      } else if (data.length === 0) {
        setIsLoading(false);
      }
    } catch (err: any) {
      console.error('Falha ao buscar profissionais:', err);
      setError(
        `Falha ao buscar profissionais: ${err.message || 'Erro desconhecido'}`
      );
      setIsLoading(false);
    }
  }, [selectedProfissionalId]);

  // Função para buscar expedientes do profissional selecionado
  const fetchExpedientes = useCallback(async () => {
    if (!selectedProfissionalId) {
      setExpedientes([]);
      setIsLoading(false);
      return;
    }

    // Garante que o loading esteja true ao buscar expedientes
    setIsLoading(true);
    setError(null); // Limpa erros anteriores específicos da busca de expediente

    try {
      const res = await fetch(
        `${API_BASE_URL}/agenda/expediente/por_profissional/?profissional=${selectedProfissionalId}`
      );

      if (!res.ok) throw new Error(`Erro ${res.status}`);
      let data: HorarioExpediente[] = await res.json();

      // Processa os dados para adicionar inicio/fim para exibição
      data = data.map((exp) => {
        if (exp.horarios && exp.horarios.length > 0) {
          // Ordena os horários para encontrar min e max confiavelmente
          const sortedHorarios = [...exp.horarios].sort((a, b) =>
            a.horario.localeCompare(b.horario)
          );
          // Calcula o horário de início: primeiro horário de início
          const inicio = sortedHorarios[0].horario.substring(0, 5); // HH:MM
          // Calcula o horário de fim: último horário de início + 30 mins (assumindo blocos de 30 min)
          const lastStartTime = sortedHorarios[
            sortedHorarios.length - 1
          ].horario.substring(0, 5);
          // Converte para Date para adicionar 30 minutos
          const [hours, minutes] = lastStartTime.split(':').map(Number);
          const endDate = new Date();
          // Usa uma data fixa para evitar problemas com horário de verão, apenas a hora importa

          endDate.setUTCHours(hours, minutes + 30, 0, 0);
          // Garante zeros à esquerda para horas/minutos
          const fimHours = String(endDate.getUTCHours()).padStart(2, '0');
          const fimMinutes = String(endDate.getUTCMinutes()).padStart(2, '0');
          const fim = `${fimHours}:${fimMinutes}`; // Extrai HH:MM da string UTC

          return { ...exp, inicio, fim };
        }
        return exp; // Retorna como está se não houver horários
      });

      setExpedientes(data);
    } catch (err: any) {
      console.error('Falha ao buscar expediente:', err);
      setError(
        `Falha ao buscar expediente: ${err.message || 'Erro desconhecido'}`
      );
      setExpedientes([]); // Limpa expedientes em caso de erro
    } finally {
      setIsLoading(false); // Para o loading SOMENTE após a busca de expedientes completar (sucesso ou erro)
    }
  }, [selectedProfissionalId]); // Depende apenas de selectedProfissionalId

  // Busca profissionais na montagem do componente e quando selectedProfissionalId muda
  useEffect(() => {
    fetchProfissionais();
  }, [fetchProfissionais]);

  // Busca expedientes quando o profissional selecionado muda
  useEffect(() => {
    if (selectedProfissionalId) {
      fetchExpedientes();
    } else {
      // Limpa expedientes e garante que loading seja false se nenhum profissional estiver selecionado
      setExpedientes([]);
      setIsLoading(false);
    }
  }, [selectedProfissionalId, fetchExpedientes]);

  // --- Manipuladores de Eventos ---

  // Manipulador para mudança de profissional
  const handleProfissionalChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedProfissionalId(e.target.value);
  };

  // Manipulador para abrir o modal
  const openModal = (
    mode: 'add' | 'edit',
    expediente?: HorarioExpediente,
    dayIndex?: number
  ) => {
    setModalError(null);
    setModalMode(mode);

    // Limpa o estado do modal antes de abrir
    if (mode === 'add' && selectedProfissionalId) {
      setCurrentExpediente(null);
      setModalFormData({
        profissional: selectedProfissionalId,
        dia_semana: dayIndex !== undefined ? String(dayIndex) : '',
        inicio: '',
        fim: '',
      });

      // Se o dia da semana for passado, preenche o campo
    } else if (mode === 'edit' && expediente) {
      setCurrentExpediente(expediente);
      setModalFormData({
        profissional: String(expediente.profissional),
        dia_semana: String(expediente.dia_semana),
        inicio: expediente.inicio || '',
        fim: expediente.fim || '',
      });
    } else {
      if (mode === 'add' && !selectedProfissionalId) {
        setError('Por favor, selecione um profissional primeiro.');
      }
      return;
    }
    setIsModalOpen(true);
  };

  // Manipulador para fechar o modal
  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentExpediente(null);
    setModalFormData({
      profissional: selectedProfissionalId || '',
      dia_semana: '',
      inicio: '',
      fim: '',
    });
    setModalError(null);
  };

  // Manipulador para mudanças no formulário do modal
  const handleModalChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setModalFormData({ ...modalFormData, [e.target.name]: e.target.value });
  };

  // Manipulador para envio do formulário do modal
  const handleModalSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setModalError(null);
    setIsSubmitting(true);

    // Validação Básica
    if (
      !modalFormData.profissional ||
      modalFormData.dia_semana === '' ||
      !modalFormData.inicio ||
      !modalFormData.fim
    ) {
      setModalError('Todos os campos são obrigatórios.');
      setIsSubmitting(false);
      return;
    }
    if (modalFormData.inicio >= modalFormData.fim) {
      setModalError('O horário de início deve ser anterior ao horário de fim.');
      setIsSubmitting(false);
      return;
    }

    // --- Definição do Payload baseado no modo ---
    let payload: any;
    let url: string;
    const method = modalMode === 'add' ? 'POST' : 'PUT';

    if (modalMode === 'add') {
      payload = {
        profissional: parseInt(modalFormData.profissional, 10),
        dia_semana: parseInt(modalFormData.dia_semana, 10),
        inicio: modalFormData.inicio,
        fim: modalFormData.fim,
      };
      url = `${API_BASE_URL}/agenda/expediente/`;
    } else {
      // modalMode === 'edit'
      if (!currentExpediente?.id) {
        setModalError('Erro: ID do expediente não encontrado para edição.');
        setIsSubmitting(false);
        return;
      }

      payload = {
        profissional: parseInt(modalFormData.profissional, 10), // Certifique-se que está correto e é necessário
        dia_semana: parseInt(modalFormData.dia_semana, 10), // Certifique-se que está correto e é necessário
        inicio: modalFormData.inicio,
        fim: modalFormData.fim,
      };
      url = `${API_BASE_URL}/agenda/expediente/${currentExpediente.id}/`;
    }

    console.log('Enviando:', { method, url, payload }); // DEBUG: Loga os detalhes da requisição

    try {
      const res = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      console.log('Status da Resposta:', res.status); // DEBUG: Loga o status da resposta
      const responseText = await res.text(); // DEBUG: Obtém o texto da resposta independentemente do status
      console.log('Corpo da Resposta:', responseText); // DEBUG: Loga o corpo da resposta

      if (!res.ok) {
        let errorData;
        try {
          errorData = JSON.parse(responseText); // Tenta parsear a resposta de erro como JSON
        } catch (parseError) {
          errorData = {
            message: responseText || 'Erro desconhecido ao salvar expediente.',
          }; // Fallback para texto
        }

        let errMsg = errorData.detail || JSON.stringify(errorData);
        // Tenta extrair mensagens de erro mais específicas (ex: do Django Rest Framework)
        if (typeof errorData === 'object' && errorData !== null) {
          const firstKey = Object.keys(errorData)[0];
          if (firstKey && Array.isArray(errorData[firstKey])) {
            errMsg = `${firstKey}: ${errorData[firstKey][0]}`; // ex: "inicio: Este campo é obrigatório."
          } else if (firstKey && typeof errorData[firstKey] === 'string') {
            errMsg = `${firstKey}: ${errorData[firstKey]}`;
          }
        }
        throw new Error(errMsg);
      }

      closeModal();
      await fetchExpedientes(); // Busca dados atualizados após envio bem-sucedido
    } catch (err: any) {
      console.error(`Falha ao ${modalMode} expediente:`, err);
      setModalError(
        `Falha ao ${modalMode === 'add' ? 'adicionar' : 'editar'} expediente: ${
          err.message
        }`
      );
    } finally {
      setIsSubmitting(false); // Para o loading de envio independentemente do resultado
    }
  };

  const handleDelete = async (expedienteId: number) => {
    if (
      !window.confirm(
        'Tem certeza que deseja excluir este horário de expediente?'
      )
    ) {
      return;
    }
    setError(null);
    setIsSubmitting(true); // Usa o estado de submitting para a operação de delete também
    try {
      const res = await fetch(
        `${API_BASE_URL}/agenda/expediente/${expedienteId}/`,
        {
          method: 'DELETE',
        }
      );
      if (!res.ok && res.status !== 204) {
        // 204 No Content é sucesso para DELETE
        const errorData = await res.json().catch(() => ({
          message: 'Erro desconhecido ao excluir expediente.',
        }));
        throw new Error(errorData.detail || JSON.stringify(errorData));
      }
      await fetchExpedientes(); // Atualiza a lista após deletar
    } catch (err: any) {
      console.error('Falha ao excluir expediente:', err);
      setError(`Falha ao excluir expediente: ${err.message}`);
    } finally {
      setIsSubmitting(false); // Para o estado de submitting
    }
  };

  // --- Lógica de Renderização ---

  const renderExpedientes = () => {
    // Usa isLoading para o estado de carregamento principal
    if (isLoading && !selectedProfissionalId) {
      return (
        <div className="text-center py-10 text-gray-500">
          Carregando profissionais...
        </div>
      );
    }
    if (isLoading && selectedProfissionalId) {
      return (
        <div className="text-center py-10 text-gray-500">
          Carregando expediente...
        </div>
      );
    }

    if (!selectedProfissionalId) {
      return (
        <div className="text-center py-10 text-gray-500">
          Selecione um profissional para ver ou adicionar expediente.
        </div>
      );
    }

    // Agrupa por dia da semana
    const groupedExpedientes: { [key: number]: HorarioExpediente[] } = {};
    expedientes.forEach((exp) => {
      if (!groupedExpedientes[exp.dia_semana]) {
        groupedExpedientes[exp.dia_semana] = [];
      }
      groupedExpedientes[exp.dia_semana].push(exp);
    });

    return DIAS_DA_SEMANA.map((diaNome, index) => {
      const hasExpediente =
        groupedExpedientes[index] && groupedExpedientes[index].length > 0;
      // Clicável apenas se não houver expediente, profissional selecionado, e NÃO estiver carregando/enviando
      const isClickable =
        !hasExpediente && selectedProfissionalId && !isLoading && !isSubmitting;

      return (
        <div
          key={index}
          className={`p-3 border rounded bg-[var(--secondary)] border-[var(--primary)] transition-colors duration-150 ${
            isClickable ? 'cursor-pointer hover:bg-pink-100' : ''
          } ${isSubmitting ? 'opacity-70' : ''}`} // Diminui a opacidade se estiver enviando
          onClick={
            isClickable ? () => openModal('add', undefined, index) : undefined
          }
          role={isClickable ? 'button' : undefined}
          tabIndex={isClickable ? 0 : undefined}
          onKeyDown={
            isClickable
              ? (e) => {
                  if (e.key === 'Enter' || e.key === ' ')
                    openModal('add', undefined, index);
                }
              : undefined
          }
          aria-label={
            isClickable ? `Adicionar horário para ${diaNome}` : undefined
          }
          aria-disabled={isSubmitting}
        >
          <h3 className="text-lg font-semibold mb-2 text-[var(--accent)]">
            {diaNome}
          </h3>
          {hasExpediente ? (
            <ul className="space-y-1">
              {groupedExpedientes[index].map((exp) => (
                <li
                  key={exp.id}
                  className="flex justify-between items-center py-1 "
                >
                  <span className="text-gray-700">
                    <FaClock className="inline mr-2 text-white" />
                    {exp.inicio} - {exp.fim}
                  </span>
                  <div className="space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openModal('edit', exp);
                      }}
                      className="text-[var(--accent)] hover:text-pink-700 p-1 disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-label={`Editar horário ${exp.inicio}-${exp.fim} de ${diaNome}`}
                      disabled={isLoading || isSubmitting}
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(exp.id);
                      }}
                      className="text-gray-400 hover:text-red-800 p-1 disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-label={`Excluir horário ${exp.inicio}-${exp.fim} de ${diaNome}`}
                      disabled={isLoading || isSubmitting}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex items-center justify-center text-sm text-gray-500 italic h-10">
              {!isLoading && selectedProfissionalId && (
                <>
                  <FaPlus className="mr-2" /> Clique para adicionar horário
                </>
              )}
              {
                !isLoading &&
                  !selectedProfissionalId &&
                  'Selecione um profissional' // Não deve acontecer devido à verificação externa
              }
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <div className="p-6 pb-44  w-screen">
      {/* Exibição de Erro Geral */}
      {error && !isModalOpen && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
          role="alert"
        >
          <span className="block sm:inline">{error}</span>
          <button
            onClick={() => setError(null)}
            className="absolute top-0 bottom-0 right-0 px-4 py-3"
            aria-label="Fechar erro"
          >
            <span className="text-xl">×</span>
          </button>
        </div>
      )}

      {/* Seleção de Profissional e Botão Adicionar (Horizontal Layout) */}
      <div className="mb-12 flex items-end gap-4">
        <div className="flex-grow">
          <label
            htmlFor="profissional"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Selecionar Profissional:
          </label>
          <select
            id="profissional"
            name="profissional"
            value={selectedProfissionalId || ''}
            onChange={handleProfissionalChange}
            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[var(--primary)] border-[var(--border-primary)] disabled:bg-gray-200 text-[var(--text-secondary)] bg-white"
            disabled={isLoading || isSubmitting || profissionais.length === 0}
          >
            <option value="" disabled>
              {isLoading && profissionais.length === 0
                ? 'Carregando...'
                : 'Selecione...'}
            </option>
            {profissionais.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nome_completo}
              </option>
            ))}
          </select>
          {profissionais.length === 0 && !isLoading && (
            <p className="text-xs text-red-500 mt-1">
              Nenhum profissional encontrado.
            </p>
          )}
        </div>
        {/* Add Button */}
        <button
          onClick={() => openModal('add')}
          disabled={!selectedProfissionalId || isLoading || isSubmitting}
          className="flex-shrink-0 bg-[var(--accent)] text-white px-4 py-2 rounded flex items-center justify-center hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 ease-in-out" // Use flex-shrink-0
          aria-label="Adicionar novo horário de expediente"
        >
          <FaPlus className="mr-2" /> ADD
        </button>
      </div>
      {/* Exibição dos Expedientes */}
      <div className="space-y-2">{renderExpedientes()}</div>

      {/* MODAL ADICIONAR/EDITAR */}
      <ModalExpediente
        isOpen={isModalOpen}
        mode={modalMode}
        formData={modalFormData}
        onChange={handleModalChange}
        onClose={closeModal}
        onSubmit={handleModalSubmit}
        error={modalError}
        isSubmitting={isSubmitting}
        profissionais={profissionais}
      />
    </div>
  );
}
