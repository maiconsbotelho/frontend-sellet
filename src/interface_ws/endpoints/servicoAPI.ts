import apiClient from "@/interface_ws/apiClient";

const { httpGet, httpPost, httpPut, httpDelete } = apiClient();

export const servicoAPI = {
  async getServicos() {
    return await httpGet("/servicos");
  },

  async getServicoById(id: string) {
    return await httpGet(`/servicos/${id}`);
  },

  async addServico(servico: any) {
    return await httpPost("/servicos", servico);
  },

  async editServico(id: string, servicoAtualizado: any) {
    return await httpPut(`/servicos/${id}`, servicoAtualizado);
  },

  async deleteServico(id: string) {
    return await httpDelete(`/servicos/${id}`);
  },
};
