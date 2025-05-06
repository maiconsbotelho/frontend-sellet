// utils/fetcher.ts
import { isJson } from '@/utils/helpers';

export const getFetcher = async (url: string, requestConfigs?: RequestInit) => {
  try {
    const response = await fetch(url, {
      method: 'GET',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
      headers: {
        'Content-Type': 'application/json',
        ...(requestConfigs?.headers || {}),
      },
      ...requestConfigs,
    });

    let resultadoTexto = await response.text();
    resultadoTexto = resultadoTexto.replace(/(\r\n|\n|\r)/gm, '');

    if (!isJson(resultadoTexto)) {
      throw new Error('Erro interno no servidor!');
    }

    const json = JSON.parse(resultadoTexto);

    if (json.ERRO > 0) {
      throw new Error(json.MSG);
    }

    return { ...json, temErro: false };
  } catch (e: any) {
    const { signal } = requestConfigs || {};
    const aborted = (signal || {}).aborted;
    return { temErro: true, MSG: e.message, aborted: aborted === true };
  }
};

export const postFetcher = async (
  url: string,
  body: any,
  hasItems: boolean,
  requestConfigs?: RequestInit
) => {
  try {
    const response = await fetch(url, {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
      headers: {
        'Content-Type': 'application/json',
        ...(requestConfigs?.headers || {}),
      },
      body: JSON.stringify(body),
      ...requestConfigs,
    });

    let resultadoTexto = await response.text();
    resultadoTexto = resultadoTexto.replace(/(\r\n|\n|\r)/gm, '');

    if (resultadoTexto === '') {
      return { temErro: false };
    }

    if (!isJson(resultadoTexto)) {
      throw new Error('Erro interno no servidor!');
    }

    const json = JSON.parse(resultadoTexto);

    if (json.ERRO === 1 || json.temErro === true) {
      console.log(json);
      throw new Error('Erro! Favor tente novamente.');
    }

    if (hasItems) {
      return { items: json, temErro: false };
    }

    return { ...json, temErro: false, ERRO: 0 };
  } catch (e: any) {
    return { temErro: true, mensagem: e.message };
  }
};
