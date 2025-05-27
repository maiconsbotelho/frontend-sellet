import { FaSave } from 'react-icons/fa';
import { Profissional, ExpedienteFormData } from '@/utils/types';
import { DIAS_DA_SEMANA } from '@/utils/constants';
import useHorariosEstabelecimento from '@/hooks/expediente/useHorariosEstabelecimento';

interface ModalExpedienteProps {
  isOpen: boolean;
  mode: 'add' | 'edit';
  formData: ExpedienteFormData;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  onClose: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  error: string | null;
  isSubmitting: boolean;
  profissionais: Profissional[];
}

export default function ModalExpediente({
  isOpen,
  mode,
  formData,
  onChange,
  onClose,
  onSubmit,
  error,
  isSubmitting,
  profissionais,
}: ModalExpedienteProps) {
  const {
    horarios,
    loading,
    error: horariosError,
  } = useHorariosEstabelecimento();
  console.log('Horários recebidos:', horarios);

  if (!isOpen) return null;

  return (
    <div className="absolute top-[80px] left-0 right-0 pb-[80px] bg-opacity-50 flex items-center justify-center z-20 overflow-y-auto">
      <form
        onSubmit={onSubmit}
        className="bg-white p-6 rounded shadow-lg w-full max-w-md text-black my-auto"
      >
        <h2 className="text-xl text-[var(--accent)] font-semibold mb-4">
          {mode === 'add' ? 'Adicionar ' : 'Editar '}Expediente
        </h2>

        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded relative mb-3"
            role="alert"
          >
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <input
          type="hidden"
          name="profissional"
          value={formData.profissional}
        />
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Profissional
          </label>
          <p className="text-gray-900 bg-gray-100 px-3 py-2 rounded border border-[var(--border-primary)]">
            {profissionais.find((p) => String(p.id) === formData.profissional)
              ?.nome_completo || 'N/A'}
          </p>
        </div>

        <div className="mb-4">
          <label
            htmlFor="dia_semana"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Dia da Semana <span className="text-red-500">*</span>
          </label>
          <select
            id="dia_semana"
            name="dia_semana"
            value={formData.dia_semana}
            onChange={onChange}
            className={`w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[var(--primary)] border-[var(--border-primary)] ${
              mode === 'edit' || (mode === 'add' && formData.dia_semana !== '')
                ? 'bg-gray-100 cursor-not-allowed'
                : 'bg-white text-[var(--text-secondary)]'
            }`}
            required
            disabled={
              isSubmitting ||
              mode === 'edit' ||
              (mode === 'add' && formData.dia_semana !== '')
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
          {(mode === 'edit' ||
            (mode === 'add' && formData.dia_semana !== '')) && (
            <p className="text-xs text-gray-500 mt-1">
              {mode === 'edit'
                ? 'Para alterar o dia, exclua este horário e adicione um novo.'
                : 'Dia pré-selecionado. Para escolher outro, cancele e use o botão "Adicionar Horário".'}
            </p>
          )}
        </div>

        <div className="mb-4">
          <label
            htmlFor="inicio"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Horário Início <span className="text-red-500">*</span>
          </label>
          <select
            id="inicio"
            name="inicio"
            value={formData.inicio}
            onChange={onChange}
            required
            disabled={isSubmitting || loading}
            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[var(--primary)] border-[var(--border-primary)] disabled:bg-gray-100 text-[var(--text-secondary)] bg-white"
          >
            <option value="" disabled>
              Selecione...
            </option>
            {horarios.map((h) => (
              <option
                key={typeof h === 'object' ? h.id : h}
                value={typeof h === 'object' ? h.id : h}
              >
                {typeof h === 'object' ? h.id : h}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-5">
          <label
            htmlFor="fim"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Horário Fim <span className="text-red-500">*</span>
          </label>
          <select
            id="fim"
            name="fim"
            value={formData.fim}
            onChange={onChange}
            required
            disabled={isSubmitting || loading}
            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[var(--primary)] border-[var(--border-primary)] disabled:bg-gray-100 text-[var(--text-secondary)] bg-white"
          >
            <option value="" disabled>
              Selecione...
            </option>
            {horarios.map((h) => {
              const value = typeof h === 'object' ? h.id : h;
              return (
                <option key={value} value={value}>
                  {value}
                </option>
              );
            })}
          </select>
          <p className="text-xs text-gray-500 mt-1">
            O sistema criará blocos de 30 minutos entre o início e o fim.
          </p>
        </div>

        <div className="flex justify-end space-x-2 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 disabled:opacity-50 transition-colors"
            disabled={isSubmitting}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className={`px-4 py-2 rounded text-white disabled:opacity-50 disabled:cursor-wait transition-colors flex items-center ${
              mode === 'add'
                ? 'bg-[var(--accent)] hover:bg-pink-700'
                : 'bg-[var(--accent)] hover:bg-green-700'
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              'Salvando...'
            ) : (
              <>
                <FaSave className="mr-2" />
                Salvar
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
