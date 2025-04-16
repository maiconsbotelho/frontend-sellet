import apiClient from "@/interface_ws/apiClient";

const { httpGet, httpPost, httpPut, httpDelete } = apiClient();

export const usuarioAPI = {
  async login(credenciais: { email: string; password: string }) {
    return await httpPost("/auth/login", credenciais);
  },

  async getUsuarios() {
    return await httpGet("/usuarios");
  },

  async getUsuarioById(id: string) {
    return await httpGet(`/usuarios/${id}`);
  },

  async addUsuario(usuario: any) {
    return await httpPost("/usuarios", usuario);
  },

  async editUsuario(id: string, usuarioAtualizado: any) {
    return await httpPut(`/usuarios/${id}`, usuarioAtualizado);
  },

  async deleteUsuario(id: string) {
    return await httpDelete(`/usuarios/${id}`);
  },
};
