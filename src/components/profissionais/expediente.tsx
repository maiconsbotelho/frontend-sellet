'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { FaEdit, FaPlus, FaTrash, FaClock } from 'react-icons/fa';

// --- Definições de Tipos ---
type Profissional = {
  id: number;
  nome_completo: string;
};

type Horario = {
  id: number;
  horario: string; // Formato HH:MM:SS do backend, exibir como HH:MM
};

type HorarioExpediente = {
  id: number;
  profissional: number; // ID
  dia_semana: number; // 0-6
  horarios: Horario[];
  // Adicionados para conveniência de exibição após buscar/processar
  inicio?: string; // HH:MM
  fim?: string; // HH:MM
};

type ExpedienteFormData = {
  profissional: string; // ID como string para o formulário
  dia_semana: string; // 0-6 como string para o formulário
  inicio: string; // HH:MM
  fim: string; // HH:MM
};

const DIAS_DA_SEMANA = [
  'Segunda',
  'Terça',
  'Quarta',
  'Quinta',
  'Sexta',
  'Sábado',
  'Domingo',
];

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function ExpedientePage() {
  const [profissionais, setProfissionais] = useState<Profissional[]>([]);
  const [selectedProfissionalId, setSelectedProfissionalId] = useState<
    string | null
  >(null);
  const [expedientes, setExpedientes] = useState<HorarioExpediente[]>([]);
  const [isLoading, setIsLoading] = useState(false); // Representa o estado de carregamento geral da página/dados
  const [isSubmitting, setIsSubmitting] = useState(false); // Representa o estado de envio do modal
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

  // --- Busca de Dados ---

  const fetchProfissionais = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/usuario/?tipo=PROFISSIONAL`);
      if (!res.ok) throw new Error(`Erro ${res.status}`);
      const data: Profissional[] = await res.json();
      setProfissionais(data);
      // Seleciona o primeiro profissional por padrão se a lista não estiver vazia e nenhum estiver selecionado
      if (data.length > 0 && !selectedProfissionalId) {
        setSelectedProfissionalId(String(data[0].id));
        // Não para o loading aqui, deixa fetchExpedientes cuidar disso
      } else if (data.length === 0) {
        setIsLoading(false); // Para o loading se nenhum profissional for encontrado
      }
    } catch (err: any) {
      console.error('Falha ao buscar profissionais:', err);
      setError(
        `Falha ao buscar profissionais: ${err.message || 'Erro desconhecido'}`
      );
      setIsLoading(false); // Para o loading em caso de erro
    }
    // Bloco finally removido que definia isLoading como false prematuramente
  }, [selectedProfissionalId]); // Depende apenas de selectedProfissionalId

  const fetchExpedientes = useCallback(async () => {
    if (!selectedProfissionalId) {
      setExpedientes([]);
      setIsLoading(false); // Para o loading se nenhum profissional estiver selecionado
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
          const inicio = sortedHorarios[0].horario.substring(0, 5); // HH:MM
          // Calcula o horário de fim: último horário de início + 30 mins (assumindo blocos de 30 min)
          const lastStartTime = sortedHorarios[
            sortedHorarios.length - 1
          ].horario.substring(0, 5);
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

  useEffect(() => {
    fetchProfissionais();
  }, [fetchProfissionais]); // Roda uma vez na montagem e se fetchProfissionais mudar (não deveria, a menos que a lógica de selectedProfissionalId mude)

  useEffect(() => {
    // Busca expedientes apenas quando um profissional é selecionado
    if (selectedProfissionalId) {
      fetchExpedientes();
    } else {
      // Limpa expedientes e garante que loading seja false se nenhum profissional estiver selecionado
      setExpedientes([]);
      setIsLoading(false);
    }
    // Este useEffect depende APENAS da mudança de selectedProfissionalId.
    // fetchExpedientes é estável devido ao useCallback, a menos que sua própria dependência (selectedProfissionalId) mude.
  }, [selectedProfissionalId, fetchExpedientes]);

  // --- Manipuladores de Eventos ---

  const handleProfissionalChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedProfissionalId(e.target.value);
    // fetchExpedientes será disparado pelo hook useEffect que observa selectedProfissionalId
  };

  const openModal = (
    mode: 'add' | 'edit',
    expediente?: HorarioExpediente,
    dayIndex?: number
  ) => {
    setModalError(null);
    setModalMode(mode);
    if (mode === 'add' && selectedProfissionalId) {
      setCurrentExpediente(null);
      setModalFormData({
        profissional: selectedProfissionalId,
        dia_semana: dayIndex !== undefined ? String(dayIndex) : '',
        inicio: '',
        fim: '',
      });
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

  const handleModalChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setModalFormData({ ...modalFormData, [e.target.name]: e.target.value });
  };

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
    const method = modalMode === 'add' ? 'POST' : 'PUT'; // Mantém PUT para edição

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
      // Garante que o payload para PUT inclua todos os campos necessários esperados pelo backend
      // Esta estrutura envia o objeto completo, que é padrão para PUT.
      payload = {
        profissional: parseInt(modalFormData.profissional, 10), // Certifique-se que está correto e é necessário
        dia_semana: parseInt(modalFormData.dia_semana, 10), // Certifique-se que está correto e é necessário
        inicio: modalFormData.inicio,
        fim: modalFormData.fim,
      };
      url = `${API_BASE_URL}/agenda/expediente/${currentExpediente.id}/`;
    }
    // --- Fim da Definição do Payload ---

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
          className={`mb-4 p-4 border rounded bg-white shadow-sm transition-colors duration-150 ${
            isClickable ? 'cursor-pointer hover:bg-blue-50' : ''
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
          aria-disabled={isSubmitting} // Indica estado desabilitado durante o envio
        >
          <h3 className="text-lg font-semibold mb-2 text-gray-700">
            {diaNome}
          </h3>
          {hasExpediente ? (
            <ul className="space-y-2">
              {groupedExpedientes[index].map((exp) => (
                <li
                  key={exp.id}
                  className="flex justify-between items-center p-2 border-b last:border-b-0"
                >
                  <span className="text-gray-800">
                    <FaClock className="inline mr-2 text-blue-500" />
                    {exp.inicio} - {exp.fim}
                  </span>
                  <div className="space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // Impede que o clique no botão acione o clique no card do dia
                        openModal('edit', exp);
                      }}
                      className="text-blue-600 hover:text-blue-800 p-1 disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-label={`Editar horário ${exp.inicio}-${exp.fim} de ${diaNome}`}
                      disabled={isLoading || isSubmitting} // Desabilita se estiver carregando ou enviando
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // Impede que o clique no botão acione o clique no card do dia
                        handleDelete(exp.id);
                      }}
                      className="text-red-600 hover:text-red-800 p-1 disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-label={`Excluir horário ${exp.inicio}-${exp.fim} de ${diaNome}`}
                      disabled={isLoading || isSubmitting} // Desabilita se estiver carregando ou enviando
                    >
                      <FaTrash />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex items-center justify-center text-sm text-gray-400 italic h-10">
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
              {/* Condições comentadas podem ser redundantes */}
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Gerenciar Expediente
      </h1>

      {/* Exibição de Erro Geral */}
      {error && !isModalOpen && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 border border-red-400 rounded">
          {error}
        </div>
      )}

      {/* Seleção de Profissional e Botão Adicionar */}
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4 p-4 bg-white rounded shadow">
        <div className="flex-grow w-full sm:w-auto">
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
            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-200"
            disabled={isLoading || isSubmitting || profissionais.length === 0} // Desabilita durante carregamento/envio ou se não houver profissionais
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
        <button
          onClick={() => openModal('add')}
          disabled={!selectedProfissionalId || isLoading || isSubmitting} // Desabilita durante carregamento/envio ou se nenhum profissional selecionado
          className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded flex items-center justify-center hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FaPlus className="mr-2" /> Adicionar Horário
        </button>
      </div>

      {/* Exibição dos Expedientes */}
      <div className="space-y-4">{renderExpedientes()}</div>

      {/* MODAL ADICIONAR/EDITAR */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <form
            onSubmit={handleModalSubmit}
            className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md border border-gray-200"
          >
            <h2 className="text-xl font-semibold mb-5 text-gray-800 border-b pb-3">
              {modalMode === 'add' ? 'Adicionar Novo' : 'Editar'} Horário de
              Expediente
            </h2>

            {/* Exibição de Erro do Modal */}
            {modalError && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 border border-red-300 rounded text-sm">
                {modalError}
              </div>
            )}

            {/* Profissional (Apenas Exibição) */}
            <input
              type="hidden"
              name="profissional"
              value={modalFormData.profissional}
            />
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Profissional
              </label>
              <p className="text-gray-900 bg-gray-100 px-3 py-2 rounded border border-gray-200">
                {profissionais.find(
                  (p) => String(p.id) === modalFormData.profissional
                )?.nome_completo || 'N/A'}
              </p>
            </div>

            {/* Dia da Semana */}
            <div className="mb-4">
              <label
                htmlFor="dia_semana"
                className="block text-sm font-medium text-gray-600 mb-1"
              >
                Dia da Semana <span className="text-red-500">*</span>
              </label>
              <select
                id="dia_semana"
                name="dia_semana"
                value={modalFormData.dia_semana}
                onChange={handleModalChange}
                className={`w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  modalMode === 'edit' ||
                  (modalMode === 'add' && modalFormData.dia_semana !== '')
                    ? 'bg-gray-100 cursor-not-allowed' // Desabilita visualmente se editando ou dia pré-selecionado
                    : 'bg-white'
                }`}
                required
                disabled={
                  isSubmitting || // Desabilita se enviando
                  modalMode === 'edit' || // Desabilita se editando
                  (modalMode === 'add' && modalFormData.dia_semana !== '') // Desabilita se adicionando com dia pré-selecionado
                }
              >
                <option value="" disabled>
                  Selecione...
                </option>
                {DIAS_DA_SEMANA.map((dia, index) => (
                  <option key={index} value={index}>
                    {dia}
                  </option>
                ))}
              </select>
              {(modalMode === 'edit' ||
                (modalMode === 'add' && modalFormData.dia_semana !== '')) && (
                <p className="text-xs text-gray-500 mt-1">
                  {modalMode === 'edit'
                    ? 'Para alterar o dia, exclua este horário e adicione um novo.'
                    : 'Dia pré-selecionado. Para escolher outro, cancele e use o botão "Adicionar Horário".'}
                </p>
              )}
            </div>

            {/* Horário Início */}
            <div className="mb-4">
              <label
                htmlFor="inicio"
                className="block text-sm font-medium text-gray-600 mb-1"
              >
                Horário Início <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                id="inicio"
                name="inicio"
                value={modalFormData.inicio}
                onChange={handleModalChange}
                className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                required
                step="1800" // Intervalo de 30 minutos
                disabled={isSubmitting} // Desabilita se enviando
              />
            </div>

            {/* Horário Fim */}
            <div className="mb-5">
              <label
                htmlFor="fim"
                className="block text-sm font-medium text-gray-600 mb-1"
              >
                Horário Fim <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                id="fim"
                name="fim"
                value={modalFormData.fim}
                onChange={handleModalChange}
                className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                required
                step="1800" // Intervalo de 30 minutos
                disabled={isSubmitting} // Desabilita se enviando
              />
              <p className="text-xs text-gray-500 mt-1">
                O sistema criará blocos de 30 minutos entre o início e o fim.
              </p>
            </div>

            {/* Botões de Ação */}
            <div className="flex justify-end space-x-3 border-t pt-4">
              <button
                type="button"
                onClick={closeModal}
                className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors disabled:opacity-70"
                disabled={isSubmitting} // Desabilita cancelar se enviando
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-wait transition-colors"
                disabled={isSubmitting} // Desabilita salvar se enviando
              >
                {isSubmitting ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
