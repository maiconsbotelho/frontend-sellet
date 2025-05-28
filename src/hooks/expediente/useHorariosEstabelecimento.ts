import useApi from '@/hooks/useApi';
import { useEffect } from 'react';

export default function useHorariosEstabelecimento() {
  const {
    data: horarios,
    isLoading: loading,
    error,
    fetchData,
  } = useApi<{ id: string }>({
    entityName: 'Horário',
    entityPath: '/agenda/horarios-estabelecimento',
    initialData: [],
  });

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { horarios, loading, error };
}
