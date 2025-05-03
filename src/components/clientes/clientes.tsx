'use client';

import React, { useState, useEffect } from 'react';
import { FaEdit, FaPlus, FaTrash } from 'react-icons/fa';

// Define a type for the client object for better type safety
type Client = {
  id: number;
  nome_completo: string;
  email: string;
};

// Define the base URL for your API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
export default function ClientesPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [filtered, setFiltered] = useState<Client[]>([]);
  const [search, setSearch] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [current, setCurrent] = useState<Client | null>(null);
  const [form, setForm] = useState({
    email: '',
    nome_completo: '',
    password: '',
  });
  const [error, setError] = useState<string | null>(null); // State for error messages

  useEffect(() => {
    fetchClients();
  }, []);

  useEffect(() => {
    setFiltered(
      clients.filter((c) =>
        c.nome_completo.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, clients]);

  const fetchClients = async () => {
    setError(null); // Clear previous errors
    try {
      // Use the full API URL
      const res = await fetch(`${API_BASE_URL}/usuario/?tipo=CLIENTE`);
      if (!res.ok) {
        // Try to get more specific error from backend response
        let errorMsg = `HTTP error! status: ${res.status}`;
        try {
          const errorData = await res.json();
          errorMsg += ` - ${JSON.stringify(errorData)}`;
        } catch (jsonError) {
          // Backend didn't return JSON or it was unparseable
          errorMsg += ` - ${await res
            .text()
            .catch(() => 'Could not read response text')}`;
        }
        throw new Error(errorMsg);
      }
      const data = await res.json();
      setClients(data);
    } catch (err: any) {
      // Catch any type for error object
      console.error('Failed to fetch clients:', err);
      setError(
        `Falha ao buscar clientes: ${err.message || 'Erro desconhecido'}`
      ); // Set more specific error message
    }
  };

  const openAdd = () => {
    setForm({ email: '', nome_completo: '', password: '' });
    setError(null);
    setIsAddOpen(true);
  };
  const openEdit = (c: Client) => {
    setCurrent(c);
    setForm({ email: c.email, nome_completo: c.nome_completo, password: '' });
    setError(null);
    setIsEditOpen(true);
  };
  const closeModals = () => {
    setIsAddOpen(false);
    setIsEditOpen(false);
    setCurrent(null);
    setError(null); // Clear errors when closing modals
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    try {
      // Use the full API URL
      const res = await fetch(`${API_BASE_URL}/usuario/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, tipo: 'CLIENTE' }),
      });
      if (!res.ok) {
        const errorData = await res
          .json()
          .catch(() => ({ message: 'Could not parse error JSON' }));
        throw new Error(
          `HTTP error! status: ${res.status} - ${JSON.stringify(errorData)}`
        );
      }
      await fetchClients(); // Fetch updated list
      closeModals(); // Close modal on success
    } catch (err: any) {
      console.error('Failed to add client:', err);
      setError(
        `Falha ao adicionar cliente: ${err.message || 'Erro desconhecido'}`
      ); // Set error message
    }
  };

  const handleEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!current) return; // Check if current client is set
    setError(null);
    try {
      // Use the full API URL
      const res = await fetch(`${API_BASE_URL}/usuario/${current.id}/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: form.email,
          nome_completo: form.nome_completo,
          tipo: 'CLIENTE', // Ensure type is sent if required by backend for PUT
        }),
      });
      if (!res.ok) {
        const errorData = await res
          .json()
          .catch(() => ({ message: 'Could not parse error JSON' }));
        throw new Error(
          `HTTP error! status: ${res.status} - ${JSON.stringify(errorData)}`
        );
      }
      await fetchClients(); // Fetch updated list
      closeModals(); // Close modal on success
    } catch (err: any) {
      console.error('Failed to edit client:', err);
      setError(
        `Falha ao editar cliente: ${err.message || 'Erro desconhecido'}`
      ); // Set error message
    }
  };

  const handleDelete = async () => {
    if (!current) return; // Check if current client is set

    // Add confirmation dialog
    if (
      !window.confirm(
        `Tem certeza que deseja excluir o cliente "${current.nome_completo}"?`
      )
    ) {
      return; // Stop if user cancels
    }

    setError(null);
    try {
      // Use the full API URL
      const res = await fetch(`${API_BASE_URL}/usuario/${current.id}/`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        // Handle cases where DELETE might return content (like 204 No Content is ok)
        if (res.status !== 204) {
          const errorData = await res
            .json()
            .catch(() => ({ message: 'Could not parse error JSON' }));
          throw new Error(
            `HTTP error! status: ${res.status} - ${JSON.stringify(errorData)}`
          );
        }
      }
      await fetchClients(); // Fetch updated list
      closeModals(); // Close modal on success
    } catch (err: any) {
      console.error('Failed to delete client:', err);
      // Keep the modal open to show the error
      setError(
        `Falha ao excluir cliente: ${err.message || 'Erro desconhecido'}`
      );
    }
  };

  return (
    <div className="p-6 w-screen ">
      <div className="flex justify-between mb-4">
        <input
          type="text"
          placeholder="Pesquisar clientes..."
          className="border px-3 py-2 flex-grow mr-4 text-[var(--text-secondary)] bg-white border-[var(--border-primary)] rounded-md"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          onClick={openAdd}
          className="bg-[var(--accent)] text-white px-4 py-2 rounded flex items-center "
        >
          <FaPlus className="mr-2" /> ADD
        </button>
      </div>

      {/* Display general errors */}
      {error && !isAddOpen && !isEditOpen && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
          role="alert"
        >
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <ul className="space-y-2">
        {filtered.length > 0 ? (
          filtered.map((c) => (
            <li
              key={c.id}
              className="flex justify-between items-center bg-[var(--secondary)] border p-3 rounded border-[var(--primary)] "
            >
              <div>
                <span className="font-medium">{c.nome_completo}</span>
                <span className="text-sm text-gray-500 block">{c.email}</span>
              </div>
              <button
                onClick={() => openEdit(c)}
                className="text-[var(--accent)]  p-1"
                aria-label={`Editar ${c.nome_completo}`}
              >
                <FaEdit />
              </button>
            </li>
          ))
        ) : (
          <li className="text-center text-gray-500 py-4">
            Nenhum cliente encontrado.
          </li>
        )}
      </ul>

      {/* ADD MODAL */}
      {isAddOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <form
            onSubmit={handleAdd}
            className="bg-white p-6 rounded shadow-lg w-full max-w-md text-black" // Responsive width
          >
            <h2 className="text-xl font-semibold mb-4">Novo Cliente</h2>
            {/* Display modal-specific errors */}
            {error && (
              <div
                className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded relative mb-3"
                role="alert"
              >
                <span className="block sm:inline">{error}</span>
              </div>
            )}
            <input
              name="email"
              type="email"
              placeholder="E-mail"
              value={form.email}
              onChange={handleChange}
              className="w-full border px-3 py-2 mb-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              name="nome_completo"
              type="text"
              placeholder="Nome Completo"
              value={form.nome_completo}
              onChange={handleChange}
              className="w-full border px-3 py-2 mb-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              name="password"
              type="password"
              placeholder="Senha"
              value={form.password}
              onChange={handleChange}
              className="w-full border px-3 py-2 mb-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={closeModals}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
              >
                Salvar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* EDIT MODAL */}
      {isEditOpen &&
        current && ( // Ensure current is not null before rendering
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <form
              onSubmit={handleEdit}
              className="bg-white p-6 rounded shadow-lg w-full max-w-md" // Responsive width
            >
              <h2 className="text-xl font-semibold mb-4">Editar Cliente</h2>
              {/* Display modal-specific errors */}
              {error && (
                <div
                  className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded relative mb-3"
                  role="alert"
                >
                  <span className="block sm:inline">{error}</span>
                </div>
              )}
              <input
                name="email"
                type="email"
                placeholder="E-mail"
                value={form.email}
                onChange={handleChange}
                className="w-full border px-3 py-2 mb-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                name="nome_completo"
                type="text"
                placeholder="Nome Completo"
                value={form.nome_completo}
                onChange={handleChange}
                className="w-full border px-3 py-2 mb-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              {/* Password change could be added here if needed */}
              {/* <input name="password" type="password" ... /> */}

              <div className="flex justify-between items-center">
                {/* Delete Button */}
                <button
                  type="button"
                  onClick={handleDelete}
                  className="px-4 py-2 rounded bg-red-600 text-white flex items-center hover:bg-red-700"
                >
                  <FaTrash className="mr-2" /> Excluir
                </button>
                {/* Action Buttons */}
                <div className="space-x-2">
                  <button
                    type="button"
                    onClick={closeModals}
                    className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
                  >
                    Salvar
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}
    </div>
  );
}
