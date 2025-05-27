// Em um novo arquivo, por exemplo: src/hooks/useAgenda.ts
import { useState, useEffect, useCallback, useMemo } from 'react';
import useApi from '../useApi'; // Supondo que useApi está no mesmo diretório ou ajustar o caminho
import {
  Profissional,
  Cliente,
  Servico,
  AgendaLinha,
  AgendamentoFormData,
  AgendaSlot,
} from '@/utils/types';
import { WS_BASE } from '@/interface_ws/ws_link';

export default function useAgenda() {
  // Hooks useApi para entidades primárias
  const {
    data: profissionais,
    fetchData: fetchProfissionaisApi,
    isLoading: isLoadingProfissionais,
    error: errorProfissionais,
  } = useApi<Profissional>({
    entityName: 'Profissional',
    entityPath: '/usuario',
  });
  const {
    data: clientes,
    fetchData: fetchClientesApi,
    isLoading: isLoadingClientes,
    error: errorClientes,
  } = useApi<Cliente>({ entityName: 'Cliente', entityPath: '/usuario' });
  const {
    data: servicos,
    fetchData: fetchServicosApi,
    isLoading: isLoadingServicos,
    error: errorServicos,
  } = useApi<Servico>({ entityName: 'Serviço', entityPath: '/servicos' });

  // Estado para a agenda em si (que tem uma busca mais complexa)
  const [agenda, setAgenda] = useState<AgendaLinha[]>([]);
  const [isLoadingAgenda, setIsLoadingAgenda] = useState(false);
  const [errorAgenda, setErrorAgenda] = useState<string | null>(null);

  // Estados de controle da UI que afetam a busca da agenda
  const [profissionalSelecionado, setProfissionalSelecionado] = useState<
    string | null
  >(null);
  const [dataInicial, setDataInicial] = useState(
    () => new Date().toISOString().split('T')[0]
  );
  const [dataFinal, setDataFinal] = useState(() => {
    const today = new Date();
    const nextWeek = new Date(today.setDate(today.getDate() + 6));
    return nextWeek.toISOString().split('T')[0];
  });

  // Efeitos para buscar dados iniciais
  useEffect(() => {
    fetchProfissionaisApi({ tipo: 'PROFISSIONAL' });
    fetchClientesApi({ tipo: 'CLIENTE' });
    fetchServicosApi();
  }, [fetchProfissionaisApi, fetchClientesApi, fetchServicosApi]);

  // Lógica para setar profissional padrão (ex: Fernanda Telles)
  useEffect(() => {
    if (profissionais.length > 0 && profissionalSelecionado === null) {
      const PROFISSIONAL_PADRAO = 'fernanda telles';
      const fernanda = profissionais.find((p) =>
        p.nome_completo.toLowerCase().includes(PROFISSIONAL_PADRAO)
      );
      if (fernanda) {
        setProfissionalSelecionado(fernanda.id.toString());
      }
    }
  }, [profissionais, profissionalSelecionado]);

  // Função para buscar os dados da agenda
  const fetchAgendaData = useCallback(async () => {
    if (!profissionalSelecionado) {
      setAgenda([]);
      return;
    }
    setIsLoadingAgenda(true);
    setErrorAgenda(null);
    try {
      const response = await fetch(
        `${WS_BASE}/agenda/agendamentos/agenda/?profissional=${profissionalSelecionado}&data_inicial=${dataInicial}&data_final=${dataFinal}`
      );
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          `Network response was not ok (${response.status}) - ${JSON.stringify(
            errorData
          )}`
        );
      }
      const data = await response.json();
      setAgenda(Array.isArray(data) ? data : []);
    } catch (error: any) {
      console.error('Erro ao buscar a agenda:', error);
      setErrorAgenda(error.message || 'Erro ao buscar agenda.');
      setAgenda([]);
    } finally {
      setIsLoadingAgenda(false);
    }
  }, [profissionalSelecionado, dataInicial, dataFinal]);

  useEffect(() => {
    fetchAgendaData();
  }, [fetchAgendaData]);

  // Funções para CRUD de agendamentos (poderiam usar uma instância de useApi específica para agendamentos)
  // Exemplo simplificado, você pode adaptar para usar useApi para '/agenda/agendamentos/'
  const addAgendamento = async (
    payload: Omit<AgendamentoFormData, 'id'>
  ): Promise<boolean> => {
    // setLoadingModal(true); setErrorModal(null);
    try {
      const response = await fetch(`${WS_BASE}/agenda/agendamentos/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        /* ... tratamento de erro ... */ throw new Error('Falha ao criar');
      }
      await fetchAgendaData(); // Rebuscar agenda
      return true;
    } catch (error) {
      /* ... setErrorModal ... */ return false;
    }
    // finally { setLoadingModal(false); }
  };

  const updateAgendamento = async (
    id: number,
    payload: Omit<AgendamentoFormData, 'id'>
  ): Promise<boolean> => {
    // ... lógica similar ao add ...
    try {
      const response = await fetch(`${WS_BASE}/agenda/agendamentos/${id}/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        /* ... tratamento de erro ... */ throw new Error('Falha ao atualizar');
      }
      await fetchAgendaData();
      return true;
    } catch (error) {
      return false;
    }
  };

  const deleteAgendamento = async (id: number): Promise<boolean> => {
    // ... lógica similar ...
    try {
      const response = await fetch(`${WS_BASE}/agenda/agendamentos/${id}/`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!response.ok && response.status !== 204) {
        /* ... */ throw new Error('Falha ao excluir');
      }
      await fetchAgendaData();
      return true;
    } catch (error) {
      return false;
    }
  };

  // Derivar serviços disponíveis (exemplo de lógica que iria para o hook)
  const servicosDisponiveisParaProfissional = useMemo(() => {
    if (!profissionalSelecionado) return [];
    const profIdNumber = parseInt(profissionalSelecionado, 10);
    if (isNaN(profIdNumber)) return [];
    return servicos.filter(
      (s) =>
        Array.isArray(s.profissionais) && s.profissionais.includes(profIdNumber)
    );
  }, [profissionalSelecionado, servicos]);

  return {
    profissionais,
    isLoadingProfissionais,
    errorProfissionais,
    clientes,
    isLoadingClientes,
    errorClientes,
    servicos, // Todos os serviços
    isLoadingServicos,
    errorServicos,
    agenda,
    isLoadingAgenda,
    errorAgenda,
    profissionalSelecionado,
    setProfissionalSelecionado, // Para o select no componente Agenda
    dataInicial,
    setDataInicial, // Para os inputs de data
    dataFinal,
    setDataFinal, // Para os inputs de data
    fetchAgendaData, // Se precisar de um refresh manual
    addAgendamento,
    updateAgendamento,
    deleteAgendamento,
    servicosDisponiveisParaProfissional, // Passar para o ModalAgenda
    // ... quaisquer outros estados ou funções que o componente Agenda precise
  };
}
