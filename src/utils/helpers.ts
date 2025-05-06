import { NextRouter } from "next/router";
import React, { SetStateAction } from "react";
import { toast } from "react-toastify";

export const formataDinheiro = (valor: number) => {
  return Intl.NumberFormat("pt-br", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(valor);
};

export const formataData = (data: string) => {
  return `${data.slice(8, 10)}/${data.slice(5, 7)}/${data.slice(0, 4)}`;
};

export const mudarOrdem = (
  coluna: any,
  ordemLista: { coluna: typeof coluna; ordem: "crescente" | "decrescente" },
  setOrdemLista: React.Dispatch<SetStateAction<{ coluna: typeof coluna; ordem: "crescente" | "decrescente" }>>
) => {
  if (coluna == ordemLista.coluna) {
    if (ordemLista.ordem == "crescente") {
      setOrdemLista({ ...ordemLista, ordem: "decrescente" });
    } else {
      setOrdemLista({ ...ordemLista, ordem: "crescente" });
    }
  } else {
    setOrdemLista({ coluna: coluna, ordem: "crescente" });
  }
};

export function isJson(str: string): boolean {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}

export const expirarLogin = (router: NextRouter) => {
  toast["error"]("Login expirado.", {
    toastId: "loginExpirado",
  });
  localStorage.clear();
  router.replace("/login");
};
