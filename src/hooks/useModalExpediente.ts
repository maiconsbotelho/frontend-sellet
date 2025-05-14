import { useState } from 'react';
import { HorarioExpediente, ExpedienteFormData } from '@/utils/types';

interface UseModalExpedienteProps {
  selectedProfissionalId: string | null;
  onSuccess: () => Promise<void>;
  apiFns: {
    add: (data: any) => Promise<any>;
    update: (id: number, data: any) => Promise<any>;
    error: string | null;
  };
}

export default function useModalExpediente({
  selectedProfissionalId,
  onSuccess,
  apiFns,
}: UseModalExpedienteProps) {
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
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    } else if (mode === 'add' && !selectedProfissionalId) {
      setModalError('Por favor, selecione um profissional primeiro.');
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

    const payload = {
      profissional: parseInt(modalFormData.profissional, 10),
      dia_semana: parseInt(modalFormData.dia_semana, 10),
      inicio: modalFormData.inicio,
      fim: modalFormData.fim,
    };

    try {
      let result = null;
      if (modalMode === 'add') {
        result = await apiFns.add(payload);
      } else if (currentExpediente?.id) {
        result = await apiFns.update(currentExpediente.id, payload);
      } else {
        throw new Error('ID do expediente não encontrado para edição.');
      }

      if (result) {
        closeModal();
        await onSuccess();
      } else {
        throw new Error(
          apiFns.error ||
            `Falha ao ${
              modalMode === 'add' ? 'adicionar' : 'editar'
            } expediente.`
        );
      }
    } catch (err: any) {
      console.error(`Erro ao ${modalMode} expediente:`, err);
      setModalError(err.message || 'Erro desconhecido ao salvar.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isModalOpen,
    modalMode,
    modalFormData,
    modalError,
    isSubmitting,
    openModal,
    closeModal,
    handleModalChange,
    handleModalSubmit,
  };
}
