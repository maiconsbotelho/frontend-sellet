export interface SucessoChamada<T> {
  retorno: T;
  temErro: false;
}

export interface SucessoChamadaArray<T> {
  retorno: Array<T>;
  temErro: false;
}

export interface ErroChamada {
  ERRO: 1;
  MSG: string;
  temErro: true;
  aborted: boolean;
}

// --- Definições de Tipos ---
export type Profissional = {
  id: number;
  nome_completo: string;
};

export type Horario = {
  id: number;
  horario: string; // Formato HH:MM:SS do backend, exibir como HH:MM
};

export type HorarioExpediente = {
  id: number;
  profissional: number; // ID
  dia_semana: number; // 0-6
  horarios: Horario[];
  // Adicionados para conveniência de exibição após buscar/processar
  inicio?: string; // HH:MM
  fim?: string; // HH:MM
};

export type ExpedienteFormData = {
  profissional: string; // ID como string para o formulário
  dia_semana: string; // 0-6 como string para o formulário
  inicio: string; // HH:MM
  fim: string; // HH:MM
};

export type Cliente = {
  id: number;
  nome_completo: string;
};

export type Servico = {
  id: number;
  nome: string;
  profissionais?: number[]; // Array of professional IDs
};

export type AgendaSlot = {
  ocupado: boolean | null; // true = occupied, false = available, null = outside expediente
  nome_cliente?: string;
  agendamento_id?: number;
  cliente_id?: number;
  servico_id?: number;
  servico_nome?: string;
};

export type AgendaLinha = {
  horario: string;
  [data: string]: AgendaSlot | string; // horario is string, others are AgendaSlot
};

export type AgendamentoFormData = {
  id?: number;
  cliente: string; // Store ID as string for form compatibility
  profissional: string; // Store ID as string
  servico: string; // Store ID as string
  data: string; // YYYY-MM-DD
  hora: string; // HH:MM
  duracao_personalizada?: number; // Optional, in minutes
};
