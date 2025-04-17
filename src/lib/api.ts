// lib/api.ts
import axios from 'axios';

const API_BASE = 'https://api-mock.maiconbotelho.com.br/api';

export async function fetchAgendamentos(token: string) {
  const res = await axios.get(`${API_BASE}/agendamento`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

export async function criarAgendamento(token: string, dados: any) {
  const res = await axios.post(`${API_BASE}/agendamento`, dados, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

export async function editarAgendamento(token: string, id: number, dados: any) {
  const res = await axios.put(`${API_BASE}/agendamento/${id}`, dados, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

export async function excluirAgendamento(token: string, id: number) {
  const res = await axios.delete(`${API_BASE}/agendamento/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}
