'use client';

import { FaClock, FaEdit, FaPlus, FaTrash } from 'react-icons/fa';
import ModalExpediente from './modalExpediente';
import { DIAS_DA_SEMANA } from '@/utils/constants';
import { HorarioExpediente } from '@/utils/types'; // Profissional and ExpedienteFormData are handled by the hook or Modal
import useExpedienteManager from '@/hooks/expediente/useExpedienteManager';

export default function ExpedientePage() {
  const {
    profissionais,
    selectedProfissionalId,
    expedientes,
    isLoadingProfissionais,
    isLoadingExpedientes,
    isSubmittingExpediente,
    pageError,
    setPageError, // To allow closing the error message
    modalError,
    isModalOpen,
    modalMode,
    modalFormData,
    handleProfissionalChange,
    openModal,
    closeModal,
    handleModalChange,
    handleModalSubmit,
    handleDeleteExpediente,
  } = useExpedienteManager();

  const renderExpedientes = () => {
    if (
      isLoadingProfissionais &&
      profissionais.length === 0 &&
      !selectedProfissionalId
    ) {
      return (
        <div className="text-center py-10 text-gray-500">
          Carregando profissionais...
        </div>
      );
    }
    if (isLoadingExpedientes && selectedProfissionalId) {
      return (
        <div className="text-center py-10 text-gray-500">
          Carregando expediente...
        </div>
      );
    }

    if (!selectedProfissionalId && !isLoadingProfissionais) {
      return (
        <div className="text-center py-10 text-gray-500">
          {profissionais.length === 0
            ? 'Nenhum profissional encontrado.'
            : 'Selecione um profissional para ver ou adicionar expediente.'}
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
      const isClickable =
        !hasExpediente &&
        selectedProfissionalId &&
        !isLoadingExpedientes &&
        !isSubmittingExpediente;

      return (
        <div
          key={index}
          className={`p-3 border rounded bg-[var(--secondary)] border-[var(--primary)] transition-colors duration-150 ${
            isClickable ? 'cursor-pointer hover:bg-pink-100' : ''
          } ${isSubmittingExpediente ? 'opacity-70' : ''}`}
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
          aria-disabled={isSubmittingExpediente}
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
                      disabled={isLoadingExpedientes || isSubmittingExpediente}
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteExpediente(exp.id);
                      }}
                      className="text-gray-400 hover:text-red-800 p-1 disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-label={`Excluir horário ${exp.inicio}-${exp.fim} de ${diaNome}`}
                      disabled={isLoadingExpedientes || isSubmittingExpediente}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex items-center justify-center text-sm text-gray-500 italic h-10">
              {!isLoadingExpedientes && selectedProfissionalId && (
                <>
                  <FaPlus className="mr-2" /> Clique para adicionar horário
                </>
              )}
              {/* Mensagem de "Selecione um profissional" é tratada acima */}
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <div className="p-6 pb-44  w-screen">
      {/* Exibição de Erro Geral */}
      {pageError && !isModalOpen && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
          role="alert"
        >
          <span className="block sm:inline">{pageError}</span>
          <button
            onClick={() => setPageError(null)}
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
            disabled={
              isLoadingProfissionais ||
              isSubmittingExpediente ||
              profissionais.length === 0
            }
          >
            <option value="" disabled>
              {isLoadingProfissionais && profissionais.length === 0
                ? 'Carregando...'
                : 'Selecione...'}
            </option>
            {profissionais.map((p) => (
              <option key={p.id} value={String(p.id)}>
                {' '}
                {/* Ensure value is string */}
                {p.nome_completo}
              </option>
            ))}
          </select>
          {profissionais.length === 0 &&
            !isLoadingProfissionais &&
            !pageError && ( // Don't show if there's a general page error
              <p className="text-xs text-red-500 mt-1">
                Nenhum profissional encontrado.
              </p>
            )}
        </div>
        {/* Add Button */}
        <button
          onClick={() => openModal('add')}
          disabled={
            !selectedProfissionalId ||
            isLoadingProfissionais ||
            isLoadingExpedientes ||
            isSubmittingExpediente
          }
          className="flex-shrink-0 bg-[var(--accent)] text-white px-4 py-2 rounded flex items-center justify-center hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 ease-in-out"
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
        isSubmitting={isSubmittingExpediente}
        profissionais={profissionais} // Passa a lista de profissionais para o modal
      />
    </div>
  );
}
