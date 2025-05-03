'use client';

import React, { useState, useEffect } from 'react';
import { FaEdit, FaPlus, FaTrash } from 'react-icons/fa'; // Import icons

// Define a type for the professional object
type Profissional = {
  id: number;
  nome_completo: string;
  email: string;
};

// Define the base URL for your API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function ProfissionaisPage() {
  const [professionals, setProfessionals] = useState<Profissional[]>([]);
  const [filteredProfessionals, setFilteredProfessionals] = useState<
    Profissional[]
  >([]);
  const [search, setSearch] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [currentProfessional, setCurrentProfessional] =
    useState<Profissional | null>(null);
  const [form, setForm] = useState({
    email: '',
    nome_completo: '',
    password: '', // Password only needed for adding
  });
  const [error, setError] = useState<string | null>(null); // State for error messages
  const [isLoading, setIsLoading] = useState(true); // Loading state for initial fetch and actions

  useEffect(() => {
    fetchProfessionals();
  }, []);

  useEffect(() => {
    setFilteredProfessionals(
      professionals.filter((p) =>
        p.nome_completo.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, professionals]);

  const fetchProfessionals = async () => {
    setIsLoading(true);
    setError(null); // Clear previous errors
    try {
      const res = await fetch(`${API_BASE_URL}/usuario/?tipo=PROFISSIONAL`);
      if (!res.ok) {
        // Try to get more specific error from backend response
        let errorMsg = `HTTP error! status: ${res.status}`;
        try {
          const errorData = await res.json();
          errorMsg += ` - ${JSON.stringify(errorData)}`;
        } catch (jsonError) {
          errorMsg += ` - ${await res
            .text()
            .catch(() => 'Could not read response text')}`;
        }
        throw new Error(errorMsg);
      }
      const data = await res.json();
      setProfessionals(data);
      setFilteredProfessionals(data); // Initialize filtered list
    } catch (err: any) {
      console.error('Failed to fetch professionals:', err);
      setError(
        `Falha ao buscar profissionais: ${err.message || 'Erro desconhecido'}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const openAddModal = () => {
    setForm({ email: '', nome_completo: '', password: '' });
    setError(null);
    setCurrentProfessional(null); // Ensure no professional is selected
    setIsAddOpen(true);
    setIsEditOpen(false); // Ensure edit modal is closed
  };

  const openEditModal = (professional: Profissional) => {
    setCurrentProfessional(professional);
    // Password is not needed/fetched for editing, keep it empty
    setForm({
      email: professional.email,
      nome_completo: professional.nome_completo,
      password: '',
    });
    setError(null);
    setIsEditOpen(true);
    setIsAddOpen(false); // Ensure add modal is closed
  };

  const closeModals = () => {
    setIsAddOpen(false);
    setIsEditOpen(false);
    setCurrentProfessional(null);
    setError(null); // Clear errors when closing modals
    setForm({ email: '', nome_completo: '', password: '' }); // Reset form
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleAddProfessional = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    // Basic validation
    if (!form.email || !form.nome_completo || !form.password) {
      setError('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    setIsLoading(true); // Indicate loading state for the action
    try {
      const res = await fetch(`${API_BASE_URL}/usuario/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, tipo: 'PROFISSIONAL' }), // Set type explicitly
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({})); // Try to parse error response
        throw new Error(
          `HTTP error! status: ${res.status} - ${JSON.stringify(errorData)}`
        );
      }
      await fetchProfessionals(); // Fetch updated list
      closeModals(); // Close modal on success
    } catch (err: any) {
      console.error('Failed to add professional:', err);
      setError(
        `Falha ao adicionar profissional: ${err.message || 'Erro desconhecido'}`
      );
    } finally {
      setIsLoading(false); // Action finished
    }
  };

  const handleEditProfessional = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    if (!currentProfessional) return;
    setError(null);

    // Basic validation
    if (!form.email || !form.nome_completo) {
      setError('Por favor, preencha nome e email.');
      return;
    }

    setIsLoading(true); // Indicate loading state for the action

    // Prepare payload - exclude password
    const payload = {
      email: form.email,
      nome_completo: form.nome_completo,
      tipo: 'PROFISSIONAL', // Ensure type is maintained
    };

    try {
      const res = await fetch(
        `${API_BASE_URL}/usuario/${currentProfessional.id}/`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      );
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({})); // Try to parse error response
        throw new Error(
          `HTTP error! status: ${res.status} - ${JSON.stringify(errorData)}`
        );
      }
      await fetchProfessionals(); // Fetch updated list
      closeModals(); // Close modal on success
    } catch (err: any) {
      console.error('Failed to edit professional:', err);
      setError(
        `Falha ao editar profissional: ${err.message || 'Erro desconhecido'}`
      );
    } finally {
      setIsLoading(false); // Action finished
    }
  };

  const handleDeleteProfessional = async () => {
    // Now called without argument, uses currentProfessional from state
    if (!currentProfessional) return;

    if (
      !window.confirm(
        `Tem certeza que deseja excluir o profissional "${currentProfessional.nome_completo}"?`
      )
    ) {
      return; // Stop if user cancels
    }

    setError(null);
    setIsLoading(true); // Indicate loading state for the action
    try {
      const res = await fetch(
        `${API_BASE_URL}/usuario/${currentProfessional.id}/`,
        {
          method: 'DELETE',
        }
      );
      if (!res.ok && res.status !== 204) {
        // Handle cases where DELETE might return content (like 204 No Content is ok)
        const errorData = await res
          .json()
          .catch(() => ({ message: 'Could not parse error JSON' }));
        throw new Error(
          `HTTP error! status: ${res.status} - ${JSON.stringify(errorData)}`
        );
      }
      await fetchProfessionals(); // Fetch updated list
      closeModals(); // Close the edit modal after deletion
    } catch (err: any) {
      console.error('Failed to delete professional:', err);
      // Keep the modal open to show the error
      setError(
        `Falha ao excluir profissional: ${err.message || 'Erro desconhecido'}`
      );
    } finally {
      setIsLoading(false); // Action finished
    }
  };

  return (
    // Adjusted main container padding
    <div className="p-6 w-screen">
      {/* Search and Add Button - Adjusted styles */}
      <div className="flex justify-between mb-4">
        <input
          type="text"
          placeholder="Pesquisar profissionais..."
          className="border px-3 py-2 flex-grow mr-4 text-[var(--text-secondary)] bg-white border-[var(--border-primary)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          disabled={isLoading && professionals.length === 0} // Disable search only during initial load
        />
        <button
          onClick={openAddModal}
          className="bg-[var(--accent)] text-white px-4 py-2 rounded flex items-center hover:bg-pink-700 transition duration-150 ease-in-out disabled:opacity-50"
          disabled={isLoading} // Disable button during any loading state
          aria-label="Adicionar novo profissional"
        >
          <FaPlus className="mr-2" /> ADD
        </button>
      </div>

      {/* General Error Display - Adjusted style */}
      {error && !isAddOpen && !isEditOpen && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
          role="alert"
        >
          <span className="block sm:inline">{error}</span>
          <button
            onClick={() => setError(null)}
            className="absolute top-0 bottom-0 right-0 px-4 py-3"
            aria-label="Fechar erro"
          >
            <span className="text-xl">×</span>
          </button>
        </div>
      )}

      {/* Loading Indicator - Simplified */}
      {isLoading && professionals.length === 0 && (
        <div className="text-center py-4 text-gray-500">Carregando...</div>
      )}

      {/* Professionals List - Replaced table with ul */}
      {!isLoading && filteredProfessionals.length === 0 && !error && (
        <div className="text-center text-gray-500 py-4">
          {search
            ? `Nenhum profissional encontrado para "${search}".`
            : 'Nenhum profissional cadastrado.'}
        </div>
      )}

      {!error && filteredProfessionals.length > 0 && (
        <ul className="space-y-2">
          {filteredProfessionals.map((p) => (
            <li
              key={p.id}
              className="flex justify-between items-center bg-[var(--secondary)] border p-3 rounded border-[var(--primary)] "
            >
              <div>
                <span className="font-medium text-gray-900">
                  {p.nome_completo}
                </span>
                <span className="text-sm text-gray-500 block">{p.email}</span>
              </div>
              {/* Action Buttons - Adjusted styles and icons */}
              <div className="flex space-x-2">
                <button
                  onClick={() => openEditModal(p)}
                  className="text-[var(--accent)] hover:text-pink-700 p-1 transition duration-150 ease-in-out disabled:opacity-50"
                  aria-label={`Editar ${p.nome_completo}`}
                  disabled={isLoading} // Disable during actions
                >
                  <FaEdit size={18} />
                </button>
                {/* Delete button moved to Edit Modal */}
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* ADD MODAL - Adjusted styles */}
      {isAddOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto p-4">
          <form
            onSubmit={handleAddProfessional}
            className="bg-white p-6 rounded shadow-lg w-full max-w-md text-black my-auto" // Adjusted modal style
          >
            <h2 className="text-xl font-semibold mb-4">Novo Profissional</h2>
            {/* Modal-specific errors */}
            {error && (
              <div
                className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded relative mb-3"
                role="alert"
              >
                <span className="block sm:inline">{error}</span>
              </div>
            )}
            <div className="mb-3">
              <label
                htmlFor="nome_completo_add"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Nome Completo
              </label>
              <input
                id="nome_completo_add"
                name="nome_completo"
                type="text"
                value={form.nome_completo}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[var(--primary)] border-[var(--border-primary)]" // Adjusted input style
                required
              />
            </div>
            <div className="mb-3">
              <label
                htmlFor="email_add"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email
              </label>
              <input
                id="email_add"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[var(--primary)] border-[var(--border-primary)]" // Adjusted input style
                required
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="password_add"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Senha
              </label>
              <input
                id="password_add"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[var(--primary)] border-[var(--border-primary)]" // Adjusted input style
                required
              />
            </div>
            {/* Action Buttons - Adjusted styles */}
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={closeModals}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 disabled:opacity-50"
                disabled={isLoading} // Disable during action
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded bg-[var(--accent)] text-white hover:bg-pink-700 disabled:opacity-50"
                disabled={isLoading} // Disable during action
              >
                {isLoading ? 'Adicionando...' : 'Adicionar'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* EDIT MODAL - Adjusted styles */}
      {isEditOpen &&
        currentProfessional && ( // Ensure currentProfessional is not null
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto p-4">
            <form
              onSubmit={handleEditProfessional}
              className="bg-white p-6 rounded shadow-lg w-full max-w-md text-black my-auto" // Adjusted modal style
            >
              <h2 className="text-xl font-semibold mb-4">
                Editar Profissional
              </h2>
              {/* Modal-specific errors */}
              {error && (
                <div
                  className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded relative mb-3"
                  role="alert"
                >
                  <span className="block sm:inline">{error}</span>
                </div>
              )}
              <div className="mb-3">
                <label
                  htmlFor="nome_completo_edit"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Nome Completo
                </label>
                <input
                  id="nome_completo_edit"
                  name="nome_completo"
                  type="text"
                  value={form.nome_completo}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[var(--primary)] border-[var(--border-primary)]" // Adjusted input style
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="email_edit"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email
                </label>
                <input
                  id="email_edit"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[var(--primary)] border-[var(--border-primary)]" // Adjusted input style
                  required
                />
              </div>
              {/* Password field is intentionally omitted for editing */}

              {/* Action Buttons - Adjusted styles and added Delete */}
              <div className="flex justify-between items-center mt-6">
                {/* Delete Button */}
                <button
                  type="button"
                  onClick={handleDeleteProfessional} // Calls the delete handler
                  className="px-4 py-2 rounded bg-red-600 text-white flex items-center hover:bg-red-700 disabled:opacity-50"
                  disabled={isLoading} // Disable during action
                >
                  <FaTrash className="mr-2" /> Excluir
                </button>
                {/* Cancel and Save Buttons */}
                <div className="space-x-2">
                  <button
                    type="button"
                    onClick={closeModals}
                    className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 disabled:opacity-50"
                    disabled={isLoading} // Disable during action
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700 disabled:opacity-50" // Kept green for Save Changes consistency
                    disabled={isLoading} // Disable during action
                  >
                    {isLoading ? 'Salvando...' : 'Salvar Alterações'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}
    </div>
  );
}
