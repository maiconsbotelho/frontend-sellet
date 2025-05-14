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
