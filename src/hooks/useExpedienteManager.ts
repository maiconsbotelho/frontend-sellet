import { useState, useEffect, useCallback } from 'react';
import useApi from './useApi';
import {
  Profissional,
  HorarioExpediente,
  ExpedienteFormData,
} from '@/utils/types'; // Ensure this path is correct

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export interface UseExpedienteManagerReturn {
  profissionais: Profissional[];
  selectedProfissionalId: string | null;
  expedientes: HorarioExpediente[];
  isLoadingProfissionais: boolean;
  isLoadingExpedientes: boolean;
  isSubmittingExpediente: boolean;
  pageError: string | null;
  setPageError: React.Dispatch<React.SetStateAction<string | null>>; // To allow component to clear page errors
  modalError: string | null;
  isModalOpen: boolean;
  modalMode: 'add' | 'edit';
  modalFormData: ExpedienteFormData;
  handleProfissionalChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  openModal: (
    mode: 'add' | 'edit',
    expediente?: HorarioExpediente,
    dayIndex?: number
  ) => void;
  closeModal: () => void;
  handleModalChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  handleModalSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  handleDeleteExpediente: (expedienteId: number) => Promise<void>;
}

export default function useExpedienteManager(): UseExpedienteManagerReturn {
  const {
    data: profissionais,
    isLoading: isLoadingProfissionais,
    error: profissionaisError,
    fetchData: fetchProfissionaisApi,
    // setErrorManually: setProfissionaisErrorManually, // Not directly used for setting, but error is read
  } = useApi<Profissional>({
    entityName: 'Profissional',
    entityPath: '/usuario/',
  });

  const {
    isLoading: isLoadingExpedientesApi, // Loading for CRUD operations on expedientes
    error: expedientesApiError,
    addItem: addExpedienteApi,
    updateItem: updateExpedienteApi,
    deleteItem: deleteExpedienteApi,
    setErrorManually: setExpedientesApiErrorManually,
  } = useApi<HorarioExpediente>({
    entityName: 'Expediente',
    entityPath: '/agenda/expediente', // Base path for expediente CRUD
  });

  const [selectedProfissionalId, setSelectedProfissionalId] = useState<
    string | null
  >(null);
  const [expedientes, setExpedientes] = useState<HorarioExpediente[]>([]);
  const [
    isLoadingCustomExpedientes, // Specific loading for fetching expedientes by professional
    setIsLoadingCustomExpedientes,
  ] = useState(false);
  const [isSubmittingExpediente, setIsSubmittingExpediente] = useState(false); // For modal submit and delete
  const [pageError, setPageError] = useState<string | null>(null); // For errors shown on the page (not in modal)

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [currentExpediente, setCurrentExpediente] = // Internal state for edit mode
    useState<HorarioExpediente | null>(null);
  const [modalFormData, setModalFormData] = useState<ExpedienteFormData>({
    profissional: '',
    dia_semana: '',
    inicio: '',
    fim: '',
  });
  const [modalError, setModalError] = useState<string | null>(null); // For errors shown in the modal

  // Fetch Profissionais on initial load
  useEffect(() => {
    fetchProfissionaisApi({ tipo: 'PROFISSIONAL' });
  }, [fetchProfissionaisApi]);

  // Set default profissional when profissionais list is loaded
  useEffect(() => {
    if (
      profissionais.length > 0 &&
      !selectedProfissionalId &&
      !profissionaisError // Only set if no error loading professionals
    ) {
      setSelectedProfissionalId(String(profissionais[0].id));
    }
  }, [profissionais, selectedProfissionalId, profissionaisError]);

  // Fetch Expedientes for the selected professional
  const fetchExpedientesDoProfissional = useCallback(async () => {
    if (!selectedProfissionalId) {
      setExpedientes([]);
      return;
    }
    setIsLoadingCustomExpedientes(true);
    setPageError(null); // Clear previous page errors before fetching
    setExpedientesApiErrorManually(null); // Clear any previous API errors from useApi for expedientes

    try {
      const res = await fetch(
        `${API_BASE_URL}/agenda/expediente/por_profissional/?profissional=${selectedProfissionalId}`
      );
      if (!res.ok) {
        const errorData = await res
          .json()
          .catch(() => ({
            message: `Erro ${res.status} ao buscar expediente.`,
          }));
        throw new Error(
          errorData.detail || errorData.message || `Erro ${res.status}`
        );
      }
      let data: HorarioExpediente[] = await res.json();

      // Process data to include 'inicio' and 'fim' for display
      data = data.map((exp) => {
        if (exp.horarios && exp.horarios.length > 0) {
          const sortedHorarios = [...exp.horarios].sort((a, b) =>
            a.horario.localeCompare(b.horario)
          );
          const inicio = sortedHorarios[0].horario.substring(0, 5);
          const lastStartTime = sortedHorarios[
            sortedHorarios.length - 1
          ].horario.substring(0, 5);
          const [hours, minutes] = lastStartTime.split(':').map(Number);
          const endDate = new Date(0); // Use a fixed date, only time matters
          endDate.setUTCHours(hours, minutes + 30, 0, 0); // Add 30 minutes
          const fimHours = String(endDate.getUTCHours()).padStart(2, '0');
          const fimMinutes = String(endDate.getUTCMinutes()).padStart(2, '0');
          const fim = `${fimHours}:${fimMinutes}`;
          return { ...exp, inicio, fim };
        }
        return exp;
      });
      setExpedientes(data);
    } catch (err: any) {
      console.error('Falha ao buscar expediente do profissional:', err);
      setPageError(
        `Falha ao buscar expediente: ${err.message || 'Erro desconhecido'}`
      );
      setExpedientes([]); // Clear expedientes on error
    } finally {
      setIsLoadingCustomExpedientes(false);
    }
  }, [selectedProfissionalId, setExpedientesApiErrorManually]);

  // Effect to fetch expedientes when selectedProfissionalId changes
  useEffect(() => {
    if (selectedProfissionalId) {
      fetchExpedientesDoProfissional();
    } else {
      setExpedientes([]); // Clear if no professional is selected
    }
  }, [selectedProfissionalId, fetchExpedientesDoProfissional]);

  // Event Handlers
  const handleProfissionalChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedProfissionalId(e.target.value);
    setPageError(null); // Clear page errors when changing professional
  };

  const openModal = (
    mode: 'add' | 'edit',
    expediente?: HorarioExpediente,
    dayIndex?: number
  ) => {
    setModalError(null); // Clear previous modal errors
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
        profissional: String(expediente.profissional), // Ensure it's a string for the form
        dia_semana: String(expediente.dia_semana),
        inicio: expediente.inicio || '',
        fim: expediente.fim || '',
      });
    } else if (mode === 'add' && !selectedProfissionalId) {
      setPageError('Por favor, selecione um profissional primeiro.');
      return; // Don't open modal
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentExpediente(null);
    setModalFormData({
      // Reset form
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
    setExpedientesApiErrorManually(null); // Clear previous API errors
    setIsSubmittingExpediente(true);

    if (
      !modalFormData.profissional ||
      modalFormData.dia_semana === '' ||
      !modalFormData.inicio ||
      !modalFormData.fim
    ) {
      setModalError('Todos os campos são obrigatórios.');
      setIsSubmittingExpediente(false);
      return;
    }
    if (modalFormData.inicio >= modalFormData.fim) {
      setModalError('O horário de início deve ser anterior ao horário de fim.');
      setIsSubmittingExpediente(false);
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
        result = await addExpedienteApi(payload);
      } else if (currentExpediente?.id) {
        result = await updateExpedienteApi(currentExpediente.id, payload);
      } else {
        throw new Error('ID do expediente não encontrado para edição.');
      }

      if (result) {
        // useApi returns the item on success, null on failure before throwing
        closeModal();
        await fetchExpedientesDoProfissional(); // Refresh list
      } else {
        // If useApi returned null but didn't throw (e.g. handled error internally and returned null)
        // or if an error occurred that useApi didn't catch as a network/status error
        throw new Error(
          expedientesApiError ||
            `Falha ao ${
              modalMode === 'add' ? 'adicionar' : 'editar'
            } expediente.`
        );
      }
    } catch (err: any) {
      console.error(`Falha ao ${modalMode} expediente:`, err);
      setModalError(`Falha: ${err.message || 'Erro desconhecido ao salvar.'}`);
    } finally {
      setIsSubmittingExpediente(false);
    }
  };

  const handleDeleteExpediente = async (expedienteId: number) => {
    if (
      !window.confirm(
        'Tem certeza que deseja excluir este horário de expediente?'
      )
    ) {
      return;
    }
    setPageError(null); // Clear previous page errors
    setExpedientesApiErrorManually(null); // Clear previous API errors
    setIsSubmittingExpediente(true);

    try {
      const success = await deleteExpedienteApi(expedienteId); // useApi returns boolean for delete
      if (success) {
        await fetchExpedientesDoProfissional(); // Refresh list
      } else {
        throw new Error(expedientesApiError || 'Falha ao excluir expediente.');
      }
    } catch (err: any) {
      console.error('Falha ao excluir expediente:', err);
      setPageError(`Falha ao excluir: ${err.message || 'Erro desconhecido.'}`);
    } finally {
      setIsSubmittingExpediente(false);
    }
  };

  // Combined loading state for expedientes (fetching list or CRUD operations)
  const combinedIsLoadingExpedientes =
    isLoadingCustomExpedientes || isLoadingExpedientesApi;
  // Combined page error
  const combinedPageError =
    pageError ||
    profissionaisError ||
    (isLoadingCustomExpedientes ? null : expedientesApiError);

  return {
    profissionais,
    selectedProfissionalId,
    expedientes,
    isLoadingProfissionais,
    isLoadingExpedientes: combinedIsLoadingExpedientes,
    isSubmittingExpediente,
    pageError: combinedPageError,
    setPageError, // Allow component to clear the pageError state if needed
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
  };
}
