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
