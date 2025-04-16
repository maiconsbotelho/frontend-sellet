import apiClient from "@/interface_ws/apiClient";

const { httpGet, httpPost, httpPut, httpDelete } = apiClient();

export const agendamentoAPI = {
  async getAgendamentos() {
    return await httpGet("/agendamentos");
  },

  async getAgendamentoById(id: string) {
    return await httpGet(`/agendamentos/${id}`);
  },

  async addAgendamento(agendamento: any) {
    return await httpPost("/agendamentos", agendamento);
  },

  async editAgendamento(id: string, agendamentoAtualizado: any) {
    return await httpPut(`/agendamentos/${id}`, agendamentoAtualizado);
  },

  async deleteAgendamento(id: string) {
    return await httpDelete(`/agendamentos/${id}`);
  },
};
