import { getFetcher, postFetcher } from "@/interface_ws/fetcher";
import { WS_BASE } from "@/interface_ws/ws_link";
import { useSessaoStore } from "@/data/stores/useSessaoStore";

export default function apiClient() {
  const { token } = useSessaoStore(); // Obtém o token do estado global

  function construirURL(caminho: string) {
    const uri = caminho.startsWith("/") ? caminho : `/${caminho}`;
    return `${WS_BASE}${uri}`;
  }

  function construirHeaders(authRequired: boolean) {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (authRequired && token) {
      headers["Authorization"] = `Bearer ${token}`; // Adiciona o token ao cabeçalho
    }

    return headers;
  }

  const httpGet = async (caminho: string, authRequired = true) => {
    const url = construirURL(caminho);
    const headers = construirHeaders(authRequired);
    return await getFetcher(url, { headers });
  };

  const httpPost = async (caminho: string, body: any, hasItems = false, authRequired = true) => {
    const url = construirURL(caminho);
    const headers = construirHeaders(authRequired);
    return await postFetcher(url, body, hasItems, { headers });
  };

  const httpPut = async (caminho: string, body: any, authRequired = true) => {
    const url = construirURL(caminho);
    const headers = construirHeaders(authRequired);
    const resposta = await fetch(url, {
      method: "PUT",
      headers,
      body: JSON.stringify(body),
    });

    if (!resposta.ok) {
      throw new Error(`Erro ${resposta.status} ao fazer PUT`);
    }

    return await resposta.json();
  };

  const httpDelete = async (caminho: string, authRequired = true) => {
    const url = construirURL(caminho);
    const headers = construirHeaders(authRequired);
    const resposta = await fetch(url, {
      method: "DELETE",
      headers,
    });

    if (!resposta.ok) {
      throw new Error("Erro ao deletar");
    }

    return true;
  };

  return {
    httpGet,
    httpPost,
    httpPut,
    httpDelete,
  };
}
