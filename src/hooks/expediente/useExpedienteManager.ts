import { WS_BASE } from '@/interface_ws/ws_link';
import { useState, useEffect, useCallback } from 'react';
import useApi from '../useApi';
import useProfissionais from './useProfissionais';
import useModalExpediente from './useModalExpediente';
import { HorarioExpediente } from '@/utils/types';

export default function useExpedienteManager() {
  const {
    profissionais,
    isLoadingProfissionais,
    profissionaisError,
    selectedProfissionalId,
    handleProfissionalChange: handleProfissionalChangeFromHook,
  } = useProfissionais();

  const {
    isLoading: isLoadingExpedientesApi,
    error: expedientesApiError,
    addItem: addExpedienteApi,
    updateItem: updateExpedienteApi,
    deleteItem: deleteExpedienteApi,
    setErrorManually: setExpedientesApiErrorManually,
  } = useApi<HorarioExpediente>({
    entityName: 'Expediente',
    entityPath: '/agenda/expediente',
  });

  const [expedientes, setExpedientes] = useState<HorarioExpediente[]>([]);
  const [isLoadingCustomExpedientes, setIsLoadingCustomExpedientes] =
    useState(false);
  const [isSubmittingExpediente, setIsSubmittingExpediente] = useState(false);
  const [pageError, setPageError] = useState<string | null>(null);

  const fetchExpedientesDoProfissional = useCallback(async () => {
    if (!selectedProfissionalId) {
      setExpedientes([]);
      return;
    }
    setIsLoadingCustomExpedientes(true);
    setPageError(null);
    setExpedientesApiErrorManually(null);

    try {
      const res = await fetch(
        `${WS_BASE}/agenda/expediente/por_profissional/?profissional=${selectedProfissionalId}`
      );
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({
          message: `Erro ${res.status} ao buscar expediente.`,
        }));
        throw new Error(
          errorData.detail || errorData.message || `Erro ${res.status}`
        );
      }
      let data: HorarioExpediente[] = await res.json();
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
          const endDate = new Date(0);
          endDate.setUTCHours(hours, minutes + 30, 0, 0);
          const fim = `${String(endDate.getUTCHours()).padStart(
            2,
            '0'
          )}:${String(endDate.getUTCMinutes()).padStart(2, '0')}`;
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
      setExpedientes([]);
    } finally {
      setIsLoadingCustomExpedientes(false);
    }
  }, [selectedProfissionalId, setExpedientesApiErrorManually]);

  useEffect(() => {
    if (selectedProfissionalId) {
      fetchExpedientesDoProfissional();
    } else {
      setExpedientes([]);
    }
  }, [selectedProfissionalId, fetchExpedientesDoProfissional]);

  const handleProfissionalChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    handleProfissionalChangeFromHook(e);
    setPageError(null);
  };

  const handleDeleteExpediente = async (expedienteId: number) => {
    if (
      !window.confirm(
        'Tem certeza que deseja excluir este horário de expediente?'
      )
    )
      return;
    setPageError(null);
    setExpedientesApiErrorManually(null);
    setIsSubmittingExpediente(true);

    try {
      const success = await deleteExpedienteApi(expedienteId);
      if (success) {
        await fetchExpedientesDoProfissional();
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

  const modal = useModalExpediente({
    selectedProfissionalId,
    onSuccess: fetchExpedientesDoProfissional,
    apiFns: {
      add: addExpedienteApi,
      update: updateExpedienteApi,
      error: expedientesApiError,
    },
  });

  const combinedIsLoadingExpedientes =
    isLoadingCustomExpedientes || isLoadingExpedientesApi;
  const combinedPageError =
    pageError ||
    profissionaisError ||
    (isLoadingCustomExpedientes ? null : expedientesApiError);

  return {
    profissionais,
    selectedProfissionalId,
    isLoadingProfissionais,
    handleProfissionalChange,

    expedientes,
    isLoadingExpedientes: combinedIsLoadingExpedientes,
    isSubmittingExpediente,
    pageError: combinedPageError,
    setPageError,
    handleDeleteExpediente,
    ...modal,
  };
}
