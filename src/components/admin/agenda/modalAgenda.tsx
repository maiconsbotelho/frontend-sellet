'use client';

import React from 'react';
import { FaTrash, FaSave } from 'react-icons/fa';
import {
  Profissional,
  Cliente,
  Servico,
  AgendamentoFormData,
} from '@/utils/types';

interface ModalAgendaProps {
  isOpen: boolean;
  mode: 'add' | 'edit';
  formData: AgendamentoFormData;
  clientes: Cliente[];
  profissionais: Profissional[];
  servicosDisponiveis: Servico[];
  error: string | null;
  loading: boolean;
  onClose: () => void;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onDelete: () => void;
  onDeleteRecorrencia?: () => void;
}

const ModalAgenda: React.FC<ModalAgendaProps> = ({
  isOpen,
  mode,
  formData,
  clientes,
  profissionais,
  servicosDisponiveis,
  error,
  loading,
  onClose,
  onChange,
  onSubmit,
  onDelete,
  onDeleteRecorrencia,
}) => {
  if (!isOpen) return null;

  return (
    <div className="absolute top-[80px] left-0 right-0 pb-[80px] bg-opacity-50 flex items-center justify-center z-20 overflow-y-auto">
      <form
        onSubmit={onSubmit}
        className="bg-white p-6 rounded shadow-lg w-full max-w-lg text-black"
      >
        <h2 className="text-xl font-semibold mb-4 text-[var(--accent)]">
          {mode === 'add' ? 'Novo Agendamento' : 'Editar Agendamento'}
        </h2>

        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded relative mb-4"
            role="alert"
          >
            <span className="block sm:inline whitespace-pre-line">{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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
              value={formData.cliente}
              onChange={onChange}
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
              value={formData.servico}
              onChange={onChange}
              required
              className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={servicosDisponiveis.length === 0}
            >
              <option value="" disabled>
                -- Selecione --
              </option>
              {servicosDisponiveis.map((s) => (
                <option key={s.id} value={String(s.id)}>
                  {s.nome}
                </option>
              ))}
            </select>
            {servicosDisponiveis.length === 0 && (
              <p className="text-xs text-red-500 mt-1">
                Nenhum serviço disponível para este profissional.
              </p>
            )}
          </div>
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
              value={formData.data}
              onChange={onChange}
              required
              className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
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
              type="time"
              value={formData.hora}
              onChange={onChange}
              required
              step="1800"
              className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="duracao_personalizada"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Duração personalizada (minutos)
            </label>
            <input
              id="duracao_personalizada"
              name="duracao_personalizada"
              type="number"
              min={10}
              step={5}
              value={formData.duracao_personalizada || ''}
              onChange={onChange}
              placeholder="Deixe em branco para usar o padrão"
              className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Profissional
            </label>
            <input
              type="text"
              value={
                profissionais.find(
                  (p) => p.id === Number(formData.profissional)
                )?.nome_completo || 'N/A'
              }
              readOnly
              className="w-full border px-3 py-2 rounded bg-gray-100 text-gray-600"
            />
            <input
              type="hidden"
              name="profissional"
              value={formData.profissional}
            />
          </div>

          <div>
            <label
              htmlFor="recorrencia"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Recorrência
            </label>
            <select
              id="recorrencia"
              name="recorrencia"
              value={formData.recorrencia || ''}
              onChange={onChange}
              className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Não repetir</option>
              <option value="1">Toda semana</option>
              <option value="2">A cada 2 semanas</option>
              <option value="4">A cada 4 semanas</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="repeticoes"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Repetir por
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  onChange({
                    target: {
                      name: 'repeticoes',
                      value: Math.max(1, Number(formData.repeticoes || 1) - 1),
                    },
                  } as any)
                }
                disabled={
                  !formData.recorrencia || Number(formData.repeticoes) <= 1
                }
                className="px-2 py-1 bg-gray-200 rounded disabled:opacity-50"
                tabIndex={-1}
              >
                -
              </button>
              <input
                id="repeticoes"
                name="repeticoes"
                type="number"
                min={1}
                max={52}
                value={formData.repeticoes || 1}
                onChange={onChange}
                disabled={!formData.recorrencia}
                className="w-16 border px-2 py-1 rounded text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() =>
                  onChange({
                    target: {
                      name: 'repeticoes',
                      value: Math.min(52, Number(formData.repeticoes || 1) + 1),
                    },
                  } as any)
                }
                disabled={
                  !formData.recorrencia || Number(formData.repeticoes) >= 52
                }
                className="px-2 py-1 bg-gray-200 rounded disabled:opacity-50"
                tabIndex={-1}
              >
                +
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-between py-12 items-center">
          {mode === 'edit' && onDelete && (
            <button
              type="button"
              onClick={onDelete}
              disabled={loading}
              className="px-4 py-2 rounded bg-red-600 text-white flex items-center hover:bg-red-700 disabled:opacity-50"
            >
              <FaTrash className="mr-2" />{' '}
              {loading ? 'Excluindo...' : 'Excluir'}
            </button>
          )}
          {mode === 'edit' && formData.recorrencia_id && (
            <button
              type="button"
              onClick={onDeleteRecorrencia}
              disabled={loading}
              className="px-4 py-2 rounded bg-red-700 text-white flex items-center hover:bg-red-800 disabled:opacity-50 ml-2"
            >
              <FaTrash className="mr-2" />
              Excluir todos desta recorrência
            </button>
          )}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded bg-[var(--accent)] text-white hover:bg-blue-700 disabled:opacity-50 flex items-center"
            >
              {loading ? (
                'Salvando...'
              ) : (
                <>
                  <FaSave className="mr-2" />
                  {mode === 'add' ? 'Agendar' : 'Salvar'}
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ModalAgenda;
