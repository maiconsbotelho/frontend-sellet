import { useState, useEffect, useCallback } from 'react';
import useApi from '@/hooks/useApi';
import { Profissional } from '@/utils/types';

export interface UseProfissionaisReturn {
  profissionais: Profissional[];
  isLoadingProfissionais: boolean;
  profissionaisError: string | null;
  selectedProfissionalId: string | null;
  setSelectedProfissionalId: React.Dispatch<
    React.SetStateAction<string | null>
  >;
  handleProfissionalChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  fetchProfissionais: () => Promise<void>;
}

export default function useProfissionais(): UseProfissionaisReturn {
  const {
    data: profissionais,
    isLoading: isLoadingProfissionais,
    error: profissionaisError,
    fetchData: fetchProfissionaisApi,
  } = useApi<Profissional>({
    entityName: 'Profissional',
    entityPath: '/usuario/',
  });

  const [selectedProfissionalId, setSelectedProfissionalId] = useState<
    string | null
  >(null);

  const fetchProfissionais = useCallback(async () => {
    await fetchProfissionaisApi({ tipo: 'PROFISSIONAL' });
  }, [fetchProfissionaisApi]);

  // Fetch Profissionais na montagem inicial
  useEffect(() => {
    fetchProfissionais();
  }, [fetchProfissionais]);

  // Define o profissional padrão quando a lista de profissionais é carregada
  useEffect(() => {
    if (
      profissionais.length > 0 &&
      !selectedProfissionalId &&
      !profissionaisError
    ) {
      setSelectedProfissionalId(String(profissionais[0].id));
    }
  }, [profissionais, selectedProfissionalId, profissionaisError]);

  const handleProfissionalChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedProfissionalId(e.target.value);
  };

  return {
    profissionais,
    isLoadingProfissionais,
    profissionaisError,
    selectedProfissionalId,
    setSelectedProfissionalId,
    handleProfissionalChange,
    fetchProfissionais,
  };
}
